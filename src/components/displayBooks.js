import { StatusBar } from "expo-status-bar";
import React from "react";
import { searchWithIndex } from "../../libgen-api/searchWithIndex";
import { StyleSheet, Image, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, Paragraph, Caption, Divider, Button } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DisplayOneBook from "./displayOneBook";

export default function DisplayBooks(prop) {
  //console.log("prop is: ", prop);

  //if pressed on see more --load one book in another page with all details
  const loadOneBook = (bookid) => {
    console.log(bookid);
    searchWithIndex(bookid)
      .then((response) => {
        prop.navigation.navigate("mainPage", { screen: "oneBook" });
        console.log(response);
      })
      .catch((err) => {
        return console.log(err);
      });
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
});
