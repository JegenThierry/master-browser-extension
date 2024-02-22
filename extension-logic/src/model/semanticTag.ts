export default class SemanticTag {
	public id: number = 0;
	public tag: string = "";
	public tagDescription: string = "";

	constructor(tag?: SemanticTag) {
		if (!tag) return;
		this.id = tag.id;
		this.tag = tag.tag;
		this.tagDescription = tag.tagDescription;
	}
}
