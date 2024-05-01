import { Colors } from "./enums";

export interface Metadata {
  websiteUrl: string;
  createdDate: Date;
}

export interface AnnotationCollection {
  prefix?: string;
  suffix?: string;
  annotatedText: string;
  metaData: Metadata;
  color: Colors;
}
