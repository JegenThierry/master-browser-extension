export default class RatingData{
    public markId:string = "";
    public userId:string = "";
    public username:string = "";
    public rating:number = 0;

    constructor(markId: string, userId: string, username: string, rating: number) {
        this.markId = markId;
        this.userId = userId;
        this.username = username;
        this.rating = rating;
    }
}