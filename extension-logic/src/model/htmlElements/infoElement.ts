import { TaskType } from "../enums";

export default class InfoElement {
	public id: string = "";
	private titleContainerId: string = "";
	private messageContainerId: string = "";

	public title: string = "";
	public message: string = "";

	constructor(activeTaskType?: TaskType) {
		this.id = `info-element-container`;
		this.titleContainerId = `info-container-tasktype-title`;
		this.messageContainerId = `info-container-tasktype-message`;

		this.title = this.getTitle(activeTaskType);
		this.message = this.getMessage(activeTaskType);
	}

	private createElement() {
		const elem = document.createElement("div");
		const titleContainer = document.createElement("div");
		const messageContainer = document.createElement("div");

		elem.classList.add("dragable", "my-custom-fonting-bonobo", "info-container");
		titleContainer.classList.add("context-header");

		titleContainer.innerText = this.title;
		messageContainer.innerText = this.message;

		titleContainer.id = this.titleContainerId;
		messageContainer.id = this.messageContainerId;

		elem.id = this.id;
		elem.style.left = "32px";
		elem.style.top = "32px";
		elem.append(titleContainer);
		elem.append(messageContainer);

		this.handleDrag(elem);
		document.body.appendChild(elem);
	}

	private handleDrag(elem: HTMLElement) {
		let offsetX = 0;
		let offsetY = 0;
		let isDragging = false;

		// Function to handle mouse down event
		const handleMouseDown = (event: MouseEvent) => {
			isDragging = true;
			offsetX = event.clientX - elem.getBoundingClientRect().left;
			offsetY = event.clientY - elem.getBoundingClientRect().top;
		};

		// Function to handle mouse move event
		const handleMouseMove = (event: MouseEvent) => {
			if (isDragging) {
				elem.style.left = event.clientX - offsetX + "px";
				elem.style.top = event.clientY - offsetY + "px";
			}
		};

		// Function to handle mouse up event
		const handleMouseUp = () => {
			isDragging = false;
		};

		// Add event listeners
		elem.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}

	public updateContent(activeTaskType?: TaskType) {
		if (activeTaskType == undefined) {
			this.removeElement();
			return;
		}

		const elem = document.getElementById(this.id);
		if (!elem) {
			this.title = this.getTitle(activeTaskType);
			this.message = this.getMessage(activeTaskType);
			this.createElement();
			return;
		}

		const titleContainer = document.getElementById(this.titleContainerId);
		const messageContainer = document.getElementById(this.messageContainerId);

		if (!titleContainer || !messageContainer) return;

		titleContainer.innerText = this.getTitle(activeTaskType);
		messageContainer.innerText = this.getMessage(activeTaskType);
	}

	private getMessage(activeTaskType?: TaskType): string {
		switch (activeTaskType) {
			case TaskType.ExploringTask:
				return "Sie können auf der Medienintermediärsseite frei navigieren, bis Sie eine neue Transparenzinformationsseite gefunden haben.";
			case TaskType.MarkingTask:
				return "Sie können beliebige Textstellen mit der linken Maustaste auswählen und anschließend mit der rechten Maustaste als für Sie verständlich oder unverständlich markieren. (Bitte markieren Sie nur Textstellen auf der aktuellen Seite.)";
			case TaskType.RatingTask:
				return "Klicken Sie auf eine Markierung, um diese zu bewerten. Graue Markierungen können nicht bewertet werden; diese haben Sie entweder selbst erstellt oder bereits bewertet.";
			case TaskType.ScoutingTask:
				return "Sie können einen Textbereich auswählen, der zum angezeigten Begriff passt, indem Sie ihn mit der linken Maustaste auswählen und anschließend mit der rechten Maustaste markieren. (Es kann maximal 1 Beispiel übertragen werden.)";
			case TaskType.SemanticTask:
				return "Sie können beliebige Textstellen auswählen, die zum angezeigten Begriff passen, indem Sie diese mit der linken Maustaste auswählen und anschließend mit der rechten Maustaste markieren. (Bitte markieren Sie nur Textstellen auf der aktuellen Seite.)";
			case TaskType.TimingTask:
				return "Sie können auf der Medienintermediärsseite frei navigieren, bis Sie die geforderte Transparenzinformationsseite gefunden haben.";
			default:
				return "";
		}
	}

	private getTitle(activeTaskType?: TaskType): string {
		switch (activeTaskType) {
			case TaskType.ExploringTask:
				return "Ausgewählte Aufgabe: Erkundungsaufgabe.";
			case TaskType.MarkingTask:
				return "Ausgewählte Aufgabe: Markierungsaufgabe.";
			case TaskType.RatingTask:
				return "Ausgewählte Aufgabe: Bewertungsaufgabe.";
			case TaskType.ScoutingTask:
				return "Ausgewählte Aufgabe: Semantische Aufgabe (Finden).";
			case TaskType.SemanticTask:
				return "Ausgewählte Aufgabe: Semantische Aufgabe (Markieren).";
			case TaskType.TimingTask:
				return "Ausgewählte Aufgabe: Erreichbarkeitsaufgabe.";
			default:
				return "";
		}
	}

	private removeElement() {
		const elemToRemove = document.getElementById(this.id);

		console.log(elemToRemove, "Should remove element");
		if (elemToRemove) {
			elemToRemove.remove();
		}
	}
}
