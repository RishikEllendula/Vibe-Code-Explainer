import { BaseAdapter } from '../baseAdapter';

export class CopilotAdapter implements BaseAdapter {
  name = 'GitHub Copilot';

  isAvailable(): boolean {
    return false; // Detect Copilot
  }

  async detectChanges(): Promise<any[]> {
    return [];
  }
}
