import { AnnotationCollection } from "../model/annotationCollection";

class AnnotationService {
  public async createAnnotation(windowSelection: Selection, websiteUrl?:string): Promise<AnnotationCollection> {
    if(!windowSelection || windowSelection.rangeCount === 0) throw new Error("Invalid argument Provided.");
    let annotationCollection = new AnnotationCollection();

    annotationCollection.annotatedText = windowSelection.toString();
    annotationCollection.prefix = await this.getPrefixOfSelection(windowSelection);
    annotationCollection.suffix = await this.getSuffixOfSelection(windowSelection);

    //Setting Metadata
    annotationCollection.metaData.websiteUrl = websiteUrl ?? window.location.href;
    annotationCollection.metaData.createdDate = new Date();

    return annotationCollection;
  }

  private async getPrefixOfSelection(windowSelection:Selection): Promise<string | undefined> {
    if(!windowSelection || windowSelection.rangeCount === 0) return undefined;

    const range = windowSelection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    if(container.nodeType !== Node.TEXT_NODE) return undefined;

    const textBeforeSelection = container.textContent?.substring(0, range.startOffset);
    return textBeforeSelection;
  }

  private async getSuffixOfSelection(windowSelection:Selection): Promise<string | undefined>{
    if(!windowSelection || windowSelection.rangeCount === 0) return undefined;

    const range = windowSelection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    if(container.nodeType !== Node.TEXT_NODE) return undefined;

    const textAfterSelection = container.textContent?.substring(range.endOffset, container.textContent.length);
    return textAfterSelection;
  }

  private async displayAnnotationOnWebsite(annotation:AnnotationCollection, websiteUrl?:string){
    if(websiteUrl) annotation.metaData.websiteUrl = websiteUrl;
  }
}

export default new AnnotationService();
