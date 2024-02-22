import { NotificationType } from './enums';

export default class UserNotification {
  public id: number = 0;
  public createdDate: Date = new Date();
  public seen: boolean = false;
  public notificationType: NotificationType = NotificationType.Agreements;
  public amount: number = 0;
  public message: string = '';

  constructor(userNotification?: UserNotification) {
    if (userNotification == undefined) return;

    this.id = userNotification.id;
    this.createdDate = new Date(userNotification.createdDate);
    this.seen = userNotification.seen;
    this.notificationType = userNotification.notificationType;
    this.amount = userNotification.amount;
    this.message = userNotification.message;
  }
}
