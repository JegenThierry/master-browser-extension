import { MAX_DEPTH } from "../constants";

interface SelectionInfos {
	totalOccurrences: number;
	selectedOccurrence: number;
}

export default class MarkingParagraph {
	public id: number = 0;
	public markId: string = "";
	public markedText: string = "";
	public prefix: string = "";
	public suffix: string = "";
	public selectedOccurance: number = 0;
	public totalOccurances: number = 0;

	constructor(markingParagraph?: MarkingParagraph) {
		if (!markingParagraph) return;
		this.id = markingParagraph.id;
		this.markId = markingParagraph.markId;
		this.markedText = markingParagraph.markedText;
		this.prefix = markingParagraph.prefix;
		this.suffix = markingParagraph.suffix;
		this.selectedOccurance = markingParagraph.selectedOccurance;
		this.totalOccurances = markingParagraph.totalOccurances;
	}

	public createParagraphFromSelection(selection: Selection, id: string): void {
		//Validate Selection
		if (!selection) return;
		if (selection.toString() == "") return;

		this.markId = id;
		// Causes Small offsets in some cases
		this.prefix = this.getPrefixFromSelection(selection).trimStart();
		this.suffix = this.getSuffixFromSelection(selection).trimEnd();
		this.markedText = this.removeUnsupportedSelectionCharacters(selection.toString());

		const selectionInfos = this.countOccurrencesAndFindIndex(selection);
		this.selectedOccurance = selectionInfos.selectedOccurrence;
		this.totalOccurances = selectionInfos.totalOccurrences;
	}

	private getPrefixFromSelection(selection: Selection): string {
		const range = selection.getRangeAt(0);
		const startContainer = range.startContainer;
		const startOffset = range.startOffset;

		return this.extractTextWithinSameBlock(startContainer, startOffset, true);
	}

	private getSuffixFromSelection(selection: Selection): string {
		const range = selection.getRangeAt(0);
		const endContainer = range.endContainer;
		const endOffset = range.endOffset;

		return this.extractTextWithinSameBlock(endContainer, endOffset, false);
	}

	/**
	 * Helper function that extracts all text within a given node.
	 * @param node Node of the selection
	 * @param offset offset from the selection
	 * @param isPrefix determines if text before the offset or after the offset is fetched
	 * @returns
	 */
	private extractTextWithinSameBlock(node: Node, offset: number, isPrefix: boolean): string {
		let text = "";
		let currentNode = node;

		while (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
			const nodeText = currentNode.textContent || "";
			if (isPrefix) text = nodeText.slice(0, offset) + text;
			else text += nodeText.slice(offset);

			if (currentNode === currentNode.parentElement?.firstChild && !isPrefix) currentNode = currentNode.parentElement;
			else currentNode = isPrefix ? (currentNode.previousSibling as Node) : (currentNode.nextSibling as Node);

			if (!currentNode || currentNode.nodeType !== Node.TEXT_NODE) break;

			offset = isPrefix ? nodeText.length : 0;
		}

		return this.removeUnsupportedSelectionCharacters(text);
	}

	private removeUnsupportedSelectionCharacters(text: string): string {
		return text.replaceAll("\n", "").replaceAll("\t", "");
	}

	private countOccurrencesAndFindIndex(selection: Selection): SelectionInfos {
		let count = 0;
		let index = -1;

		const originalRange = selection.getRangeAt(0);

		const lastScrollX = window.scrollX;
		const lastScrollY = window.scrollY;
		const compositeText = `${this.prefix}${this.markedText}${this.suffix}`;

		//Scroll to top since window.find starts from scroll position.
		window.scrollTo(0, 0);
		window.getSelection()?.removeAllRanges();

		let found = true;
		while (count < MAX_DEPTH) {
			//@ts-ignore
			found = window.find(compositeText, false, false, false);
			if (!found) break;

			const currentSelection = window.getSelection();
			if (!currentSelection || currentSelection === null) continue;

			// Create a range that corresponds to the markedText part only
			const markedTextRange = document.createRange();
			markedTextRange.setStart(currentSelection.anchorNode as Node, currentSelection.anchorOffset + this.prefix.length);
			markedTextRange.setEnd(currentSelection.focusNode as Node, currentSelection.focusOffset - this.suffix.length);

			count++;
			if (this.areEqualRanges(originalRange, markedTextRange)) index = count - 1;
		}

		// Restore the original selection
		if (originalRange) {
			window.getSelection()?.removeAllRanges();
			window.getSelection()?.addRange(originalRange);
		}

		window.scrollTo(lastScrollX, lastScrollY);
		return { totalOccurrences: count, selectedOccurrence: index };
	}

	private areEqualRanges(originalRange: Range, compareRange: Range) {
		const tollerance = 1;
		const originalRectClient = originalRange.getBoundingClientRect();
		const compareRectClient = compareRange.getBoundingClientRect();

		const isPosXDiffValid = Math.abs(originalRectClient.x - compareRectClient.x) <= tollerance;
		const isPosYDiffValid = Math.abs(originalRectClient.y - compareRectClient.y) <= tollerance;
		const isPosLeftDiffValid = Math.abs(originalRectClient.left - compareRectClient.left) <= tollerance;

		return isPosXDiffValid && isPosYDiffValid && isPosLeftDiffValid;
	}
}
