import TimingTaskInteraction from './timingTaskInteraction';

export default class TimingTaskData {
  public websiteUrl: string = '';
  public timeInSeconds: number = 0;
  public startTime: Date = new Date();
  public timingTaskInteractions: TimingTaskInteraction[] = [];

  constructor(timingTaskData?: TimingTaskData) {
    if (!timingTaskData) return;
    this.websiteUrl = timingTaskData.websiteUrl;
    this.timeInSeconds = timingTaskData.timeInSeconds;
    this.startTime = new Date(timingTaskData.startTime);

    this.timingTaskInteractions = timingTaskData.timingTaskInteractions.map(
      (interaction) => new TimingTaskInteraction(interaction)
    );
  }

  public updateTimeInSeconds(): void {
    this.timeInSeconds = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
  }
}
