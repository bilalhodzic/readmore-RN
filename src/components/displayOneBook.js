import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Image, View, ScrollView } from "react-native";
import {
  Button,
  Title,
  Card,
  Paragraph,
  Text,
  Subheading,
  FAB,
  Caption,
} from "react-native-paper";
import HTML from "react-native-render-html";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function DisplayOneBook({ route, navigation }) {
  const [showDescription, setShowDescription] = React.useState(false);
  const { oneBook } = route.params;
  //console.log(oneBook);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Title style={styles.text}>{oneBook.title}</Title>
        <Subheading style={styles.text}>
          <MaterialCommunityIcons name="account" size={15} color="#7fb7f2" />
          {"  "}
          {oneBook.author}
        </Subheading>
        <View style={styles.book}>
          <Image style={styles.bookImage} source={{ uri: oneBook.image }} />
          <View style={styles.bookDescr}>
            <Subheading>
              <MaterialCommunityIcons name="file" size={15} color="#7fb7f2" />
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
          icon="chevron-down"
          label="Show description"
          color="white"
          uppercase={false}
          onPress={() => setShowDescription(!showDescription)}
        />
        {showDescription && (
          <Card elevation={3} style={{ margin: 10, display: "flex" }}>
            <Card.Content>
              <HTML html={oneBook.descr} />
            </Card.Content>
          </Card>
        )}
        <Button
          onPress={() => {
            navigation.navigate("mainPage", { screen: "search" });
          }}
        >
          Go back
        </Button>

        <StatusBar style="auto" />
      </View>
    </ScrollView>
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
});
