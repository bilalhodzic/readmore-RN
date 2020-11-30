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
      {/* <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        Go back
      </Button> */}
      <PDFReader
        source={{ uri: oneBook.file, headers: { key: "string" } }}
        withPinchZoom={true}
        style={{ width: "100%", backgroundColor: "red" }}
        customStyle={{
          readerContainerNumbers: {
            backgroundColor: "#fff",
            padding: 0,
          },
          readerContainerNumbersContent: {
            marginTop: 10,
            backgroundColor: "gray",
          },
          readerContainerDocument: {
            backgroundColor: "#fff",
            //zoom: "130%",
            transform: "scale(1.3)",
            width: "100%",
          },
          readerContainerNavigate: {
            backgroundColor: "#fff",
          },
          readerContainerNavigateArrow: {
            //border: "2px solid red",
            borderRadius: 20,
            fontSize: 30,
            color: "white",
            backgroundColor: "gray",
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //justifyContent: "flex-start",
  },
});
