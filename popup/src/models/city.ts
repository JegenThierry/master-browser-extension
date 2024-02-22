import { CityState } from "./enums"

export default class City {
    public id: number = 0
    public title: string = ""
    public url: string = ""
    public description: string = ""
    public imageUrl: string = ""
    public cityState: CityState = CityState.Unexplored;
    public additionalSupportedUrls: string[] = [];
}