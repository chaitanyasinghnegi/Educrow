import { javascriptTutorials } from './tutorials/javascript-tutorials';
import { pythonTutorials } from './tutorials/python-tutorials';
import { javaTutorials } from './tutorials/java-tutorials';
import { cppTutorials } from './tutorials/cpp-tutorials';

export interface VideoTutorial {
  id: string;
  languageId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  youtubeUrl: string; // Added URL property
}

export const videoTutorials: VideoTutorial[] = [
  ...javascriptTutorials,
  ...pythonTutorials,
  ...javaTutorials,
  ...cppTutorials
];

