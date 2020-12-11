import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
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
import Pdf from "react-native-pdf";

export default function ReadBook({ route, navigation }) {
  const { oneBook } = route.params;
  const source = { uri: oneBook.file };
  console.log(oneBook);
  const numberOfPage = oneBook.pages;

  return (
    <View style={styles.container}>
      <Pdf
        ref={(pdf) => {
          pdf = pdf;
          //pdf.setPage(3);
        }}
        source={source}
        //horizontal={true}
        //fitWidth={true}
        //spacing={10}
        //enableAntialiasing={true}
        //singlePage={true}
        //enablePaging={true}
        // onPageSingleTap={(page) => {
        //   console.log(page);
        // }}
        onLoadComplete={(numberOfPage, filePath) => {
          console.log(`number of pages: ${numberOfPage}`);
        }}
        onPageChanged={(page, numberOfPage) => {
          console.log(`current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link presse: ${uri}`);
        }}
        style={styles.pdf}
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
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
