import { Change } from '../models/Change';
import { Logger } from '../utils/logger';
import { CodeParser } from '../utils/codeParser';

export interface ChangeAnalysis {
  complexity: 'simple' | 'medium' | 'complex';
  impact: 'low' | 'medium' | 'high';
  affectedConcepts: string[];
  potentialIssues: string[];
  suggestedTests: string[];
  changeCategory: string;
}

export class ChangeAnalyzer {
  private codeParser: CodeParser;

  constructor() {
    this.codeParser = new CodeParser();
  }

  async analyze(changes: Change[]): Promise<ChangeAnalysis> {
    if (changes.length === 0) {
      return this.getEmptyAnalysis();
    }

    const complexity = this.assessComplexity(changes);
    const impact = this.assessImpact(changes);
    const affectedConcepts = this.identifyAffectedConcepts(changes);
    const potentialIssues = this.identifyPotentialIssues(changes);
    const suggestedTests = this.suggestTests(changes);
    const changeCategory = this.categorizeChange(changes);

    return {
      complexity,
      impact,
      affectedConcepts,
      potentialIssues,
      suggestedTests,
      changeCategory,
    };
  }

  private assessComplexity(changes: Change[]): 'simple' | 'medium' | 'complex' {
    let score = 0;

    changes.forEach((change) => {
      // Count lines changed
      const linesChanged =
        change.newContent.split('\n').length + change.oldContent.split('\n').length;
      score += linesChanged;

      // Check for complex patterns
      if (this.hasComplexPatterns(change.newContent)) {
        score += 10;
      }

      // Check for multiple file changes
      if (changes.length > 3) {
        score += 5;
      }
    });

    if (score < 10) {
      return 'simple';
    }
    if (score < 30) {
      return 'medium';
    }
    return 'complex';
  }

  private assessImpact(changes: Change[]): 'low' | 'medium' | 'high' {
    let impactScore = 0;

    changes.forEach((change) => {
      // Check if it's a core file
      if (this.isCoreFile(change.filePath)) {
        impactScore += 3;
      }

      // Check for breaking changes
      if (this.hasBreakingChanges(change)) {
        impactScore += 5;
      }

      // Check for API changes
      if (this.hasApiChanges(change)) {
        impactScore += 4;
      }
    });

    if (impactScore < 3) {
      return 'low';
    }
    if (impactScore < 7) {
      return 'medium';
    }
    return 'high';
  }

  private identifyAffectedConcepts(changes: Change[]): string[] {
    const concepts = new Set<string>();

    changes.forEach((change) => {
      const content = change.newContent + change.oldContent;

      // Identify programming concepts
      if (content.match(/class\s+\w+/)) {
        concepts.add('Object-Oriented Programming');
      }
      if (content.match(/async|await|Promise/)) {
        concepts.add('Asynchronous Programming');
      }
      if (content.match(/function\s*\*/)) {
        concepts.add('Generators');
      }
      if (content.match(/import|export|require/)) {
        concepts.add('Module System');
      }
      if (content.match(/\.map\(|\.filter\(|\.reduce\(/)) {
        concepts.add('Functional Programming');
      }
      if (content.match(/try|catch|throw/)) {
        concepts.add('Error Handling');
      }
      if (content.match(/interface|type\s+\w+\s*=/)) {
        concepts.add('Type Systems');
      }
    });

    return Array.from(concepts);
  }

  private identifyPotentialIssues(changes: Change[]): string[] {
    const issues: string[] = [];

    changes.forEach((change) => {
      const content = change.newContent;

      // Check for common issues
      if (content.match(/console\.log/)) {
        issues.push('Debug console.log statements left in code');
      }
      if (content.match(/TODO|FIXME/)) {
        issues.push('TODO comments require attention');
      }
      if (content.match(/any\s*[;:]/)) {
        issues.push('Use of "any" type reduces type safety');
      }
      if (!content.match(/try|catch/) && content.match(/throw/)) {
        issues.push('Exception thrown without try-catch block');
      }
      if (content.match(/==\s*null|!=\s*null/)) {
        issues.push('Consider using strict equality (=== or !==)');
      }
    });

    return issues;
  }

  private suggestTests(changes: Change[]): string[] {
    const tests: string[] = [];

    changes.forEach((change) => {
      if (change.changeType === 'addition' || change.changeType === 'modification') {
        tests.push(`Test the new functionality in ${change.fileName}`);
      }
      if (this.hasApiChanges(change)) {
        tests.push('Test API endpoints for breaking changes');
      }
      if (change.newContent.match(/if|else|switch/)) {
        tests.push('Test all conditional branches');
      }
      if (change.newContent.match(/async|await/)) {
        tests.push('Test async operations and error scenarios');
      }
    });

    return tests.length > 0 ? tests : ['Add unit tests for the changes'];
  }

  private categorizeChange(changes: Change[]): string {
    const categories: string[] = [];

    changes.forEach((change) => {
      if (change.newContent.match(/function|const.*=.*\(/)) {
        categories.push('Function Definition');
      }
      if (change.newContent.match(/class\s+/)) {
        categories.push('Class Definition');
      }
      if (change.newContent.match(/import|require/)) {
        categories.push('Dependency Update');
      }
      if (change.newContent.match(/if|else|switch|for|while/)) {
        categories.push('Logic Change');
      }
      if (change.changeType === 'deletion') {
        categories.push('Code Removal');
      }
    });

    return categories.length > 0 ? categories[0] : 'General Update';
  }

  private hasComplexPatterns(content: string): boolean {
    return (
      content.match(/class|interface|async|Promise|generator/) !== null ||
      content.split('\n').length > 10
    );
  }

  private isCoreFile(filePath: string): boolean {
    return (
      filePath.includes('index.') ||
      filePath.includes('main.') ||
      filePath.includes('app.') ||
      filePath.includes('core/')
    );
  }

  private hasBreakingChanges(change: Change): boolean {
    // Check for function signature changes
    const oldFunctions = change.oldContent.match(/function\s+\w+\s*\([^)]*\)/g) || [];
    const newFunctions = change.newContent.match(/function\s+\w+\s*\([^)]*\)/g) || [];

    return oldFunctions.length !== newFunctions.length;
  }

  private hasApiChanges(change: Change): boolean {
    return (
      change.newContent.match(/router\.|app\.(get|post|put|delete)|@(Get|Post|Put|Delete)/) !==
      null
    );
  }

  private getEmptyAnalysis(): ChangeAnalysis {
    return {
      complexity: 'simple',
      impact: 'low',
      affectedConcepts: [],
      potentialIssues: [],
      suggestedTests: [],
      changeCategory: 'Unknown',
    };
  }
}
