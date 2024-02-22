import { MarkingType } from "../enums";
import MarkingParagraph from "./markingParagraph";

export interface MarkingTaskApiObject {
  id: string;
  contributionUrl: string;
  username: string;
  selectedText: string;
  markingType: MarkingType;
  isVerified: boolean;
  markingParagraphs: MarkingParagraph[];
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
  public isVerifiedFalse: boolean = false;
  public completionId: number = 0;
  public ratings: number[] = [];
  public usernames: string[] = [];
  public userIds: string[] = [];

  constructor(markingTaskData?: MarkingTaskData) {
    if (!markingTaskData) return;
    this.id = markingTaskData.id;
    this.selectedText = markingTaskData.selectedText;
    this.markingType = markingTaskData.markingType;
    this.createdDate = markingTaskData.createdDate;
    this.contributionURL = markingTaskData.contributionURL;
    this.userId = markingTaskData.userId;
    this.username = markingTaskData.username;
    this.markingParagraphs = markingTaskData.markingParagraphs.map((p) => new MarkingParagraph(p));
    this.isVerified = markingTaskData.isVerified;
    this.isVerifiedFalse = markingTaskData.isVerifiedFalse;
    this.completionId = markingTaskData.completionId;
    this.ratings = markingTaskData.ratings;
    this.usernames = markingTaskData.usernames;
    this.userIds = markingTaskData.userIds;
  }

  public createParagraphsFromSelection(id: string, markingType: MarkingType): Selection[] | undefined {
    this.markingParagraphs = [];
    const userSelection = window.getSelection();

    // Validation
    if (!userSelection || userSelection.toString() === "") return;

    this.id = id;
    this.markingType = markingType;

    // Computed values
    this.createdDate = new Date();
    this.contributionURL = window.location.href;
    this.selectedText = userSelection.toString();

    // Set Paragraphs
    const resultSelections: Selection[] = [];

    for (let i = 0; i < userSelection.rangeCount; i++) {
      const range = userSelection.getRangeAt(i);
      const subRanges = this.walkRange(range);

      for (const subRange of subRanges) {
        // Create a new selection for the sub-range
        const newSelection = document.getSelection();
        if (newSelection) {
          console.log(newSelection.toString());
          newSelection.removeAllRanges();
          newSelection.addRange(subRange);

          // Call the function with the new selection
          const paragraph = new MarkingParagraph();
          paragraph.createParagraphFromSelection(newSelection, id);

          // Check if the marked paragraph is not empty before adding it
          if (paragraph.markedText) {
            this.markingParagraphs.push(paragraph);
            resultSelections.push(newSelection);
          }
        }
      }
    }

    return resultSelections;
  }

  public getDbObject(): MarkingTaskApiObject {
    return {
      id: this.id,
      contributionUrl: this.contributionURL,
      username: this.username,
      selectedText: this.selectedText,
      markingType: this.markingType,
      isVerified: false,
      markingParagraphs: this.markingParagraphs,
    } as MarkingTaskApiObject;
  }

  private walkRange(range: Range): Range[] {
    let ranges: Range[] = [];
    let elementNode = range.startContainer;

    let hasRemainingElements = true;
    while (hasRemainingElements) {
      let startOffset: number = elementNode == range.startContainer ? range.startOffset : 0;

      let endOffset: number =
        elementNode && elementNode === range.endContainer ? range.endOffset : elementNode.textContent?.length ?? 0;

      let r = document.createRange();
      r.setStart(elementNode, startOffset);
      r.setEnd(elementNode, endOffset);
      ranges.push(r);

      /// Move to the next text container in the tree order
      hasRemainingElements = false;
      while (!hasRemainingElements && elementNode != range.endContainer) {
        let nextEl = this.getFirstTextNode(elementNode.nextSibling);
        if (nextEl) {
          elementNode = nextEl;
          hasRemainingElements = true;
          continue;
        }
        if (elementNode.nextSibling) {
          elementNode = elementNode.nextSibling;
          continue;
        }
        if (elementNode.parentNode) {
          elementNode = elementNode.parentNode;
          continue;
        }

        break;
      }
    }

    return ranges;
  }

  private getFirstTextNode(el: Node | null): Node | null {
    /// Degenerate cases: either el is null, or el is already a text node
    if (!el) return null;
    if (el.nodeType === Node.TEXT_NODE) return el;

    const childNodes: NodeList = el.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      if (child.nodeType === Node.TEXT_NODE) return child;

      // Recursively go over the dom
      let textNode = this.getFirstTextNode(child);
      if (textNode !== null) return textNode;
    }

    return null;
  }
}
