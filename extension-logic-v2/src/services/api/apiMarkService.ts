import { API_URL } from "../../config/constants";

class apiMarkService {
  public async fetchExistingMarks(userId: string, windowUrl: string): Promise<void> {
    const url = new URL(API_URL);
    url.searchParams.append('userId', userId);
    url.searchParams.append('link', windowUrl);
    
    const res = await fetch(url.toString());
    const data = res.json();
  }
}

export default new apiMarkService();
