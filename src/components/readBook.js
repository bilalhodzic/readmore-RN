import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Caption, IconButton } from "react-native-paper";
import Pdf from "react-native-pdf";
import { updateBookPage } from "../../storage";
import { useDarkMode } from "react-native-dynamic";

export default function ReadBook({ route }) {
  const { oneBook } = route.params;
  const [currentPage, setCurrentPage] = React.useState(oneBook.pageRead);
  const [pdfLoaded, setPdfLoaded] = React.useState(false);
  const [scale, setScale] = React.useState(1.15);

  const isDarkMode = useDarkMode();
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

  React.useEffect(() => {
    //useEffect hook when the pdf is loaded-only once
    //to set the initial page
    pdfRef.setPage(currentPage);
  }, [pdfLoaded]);

  React.useEffect(() => {
    //updating book page on every pageChanged
    updateBookPage(oneBook.id, currentPage);
  }, [currentPage]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#fff" : "#000000e6",
        justifyContent: "flex-start",
      }}
    >
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
        //singlePage={true}
        source={source}
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
        onScaleChanged={(scale1) => {
          setScale(scale1 >= 1.0 ? scale1 : 1.0);
        }}
        onError={(error) => {
          console.log(error);
        }}
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: isDarkMode ? "#000000e6" : "white",
        }}
      />
      {/* <View style={styles.zoom}>
        <IconButton icon="plus" color={"white"} onPress={zoomIn} />
        <IconButton icon="minus" color={"white"} onPress={zoomOut} />
      </View> */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: isDarkMode ? "#000000e6" : "white",
        }}
      >
        <IconButton
          icon="arrow-left"
          onPress={prevPage}
          size={30}
          style={{ margin: 0 }}
          color={isDarkMode ? "white" : "000000e6"}
        />
        <IconButton
          icon="arrow-right"
          onPress={nextPage}
          style={{ margin: 0 }}
          size={30}
          color={isDarkMode ? "white" : "000000e6"}
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

  zoom: {
    backgroundColor: "#00000070",
    borderRadius: 20,
    position: "absolute",
    right: 0,
    bottom: 63,
    zIndex: 2,
  },
});
