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
} from "react-native-paper";
import { deleteValue } from "../../storage";
import * as FileSystem from "expo-file-system";

export default function DisplayBooks(prop) {
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
        console.log("oneBook is ready to display");
      })
      .catch((err) => {
        return console.log(err);
      });
  };
  const readBook = () => {
    console.log("read book...");
  };

  const deleteBook = (book) => {
    console.log("book deleting", book.id);

    (async function () {
      try {
        FileSystem.deleteAsync(book.file);
        let deletedBook = await deleteValue(book.id);
        if (deletedBook === true) {
          prop.refreshLibrary();
        }
      } catch (error) {
        return console.log(error);
      }
    })();
    //deleteValue(id);
  };

  return (
    <View style={styles.container}>
      <Card elevation={2}>
        <Image style={styles.bookImage} source={{ uri: prop.book.image }} />
        <Card.Content style={styles.bookDescr}>
          <Paragraph style={{ textAlign: "center" }}>
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
              progress={0.3}
              visible={prop.book.pageRead > 1}
            ></ProgressBar>
            <View style={styles.libContainer}>
              <Button
                color="#ff0000"
                mode="contained"
                dark={true}
                uppercase={false}
                icon="delete-circle"
                onPress={() => deleteBook(prop.book)}
              >
                Delete book
              </Button>
              <Button
                color="#7fb7f2"
                mode="contained"
                dark={true}
                uppercase={false}
                icon="book-open-page-variant"
                onPress={readBook}
              >
                {" "}
                {prop.book.pageRead > 1 ? "Continue reading" : "Start reading"}
              </Button>
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
