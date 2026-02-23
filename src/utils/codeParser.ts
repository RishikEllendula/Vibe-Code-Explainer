export interface ParsedCode {
  functions: string[];
  classes: string[];
  imports: string[];
  exports: string[];
  variables: string[];
  comments: string[];
}

export class CodeParser {
  parse(code: string, language: string): ParsedCode {
    const result: ParsedCode = {
      functions: [],
      classes: [],
      imports: [],
      exports: [],
      variables: [],
      comments: [],
    };

    switch (language) {
      case 'javascript':
      case 'typescript':
      case 'javascriptreact':
      case 'typescriptreact':
        return this.parseJavaScript(code);
      case 'python':
        return this.parsePython(code);
      default:
        return result;
    }
  }

  private parseJavaScript(code: string): ParsedCode {
    const result: ParsedCode = {
      functions: [],
      classes: [],
      imports: [],
      exports: [],
      variables: [],
      comments: [],
    };

    // Parse functions
    const functionRegex = /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)/g;
    let match;
    while ((match = functionRegex.exec(code)) !== null) {
      result.functions.push(match[1] || match[2]);
    }

    // Parse classes
    const classRegex = /class\s+(\w+)/g;
    while ((match = classRegex.exec(code)) !== null) {
      result.classes.push(match[1]);
    }

    // Parse imports
    const importRegex = /import\s+(?:{[^}]+}|[\w,\s]+)\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = importRegex.exec(code)) !== null) {
      result.imports.push(match[1]);
    }

    // Parse exports
    const exportRegex = /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g;
    while ((match = exportRegex.exec(code)) !== null) {
      result.exports.push(match[1]);
    }

    // Parse variables
    const varRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
    while ((match = varRegex.exec(code)) !== null) {
      if (!result.functions.includes(match[1])) {
        result.variables.push(match[1]);
      }
    }

    // Parse comments
    const commentRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g;
    while ((match = commentRegex.exec(code)) !== null) {
      result.comments.push(match[0]);
    }

    return result;
  }

  private parsePython(code: string): ParsedCode {
    const result: ParsedCode = {
      functions: [],
      classes: [],
      imports: [],
      exports: [],
      variables: [],
      comments: [],
    };

    // Parse functions
    const functionRegex = /def\s+(\w+)\s*\(/g;
    let match;
    while ((match = functionRegex.exec(code)) !== null) {
      result.functions.push(match[1]);
    }

    // Parse classes
    const classRegex = /class\s+(\w+)/g;
    while ((match = classRegex.exec(code)) !== null) {
      result.classes.push(match[1]);
    }

    // Parse imports
    const importRegex = /(?:from\s+(\S+)\s+)?import\s+([^#\n]+)/g;
    while ((match = importRegex.exec(code)) !== null) {
      result.imports.push(match[1] || match[2].trim());
    }

    // Parse variables
    const varRegex = /(\w+)\s*=\s*[^=]/g;
    while ((match = varRegex.exec(code)) !== null) {
      if (!result.functions.includes(match[1]) && !result.classes.includes(match[1])) {
        result.variables.push(match[1]);
      }
    }

    // Parse comments
    const commentRegex = /#.*/g;
    while ((match = commentRegex.exec(code)) !== null) {
      result.comments.push(match[0]);
    }

    return result;
  }

  extractFunctionSignature(code: string, functionName: string): string | null {
    const regex = new RegExp(
      `(?:function\\s+${functionName}|const\\s+${functionName}\\s*=\\s*(?:async\\s*)?\\([^)]*\\)\\s*=>|def\\s+${functionName})\\s*\\([^)]*\\)`,
      'g'
    );
    const match = regex.exec(code);
    return match ? match[0] : null;
  }

  getComplexityIndicators(code: string): {
    cyclomaticComplexity: number;
    linesOfCode: number;
    commentRatio: number;
  } {
    const lines = code.split('\n');
    const linesOfCode = lines.filter((line) => line.trim().length > 0).length;

    // Approximate cyclomatic complexity
    const conditionals = (code.match(/if|else|for|while|switch|case|\?|&&|\|\|/g) || []).length;
    const cyclomaticComplexity = conditionals + 1;

    // Comment ratio
    const commentLines = (code.match(/\/\*[\s\S]*?\*\/|\/\/.*|#.*/g) || []).length;
    const commentRatio = linesOfCode > 0 ? commentLines / linesOfCode : 0;

    return {
      cyclomaticComplexity,
      linesOfCode,
      commentRatio,
    };
  }

  identifyDependencies(code: string, language: string): string[] {
    const dependencies: string[] = [];

    if (language === 'javascript' || language === 'typescript') {
      const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
      const requireRegex = /require\(['"]([^'"]+)['"]\)/g;

      let match;
      while ((match = importRegex.exec(code)) !== null) {
        dependencies.push(match[1]);
      }
      while ((match = requireRegex.exec(code)) !== null) {
        dependencies.push(match[1]);
      }
    } else if (language === 'python') {
      const importRegex = /(?:from\s+(\S+)\s+)?import\s+([^#\n]+)/g;
      let match;
      while ((match = importRegex.exec(code)) !== null) {
        dependencies.push(match[1] || match[2].split(',')[0].trim());
      }
    }

    return [...new Set(dependencies)];
  }
}
