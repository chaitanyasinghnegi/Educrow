export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: Array<{
    input: number[];
    target: number;
    expected: number[];
  }>;
}

export const problems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]'
      }
    ],
    testCases: [
      {
        input: [2, 7, 11, 15],
        target: 9,
        expected: [0, 1]
      },
      {
        input: [3, 2, 4],
        target: 6,
        expected: [1, 2]
      }
    ]
  }
];