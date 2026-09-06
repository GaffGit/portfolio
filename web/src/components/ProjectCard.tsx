type projectCardProps = {
  title: string;
  description: string;
  tags: string[];
  source: string;
  demo?: string;
};

export default function ProjectCard({ title, description, tags, source, demo }: projectCardProps) {
  return (
    <li className="card">
      <h3 className="card-title">{title}</h3>

      <p className="card-body">
        {description}
      </p>

      <ul className="tags">
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <div className="card-links">
        <a href={source}>Source</a>
        {demo && <a href={demo}>Live demo</a>}
      </div>
    </li>
  );
}