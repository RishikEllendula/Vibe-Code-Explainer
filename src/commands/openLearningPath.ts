import { LearningService } from '../services/learningService';
import * as vscode from 'vscode';

export function openLearningPath(learningService: LearningService) {
  return async () => {
    vscode.window.showInformationMessage('Opening learning path...');
  };
}
