import { SignLanguage, UserRole } from "./enums";
import { UserPartial } from "./user";
import { ClientPartial } from "./client";

interface IParagraph extends IBaseItemFromAPI {
  client: ClientPartial;
  videoLabel: string;
  folder: string;
  signLanguage: SignLanguage;
  text: string;
  translation?: SignTranslationPartial;
  assignedUserRole?: UserRole;
  assignedUser?: UserPartial;
  isTeleprompter?: boolean;
}

interface IParagraphSentence extends IBaseItemFromAPI {
  text: string;
  paragraphId: number;
  sentenceGloss?: string;
  sentenceOrder: number;
  label: string;
  videoFileUrl?: string;
  isApproved: boolean;
  translationId?: number;
  approvedBy?: UserPartial;
}

// export type ParagraphSentencePartial = Partial<IParagraphSentence> & {
//   id: number;
//   text: string;
//   sentenceOrder: number;
//   label: string;
// };

// export type ParagraphPartial = Partial<IParagraphDetails> & {
//   id: number;
//   text: string;
//   videoLabel: string;
//   signLanguage: SignLanguage;
//   sentences?: ParagraphSentencePartial[];
// };
