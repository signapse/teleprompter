import apiClient from "@/lib/api/apiClient";
import { IParagraph } from "@/types/paragraph";
import { handleApiError } from "./apiUtils";

const PARAGRAPHS_SERVICE_ENDPOINT = `/v1/paragraph`;

export interface ISearchParagraphsParams {
  query?: string | null;
  folder?: string | null;
  clientId?: string | null;
  assignedUserId?: number | undefined;
}

const paragraphService = {
  getParagraphs: async ({
    params,
  }: {
    params?: ISearchParagraphsParams;
  } = {}): Promise<GenericApiListResponse<IParagraph> | void> => {
    const searchParams = new URLSearchParams({
      isTeleprompter: "true",
      assignedUserId: params?.assignedUserId?.toString() || "",
    });

    const searchParagraphsUrl = `${PARAGRAPHS_SERVICE_ENDPOINT}/all?${searchParams.toString()}`;

    try {
      const res = await apiClient.get<GenericApiListResponse<IParagraph>>(
        searchParagraphsUrl
      );

      return res.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default paragraphService;
