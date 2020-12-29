import { StatusBar } from "expo-status-bar";
import React from "react";
import { searchWithIndex } from "../../libgen-api/searchWithIndex";
import { StyleSheet, Image, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Card,
  Paragraph,
  Caption,
  Divider,
  Button,
  ProgressBar,
  IconButton,
  Portal,
  Dialog,
  Provider,
} from "react-native-paper";
import { deleteValue } from "../../storage";
import RNFetchBlob from "rn-fetch-blob";

export default function DisplayBooks(prop) {
  const [visibleDialog, setVisibleDialog] = React.useState(false);

  //making dinamic progress bar
  const normalise = (value) => ((value - 1) * 1) / (prop.book.pages - 1);
  var readProgress = normalise(prop.book.pageRead);

  //console.log("prop is: ", prop);

  //if pressed on see more --load one book in another page with all details
  const loadOneBook = (bookid) => {
    console.log(bookid);
    searchWithIndex(bookid)
      .then((response) => {
        //nested navigation with parameters
        prop.navigation.navigate(prop.pathname, {
          screen: "oneBook",
          params: {
            oneBook: response,
            pathname: prop.pathname,
          },
        });
        //console.log("oneBook is ready to display");
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  //if pressed on start reading-- load read book component
  const readBook = (book) => {
    prop.navigation.navigate(prop.pathname, {
      screen: "readBook",
      params: {
        oneBook: book,
      },
    });
  };

  const deleteBook = (book) => {
    console.log("book deleting", book.id);

    (async function () {
      try {
        await RNFetchBlob.fs.unlink(book.file);
        let deletedBook = await deleteValue(book.id);
        if (deletedBook === true) {
          prop.refreshLibrary();
        }
      } catch (error) {
        return console.log(error);
      }
    })();
  };

  return (
    <View style={styles.container}>
      <Provider>
        <Card elevation={2} onPress={() => loadOneBook(prop.book.id)}>
          <Image style={styles.bookImage} source={{ uri: prop.book.image }} />
          <Card.Content style={styles.bookDescr}>
            <Paragraph
              numberOfLines={3}
              style={{
                textAlign: "center",
              }}
            >
              {prop.book.title}
            </Paragraph>
            <Caption style={{ textAlign: "center" }}>
              <MaterialCommunityIcons name="account-circle" color="#7fb7f2" />{" "}
              {prop.book.author}
            </Caption>
            <Caption>
              <MaterialCommunityIcons name="book-open" color="#7fb7f2" />{" "}
              {prop.book.pages} pages
            </Caption>
          </Card.Content>
          <Divider style={{ marginTop: 10 }} />
          {prop.pathname === "library" && (
            <>
              <ProgressBar
                style={{
                  alignSelf: "center",
                  height: 7,
                  borderRadius: 5,
                  width: "95%",
                }}
                color={"royalblue"}
                progress={readProgress}
                visible={prop.book.pageRead > 1}
              ></ProgressBar>
              <View style={styles.libContainer}>
                <IconButton
                  color="#ff0000"
                  size={40}
                  style={{ margin: 0, height: 35 }}
                  icon="delete-circle"
                  onPress={() => setVisibleDialog(true)}
                />

                <Button
                  color="#7fb7f2"
                  mode="contained"
                  dark={true}
                  uppercase={false}
                  icon="book-open-page-variant"
                  onPress={() => readBook(prop.book)}
                >
                  {" "}
                  {prop.book.pageRead > 1
                    ? "Continue reading"
                    : "Start reading"}
                </Button>

                <Portal>
                  <Dialog
                    visible={visibleDialog}
                    onDismiss={() => setVisibleDialog(false)}
                  >
                    <Dialog.Title style={{ fontSize: 18 }}>
                      Delete this book?
                    </Dialog.Title>
                    <Dialog.Actions>
                      <Button
                        color={"#6592c1"}
                        onPress={() => setVisibleDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        color={"#6592c1"}
                        onPress={() => {
                          deleteBook(prop.book);
                          setVisibleDialog(false);
                        }}
                      >
                        Yes
                      </Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              </View>
            </>
          )}
          <Button
            color="#7fb7f2"
            style={{
              zIndex: 2,
              width: "40%",
              alignSelf: "center",
              marginTop: 0,
              margin: 5,
            }}
            onPress={() => loadOneBook(prop.book.id)}
            labelStyle={{ textTransform: "none", fontSize: 15 }}
          >
            See more <Icon name="chevron-circle-right" size={15} />{" "}
          </Button>
        </Card>

        <StatusBar style="auto" />
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: "100%",
  },
  bookImage: {
    width: "27%",
    height: 140,
    marginTop: 5,
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
  },
  bookDescr: {
    alignItems: "center",
    alignSelf: "flex-end",
    width: "73%",
    position: "absolute",
    maxHeight: 140,
  },
  book: {
    alignItems: "center",
    borderColor: "red",
    borderWidth: 2,
    alignContent: "center",
    textAlign: "center",
  },
  libContainer: {
    padding: "1%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
