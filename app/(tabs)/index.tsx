import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import ParagraphList from "@/components/paragraphs/ParagraphList";
import ParagraphListActionBar from "@/components/paragraphs/ParagraphListActionBar";
import { useParagraphSelectionContext } from "@/components/providers/ParagraphSelectionProvider";
import { useParagraphs } from "@/components/providers/ParagraphsProvider";

export default function HomeScreen() {
  const { selection, toggleParagraphSelection } =
    useParagraphSelectionContext();

  const { paragraphs, isLoading, error, refetch } = useParagraphs();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={styles.activity} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ParagraphList
        paragraphs={paragraphs}
        selection={selection}
        toggleParagraphSelection={toggleParagraphSelection}
        refetch={refetch}
        error={error?.message}
      />
      <ParagraphListActionBar selection={selection} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFCFE",
  },
  activity: {
    paddingVertical: 26,
  },
});
