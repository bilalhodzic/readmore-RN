import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Title,
  Card,
  Subheading,
  FAB,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { getDLink } from "../../helpers";
import * as FileSystem from "expo-file-system";
import HTML from "react-native-render-html";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const bookDir = FileSystem.documentDirectory + "books/";

export default function DisplayOneBook({ route, navigation }) {
  const [showDescription, setShowDescription] = React.useState(false);
  const [visibleImage, setVisibleImage] = React.useState(false);
  const { oneBook } = route.params;

  async function ensureDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(bookDir);
    if (!dirInfo.exists) {
      console.log("Books direcoty doesn't exist, creating..");
      await FileSystem.makeDirectoryAsync(bookDir);
    }
  }

  const downloadFile = async () => {
    console.log("pressed");
    let downloadURL = getDLink(oneBook);
    console.log(downloadURL);

    await ensureDirExists();
    FileSystem.downloadAsync(downloadURL, bookDir + oneBook.title)
      .then(({ uri }) => {
        console.log("finished downloading to ", uri);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //console.log(oneBook);
  return (
    <>
      <Provider>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Title style={styles.text}>{oneBook.title}</Title>
            <Subheading style={styles.text}>
              <MaterialCommunityIcons
                name="account"
                size={15}
                color="#7fb7f2"
              />
              {"  "}
              {oneBook.author}
            </Subheading>
            <View style={styles.book}>
              <TouchableOpacity onPress={() => setVisibleImage(true)}>
                <Image
                  style={styles.bookImage}
                  source={{ uri: oneBook.image }}
                />
              </TouchableOpacity>
              <Portal>
                <Modal
                  contentContainerStyle={styles.modalStyle}
                  visible={visibleImage}
                  onDismiss={() => setVisibleImage(false)}
                >
                  <Image
                    style={styles.openImage}
                    source={{ uri: oneBook.image }}
                  />
                </Modal>
              </Portal>
              <View style={styles.bookDescr}>
                <Subheading>
                  <MaterialCommunityIcons
                    name="file"
                    size={15}
                    color="#7fb7f2"
                  />
                  {"  "}
                  {oneBook.filesize}
                </Subheading>
                <Subheading>
                  <MaterialCommunityIcons
                    name="book-open-page-variant"
                    size={15}
                    color="#7fb7f2"
                  />
                  {"  "}
                  {oneBook.pages} pages
                </Subheading>
                <Subheading>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={15}
                    color="#7fb7f2"
                  />
                  {"  "}
                  {oneBook.year}
                </Subheading>
                <Subheading>
                  <MaterialIcons name="extension" size={15} color="#7fb7f2" />
                  {"  "}
                  {oneBook.extension}
                </Subheading>
              </View>
            </View>
            <FAB
              style={styles.fab}
              icon={showDescription ? "chevron-up" : "chevron-down"}
              label="Show description"
              color="white"
              uppercase={false}
              onPress={() => setShowDescription(!showDescription)}
            />
            {showDescription && (
              <Card elevation={3} style={{ margin: 10, flexBasis: 1 }}>
                <Card.Content>
                  <HTML
                    tagsStyles={{ p: { textAlign: "center" } }}
                    html={oneBook.descr}
                  />
                </Card.Content>
              </Card>
            )}
            <FAB
              label="Download now"
              icon="download"
              color="white"
              uppercase={false}
              style={styles.fab}
              onPress={downloadFile}
            />

            <StatusBar style="auto" />
          </View>
        </ScrollView>
      </Provider>

      <FAB
        icon="chevron-double-left"
        small
        style={styles.fabBack}
        animated={true}
        onPress={() => {
          navigation.navigate("mainPage", { screen: "search" });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: "2%",
    paddingTop: "15%",
    justifyContent: "flex-start",
  },
  modalStyle: {
    backgroundColor: "white",
    margin: "6%",
    padding: "4%",
  },
  openImage: {
    width: 280,
    height: 380,
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
  },
  bookImage: {
    width: "40%",
    height: 190,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
  book: {
    width: "100%",
    marginTop: "5%",
  },
  bookDescr: {
    height: 190,
    width: "60%",
    // borderColor: "black",
    // borderWidth: 2,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    fontSize: 24,
  },
  fab: {
    marginTop: "5%",
    width: "60%",
    backgroundColor: "#7fb7f2",
    textTransform: "none",
    height: 35,
    justifyContent: "center",
  },
  fabBack: {
    backgroundColor: "#ff0000",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
