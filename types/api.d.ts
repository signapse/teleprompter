interface GenericApiListResponse<T> {
  data: T[];
  total: number;
}

interface GenericApiObjectResponse<T> {
  data: T;
}

interface IBaseItemFromAPI {
  id: number;
  createdDate: string;
  updatedAtDate?: string;
}

// type AuthApiHeaders = {
//   authorization: string;
//   cache?: string;
// };

// interface RequestWithHeaders {
//   headers: AuthApiHeaders;
// }

interface LogEntry {
  type: LogType;
  message: string;
}
