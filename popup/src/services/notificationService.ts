import { API_URL } from '@/models/constants';
import axios from 'axios';
import UserNotification from '@/models/userNotification';

class NotificationService {
  public async GetUserNotifications(userId: string): Promise<UserNotification[]> {
    let url = `${API_URL}/Notifications`;
    url += `?userId=${encodeURIComponent(userId)}`;

    const res = await axios.get(url);

    return res.data.map(
      (userNotification: UserNotification) => new UserNotification(userNotification)
    );
  }

  public async UpdateNotificationAsSeen(userId: string, notificationId: number): Promise<void> {
    let url = `${API_URL}/Notifications`;
    url += `?userId=${encodeURIComponent(userId)}`;
    url += `&notificationId=${encodeURIComponent(notificationId)}`;

    await axios.put(url);
  }
}

export default new NotificationService();
