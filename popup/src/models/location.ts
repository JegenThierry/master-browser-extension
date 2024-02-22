export default class Location {
    id: number = 0;
    name: string = "";
    gameName: string = "";
    description: string = "";
    groupTitle: string = "";
    url: string = "";
    isMajorLocation: boolean = false;
    isApproved: boolean = false;
    imageSrc: string = "";
    positionX: number = 0;
    positionY: number = 0;
    totalContributions: number = 0;
  
    constructor(location?:Location){
        if(!location) return;
        this.id = location.id;
        this.name = location.name;
        this.gameName = location.gameName;
        this.description = location.description;
        this.groupTitle = location.groupTitle;
        this.url = location.url;
        this.isMajorLocation = location.isMajorLocation;
        this.isApproved = location.isApproved;
        this.imageSrc = location.imageSrc;
        this.positionX = location.positionX;
        this.positionY = location.positionY;
        this.totalContributions = location.totalContributions;
    }
}
  