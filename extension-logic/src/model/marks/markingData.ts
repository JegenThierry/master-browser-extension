import MarkingTaskData from "./markingTaskData";

export default class MarkingData {
	public markingTaskDataEntries: MarkingTaskData[] = [];

	constructor(markingData?: MarkingData) {
		if (!markingData) return;

		this.markingTaskDataEntries = markingData.markingTaskDataEntries.map(
			(m: MarkingTaskData) => new MarkingTaskData(m)
		);
	}

	public addMarkingData(data: MarkingTaskData) {
		this.markingTaskDataEntries.push(data);
	}

	public removeById(id: string) {
		this.markingTaskDataEntries = this.markingTaskDataEntries.filter((entry) => entry.id !== id);
	}
}
