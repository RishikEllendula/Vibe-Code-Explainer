export interface CodePattern {
  name: string;
  description: string;
  category: string;
  examples: string[];
}

export class PatternMatcher {
  private patterns: Map<string, RegExp> = new Map();

  constructor() {
    this.initializePatterns();
  }

  identifyPatterns(code: string, language: string): CodePattern[] {
    const identifiedPatterns: CodePattern[] = [];

    // Design Patterns
    if (this.matchPattern(code, 'singleton')) {
      identifiedPatterns.push({
        name: 'Singleton Pattern',
        description: 'Ensures a class has only one instance',
        category: 'Design Pattern',
        examples: ['Database connections', 'Configuration managers'],
      });
    }

    if (this.matchPattern(code, 'factory')) {
      identifiedPatterns.push({
        name: 'Factory Pattern',
        description: 'Creates objects without specifying exact classes',
        category: 'Design Pattern',
        examples: ['Object creation', 'Dependency injection'],
      });
    }

    if (this.matchPattern(code, 'observer')) {
      identifiedPatterns.push({
        name: 'Observer Pattern',
        description: 'Defines a subscription mechanism for events',
        category: 'Design Pattern',
        examples: ['Event listeners', 'Pub/Sub systems'],
      });
    }

    // Programming Paradigms
    if (this.matchPattern(code, 'async')) {
      identifiedPatterns.push({
        name: 'Asynchronous Programming',
        description: 'Non-blocking code execution',
        category: 'Programming Paradigm',
        examples: ['API calls', 'File operations', 'Timers'],
      });
    }

    if (this.matchPattern(code, 'functional')) {
      identifiedPatterns.push({
        name: 'Functional Programming',
        description: 'Using pure functions and immutability',
        category: 'Programming Paradigm',
        examples: ['map', 'filter', 'reduce operations'],
      });
    }

    // Common Constructs
    if (this.matchPattern(code, 'errorHandling')) {
      identifiedPatterns.push({
        name: 'Error Handling',
        description: 'Managing exceptions and errors',
        category: 'Best Practice',
        examples: ['try-catch blocks', 'error callbacks'],
      });
    }

    if (this.matchPattern(code, 'modulePattern')) {
      identifiedPatterns.push({
        name: 'Module Pattern',
        description: 'Organizing code into reusable modules',
        category: 'Code Organization',
        examples: ['ES6 modules', 'CommonJS'],
      });
    }

    return identifiedPatterns;
  }

  private initializePatterns(): void {
    // Design Patterns
    this.patterns.set(
      'singleton',
      /class\s+\w+\s*{[^}]*static\s+instance[^}]*getInstance/s
    );
    this.patterns.set(
      'factory',
      /create\w+|factory|build\w+/i
    );
    this.patterns.set(
      'observer',
      /addEventListener|on\w+|subscribe|emit|dispatch/
    );

    // Async patterns
    this.patterns.set(
      'async',
      /async\s+function|await\s+|new\s+Promise|\.then\(|\.catch\(/
    );

    // Functional programming
    this.patterns.set(
      'functional',
      /\.map\(|\.filter\(|\.reduce\(|\.forEach\(|=>|const.*=.*=>/
    );

    // Error handling
    this.patterns.set(
      'errorHandling',
      /try\s*{|catch\s*\(|throw\s+new|\.catch\(/
    );

    // Module pattern
    this.patterns.set(
      'modulePattern',
      /export\s+(default|const|function|class)|import\s+.*from|module\.exports|require\(/
    );
  }

  private matchPattern(code: string, patternName: string): boolean {
    const pattern = this.patterns.get(patternName);
    return pattern ? pattern.test(code) : false;
  }

  getSuggestedLearningResources(patterns: CodePattern[]): string[] {
    const resources: string[] = [];
    const resourceMap: Map<string, string> = new Map([
      ['Singleton Pattern', 'Learn about the Singleton design pattern'],
      ['Factory Pattern', 'Study Factory design pattern implementations'],
      ['Observer Pattern', 'Understand Observer pattern and event systems'],
      ['Asynchronous Programming', 'Master async/await and Promises'],
      ['Functional Programming', 'Explore functional programming concepts'],
      ['Error Handling', 'Learn best practices for error handling'],
      ['Module Pattern', 'Understand module systems and code organization'],
    ]);

    patterns.forEach((pattern) => {
      const resource = resourceMap.get(pattern.name);
      if (resource && !resources.includes(resource)) {
        resources.push(resource);
      }
    });

    return resources;
  }
}
