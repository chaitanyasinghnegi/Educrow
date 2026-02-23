export function evaluateTwoSum(code: string, input: number[], target: number, expected: number[]): boolean {
  try {
    // Create a function from the user's code
    const userFunction = new Function('nums', 'target', code);
    
    // Run the function with test case
    const result = userFunction(input, target);
    
    // Check if result matches expected
    if (!Array.isArray(result) || result.length !== 2) return false;
    
    // Check if the numbers at the indices sum up to target
    return input[result[0]] + input[result[1]] === target;
  } catch (error) {
    console.error('Evaluation error:', error);
    return false;
  }
}