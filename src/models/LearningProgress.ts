export interface ConceptProgress {
  concept: string;
  timesEncountered: number;
  lastEncountered: Date;
  mastery: 'beginner' | 'intermediate' | 'advanced';
  relatedConcepts: string[];
  resources: string[];
}

export interface LearningProgress {
  id: string;
  userId?: string;
  concepts: Map<string, ConceptProgress>;
  totalSessionTime: number;
  totalChangesReviewed: number;
  streak: number;
  lastActiveDate: Date;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: Date;
  type: 'changes' | 'concepts' | 'streak' | 'time';
  threshold: number;
}

export class LearningProgressModel {
  static create(data?: Partial<LearningProgress>): LearningProgress {
    return {
      id: data?.id || this.generateId(),
      userId: data?.userId,
      concepts: data?.concepts || new Map<string, ConceptProgress>(),
      totalSessionTime: data?.totalSessionTime || 0,
      totalChangesReviewed: data?.totalChangesReviewed || 0,
      streak: data?.streak || 0,
      lastActiveDate: data?.lastActiveDate || new Date(),
      milestones: data?.milestones || this.getDefaultMilestones(),
    };
  }

  static generateId(): string {
    return `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static addConcept(
    progress: LearningProgress,
    concept: string,
    relatedConcepts: string[] = []
  ): LearningProgress {
    const existing = progress.concepts.get(concept);
    
    if (existing) {
      existing.timesEncountered++;
      existing.lastEncountered = new Date();
      existing.mastery = this.calculateMastery(existing.timesEncountered);
      progress.concepts.set(concept, existing);
    } else {
      const newConcept: ConceptProgress = {
        concept,
        timesEncountered: 1,
        lastEncountered: new Date(),
        mastery: 'beginner',
        relatedConcepts,
        resources: [],
      };
      progress.concepts.set(concept, newConcept);
    }
    
    return progress;
  }

  static calculateMastery(timesEncountered: number): 'beginner' | 'intermediate' | 'advanced' {
    if (timesEncountered < 3) {
      return 'beginner';
    }
    if (timesEncountered < 10) {
      return 'intermediate';
    }
    return 'advanced';
  }

  static updateStreak(progress: LearningProgress): LearningProgress {
    const today = new Date();
    const lastActive = progress.lastActiveDate;
    
    const daysSince = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSince === 0) {
      // Same day, no change
      return progress;
    } else if (daysSince === 1) {
      // Consecutive day, increment streak
      progress.streak++;
    } else {
      // Streak broken
      progress.streak = 1;
    }
    
    progress.lastActiveDate = today;
    return progress;
  }

  static checkMilestones(progress: LearningProgress): Milestone[] {
    const achievedMilestones: Milestone[] = [];
    
    progress.milestones.forEach(milestone => {
      if (!milestone.achieved) {
        let achieved = false;
        
        switch (milestone.type) {
          case 'changes':
            achieved = progress.totalChangesReviewed >= milestone.threshold;
            break;
          case 'concepts':
            achieved = progress.concepts.size >= milestone.threshold;
            break;
          case 'streak':
            achieved = progress.streak >= milestone.threshold;
            break;
          case 'time':
            achieved = progress.totalSessionTime >= milestone.threshold;
            break;
        }
        
        if (achieved) {
          milestone.achieved = true;
          milestone.achievedDate = new Date();
          achievedMilestones.push(milestone);
        }
      }
    });
    
    return achievedMilestones;
  }

  static getDefaultMilestones(): Milestone[] {
    return [
      {
        id: 'first-change',
        title: 'First Steps',
        description: 'Review your first code change',
        achieved: false,
        type: 'changes',
        threshold: 1,
      },
      {
        id: 'ten-changes',
        title: 'Getting Started',
        description: 'Review 10 code changes',
        achieved: false,
        type: 'changes',
        threshold: 10,
      },
      {
        id: 'fifty-changes',
        title: 'Code Explorer',
        description: 'Review 50 code changes',
        achieved: false,
        type: 'changes',
        threshold: 50,
      },
      {
        id: 'five-concepts',
        title: 'Concept Collector',
        description: 'Encounter 5 different programming concepts',
        achieved: false,
        type: 'concepts',
        threshold: 5,
      },
      {
        id: 'week-streak',
        title: 'Consistent Learner',
        description: 'Maintain a 7-day streak',
        achieved: false,
        type: 'streak',
        threshold: 7,
      },
      {
        id: 'hour-time',
        title: 'Dedicated Hour',
        description: 'Spend 1 hour learning from code',
        achieved: false,
        type: 'time',
        threshold: 3600000, // 1 hour in milliseconds
      },
    ];
  }

  static getRecommendedConcepts(progress: LearningProgress): string[] {
    const beginnerConcepts: string[] = [];
    
    progress.concepts.forEach((conceptProgress) => {
      if (conceptProgress.mastery === 'beginner') {
        beginnerConcepts.push(conceptProgress.concept);
      }
    });
    
    return beginnerConcepts.slice(0, 5);
  }

  static serialize(progress: LearningProgress): string {
    return JSON.stringify({
      ...progress,
      concepts: Array.from(progress.concepts.entries()),
      lastActiveDate: progress.lastActiveDate.toISOString(),
      milestones: progress.milestones.map(m => ({
        ...m,
        achievedDate: m.achievedDate?.toISOString(),
      })),
    });
  }

  static deserialize(data: string): LearningProgress {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      concepts: new Map(parsed.concepts),
      lastActiveDate: new Date(parsed.lastActiveDate),
      milestones: parsed.milestones.map((m: any) => ({
        ...m,
        achievedDate: m.achievedDate ? new Date(m.achievedDate) : undefined,
      })),
    };
  }

  static toSummary(progress: LearningProgress): string {
    const concepts = progress.concepts.size;
    const changes = progress.totalChangesReviewed;
    const streak = progress.streak;
    const hours = Math.floor(progress.totalSessionTime / 3600000);
    const minutes = Math.floor((progress.totalSessionTime % 3600000) / 60000);
    
    return `Learning Progress:
- Concepts Encountered: ${concepts}
- Changes Reviewed: ${changes}
- Current Streak: ${streak} days
- Time Spent: ${hours}h ${minutes}m

Milestones Achieved: ${progress.milestones.filter(m => m.achieved).length}/${progress.milestones.length}`;
  }
}
