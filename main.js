/* =========================================================================
   main.js — Thomas Rickström

   Build 1: give the header a border once the page has scrolled.
   ========================================================================= */

// Your code goes here.
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
}

async function playBoot() {
   for(const step of steps) {
      const typed = step.querySelector('.typed');
      const out = step.querySelector('.out');
      step.style.visibility = 'visible';
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
});
} else {
   revealAll();
}

