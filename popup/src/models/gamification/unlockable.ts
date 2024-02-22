import {
  AchievementDifficulty,
  AchievementType,
  UnlockablesReward,
} from "../enums";

export default class Unlockable {
  public name: string = "";
  public type: AchievementType = AchievementType.ContributionCount;
  public neededValue: number = 0;
  public description: string = "";
  public difficulty: AchievementDifficulty = AchievementDifficulty.Easy;
  public reward: UnlockablesReward = UnlockablesReward.MarkerCommon;

  constructor(unlockable?: Unlockable) {
    if (!unlockable) return;

    this.name = unlockable.name;
    this.type = unlockable.type;
    this.neededValue = unlockable.neededValue;
    this.description = unlockable.description;
    this.difficulty = unlockable.difficulty;
    this.reward = unlockable.reward;
  }
}
