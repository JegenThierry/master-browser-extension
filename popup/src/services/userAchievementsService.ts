import { API_URL } from '@/models/constants';
import UserAchievements from '@/models/gamification/userAchievements';
import axios from 'axios';

class UserAchievementsService {
  private baseUrl = `${API_URL}/Achievements`;

  public async fetchUserAchievements(userId: string): Promise<UserAchievements[]> {
    let url = `${this.baseUrl}`;
    url += `?userId=${encodeURIComponent(userId)}`;

    const res = await axios.get(url);

    return res.data.map((achievement: UserAchievements) => new UserAchievements(achievement));
  }
}

export default new UserAchievementsService();
