import { BaseAdapter } from '../baseAdapter';

export class CursorAdapter implements BaseAdapter {
  name = 'Cursor';

  isAvailable(): boolean {
    return false; // Detect Cursor IDE
  }

  async detectChanges(): Promise<any[]> {
    return [];
  }
}
