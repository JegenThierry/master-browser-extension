import { API_URL } from '@/models/constants';
import UserUnlockables from '@/models/gamification/userUnlockable';
import axios from 'axios';

class UserAchievementsService {
  private baseUrl = `${API_URL}/Unlockables`;

  public async fetchUserUnlockables(userId: string): Promise<UserUnlockables[]> {
    let url = `${this.baseUrl}`;
    url += `?userId=${encodeURIComponent(userId)}`;

    const res = await axios.get(url);

    return res.data.map((unlockable: UserUnlockables) => new UserUnlockables(unlockable));
  }
}

export default new UserAchievementsService();
