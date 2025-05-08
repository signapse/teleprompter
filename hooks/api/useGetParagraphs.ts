import paragraphService, {
  ISearchParagraphsParams,
} from "@/lib/api/paragraphService";
import { IParagraph } from "@/types/paragraph";
import { useQuery } from "@tanstack/react-query";

interface Props {
  params?: ISearchParagraphsParams;
}

export default function useGetParagraphs({ params }: Props = {}) {
  return useQuery<GenericApiListResponse<IParagraph>, Error>({
    queryKey: [
      "paragraphs",
      params?.clientId,
      params?.folder,
      params?.query,
      params?.assignedUserId,
    ],
    queryFn: () =>
      paragraphService.getParagraphs({
        params: {
          assignedUserId: params?.assignedUserId,
        },
      }),
    // enabled: !!params?.assignedUserId, // TODO - uncomment this
  });
}
