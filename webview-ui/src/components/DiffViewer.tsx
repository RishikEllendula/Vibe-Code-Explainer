import React, { useState, useEffect } from 'react';
import './DiffViewer.css';

interface DiffViewerProps {
  oldCode: string;
  newCode: string;
  language: string;
  fileName?: string;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: number;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  oldCode,
  newCode,
  language,
  fileName = 'file'
}) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
    setTimeout(() => setShowDiff(true), 600);
  }, []);

  const getLines = (code: string) => {
    return code.split('\n').filter(line => line.trim() !== '');
  };

  const oldLines = getLines(oldCode);
  const newLines = getLines(newCode);

  const calculateDiff = (): { old: DiffLine[], new: DiffLine[] } => {
    const oldDiff: DiffLine[] = oldLines.map((line, idx) => ({
      type: newLines.includes(line) ? 'unchanged' as const : 'removed' as const,
      content: line,
      lineNumber: idx + 1
    }));

    const newDiff: DiffLine[] = newLines.map((line, idx) => ({
      type: oldLines.includes(line) ? 'unchanged' as const : 'added' as const,
      content: line,
      lineNumber: idx + 1
    }));

    return { old: oldDiff, new: newDiff };
  };

  const diff = calculateDiff();

  return (
    <div className={`diff-viewer-container ${animateIn ? 'animate-in' : ''}`}>
      <div className="diff-header">
        <h3>Code Changes in {fileName}</h3>
        <div className="diff-stats">
          <span className="stat-added">
            +{diff.new.filter(l => l.type === 'added').length}
          </span>
          <span className="stat-removed">
            -{diff.old.filter(l => l.type === 'removed').length}
          </span>
        </div>
      </div>

      <div className={`diff-content ${showDiff ? 'show-diff' : ''}`}>
        <div className="diff-panel before-panel">
          <div className="panel-header">
            <span className="panel-title">Before</span>
            <span className="panel-badge removed">Original Code</span>
          </div>
          <div className="code-container">
            {diff.old.map((line, idx) => (
              <div
                key={`old-${idx}`}
                className={`code-line ${line.type}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="line-number">{line.lineNumber}</span>
                <span className="line-indicator">
                  {line.type === 'removed' && '-'}
                  {line.type === 'unchanged' && ' '}
                </span>
                <code className={`language-${language}`}>{line.content}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="diff-arrow">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path
              d="M10 20 L30 20 M30 20 L23 13 M30 20 L23 27"
              stroke="var(--vscode-textLink-foreground)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="diff-panel after-panel">
          <div className="panel-header">
            <span className="panel-title">After</span>
            <span className="panel-badge added">New Code</span>
          </div>
          <div className="code-container">
            {diff.new.map((line, idx) => (
              <div
                key={`new-${idx}`}
                className={`code-line ${line.type}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="line-number">{line.lineNumber}</span>
                <span className="line-indicator">
                  {line.type === 'added' && '+'}
                  {line.type === 'unchanged' && ' '}
                </span>
                <code className={`language-${language}`}>{line.content}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
