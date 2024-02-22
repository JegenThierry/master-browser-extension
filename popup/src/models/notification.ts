import type { MessageType } from '@/models/enums';

export default class Notification {
  public message: string;
  public messageType: MessageType;
  public id: number;

  constructor(id: number, message: string, messageType: MessageType) {
    this.id = id;
    this.message = message;
    this.messageType = messageType;
  }
}
