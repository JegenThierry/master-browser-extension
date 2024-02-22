import {
  AchievementDifficulty,
  ResourceTypes,
  ResponseMessageType,
  UnlockablesReward,
} from './enums';

export default class ResponseMessage {
  public responseMessageType: ResponseMessageType = ResponseMessageType.Achievement;
  public message: string = '';
  public amountGained: number | undefined = undefined;
  public assetUrl: string | undefined = undefined;
  public resourceTypes: ResourceTypes | undefined = undefined;
  public achievementDifficulty: AchievementDifficulty | undefined = undefined;
  public unlockablesReward: UnlockablesReward | undefined = undefined;
  public name: string | undefined = undefined;

  constructor(responseMessage?: ResponseMessage) {
    if (!responseMessage) return;

    this.message = responseMessage.message;
    this.responseMessageType = responseMessage.responseMessageType;
    this.amountGained = responseMessage.amountGained;
    this.assetUrl = responseMessage.assetUrl;
    this.resourceTypes = responseMessage.resourceTypes;
    this.achievementDifficulty = responseMessage.achievementDifficulty;
    this.unlockablesReward = responseMessage.unlockablesReward;
    this.name = responseMessage.name;
  }
}
