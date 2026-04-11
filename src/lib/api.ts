import axios from 'axios';
import { JUDGE0_LANGUAGE_IDS } from './constants';

const API = axios.create({
  baseURL: 'https://ce.judge0.com',
});

export const executeCode = async (language: string, sourceCode: string) => {
  const languageId = JUDGE0_LANGUAGE_IDS[language];
  
  if (!languageId) {
    throw new Error(`Language '${language}' is not supported yet.`);
  }

  const response = await API.post("/submissions?base64_encoded=false&wait=true", {
    language_id: languageId,
    source_code: sourceCode,
  });
  
  const data = response.data;
  
  // Map Judge0's response format to what Output expected previously
  const output = [data.compile_output, data.stdout, data.stderr]
    .filter(Boolean)
    .join("\n");
    
  return {
    run: {
      output: output,
      stderr: data.stderr || data.compile_output ? data.stderr || data.compile_output : "",
    }
  };
};
