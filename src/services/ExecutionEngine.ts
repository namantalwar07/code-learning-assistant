// CREATE THIS FILE
// Purpose: Core execution logic for JavaScript and Python

/* JavaScript execution approach:
1. Use safe eval with custom console
2. Wrap in try-catch
3. Add timeout protection
4. Capture console.log output
*/

import { NativeModules } from 'react-native';

const { PythonExecutor } = NativeModules; // Created by Person 3

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
}

class ExecutionEngineClass {
  // JavaScript Execution
  async executeJavaScript(code: string): Promise<ExecutionResult> {
    // Validate code first
    if (this.isDangerousCode(code)) {
      return {
        success: false,
        error: 'Dangerous code detected. Execution blocked for safety.',
      };
    }
    
    const logs: string[] = [];
    
    // Custom console that captures output
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('WARN: ' + args.map(arg => String(arg)).join(' '));
      },
    };
    
    try {
      // Execute with timeout
      await this.executeWithTimeout(async () => {
        // Create function with custom console
        const func = new Function('console', code);
        func(customConsole);
      }, 5000); // 5 second timeout
      
      return {
        success: true,
        output: logs.length > 0 ? logs.join('\n') : '(No output)',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  // Python Execution (via native module)
  async executePython(code: string): Promise<ExecutionResult> {
    if (!PythonExecutor) {
      return {
        success: false,
        error: 'Python execution not available on this platform',
      };
    }
    
    try {
      const output = await PythonExecutor.execute(code);
      return {
        success: true,
        output: output || '(No output)',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  // Safety checks
  private isDangerousCode(code: string): boolean {
    const DANGEROUS_PATTERNS = [
      'eval(',
      'Function(',
      'require(',
      'import(',
      'fetch(',
      'XMLHttpRequest',
      'localStorage',
      'sessionStorage',
      '__proto__',
      'constructor',
    ];
    
    return DANGEROUS_PATTERNS.some(pattern => code.includes(pattern));
  }
  
  // Timeout wrapper
  private executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Execution timeout (5s)')), timeout)
      ),
    ]);
  }
}

export const ExecutionEngine = new ExecutionEngineClass();
