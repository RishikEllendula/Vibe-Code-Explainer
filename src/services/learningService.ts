import { StorageService } from './storageService';
import { LearningProgress, LearningProgressModel } from '../models/LearningProgress';

export class LearningService {
  private storage: StorageService;
  private progress: LearningProgress | null = null;

  constructor(storage: StorageService) {
    this.storage = storage;
    this.loadProgress();
  }

  private loadProgress(): void {
    const data = this.storage.getGlobal<string>('learningProgress');
    if (data) {
      this.progress = LearningProgressModel.deserialize(data);
    } else {
      this.progress = LearningProgressModel.create();
    }
  }

  async saveProgress(): Promise<void> {
    if (this.progress) {
      const serialized = LearningProgressModel.serialize(this.progress);
      await this.storage.setGlobal('learningProgress', serialized);
    }
  }

  getProgress(): LearningProgress | null {
    return this.progress;
  }

  async addConcept(concept: string, related: string[] = []): Promise<void> {
    if (this.progress) {
      this.progress = LearningProgressModel.addConcept(this.progress, concept, related);
      await this.saveProgress();
    }
  }

  async updateStreak(): Promise<void> {
    if (this.progress) {
      this.progress = LearningProgressModel.updateStreak(this.progress);
      await this.saveProgress();
    }
  }
}
