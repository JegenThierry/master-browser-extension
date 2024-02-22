import { IconType } from "../enums";
import { GlobalEvents, IconsSrc } from "../constants";
import eventEmitter from "../EventManger";
export default class ButtonElement {
	public id: string = "";
	public buttonText: string = "";
	public icon: IconType | undefined = undefined;

	constructor(id: string, buttonText: string, icon?: IconType) {
		this.id = id;
		this.buttonText = buttonText;
		this.icon = icon;
	}

	public createButtonElement(): HTMLButtonElement {
		const button = document.createElement("button");
		button.classList.add("generic-button");
		button.id = this.id;

		let imageElement: HTMLImageElement | undefined = undefined;

		const textElement = document.createElement("div");
		textElement.innerText = this.buttonText;
		textElement.id = `${this.id}-text`;

		imageElement ? button.appendChild(imageElement) : "";
		button.appendChild(textElement);

		button.addEventListener("click", this.handleClick);
		return button;
	}

	private handleClick(event: MouseEvent): void {
		event.stopPropagation();
		const target = event.target as HTMLElement;
		if (!target.id.includes(this.id)) return;

		eventEmitter.emit(GlobalEvents.ButtonClicked, target.id);
	}

	private getIconSrc(): string {
		switch (this.icon) {
			case IconType.Marker:
				return IconsSrc.Marker;
			case IconType.Delete:
				return IconsSrc.Delete;
			default:
				return "";
		}
	}

	private getIconName(): string {
		switch (this.icon) {
			case IconType.Marker:
				return "Marker";
			case IconType.Delete:
				return "Delete";
			default:
				return "";
		}
	}
}
