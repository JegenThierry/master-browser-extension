import { MarkingType } from "../enums";
import ColorTuple from "../colorTuple";
import { Colors } from "../constants";

export default class MarkElement {
	public id: string = "";
	public markingType: MarkingType = MarkingType.WellFormulated;
	public createdByUser: boolean = false;
	public isRatingTaskAndIsNotClickable: boolean = false;
	public isActive: boolean = false;

	constructor(id: string, markingType?: MarkingType, createdByUser?: boolean, isRatingTaskAndIsNotClickable?: boolean) {
		this.id = id;
		this.createdByUser = createdByUser ?? false;
		this.markingType = markingType ?? MarkingType.WellFormulated;
		this.isRatingTaskAndIsNotClickable = isRatingTaskAndIsNotClickable ?? false;
	}

	public getMarkingColor(active?: boolean): ColorTuple {
		if (this.isRatingTaskAndIsNotClickable) return new ColorTuple(Colors.pastelGray, "");
		switch (this.markingType) {
			case MarkingType.WellFormulated:
				return active ? new ColorTuple(Colors.pastelGreenActive, "") : new ColorTuple(Colors.pastelGreen, "");
			case MarkingType.NotUnderstandable:
				return active ? new ColorTuple(Colors.pastelRedActive, "") : new ColorTuple(Colors.pastelRed, "");
			default:
				return active ? new ColorTuple(Colors.pastelYellowActive, "") : new ColorTuple(Colors.pastelYellow, "");
		}
	}

	/**
	 * Creates a styled span element based on a provided color and whether it was created by the user or code
	 */
	public createSpanElement(): HTMLSpanElement {
		const span = document.createElement("span");
		const color = this.getMarkingColor();
		span.style.backgroundColor = color.color;
		// span.style.border = "1px solid";
		span.style.borderColor = color.borderColor ?? "";
		span.id = this.id;

		return span;
	}

	public toggleHighlight() {
		this.isActive = !this.isActive;
		const elem = document.getElementById(this.id);
		const color = this.getMarkingColor(this.isActive);

		if (!elem) return;
		elem.style.backgroundColor = color.color;
	}
}
