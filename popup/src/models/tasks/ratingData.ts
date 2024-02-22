export default class RatingData {
  public markId: string = '';
  public userId: string = '';
  public username: string = '';
  public rating: number = 0;

  constructor(ratingData?: RatingData) {
    if (!ratingData) return;

    this.markId = ratingData.markId;
    this.userId = ratingData.userId;
    this.username = ratingData.username;
    this.rating = ratingData.rating;
  }
}
