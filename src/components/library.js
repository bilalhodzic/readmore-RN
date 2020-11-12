import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Button, FAB } from "react-native-paper";
import { insertValue, getAllValues, deleteValue } from "../../storage";
import * as SQLite from "expo-sqlite";
import DisplayBooks from "./displayBooks";

export default function Library({ navigation }) {
  const [libraryBooks, setLibraryBooks] = React.useState([]);

  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const db = SQLite.openDatabase("books");

    db.transaction((tx) => {
      let sql = "select * from books";
      tx.executeSql(sql, [], (_, { rows: { _array } }) => {
        // console.log("iz baze: ", _array);
        setLibraryBooks(_array);
      });
    });
  }, []);

  return (
    <>
      <ScrollView ref={scrollRef}>
        <View style={styles.container}>
          {libraryBooks &&
            libraryBooks.map((book, index) => (
              <DisplayBooks
                book={book}
                navigation={navigation}
                pathname={"library"}
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
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: "2%",
    //justifyContent: "center",
  },
  fab: {
    backgroundColor: "#ff0000",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
