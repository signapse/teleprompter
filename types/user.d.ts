import { UserRole, SignLanguage } from "./enums";

interface IUserPermission {
  id: number;
  name: string;
}

interface IUser extends IBaseItemFromAPI {
  authId: string;
  firstName: string;
  lastName: string;
  email: string;
  signLanguage: SignLanguage;
  role: UserRole;
  isDisabled: boolean;
}

type UserPartial = Partial<IUser> & {
  id: number;
  firstName: string;
  lastName: string;
};
