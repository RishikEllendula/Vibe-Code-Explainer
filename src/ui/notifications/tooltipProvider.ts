export class TooltipProvider {
  static generateTooltip(title: string, description: string): string {
    return `${title}\n${description}`;
  }
}
