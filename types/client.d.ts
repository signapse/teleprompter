import { SignLanguage } from "./enums";

interface IClient extends IBaseItemFromAPI {
  name: string;
  email?: string;
  website?: string;
  signLanguage: SignLanguage;
  notes?: string;
  isVt: boolean;
  isTransport: boolean;
  isWebTranslation: boolean;
}

type ClientPartial = Partial<IClient> & { id: number; name: string };
