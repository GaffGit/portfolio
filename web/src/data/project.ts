export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  source: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    id: 'portfolio',
    title: 'Portfolio site',
    description: 'Portfolio site you are on right now',
    tags: ['TypeScript', 'React'],
    source: 'https://github.com/GaffGit/portfolio',
    demo: 'https://...',
  }, {
    id: 'project 2',
    title: 'project 2',
    description: 'Ai project',
    tags: ['AI', 'Ragging'],
    source: 'https://github.com/GaffGit',
  },

  {
    id: 'project 3',
    title: 'project 3',
    description: 'Movielog software',
    tags: ['Java', 'JavaFx', 'Relations'],
    source: 'https://github.com/GaffGit',
  },
];