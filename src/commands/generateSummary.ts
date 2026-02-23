import { SessionService } from '../services/sessionService';
import * as vscode from 'vscode';
import { SessionModel } from '../models/Session';

export function generateSummary(sessionService: SessionService) {
  return async () => {
    const session = sessionService.getCurrentSession();
    if (!session) {
      vscode.window.showInformationMessage('No active session');
      return;
    }
    const summary = SessionModel.toSummary(session);
    vscode.window.showInformationMessage(summary);
  };
}
