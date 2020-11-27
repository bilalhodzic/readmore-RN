import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Title,
  Card,
  Subheading,
  FAB,
  Modal,
  Portal,
  Provider,
  Snackbar,
  Button,
} from "react-native-paper";
import { WebView } from "react-native-webview";
import PDFReader from "rn-pdf-reader-js";

export default function ReadBook({ route, navigation }) {
  const { oneBook } = route.params;

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        Go back
      </Button>
      <PDFReader source={{ uri: oneBook.file }} withPinchZoom={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "2%",
    paddingTop: "15%",
    //justifyContent: "flex-start",
  },
});
