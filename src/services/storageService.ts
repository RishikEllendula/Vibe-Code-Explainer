import * as vscode from 'vscode';
import { Logger } from '../utils/logger';

export class StorageService {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  // Global state storage (persists across VS Code sessions)
  async setGlobal<T>(key: string, value: T): Promise<void> {
    try {
      await this.context.globalState.update(key, value);
      Logger.debug(`Saved global state: ${key}`);
    } catch (error) {
      Logger.error(`Failed to save global state ${key}:`, error);
      throw error;
    }
  }

  getGlobal<T>(key: string, defaultValue?: T): T | undefined {
    return this.context.globalState.get<T>(key) ?? defaultValue;
  }

  // Workspace state storage (per workspace)
  async setWorkspace<T>(key: string, value: T): Promise<void> {
    try {
      await this.context.workspaceState.update(key, value);
      Logger.debug(`Saved workspace state: ${key}`);
    } catch (error) {
      Logger.error(`Failed to save workspace state ${key}:`, error);
      throw error;
    }
  }

  getWorkspace<T>(key: string, defaultValue?: T): T | undefined {
    return this.context.workspaceState.get<T>(key) ?? defaultValue;
  }

  // Secrets storage (for API keys, etc.)
  async setSecret(key: string, value: string): Promise<void> {
    try {
      await this.context.secrets.store(key, value);
      Logger.debug(`Saved secret: ${key}`);
    } catch (error) {
      Logger.error(`Failed to save secret ${key}:`, error);
      throw error;
    }
  }

  async getSecret(key: string): Promise<string | undefined> {
    try {
      return await this.context.secrets.get(key);
    } catch (error) {
      Logger.error(`Failed to get secret ${key}:`, error);
      return undefined;
    }
  }

  async deleteSecret(key: string): Promise<void> {
    try {
      await this.context.secrets.delete(key);
      Logger.debug(`Deleted secret: ${key}`);
    } catch (error) {
      Logger.error(`Failed to delete secret ${key}:`, error);
    }
  }

  // Clear all stored data
  async clearAll(): Promise<void> {
    const globalKeys = this.context.globalState.keys();
    for (const key of globalKeys) {
      await this.context.globalState.update(key, undefined);
    }

    const workspaceKeys = this.context.workspaceState.keys();
    for (const key of workspaceKeys) {
      await this.context.workspaceState.update(key, undefined);
    }

    Logger.info('Cleared all storage');
  }

  // Export data for backup
  async exportData(): Promise<any> {
    const data: any = {};

    const globalKeys = this.context.globalState.keys();
    for (const key of globalKeys) {
      data[`global.${key}`] = this.context.globalState.get(key);
    }

    const workspaceKeys = this.context.workspaceState.keys();
    for (const key of workspaceKeys) {
      data[`workspace.${key}`] = this.context.workspaceState.get(key);
    }

    return data;
  }
}
