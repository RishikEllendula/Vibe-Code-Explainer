import { BaseAdapter } from '../baseAdapter';

export class WindsurfAdapter implements BaseAdapter {
  name = 'Windsurf';

  isAvailable(): boolean {
    return false; // Detect Windsurf
  }

  async detectChanges(): Promise<any[]> {
    return [];
  }
}
