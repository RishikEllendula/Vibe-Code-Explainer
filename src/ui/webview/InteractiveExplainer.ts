export class InteractiveExplainer {
  static renderChat(messages: Array<{role: string; content: string}>): string {
    return messages.map(m => `<div class="${m.role}">${m.content}</div>`).join('');
  }
}
