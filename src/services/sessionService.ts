import { StorageService } from './storageService';
import { Session, SessionModel } from '../models/Session';
import { Change } from '../models/Change';
import { ChangeAnalysis } from '../core/changeAnalyzer';

export class SessionService {
  private storage: StorageService;
  private currentSession: Session | null = null;

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  startSession(): void {
    this.currentSession = SessionModel.create();
  }

  endSession(): void {
    if (this.currentSession) {
      this.currentSession = SessionModel.endSession(this.currentSession);
      this.saveSession();
      this.currentSession = null;
    }
  }

  recordChanges(changes: Change[], analysis: ChangeAnalysis): void {
    if (!this.currentSession) {
      this.startSession();
    }

    changes.forEach(change => {
      if (this.currentSession) {
        this.currentSession = SessionModel.addChange(this.currentSession, change, analysis);
      }
    });
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  private async saveSession(): Promise<void> {
    if (this.currentSession) {
      const sessions = this.storage.getGlobal<string[]>('sessions', []) || [];
      sessions.push(SessionModel.serialize(this.currentSession));
      await this.storage.setGlobal('sessions', sessions);
    }
  }
}
