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
  Snackbar,
  ProgressBar,
} from "react-native-paper";
import { getDLink } from "../../helpers";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import HTML from "react-native-render-html";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { insertValue, getValueById } from "../../storage";
import { downloadFile } from "../../helpers";

const bookDir = FileSystem.documentDirectory + "books/";

export default function DisplayOneBook({ route, navigation }) {
  const [showDescription, setShowDescription] = React.useState(false);
  const [visibleImage, setVisibleImage] = React.useState(false);
  const [downloadingSnackbar, setDownloadingSnackbar] = React.useState(false);
  const [finishedSnackbar, setFinishedSnackbar] = React.useState(false);
  const [errorSnackbar, setErrorSnackbar] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(
    "File couldn't be downloaded :( "
  );

  const { oneBook, pathname } = route.params;

  async function ensureDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(bookDir);
    if (!dirInfo.exists) {
      console.log("Books direcoty doesn't exist, creating..");
      await FileSystem.makeDirectoryAsync(bookDir);
    }
  }

  const downloadFile = async () => {
    console.log("downloading book..");

    //generating download link
    let downloadURL = getDLink(oneBook);
    //console.log(downloadURL);

    //show to the user that downloading started
    setDownloadingSnackbar(true);
    setDisabledButton(true);

    (async function () {
      try {
        //Check in database if book is downloaded already
        let bookExist = await getValueById(oneBook.id);
        if (bookExist !== undefined) {
          setDownloadingSnackbar(false);

          setErrorSnackbar(true);
          setErrorMessage("Book already exist in library!");
          setDisabledButton(true);
          return console.log("book already exist!");
        }

        await ensureDirExists();
        //using expo filesystem to download files
        var file = await FileSystem.downloadAsync(
          downloadURL,
          bookDir + oneBook.title + "." + oneBook.extension
        );

        //console.log("FILE: ", file.uri);

        oneBook.file = file.uri;

        //after the book is downloaded insert it into database
        let addBook = await insertValue(oneBook);
        //insert will return true if everything is okay
        if (addBook === true) {
          setDownloadingSnackbar(false);
          setFinishedSnackbar(true);
        }
      } catch (error) {
        setDownloadingSnackbar(false);
        //FileSystem.deleteAsync(file.uri);
        setDisabledButton(false);

        setErrorSnackbar(true);
        return console.log(error);
      }
    })();
  };

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
                    html={oneBook.descr || "No description"}
                  />
                </Card.Content>
              </Card>
            )}
            {pathname !== "library" && (
              <>
                <FAB
                  label="Download now"
                  icon="download"
                  color="white"
                  disabled={disabledButton}
                  uppercase={false}
                  style={styles.fab}
                  onPress={downloadFile}
                />
                {/* <ProgressBar
                  progress={downloadProgress}
                  style={{ margin: 10 }}
                /> */}
              </>
            )}
            {showDescription && <View style={{ height: 100 }} />}

            <StatusBar style="auto" />
          </View>
          <Snackbar
            visible={downloadingSnackbar}
            onDismiss={() => setDownloadingSnackbar(false)}
            duration={10000}
            style={{
              position: "absolute",
              bottom: 0,
              backgroundColor: "#000000CC",
            }}
          >
            Downloading book..
          </Snackbar>
          <Snackbar
            visible={finishedSnackbar}
            onDismiss={() => setFinishedSnackbar(false)}
            duration={3000}
            style={{
              position: "absolute",
              bottom: 0,
              backgroundColor: "#52af52",
            }}
          >
            Book downloaded! Check your library
          </Snackbar>
          <Snackbar
            visible={errorSnackbar}
            onDismiss={() => setErrorSnackbar(false)}
            duration={3000}
            style={{
              position: "absolute",
              bottom: 0,
              backgroundColor: "#ff0000",
            }}
          >
            {errorMessage}
          </Snackbar>
        </ScrollView>
      </Provider>

      <FAB
        icon="chevron-double-left"
        small
        style={styles.fabBack}
        animated={true}
        onPress={() => {
          navigation.goBack();
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
    backgroundColor: "#ff1919CC",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
