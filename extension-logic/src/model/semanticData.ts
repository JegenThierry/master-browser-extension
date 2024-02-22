import { MarkingType } from "./enums";
import MarkingTaskData from "./marks/markingTaskData";
import SemanticTag from "./semanticTag";

export default class SemanticData {
	public markingTaskDataEntries: MarkingTaskData[] = [];
	public tag: SemanticTag = new SemanticTag();
	public notFound: boolean = false;

	constructor(tag?: SemanticTag, semanticData?: SemanticData) {
		if (semanticData) {
			this.notFound = semanticData.notFound;
			this.tag = new SemanticTag(semanticData.tag);
			this.markingTaskDataEntries = semanticData.markingTaskDataEntries.map(
				(s: MarkingTaskData) => new MarkingTaskData(s)
			);
			return;
		}

		if (!tag) return;
		this.tag = tag;
	}

	public addMarkingData(data: MarkingTaskData) {
		data.markingType = MarkingType.Semantic;
		this.markingTaskDataEntries.push(data);
	}

	public removeById(id: string) {
		this.markingTaskDataEntries = this.markingTaskDataEntries.filter((entry) => entry.id !== id);
	}
}
