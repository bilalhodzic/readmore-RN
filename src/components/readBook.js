import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Caption, IconButton } from "react-native-paper";
import Pdf from "react-native-pdf";
import { updateBookPage } from "../../storage";
import { useDarkMode } from "react-native-dynamic";
import Orientation from "react-native-orientation-locker";

const WIN_WIDTH = Dimensions.get("window").width;
const WIN_HEIGHT = Dimensions.get("window").height;
const initialScale = 1;

export default function ReadBook({ route, navigation }) {
  const { oneBook } = route.params;
  const [currentPage, setCurrentPage] = React.useState(oneBook.pageRead);
  const [pdfLoaded, setPdfLoaded] = React.useState(false);
  const [scale, setScale] = React.useState(initialScale);
  const [width, setWidth] = React.useState(WIN_WIDTH);
  const [deviceOrientation, setDeviceOrientation] = React.useState("PORTRAIT");

  const isDarkMode = useDarkMode();
  const totalPages = oneBook.pages;
  const source = { uri: oneBook.file, cache: true, expiration: 0 };

  //reference to pdf document--being able to use setPage() method
  var pdfRef = React.createRef(null);

  //changes  depends of orientation
  const _onOrientationDidChange = (orientation) => {
    if (orientation == "LANDSCAPE-LEFT" || orientation == "LANDSCAPE-RIGHT") {
      setWidth(
        WIN_HEIGHT > WIN_WIDTH ? WIN_HEIGHT - 0.08 * WIN_HEIGHT : WIN_WIDTH
      );
      setDeviceOrientation(orientation);
    } else {
      setWidth(WIN_HEIGHT > WIN_WIDTH ? WIN_WIDTH : WIN_HEIGHT);
      setDeviceOrientation(orientation);
    }
  };

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

  //add event listener on change orientation and remove it after unmounting
  React.useEffect(() => {
    Orientation.addDeviceOrientationListener(_onOrientationDidChange);
    return () => {
      Orientation.removeDeviceOrientationListener(_onOrientationDidChange);
    };
  }, []);

  //hide stack navigator in landscape while reading
  React.useLayoutEffect(() => {
    if (
      deviceOrientation == "LANDSCAPE-LEFT" ||
      deviceOrientation == "LANDSCAPE-RIGHT"
    ) {
      navigation.setOptions({
        headerShown: true,
        headerTitle: null,
        headerStyle: { height: 40, backgroundColor: "initial" },
        headerLeft: null,
      });
    } else {
      navigation.setOptions({
        headerShown: true,
        headerTitle: "ReadMore",
        headerStyle: {
          height: 80,
          backgroundColor: "initial",
          borderBottomWidth: 3,
          borderRadius: isDarkMode ? 0 : 3,
          borderBottomColor: isDarkMode ? "#000000cc" : "#7fb7f2CC",
        },
      });
    }
  }, [deviceOrientation]);

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
    // <ScrollView
    //   horizontal={true}
    //   scrollEnabled={false}
    //   //scrollEnabled={deviceOrientation.includes("LANDSCAPE") ? false : false}
    // >

    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#000000e6" : "#fff",
        width: width,
        position: "absolute",
        height: deviceOrientation.includes("LANDSCAPE") ? WIN_WIDTH : "100%",
        alignSelf: "center",
        // marginLeft: deviceOrientation.includes("LANDSCAPE")
        //   ? -0.21 * WIN_HEIGHT //-145 //-0.16 * WIN_HEIGHT
        //   : 0,

        bottom: deviceOrientation.includes("LANDSCAPE") ? "20%" : 0,
        transform:
          deviceOrientation === "LANDSCAPE-LEFT"
            ? [{ rotate: "90deg" }]
            : deviceOrientation === "LANDSCAPE-RIGHT"
            ? [{ rotate: "-90deg" }]
            : [{ rotate: "0deg" }],
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
        maxScale={5}
        horizontal={true}
        scale={initialScale}
        source={source}
        fitPolicy={deviceOrientation.includes("LANDSCAPE") ? 0 : 0}
        enableAnnotationRendering={true}
        enablePaging={true}
        onPageChanged={(page) => {
          console.log("page: ", page);
          setCurrentPage(page);
        }}
        onLoadComplete={() => {
          if (pdfLoaded === false) {
            setPdfLoaded(true);
          }
        }}
        onScaleChanged={(scale1) => {
          setScale(scale1 >= 1.0 ? scale1 : 1.0);
        }}
        onError={(error) => {
          console.log(error);
        }}
        style={{
          flex: 1,
          //width: Dimensions.get("window").width,
          //height: Dimensions.get("window").height,
          // backgroundColor: "white", //isDarkMode ? "#000000e6" : "white",
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
          color={isDarkMode ? "white" : "#000000e6"}
        />
        <IconButton
          icon="arrow-right"
          onPress={nextPage}
          style={{ margin: 0 }}
          size={30}
          color={isDarkMode ? "white" : "#000000e6"}
        />
      </View>
    </View>
    //</ScrollView>
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
