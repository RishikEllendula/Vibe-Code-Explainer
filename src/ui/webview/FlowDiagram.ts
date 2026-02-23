export class FlowDiagram {
  static generateFlowDiagram(steps: string[]): string {
    return steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
  }
}
