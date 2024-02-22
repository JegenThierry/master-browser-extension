import MarkElement from "../htmlElements/markElement";
import MarkingTaskData from "./markingTaskData";

import { MarkingType } from "../enums";
import eventEmitter from "../EventManger";
import { Colors, GlobalEvents } from "../constants";
import MarkingParagraph from "./markingParagraph";

export default class MarkElementsCollection {
	public markElements: MarkElement[] = [];
	public id: string = "";
	public isRateable: boolean = false;
	public isGenerated: boolean = false;
	public markingType: MarkingType = MarkingType.WellFormulated;
	public isVerified: boolean = false;
	public isVerifiedFalse: boolean = false;
	public isRatingTask: boolean = false;
	public ratings: number[] = [];

	constructor(isGenerated?: boolean, isRateable?: boolean, isRatingTask?: boolean) {
		this.id = this.getCollectionUid();
		this.isGenerated = isGenerated ?? false;
		this.isRateable = isRateable ?? false;
		this.isRatingTask = isRatingTask ?? false;
	}

	public createMarksFromMarkingTaskDataEntry(markingData: MarkingTaskData) {
		this.id = markingData.id;
		this.markingType = markingData.markingType;
		this.isVerified = markingData.isVerified;
		this.isVerifiedFalse = markingData.isVerifiedFalse;
		this.ratings = markingData.ratings ?? [];

		if (markingData.isVerified) this.isRateable = false;

		markingData.markingParagraphs.forEach((paragraph: MarkingParagraph, index: number) => {
			const selection = this.createSelection(
				paragraph.markedText,
				paragraph.prefix,
				paragraph.suffix,
				paragraph.totalOccurances,
				paragraph.selectedOccurance
			);

			if (!selection) return;

			this.createMarkElement(index, markingData.markingType, selection);
		});

		if (this.isVerified && this.markElements.length > 0) {
			// display a checkmark in the top left corner of the collection
			const firsElemOfCollection = this.markElements[0];
			let checkmarkElement = document.createElement("span");
			checkmarkElement.innerHTML = "✔";
			checkmarkElement.style.color = "green";
			checkmarkElement.style.borderRadius = "25%";
			checkmarkElement.style.position = "absolute";
			checkmarkElement.style.top = "-1.25em";
			checkmarkElement.style.left = "0";
			checkmarkElement.title = "Bestätigte Markierung";

			const elem = document.getElementById(firsElemOfCollection.id);
			if (!elem) return;

			elem.style.position = "relative";
			elem.appendChild(checkmarkElement);
		}

		if (this.isVerifiedFalse && this.markElements.length > 0) {
			// display a cross in the top left corner of the collection
			const firsElemOfCollection = this.markElements[0];
			let crossElement = document.createElement("span");
			crossElement.innerHTML = "✘";
			crossElement.style.color = "red";
			crossElement.style.borderRadius = "25%";
			crossElement.style.position = "absolute";
			crossElement.style.top = "-1.25em";
			crossElement.style.left = "0";
			crossElement.title = "Falsch markierte Stelle";

			const elem = document.getElementById(firsElemOfCollection.id);
			if (!elem) return;

			elem.style.position = "relative";
			elem.appendChild(crossElement);
		}

		if (this.isVerified) return;
		if (this.isVerifiedFalse) return;

		// foreach rating display a red circle if the rating value is below 2 a yellow one if the rating is 3 and a green one if the rating is above 3
		this.ratings.forEach((rating: number, index: number) => {
			const firsElemOfCollection = this.markElements[0];
			let circleElement = document.createElement("span");
			circleElement.style.backgroundColor = rating <= 2 ? "red" : rating === 3 ? "yellow" : "green";
			circleElement.style.borderRadius = "100%";
			circleElement.style.width = "0.75em";
			circleElement.style.height = "0.75em";
			circleElement.style.border = "1px solid white";
			circleElement.style.position = "absolute";
			circleElement.style.top = "-1em";
			circleElement.style.left = `${index * 0.5}em`;
			circleElement.title = `Bereits erfolgte Bewertungen: ${this.ratings.join(", ")}`;

			const elem = document.getElementById(firsElemOfCollection.id);
			if (!elem) return;

			elem.style.position = "relative";
			elem.appendChild(circleElement);
		});
	}

	public createMarksFromSelection(markingType: MarkingType): MarkingTaskData {
		const markingData = new MarkingTaskData();
		markingData.createParagraphsFromSelection(this.id, markingType);

		this.createMarksFromMarkingTaskDataEntry(markingData);

		return markingData;
	}

	private createMarkElement(index: number, markingType: MarkingType, selection: Selection): void {
		const mark: MarkElement = new MarkElement(
			`span-${this.id}-${index}`,
			markingType,
			undefined,
			this.isRatingTask && !this.isRateable
		);
		const range = selection.getRangeAt(0);
		if (!range) {
			console.error(`Undefined range`);
			return;
		}
		const length = range.endOffset - range.startOffset;
		const span = mark.createSpanElement();

		span.style.cursor = "pointer";
		span.onclick = (event) => this.handleClickCollection(event);

		this.markElements.push(mark);
		length >= 1 ? range.surroundContents(span) : "";
	}

	private createSelection(
		text: string,
		prefix: string,
		suffix: string,
		count: number,
		index: number
	): Selection | null {
		let selection: Selection | null = null;
		let occurrence = 0;

		const lastScrollX = window.scrollX;
		const lastScrollY = window.scrollY;

		window.scrollTo(0, 0);
		window.getSelection()?.removeAllRanges();

		let found = true;
		const compositeText = `${prefix}${text}${suffix}`;
		while (occurrence < count) {
			//@ts-ignore
			found = window.find(compositeText, false, false, false);
			if (!found) break;

			const currentSelection = window.getSelection();
			if (!currentSelection) continue;

			// Create a range that corresponds to the markedText part only
			const markedTextRange = document.createRange();
			markedTextRange.setStart(currentSelection.anchorNode as Node, currentSelection.anchorOffset + prefix.length);
			markedTextRange.setEnd(currentSelection.focusNode as Node, currentSelection.focusOffset - suffix.length);

			if (occurrence === index) {
				selection = currentSelection;
				selection.removeAllRanges();
				selection.addRange(markedTextRange);
				break;
			}
			occurrence++;
		}

		setTimeout(() => window.scrollTo(lastScrollX, lastScrollY), 0);

		return selection;
	}

	private getCollectionUid() {
		const timestamp = new Date().getTime().toString(36);
		const randomStr = Math.random().toString(36).slice(2, 7);
		return `${timestamp}-${randomStr}`;
	}

	private handleClickCollection(event: MouseEvent) {
		event.stopPropagation();
		const elem = event.target as HTMLElement;

		if (!elem.id.includes(this.id)) return;
		if (!this.isRateable && this.isGenerated) return;

		elem.classList.add("active-mark");
		this.markElements.forEach((mark) => mark.toggleHighlight());
		eventEmitter.emit(GlobalEvents.CollectionClicked, {
			htmlId: `span-${this.id}-0`,
			id: this.id,
			isRating: this.isRateable,
			markType: this.markingType,
		});
	}

	public deactivateHighlights() {
		document.getElementById(this.id)?.classList.remove("active-mark");
		this.markElements.forEach((mark) => (mark.isActive ? mark.toggleHighlight() : ""));
	}

	public updateMarkColors(isGray: boolean) {
		this.markElements.forEach((elem) => {
			const docElem = document.getElementById(elem.id);
			if (!docElem) return;

			if (isGray) {
				docElem.style.backgroundColor = Colors.pastelGray;
				docElem.style.cursor = "default";
				return;
			}

			docElem.style.cursor = "pointer";
			docElem.style.backgroundColor = elem.getMarkingColor().color;
		});
	}

	public removeElements() {
		try {
			this.markElements.forEach((elem) => {
				if (!elem) return;
				if (!elem.id) return;

				const docElem = document.getElementById(elem.id);
				if (!docElem) return;
				docElem.style.backgroundColor = "transparent";
				docElem.style.cursor = "default";
			});
		} catch (error) {
			console.log(error);
		}
	}
}
