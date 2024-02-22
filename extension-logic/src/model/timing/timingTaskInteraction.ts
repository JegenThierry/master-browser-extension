export default class TimingTaskInteraction {
    public id: number = 0;
    public timingTaskId: number = 0;
    public timeStamp: Date = new Date();
    public clickedElement: string = '';
    public visitedPageLink: string = '';
  
    constructor(timingTaskInteraction?: TimingTaskInteraction) {
      if (!timingTaskInteraction) return;
      this.id = timingTaskInteraction.id;
      this.timingTaskId = timingTaskInteraction.timingTaskId;
      this.timeStamp = timingTaskInteraction.timeStamp;
      this.clickedElement = timingTaskInteraction.clickedElement;
      this.visitedPageLink = timingTaskInteraction.visitedPageLink;
    }
  }
  