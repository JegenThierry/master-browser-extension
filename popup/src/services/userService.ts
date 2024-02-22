import { API_URL } from '@/models/constants';
import type { ProfileImage } from '@/models/enums';
import User from '@/models/user';
import UserResources from '@/models/userResources';
import axios from 'axios';

class UserService {
  public async createUser(extensionId: string): Promise<User> {
    let url = `${API_URL}/User`;
    url += `?extensionId=${encodeURIComponent(extensionId)}`;

    const response = await axios.post(url);

    return new User(response.data as User);
  }

  public async updateUsername(
    uid: string,
    profileImage: ProfileImage,
    username: string
  ): Promise<User> {
    let url = `${API_URL}/User`;

    url += `?uid=${encodeURIComponent(uid)}`;
    url += `&profileImage=${encodeURIComponent(profileImage)}`;
    url += `&username=${encodeURIComponent(username)}`;

    const response = await axios.put(url);

    return new User(response.data as User);
  }

  public async deleteUser(uid: string): Promise<void> {
    let url = `${API_URL}/User`;

    url += `?uid=${encodeURIComponent(uid)}`;

    await axios.delete(url);
  }

  public async fetchUser(uid: string): Promise<User> {
    let url = `${API_URL}/User`;
    url += `/${encodeURIComponent(uid)}`;

    const res = await axios.get(url);

    return new User(res.data);
  }

  public async fetchUserResources(uid: string): Promise<UserResources> {
    let url = `${API_URL}/Resources`;
    url += `?userId=${encodeURIComponent(uid)}`;

    const res = await axios.get(url);

    return new UserResources(res.data);
  }
}

export default new UserService();
