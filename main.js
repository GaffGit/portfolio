/* =========================================================================
   main.js — Thomas Rickström
   ========================================================================= */

const header = document.getElementById('site-header');
const links = document.querySelectorAll('.nav-list a');
const brandPath = document.getElementById('brand-path');
const options = {
   rootMargin: '-15% 0px -55% 0px'
}
const sections = document.querySelectorAll("main section[id]");
const steps = document.querySelectorAll(".boot .step")

const TYPE_MS = 35;
const PAUSE_MS = 200;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const promptForm = document.getElementById('prompt-form');
const cmdInput = document.getElementById('cmd-input');
const bootCursor = document.getElementById('boot-cursor');
const cursor = document.querySelector('#boot-cursor .cursor');

const historyEl = document.getElementById('history');
const terminal = document.getElementById('terminal');

const commands = {
   help: () => print("Available commands: " + Object.keys(commands).join(', ')),
   ls: () => { const array = Array.from(sections);
               const ids   = array.map(s => s.id);
               const text  = ids.join('\n');
               print(text);},
   clear: () => historyEl.textContent = '',
   cd(args) { const target = args[0]
      if(!target) {
         print('usage: cd <section>', 'error');
         return;
      }
       const array = Array.from(sections);
       const ids   = array.map(s => s.id);

       if(ids.includes(target)) {
         document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
       }
       else {
         print("no such section: " + target, 'error')
       }
   }
};

let seen = null;
let skipped = false;

window.addEventListener("scroll", updateHeader,
{ passive: true });
updateHeader();

function updateHeader () {
header.classList.toggle('is-scrolled', window.scrollY > 8);
}

function setCurrent(id) {
   for(const link of links) {
      if(link.getAttribute('href') === '#' + id) {
         link.setAttribute("aria-current", "true");
      }
      else {
         link.removeAttribute("aria-current");
      }
   }
   brandPath.textContent = '/' + id;
   if(id === 'home') {
      brandPath.textContent = '';
   }
}
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
   if(entry.isIntersecting) {
      setCurrent(entry.target.id);
   }
  }
}, options);

for(const section of sections) {
   observer.observe(section);
}

async function typeText(element, text) {
   element.textContent = '';
   for(const char of text) {
      if(skipped) {element.textContent = text; return;}
      await sleep(TYPE_MS);
      element.textContent += char;
   } 
}

function sleep(ms) {
  const promise = new Promise((resolve) => {
   setTimeout(resolve, ms);
});

return promise;
}

function prepare()  {
 for(const step of steps) {
   const typed = step.querySelector('.typed');
   const out = step.querySelector('.out');

   typed.dataset.text = typed.textContent;
   typed.textContent = '';
   out.style.visibility = "hidden";
 }


 bootCursor.hidden = true;
}

async function playBoot() {
   for(const step of steps) {
      const typed = step.querySelector('.typed');
      const out = step.querySelector('.out');
      step.style.visibility = 'visible';
      typed.after(cursor);
      await typeText(typed, typed.dataset.text);
      await sleep(PAUSE_MS);
      out.style.visibility = "visible";
      
   }
}

function revealAll() {
   for(const step of steps) {
         const typed = step.querySelector('.typed');
         const out = step.querySelector('.out');
         step.style.visibility = 'visible';
         if(typed.dataset.text) {
            typed.textContent = typed.dataset.text;
         }
         out.style.visibility = "visible";
   }
}

function skipBoot() {
   skipped = true;
   revealAll();
}

function activatePrompt() {
      promptForm.hidden = false;
      bootCursor.hidden = true;
      cursor.remove();
   if (window.matchMedia('(hover: hover)').matches) cmdInput.focus({ preventScroll: true });

}

try {
  seen = sessionStorage.getItem('booted');
} catch {
}

if(!reducedMotion && seen === null) { 
   window.addEventListener("click", skipBoot, {once: true});
window.addEventListener("keydown", skipBoot, {once: true});
   prepare();
   playBoot().then(() => {
  try { sessionStorage.setItem('booted', '1'); } catch {}
  activatePrompt();
});
} else {
   revealAll();
   activatePrompt();
}

promptForm.addEventListener('submit', event => {
   event.preventDefault();
   const userInput = cmdInput.value.trim();
   cmdInput.value = '';
   if(!userInput) return;

   echoCommand(userInput);
   runCommand(userInput);
   terminal.scrollTop = terminal.scrollHeight;
})

function echoCommand(user) {
   const line = document.createElement('p');
   line.className = 'cmd';

   const prompt = document.createElement('span');
   prompt.className = 'prompt';
   prompt.setAttribute('aria-hidden', 'true');
   prompt.textContent = '$';

   const text = document.createElement('span');
   text.textContent = user; 

   line.append(prompt, text);
   historyEl.append(line);
}

function print(text, className = '') {
   const p = document.createElement('p');
   const div = document.createElement('div');
   p.append(text);
   div.append(p);
   div.classList.add('out');
   if(className) {
      div.classList.add(className);
   }
   historyEl.append(div);
}

function runCommand(input) {
   const parts = input.trim().toLowerCase().split(/\s+/);
   const name = parts[0];
   const args = parts.slice(1);
   const command = commands[name];

   if(!command) {
      print('command not found: ' + name, 'error');
      return;
   }
   command(args);
}


