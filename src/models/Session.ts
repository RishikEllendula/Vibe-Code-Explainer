import { Change } from './Change';
import { ChangeAnalysis } from '../core/changeAnalyzer';

export interface SessionChange {
  change: Change;
  analysis: ChangeAnalysis;
  timestamp: Date;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime?: Date;
  changes: SessionChange[];
  totalChanges: number;
  filesModified: Set<string>;
  conceptsEncountered: Set<string>;
  summary?: string;
}

export class SessionModel {
  static create(data?: Partial<Session>): Session {
    return {
      id: data?.id || this.generateId(),
      startTime: data?.startTime || new Date(),
      endTime: data?.endTime,
      changes: data?.changes || [],
      totalChanges: data?.totalChanges || 0,
      filesModified: data?.filesModified || new Set<string>(),
      conceptsEncountered: data?.conceptsEncountered || new Set<string>(),
      summary: data?.summary,
    };
  }

  static generateId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static addChange(session: Session, change: Change, analysis: ChangeAnalysis): Session {
    const sessionChange: SessionChange = {
      change,
      analysis,
      timestamp: new Date(),
    };

    session.changes.push(sessionChange);
    session.totalChanges++;
    session.filesModified.add(change.filePath);
    
    analysis.affectedConcepts.forEach(concept => {
      session.conceptsEncountered.add(concept);
    });

    return session;
  }

  static endSession(session: Session): Session {
    return {
      ...session,
      endTime: new Date(),
    };
  }

  static getDuration(session: Session): number {
    const end = session.endTime || new Date();
    return end.getTime() - session.startTime.getTime();
  }

  static getDurationString(session: Session): string {
    const ms = this.getDuration(session);
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }

  static getComplexityDistribution(session: Session): {
    simple: number;
    medium: number;
    complex: number;
  } {
    const distribution = { simple: 0, medium: 0, complex: 0 };
    
    session.changes.forEach(sc => {
      distribution[sc.analysis.complexity]++;
    });
    
    return distribution;
  }

  static getImpactDistribution(session: Session): {
    low: number;
    medium: number;
    high: number;
  } {
    const distribution = { low: 0, medium: 0, high: 0 };
    
    session.changes.forEach(sc => {
      distribution[sc.analysis.impact]++;
    });
    
    return distribution;
  }

  static getMostModifiedFile(session: Session): string | null {
    if (session.changes.length === 0) {
      return null;
    }

    const fileCount = new Map<string, number>();
    
    session.changes.forEach(sc => {
      const count = fileCount.get(sc.change.filePath) || 0;
      fileCount.set(sc.change.filePath, count + 1);
    });
    
    let maxCount = 0;
    let mostModified: string | null = null;
    
    fileCount.forEach((count, file) => {
      if (count > maxCount) {
        maxCount = count;
        mostModified = file;
      }
    });
    
    return mostModified;
  }

  static serialize(session: Session): string {
    return JSON.stringify({
      ...session,
      filesModified: Array.from(session.filesModified),
      conceptsEncountered: Array.from(session.conceptsEncountered),
    });
  }

  static deserialize(data: string): Session {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      startTime: new Date(parsed.startTime),
      endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
      filesModified: new Set(parsed.filesModified),
      conceptsEncountered: new Set(parsed.conceptsEncountered),
      changes: parsed.changes.map((sc: any) => ({
        ...sc,
        timestamp: new Date(sc.timestamp),
        change: {
          ...sc.change,
          timestamp: new Date(sc.change.timestamp),
        },
      })),
    };
  }

  static toSummary(session: Session): string {
    const duration = this.getDurationString(session);
    const files = session.filesModified.size;
    const changes = session.totalChanges;
    const complexity = this.getComplexityDistribution(session);
    const impact = this.getImpactDistribution(session);
    
    return `Session Duration: ${duration}
Files Modified: ${files}
Total Changes: ${changes}

Complexity:
- Simple: ${complexity.simple}
- Medium: ${complexity.medium}
- Complex: ${complexity.complex}

Impact:
- Low: ${impact.low}
- Medium: ${impact.medium}
- High: ${impact.high}

Concepts Encountered: ${Array.from(session.conceptsEncountered).join(', ')}`;
  }
}
