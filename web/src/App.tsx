import ProjectCard from "./components/ProjectCard"
import { projects } from './data/project';

function App() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <p className="section-intro">A few things I've built. Each one taught me something I couldn't have read my way to.</p>

        <ul className="card-grid">
           {projects.map((project) => (
             <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                source={project.source}
                demo={project.demo}
              />
           ))}
        </ul>
        </div>
      </section>
  )
}
export default App
