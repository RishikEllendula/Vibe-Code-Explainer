export class PromptTemplates {
  static getExplanationPrompt(
    fileName: string,
    language: string,
    oldCode: string,
    newCode: string,
    detailLevel: string
  ): string {
    const detail = this.getDetailLevelInstruction(detailLevel);

    return `You are an expert code educator. Explain this code change in a way that helps developers learn and understand.

File: ${fileName}
Language: ${language}

BEFORE:
\`\`\`${language}
${oldCode}
\`\`\`

AFTER:
\`\`\`${language}
${newCode}
\`\`\`

${detail}

Structure your explanation with:
1. **Summary**: One sentence overview
2. **What Changed**: Describe the specific modifications
3. **Why It Matters**: Explain the impact and significance
4. **How It Works**: Step-by-step breakdown of the new logic
5. **Key Concepts**: List programming concepts used
6. **Best Practices**: Note any patterns or anti-patterns
7. **Testing Suggestions**: Recommend tests to verify the change

Keep explanations clear, educational, and actionable.`;
  }

  static getQuestionAnswerPrompt(
    fileName: string,
    language: string,
    oldCode: string,
    newCode: string,
    question: string
  ): string {
    return `You are a helpful coding tutor. Answer this specific question about the code change.

File: ${fileName}
Language: ${language}

BEFORE:
\`\`\`${language}
${oldCode}
\`\`\`

AFTER:
\`\`\`${language}
${newCode}
\`\`\`

QUESTION: ${question}

Provide a clear, direct answer. If relevant, include:
- Code examples
- Analogies or comparisons
- Related concepts to explore further

Keep your answer focused on the question asked.`;
  }

  static getSessionSummaryPrompt(changes: Array<{ file: string; summary: string }>): string {
    const changesList = changes.map((c, i) => `${i + 1}. ${c.file}: ${c.summary}`).join('\n');

    return `You are a code review assistant. Summarize this coding session.

Changes made:
${changesList}

Provide a structured summary:
1. **Overall Impact**: High-level view of what was accomplished
2. **Key Modifications**: Main changes and their purposes
3. **Concepts Applied**: Programming concepts and patterns used
4. **Potential Risks**: Areas that need attention or testing
5. **Next Steps**: Suggested follow-up actions

Format as a clear, scannable summary suitable for team review or personal notes.`;
  }

  static getLearningPathPrompt(concepts: string[]): string {
    return `You are a programming education expert. Create a learning path for these concepts:

Concepts to learn:
${concepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

For each concept, provide:
1. **Difficulty Level**: Beginner/Intermediate/Advanced
2. **Prerequisites**: What to know first
3. **Core Topics**: Key things to learn
4. **Practical Applications**: Real-world use cases
5. **Resources**: Where to learn more (articles, docs, tutorials)
6. **Practice Ideas**: Coding exercises or projects

Order concepts by difficulty and logical progression.`;
  }

  static getCodeReviewPrompt(
    fileName: string,
    language: string,
    code: string
  ): string {
    return `You are a senior code reviewer. Review this code change critically but constructively.

File: ${fileName}
Language: ${language}

CODE:
\`\`\`${language}
${code}
\`\`\`

Provide feedback on:
1. **Code Quality**: Readability, maintainability, structure
2. **Performance**: Potential bottlenecks or optimizations
3. **Security**: Vulnerabilities or risks
4. **Best Practices**: Alignment with language/framework standards
5. **Testing**: What should be tested
6. **Alternative Approaches**: Other ways to solve this

Be specific with examples and suggestions. Balance criticism with encouragement.`;
  }

  static getVisualizationPrompt(
    fileName: string,
    language: string,
    code: string
  ): string {
    return `You are a technical documentation expert. Describe the execution flow of this code in a way that can be visualized.

File: ${fileName}
Language: ${language}

CODE:
\`\`\`${language}
${code}
\`\`\`

Describe:
1. **Entry Point**: Where execution begins
2. **Flow Steps**: Each major operation in sequence
3. **Decision Points**: Conditions and branches
4. **Data Flow**: How data moves through the code
5. **Exit Points**: Where execution completes

Format as a step-by-step narrative suitable for creating a flowchart or diagram.`;
  }

  private static getDetailLevelInstruction(level: string): string {
    switch (level) {
      case 'brief':
        return 'Keep explanations concise. Focus on what changed and why. 2-3 sentences per section.';
      case 'expert':
        return 'Provide deep technical analysis. Include: design patterns, performance implications, architectural considerations, edge cases, and advanced concepts. Assume expert-level knowledge.';
      case 'detailed':
      default:
        return 'Provide comprehensive explanations suitable for intermediate developers. Balance depth with clarity. Include examples where helpful.';
    }
  }

  static getImpactAnalysisPrompt(
    fileName: string,
    language: string,
    oldCode: string,
    newCode: string
  ): string {
    return `You are a software architect. Analyze the impact of this code change.

File: ${fileName}
Language: ${language}

BEFORE:
\`\`\`${language}
${oldCode}
\`\`\`

AFTER:
\`\`\`${language}
${newCode}
\`\`\`

Analyze:
1. **Breaking Changes**: Will this break existing functionality?
2. **Performance Impact**: Better, worse, or neutral?
3. **Maintainability**: Easier or harder to maintain?
4. **Dependencies**: What other code might be affected?
5. **Risk Level**: Low, Medium, or High risk?
6. **Rollback Plan**: How to revert if needed?

Provide concrete, actionable insights.`;
  }
}
