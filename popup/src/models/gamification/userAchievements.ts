import Achievements from "./achievement";

export default class UserAchievements {
  public id: number = 0;
  public name: string = "";
  public userId: string = "";
  public achievement: Achievements = new Achievements();
  public currentValue: number = 0;
  public isUnlocked: boolean = false;
  public wasDisplayed: boolean = false;
  public unlockedDate: Date = new Date();

  constructor(userAchievements?: UserAchievements) {
    if (!userAchievements) return;
    this.id = userAchievements.id;
    this.name = userAchievements.name;
    this.userId = userAchievements.userId;
    this.achievement = new Achievements(userAchievements.achievement);
    this.currentValue = userAchievements.currentValue;
    this.isUnlocked = userAchievements.isUnlocked;
    this.wasDisplayed = userAchievements.wasDisplayed;
    this.unlockedDate = new Date(userAchievements.unlockedDate);
  }
}
