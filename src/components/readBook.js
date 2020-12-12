import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  BackHandler,
  AppState,
  ScrollView,
} from "react-native";
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
  Caption,
  IconButton,
} from "react-native-paper";
import Pdf from "react-native-pdf";
import { updateBookPage } from "../../storage";

export default function ReadBook({ route, navigation }) {
  const { oneBook } = route.params;
  const [currentPage, setCurrentPage] = React.useState(oneBook.pageRead);
  const [pdfLoaded, setPdfLoaded] = React.useState(false);

  const [scale, setScale] = React.useState(1.0);
  const totalPages = oneBook.pages;
  const source = { uri: oneBook.file, cache: true, expiration: 0 };

  //reference to pdf document--being able to use setPage() method
  var pdfRef = React.createRef(null);

  const nextPage = () => {
    let nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1;
    setCurrentPage(nextPage);
    pdfRef.setPage(nextPage);
  };
  const prevPage = () => {
    let prevPage = currentPage > 1 ? currentPage - 1 : 1;
    setCurrentPage(prevPage);
    pdfRef.setPage(prevPage);
  };
  const zoomIn = () => {
    let sc = scale * 1.2;
    setScale(sc);
    pdfRef.setPage(currentPage);
  };
  const zoomOut = () => {
    let sc = scale > 1 ? scale / 1.2 : 1;
    setScale(sc);
    pdfRef.setPage(currentPage);
  };

  React.useEffect(() => {
    //updating book page on every pageChanged
    updateBookPage(oneBook.id, currentPage);
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <Caption
        style={{
          backgroundColor: "#00000080",
          color: "white",
          display: "flex",
          alignSelf: "center",
          padding: 3,
          borderRadius: 5,
          textAlign: "center",
          position: "absolute",
          top: 0,
          zIndex: 2,
        }}
      >
        {currentPage}/{totalPages}
      </Caption>
      <Pdf
        ref={(pdf) => {
          pdfRef = pdf;
        }}
        horizontal={true}
        page={currentPage}
        spacing={0}
        //singlePage={true}
        source={source}
        scale={scale}
        fitPolicy={0}
        enableAnnotationRendering={true}
        enablePaging={true}
        onPageSingleTap={(page) => {
          console.log("single page tapped");
        }}
        onPageChanged={(page) => {
          console.log("page: ", page);
          setCurrentPage(page);
        }}
        onLoadComplete={() => {
          if (pdfLoaded === false) {
            setPdfLoaded(true);
          }
        }}
        onPressLink={(uri) => {
          console.log("Link pressed: ", uri);
        }}
        onScaleChanged={(scale) => {
          setScale(scale);
          //console.log("scale: ", scale);
        }}
        onError={(error) => {
          console.log(error);
        }}
        style={styles.pdf}
      />
      {/* <View style={styles.zoom}>
        <IconButton icon="plus" color={"white"} onPress={zoomIn} />
        <IconButton icon="minus" color={"white"} onPress={zoomOut} />
      </View> */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <IconButton
          icon="arrow-left"
          onPress={prevPage}
          size={30}
          style={{ margin: 0 }}
          color={"#00000099"}
        />
        <IconButton
          icon="arrow-right"
          onPress={nextPage}
          style={{ margin: 0 }}
          size={30}
          color={"#00000099"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  zoom: {
    backgroundColor: "#00000070",
    borderRadius: 20,
    position: "absolute",
    right: 0,
    bottom: 63,
    zIndex: 2,
  },
});
