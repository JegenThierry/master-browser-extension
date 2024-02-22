import { AchievementDifficulty, AchievementType } from '../enums';

export default class Achievements {
  public name: string = '';
  public type: AchievementType = AchievementType.ContributionCount;
  public neededValue: number = 0;
  public description: string = '';
  public difficulty: AchievementDifficulty = AchievementDifficulty.Easy;

  constructor(achievement?: Achievements) {
    if (!achievement) return;

    this.name = achievement.name;
    this.type = achievement.type;
    this.neededValue = achievement.neededValue;
    this.description = achievement.description;
    this.difficulty = achievement.difficulty;
  }
}
