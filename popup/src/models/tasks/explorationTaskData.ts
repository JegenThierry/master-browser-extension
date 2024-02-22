import ExplorationTaskInteraction from './explorationTaskInteraction';

export default class ExplorationTaskData {
  public endUrl: string = '';
  public startUrl: string = '';
  public timeInSeconds: number = 0;
  public startTime: Date = new Date();
  public explorationTaskInteractions: ExplorationTaskInteraction[] = [];

  constructor(explorationTaskData?: ExplorationTaskData) {
    if (!explorationTaskData) return;
    this.endUrl = explorationTaskData.endUrl;
    this.startUrl = explorationTaskData.startUrl;

    this.timeInSeconds = explorationTaskData.timeInSeconds;
    this.startTime = new Date(explorationTaskData.startTime);
    this.explorationTaskInteractions = explorationTaskData.explorationTaskInteractions.map(
      (interaction) => new ExplorationTaskInteraction(interaction)
    );
  }

  public updateTimeInSeconds(): void {
    this.timeInSeconds = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
  }
}
