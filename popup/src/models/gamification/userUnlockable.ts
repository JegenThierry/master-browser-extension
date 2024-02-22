import Unlockable from "./unlockable";

export default class UserUnlockables {
  public id: number = 0;
  public name: string = "";
  public userId: string = "";
  public unlockable: Unlockable = new Unlockable();
  public currentValue: number = 0;
  public isUnlocked: boolean = false;
  public wasDisplayed: boolean = false;
  public unlockedDate: Date = new Date();

  constructor(userLockable?: UserUnlockables) {
    if (!userLockable) return;
    this.id = userLockable.id;
    this.name = userLockable.name;
    this.userId = userLockable.userId;
    this.unlockable = new Unlockable(userLockable.unlockable);
    this.currentValue = userLockable.currentValue;
    this.isUnlocked = userLockable.isUnlocked;
    this.wasDisplayed = userLockable.wasDisplayed;
    this.unlockedDate = new Date(userLockable.unlockedDate);
  }
}
