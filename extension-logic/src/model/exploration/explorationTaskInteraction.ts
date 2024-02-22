export default class ExplorationTaskInteraction {
    public id: number = 0;
    public explorationTaskDataId: number = 0;
    public timeStamp: Date = new Date();
    public clickedElement: string = '';
    public visitedPageLink: string = '';
  
    constructor(explorationTaskInteraction?: ExplorationTaskInteraction) {
      if (!explorationTaskInteraction) return;
      this.id = explorationTaskInteraction.id;
      this.explorationTaskDataId = explorationTaskInteraction.explorationTaskDataId;
      this.timeStamp = explorationTaskInteraction.timeStamp;
      this.clickedElement = explorationTaskInteraction.clickedElement;
      this.visitedPageLink = explorationTaskInteraction.visitedPageLink;
    }
  }
  