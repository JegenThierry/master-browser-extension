import { API_URL } from "../../config/constants";

class apiMarkService {
  private apiUrlBase = `${API_URL}/Mark`;
  public async fetchExistingMarks(userId: string, url: string): Promise<void> {}
}

export default new apiMarkService();
