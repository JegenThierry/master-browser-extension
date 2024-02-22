import { ProfileImage, StudyPhase } from './enums';

export default class User {
  uid: string = '';
  username: string = '';
  phase: StudyPhase = StudyPhase.Baseline;
  contributionCount: number = 0;
  isDone: boolean = false;
  createdDate: Date = new Date();
  gameContributionCount: number = 0;
	profileImage: ProfileImage = ProfileImage.None;

  constructor(user?: User) {
    if (!user) return;

    this.uid = user.uid;
    this.username = user.username;
    this.phase = user.phase;
    this.contributionCount = user.contributionCount;
    this.isDone = user.isDone;
    this.createdDate = user.createdDate;
    this.gameContributionCount = user.gameContributionCount;
    this.profileImage = user.profileImage;
  }
}
