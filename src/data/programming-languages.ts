export interface ProgrammingLanguage {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const programmingLanguages: ProgrammingLanguage[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Modern JavaScript tutorials from basics to advanced concepts',
    icon: '⚡'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Learn Python programming with practical examples',
    icon: '🐍'
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Comprehensive Java programming tutorials',
    icon: '☕'
  },
  {
    id: 'cpp',
    name: 'C++',
    description: 'Master C++ programming fundamentals and advanced topics',
    icon: '⚙️'
  }
];
