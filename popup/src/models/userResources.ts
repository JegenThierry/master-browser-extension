export default class UserResources {
  userId: string = '';
  currentMana: number = 0;
  currentStamina: number = 0;
  currentPixelDust: number = 0;
  manaPotions: number = 0;
  staminaPotions: number = 0;
  maxMana: number = 20;
  maxStamina: number = 20;
  level: number = 1;
  currentXp: number = 0;
  expUntilNextLevel: number = 20;
  totalExp: number = 0;

  constructor(userResources?: UserResources) {
    if (!userResources) return;
    this.userId = userResources.userId;
    this.currentMana = userResources.currentMana;
    this.currentStamina = userResources.currentStamina;
    this.currentPixelDust = userResources.currentPixelDust;
    this.manaPotions = userResources.manaPotions;
    this.staminaPotions = userResources.staminaPotions;
    this.maxMana = userResources.maxMana;
    this.maxStamina = userResources.maxStamina;
    this.level = userResources.level;
    this.currentXp = userResources.currentXp;
    this.expUntilNextLevel = userResources.expUntilNextLevel;
    this.totalExp = userResources.totalExp;
  }
}
