import { ISignTranslationDetails } from "@/types/sign-translation";
import apiClient from "./apiClient";
import { handleApiError } from "./apiUtils";

const SIGN_TRANSLATION_API_ENDPOINT = `/v1/sign-translation`;

export interface IPostTranslationRequestData {
  paragraphId?: number;
  sentenceId?: number;
  notes?: string;
}

export interface IPart {
  id: number;
  etag: string;
  uploadId: string;
  key: string;
}

export interface IPostMultipartUploadCompleteRequestData {
  parts: IPart[];
}

export interface IPostPresignedUrlsRequestData {
  fileKey: string;
  numberOfParts: number;
}

export interface PresignedUrl {
  partNumber: number;
  uploadUrl: string;
  uploadId: string;
  key: string;
}

export interface IBulkUploadSignTranslationsRequestData {
  fileName: string;
  clientId: number;
  replace: boolean;
  isSentenceTranslation: boolean;
}

const signTranslationService = {
  postTranslationBulk: async ({
    data,
  }: {
    data: IBulkUploadSignTranslationsRequestData;
  }): Promise<ISignTranslationDetails | void> => {
    const bulkUploadSignTranslationsUrl = `${SIGN_TRANSLATION_API_ENDPOINT}/bulk/translation`;

    try {
      const response = await apiClient.post<
        GenericApiObjectResponse<ISignTranslationDetails>
      >(bulkUploadSignTranslationsUrl, data);

      return response.data?.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  postPresignedUrls: async ({
    data,
  }: {
    data: IPostPresignedUrlsRequestData;
  }): Promise<PresignedUrl[] | void> => {
    const postPresignedUrlsUrl = `${SIGN_TRANSLATION_API_ENDPOINT}/multipart`;

    try {
      const response = await apiClient.post<PresignedUrl[]>(
        postPresignedUrlsUrl,
        data
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  postMultipartUploadComplete: async ({
    data,
  }: {
    data: IPostMultipartUploadCompleteRequestData;
  }): Promise<void> => {
    const postMultipartUploadCompleteUrl = `${SIGN_TRANSLATION_API_ENDPOINT}/multipart/complete`;

    try {
      const response = await apiClient.post<void>(
        postMultipartUploadCompleteUrl,
        data
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  postTranslationUploadComplete: async (id: number): Promise<number | void> => {
    const postMultipartTranslationVideoCompleteUrl = `${SIGN_TRANSLATION_API_ENDPOINT}/translation/complete/${id}`;

    try {
      const response = await apiClient.post<number | void>(
        postMultipartTranslationVideoCompleteUrl,
        {}
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  completeTranslationUpload: async ({
    id,
  }: {
    id: number;
  }): Promise<number | void> => {
    const postMultipartTranslationVideoCompleteUrl = `${SIGN_TRANSLATION_API_ENDPOINT}/translation/complete/${id}?isTeleprompter=true`;

    try {
      const response = await apiClient.post<number | void>(
        postMultipartTranslationVideoCompleteUrl,
        {}
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default signTranslationService;
