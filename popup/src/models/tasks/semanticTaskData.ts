import { MarkingType } from '@/models/enums';
import SemanticTag from './semanticTag';
import type MarkingTaskData from './markingTaskData';

interface MarkingParagraph {
  id: number;
  markId: string;
  markedText: string;
  prefix: string;
  suffix: string;
  selectedOccurance: number;
  totalOccurances: number;
}

export default class SemanticTaskData {
  public id: string = '';
  public selectedText: string = '';
  public markingType: MarkingType = MarkingType.WellFormulated;
  public createdDate: Date = new Date();
  public contributionURL: string = '';
  public userId: string = '';
  public username: string = '';
  public markingParagraphs: MarkingParagraph[] = [];
  public isVerified: boolean = false;
  public completionId: number = 0;
  public ratings: string[] = [];
  public usernames: string[] = [];
  public userIds: string[] = [];
  public tag: SemanticTag = new SemanticTag();

  constructor(semanticTaskData?: MarkingTaskData, tag?:SemanticTag) {
    if (!semanticTaskData) return;

    this.id = semanticTaskData.id;
    this.selectedText = semanticTaskData.selectedText;
    this.markingType = semanticTaskData.markingType;
    this.createdDate = new Date(semanticTaskData.createdDate);
    this.contributionURL = semanticTaskData.contributionURL;
    this.userId = semanticTaskData.userId;
    this.username = semanticTaskData.username;
    this.markingParagraphs = semanticTaskData.markingParagraphs;
    this.isVerified = semanticTaskData.isVerified;
    this.completionId = semanticTaskData.completionId;
    this.tag = new SemanticTag(tag);
  }
}