import {MarkingType} from "@/models/enums";

interface MarkingParagraph {
    id: number
    markId: string
    markedText: string
    prefix: string
    suffix: string
    selectedOccurance: number
    totalOccurances: number
}

export default class MarkingTaskData {
    public id: string = "";
    public selectedText: string = "";
    public markingType: MarkingType = MarkingType.WellFormulated;
    public createdDate: Date = new Date();
    public contributionURL: string = "";
    public userId: string = "";
    public username: string = "";
    public markingParagraphs: MarkingParagraph[] = [];
    public isVerified: boolean = false;
    public completionId: number = 0;
    public ratings: string[] = [];
    public usernames: string[] = [];
    public userIds: string[] = [];


    constructor(markingTaskData?: MarkingTaskData) {
        if(!markingTaskData) return;

        this.id = markingTaskData.id
        this.selectedText = markingTaskData.selectedText
        this.markingType = markingTaskData.markingType
        this.createdDate = new Date(markingTaskData.createdDate);
        this.contributionURL = markingTaskData.contributionURL
        this.userId = markingTaskData.userId
        this.username = markingTaskData.username
        this.markingParagraphs = markingTaskData.markingParagraphs;
        this.isVerified = markingTaskData.isVerified
        this.completionId = markingTaskData.completionId
    }
}