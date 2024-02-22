import { ContextMenuType, MarkingType } from "../enums";
import PositionTuple from "../positionTuple";
import { Ids, OffsetY } from "../constants";
import ButtonElement from "./buttonElement";

export default class ContextMenuElement {
	public contextMenuType: ContextMenuType = ContextMenuType.Marking;
	public id: string = "";

	constructor(contextMenuType: ContextMenuType) {
		this.contextMenuType = contextMenuType;
		this.id = Ids.ContextMenuId;
	}

	public showContextMenu(elementClickedId?: string, markType?: MarkingType, tag?: string) {
		const contextMenuElement = document.createElement("div");
		contextMenuElement.classList.add("my-custom-fonting-bonobo", "context-menu");
		contextMenuElement.id = this.id;

		const contextHeader = document.createElement("span");
		contextHeader.classList.add("context-header");

		const buttons: ButtonElement[] = [];

		switch (this.contextMenuType) {
			case ContextMenuType.Deleting:
				contextHeader.textContent = "Markierung";
				buttons.push(new ButtonElement(Ids.DeleteButton, "Entfernen"));
				break;
			case ContextMenuType.Rating:
				contextHeader.textContent = `Wie sehr stimmst du der folgenden Aussage zu: "${this.getTextForRating(
					markType,
					tag
				)}"`;

				const buttonLabels = [
					"1 (stimme nicht zu)",
					"2 (stimme eher nicht zu)",
					"3 (stimme weder zu noch nicht zu)",
					"4 (stimme eher zu)",
					"5 (stimme zu)",
				];

				buttonLabels.forEach((label, index) => buttons.push(new ButtonElement(`${Ids.RatingButton}-${index}`, label)));
				break;
			case ContextMenuType.Semantic:
				contextHeader.textContent = "Markieren als";
				buttons.push(new ButtonElement(Ids.SemanticMarkButton, "Passt zu dem Begriff"));
				break;
			case ContextMenuType.Marking:
				contextHeader.textContent = "Markieren als";
				buttons.push(new ButtonElement(Ids.WellFormulatedButton, "Gut formuliert"));
				buttons.push(new ButtonElement(Ids.BadlyFormulatedButton, "Schlecht formuliert"));
				break;
		}

		contextMenuElement.append(contextHeader);
		buttons.forEach((button) => contextMenuElement.append(button.createButtonElement()));

		document.body.append(contextMenuElement);

		const position = this.calculateContextPosition(contextMenuElement, elementClickedId);
		contextMenuElement.style.top = position?.getPositionStyleY() ?? "0px";
		contextMenuElement.style.left = position?.getPositionStyleX() ?? "0px";
	}

	public hideContextMenu() {
		let element = document.getElementById(this.id);

		while (element) {
			element.remove();
			element = document.getElementById(this.id);
		}
	}

	private calculateContextPosition(contextMenu: HTMLElement, elementClickedId?: string) {
		let element = null;

		switch (this.contextMenuType) {
			case ContextMenuType.Deleting:
			case ContextMenuType.Rating:
				element = document.getElementById(elementClickedId ?? "");
				break;
			case ContextMenuType.Marking:
			case ContextMenuType.Semantic:
				const selection = window.getSelection();
				if (!selection) return undefined;

				const range = selection.getRangeAt(0);
				element = range;
				break;
		}

		if (!element) return undefined;

		const elementRect = element.getBoundingClientRect();
		const contextRect = contextMenu.getBoundingClientRect();

		// Check if the context menu will be outside the bottom edge of the screen
		if (elementRect.y - contextRect.height - OffsetY <= 0) {
			return new PositionTuple(elementRect.x, elementRect.y + elementRect.height + OffsetY);
		}

		return new PositionTuple(elementRect.x, elementRect.y - contextRect.height - OffsetY);
	}

	private getTextForRating(markType?: MarkingType, tag?: string) {
		switch (markType) {
			case MarkingType.NotUnderstandable:
				return "Die Aussage ist für mich schlecht formuliert.";
			case MarkingType.Semantic:
				return `Die Aussage passt zu dem folgendem Begriff: ${tag}.`;
			case MarkingType.WellFormulated:
				return "Die Aussage ist für mich gut formuliert.";
			default:
				return "Die Aussage ist für mich gut formuliert.";
		}
	}
}
