export const PROMPTS = {
    errorSimple: (error: string, language?: string) => 
      `You are a friendly coding teacher explaining to a 12-year-old beginner.
  
  Error${language ? ` (${language})` : ''}:
  ${error}
  
  Explain in SIMPLE language (under 150 words):
  1. What this error means (like explaining to a kid)
  2. Why it might have happened (common beginner mistakes)
  3. How to fix it (step-by-step)
  
  Keep it encouraging and friendly!`,
  
    errorTechnical: (error: string, language: string) =>
      `You are an expert ${language} programmer providing technical analysis.
  
  Error:
  ${error}
  
  Provide a TECHNICAL explanation (under 200 words):
  1. Root cause analysis (what's happening under the hood)
  2. Exact fix with code example if applicable
  3. Best practices to prevent this error
  4. Related concepts to learn
  
  Be precise and technical.`,
  
    hint1: (problem: string) =>
      `Give ONLY a one-sentence hint about the approach/strategy for this problem. No code, no pseudocode, just a thinking direction.
  
  Problem:
  ${problem}
  
  Hint 1 (strategy only):`,
  
    hint2: (problem: string) =>
      `Give ONLY pseudocode (not real code) for solving this problem. Use plain English steps.
  
  Problem:
  ${problem}
  
  Pseudocode:`,
  
    hint3: (problem: string) =>
      `Provide 50-60% of the solution code with TODO comments for the remaining parts. Leave key logic for the user to implement.
  
  Problem:
  ${problem}
  
  Partial Solution:`,
  
    solution: (problem: string) =>
      `Provide a complete, well-commented solution with explanation.
  
  Problem:
  ${problem}
  
  Complete Solution:
  1. Code (with comments)
  2. Explanation of approach
  3. Time/Space complexity
  4. Edge cases handled`,
  };
  