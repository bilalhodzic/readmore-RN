import React from "react";
import { StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import { Button, FAB } from "react-native-paper";
import { insertValue, getAllValues, deleteValue } from "../../storage";
import * as SQLite from "expo-sqlite";
import DisplayBooks from "./displayBooks";

export default function Library({ navigation }) {
  const [libraryBooks, setLibraryBooks] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  //pull down to refresh library
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    (async function () {
      try {
        let books = await getAllValues();
        setLibraryBooks(books);
        setRefreshing(false);
      } catch (error) {
        console.log(error);
      }
    })();
  });

  const scrollRef = React.useRef(null);

  //On loading the component get all the books from database
  React.useEffect(() => {
    (async function () {
      try {
        let books = await getAllValues();
        setLibraryBooks(books);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ alignItems: "center" }}>
          {libraryBooks &&
            libraryBooks.map((book, index) => (
              <DisplayBooks
                book={book}
                navigation={navigation}
                pathname={"library"}
                refreshLibrary={onRefresh}
                key={index}
              />
            ))}
        </View>
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="chevron-double-up"
        small
        animated={true}
        onPress={() => {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
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
  },
  fab: {
    backgroundColor: "#ff0000",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
