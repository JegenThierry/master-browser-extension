import Location from '@/models/location';
import { API_URL } from '@/models/constants';
import axios from 'axios';

class LocationService {
  public async fetchLocations(userId: string): Promise<Location[]> {
    let url = `${API_URL}/Location`;
    url += `?userId=${encodeURIComponent(userId)}`;

    const res = await axios.get(url);
    console.log(res.data);
    return res.data.map((location: Location) => new Location(location));
  }

  public async fetchSubLocations(userId: string, locationId: number) {
    let url = `${API_URL}/Location/sublocations`;
    url += `?userId=${encodeURIComponent(userId)}`;
    url += `&locationId=${encodeURIComponent(locationId)}`;

    const res = await axios.get(url);

    return res.data.map((location: Location) => new Location(location));
  }
}

export default new LocationService();
