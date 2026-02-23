export interface BaseAdapter {
  name: string;
  isAvailable(): boolean;
  detectChanges(): Promise<any[]>;
}
