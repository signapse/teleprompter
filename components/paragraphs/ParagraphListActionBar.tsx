import { StyleSheet, View } from "react-native";
import StartRecordingButtonDialog from "@/components/shared/StartRecordingButtonDialog";
import UploadParagraphsButtonDialog from "@/components/paragraphs/UploadParagraphsButtonDialog";
import { IParagraph } from "@/types/paragraph";
import { useParagraphSelectionContext } from "../providers/ParagraphSelectionProvider";

interface Props {
  selection: IParagraph[];
}

export default function ParagraphListActionBar({ selection }: Props) {
  return (
    <View style={styles.fixedActionButtons}>
      <StartRecordingButtonDialog disabled={selection.length === 0} />
      {/* <UploadParagraphsButtonDialog disabled={isDisabled} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  fixedActionButtons: {
    position: "absolute",
    right: 20,
    bottom: 20,
    left: 20,
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 1000,
    backgroundColor: "transparent",
  },
});
