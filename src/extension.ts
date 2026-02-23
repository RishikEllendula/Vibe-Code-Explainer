import * as vscode from 'vscode';
import { DiffDetector } from './core/diffDetector';
import { ChangeAnalyzer } from './core/changeAnalyzer';
import { Explainer } from './core/explainer';
import { ExplainerPanel } from './ui/webview/ExplainerPanel';
import { ChangesTreeView } from './ui/views/changesTreeView';
import { LearningPathView } from './ui/views/learningPathView';
import { SessionSummaryView } from './ui/views/sessionSummaryView';
import { ChangeNotifier } from './ui/notifications/changeNotifier';
import { StorageService } from './services/storageService';
import { LearningService } from './services/learningService';
import { SessionService } from './services/sessionService';
import { Logger } from './utils/logger';
import * as commands from './commands';

let diffDetector: DiffDetector;
let changeAnalyzer: ChangeAnalyzer;
let explainer: Explainer;
let storageService: StorageService;
let learningService: LearningService;
let sessionService: SessionService;
let changeNotifier: ChangeNotifier;

export function activate(context: vscode.ExtensionContext) {
  Logger.info('Vibe Code Explainer is now active!');

  // Initialize services
  storageService = new StorageService(context);
  learningService = new LearningService(storageService);
  sessionService = new SessionService(storageService);
  
  // Initialize core components
  diffDetector = new DiffDetector();
  changeAnalyzer = new ChangeAnalyzer();
  explainer = new Explainer(context);
  changeNotifier = new ChangeNotifier();

  // Initialize views
  const changesTreeView = new ChangesTreeView(context);
  const learningPathView = new LearningPathView(context, learningService);
  const sessionSummaryView = new SessionSummaryView(context, sessionService);

  // Register tree views
  vscode.window.registerTreeDataProvider('vibeExplainerChanges', changesTreeView);
  vscode.window.registerTreeDataProvider('vibeExplainerLearning', learningPathView);
  vscode.window.registerTreeDataProvider('vibeExplainerSession', sessionSummaryView);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'vibeCodeExplainer.explainChange',
      commands.explainChange(explainer, changeNotifier)
    ),
    vscode.commands.registerCommand(
      'vibeCodeExplainer.showDiff',
      commands.showDiff(diffDetector)
    ),
    vscode.commands.registerCommand(
      'vibeCodeExplainer.generateSummary',
      commands.generateSummary(sessionService)
    ),
    vscode.commands.registerCommand(
      'vibeCodeExplainer.openLearningPath',
      commands.openLearningPath(learningService)
    ),
    vscode.commands.registerCommand(
      'vibeCodeExplainer.openExplainerPanel',
      () => ExplainerPanel.render(context.extensionUri)
    )
  );

  // Watch for file changes
  const fileWatcher = vscode.workspace.onDidChangeTextDocument((event) => {
    handleFileChange(event, changesTreeView);
  });

  context.subscriptions.push(fileWatcher);

  // Start session
  sessionService.startSession();

  Logger.info('Vibe Code Explainer activated successfully');
}

async function handleFileChange(
  event: vscode.TextDocumentChangeEvent,
  changesTreeView: ChangesTreeView
) {
  const config = vscode.workspace.getConfiguration('vibeCodeExplainer');
  const autoExplain = config.get<boolean>('autoExplain', true);

  if (!autoExplain || event.contentChanges.length === 0) {
    return;
  }

  try {
    // Detect changes
    const changes = await diffDetector.detectChanges(event);
    
    if (changes.length === 0) {
      return;
    }

    // Analyze changes
    const analysis = await changeAnalyzer.analyze(changes);

    // Update tree view
    changesTreeView.addChanges(changes);

    // Show notification if enabled
    const showNotifications = config.get<boolean>('showNotifications', true);
    if (showNotifications) {
      changeNotifier.notifyChanges(changes, analysis);
    }

    // Track in session
    sessionService.recordChanges(changes, analysis);
    
  } catch (error) {
    Logger.error('Error handling file change:', error);
  }
}

export function deactivate() {
  if (sessionService) {
    sessionService.endSession();
  }
  Logger.info('Vibe Code Explainer deactivated');
}
