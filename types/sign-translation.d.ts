import { ClientPartial } from "./client";
import { BackgroundSegmentationStatus, SignTranslationStatus } from "./enums";
import {
  IParagraph,
  IParagraphSentence,
  //   ParagraphPartial,
  //   ParagraphSentencePartial,
} from "./paragraph";

interface ISignTranslationDetails extends IBaseItemFromAPI {
  status: SignTranslationStatus;
  backgroundSegmentationStatus: BackgroundSegmentationStatus;
  translationFileName?: string;
  videoFileUrl?: string;
  originalSourceFileUrl?: string;
  translationHash?: string;
  paragraph?: IParagraph;
  sentence?: IParagraphSentence;
  notes?: string;
}
