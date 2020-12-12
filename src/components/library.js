import React from "react";
import { StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import { FAB } from "react-native-paper";
import { getAllValues } from "../../storage";
import DisplayBooks from "./displayBooks";

export default function Library({ navigation }) {
  const [libraryBooks, setLibraryBooks] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshed, setRefreshed] = React.useState(false);
  const scrollRef = React.useRef(null);

  //pull down to refresh library
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshed(true);
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

  //when the library component is focused(active)
  // refresh it but only once-- to update new values from database
  const listen = navigation.addListener("focus", () => {
    if (refreshed === false) {
      onRefresh();
    }
  });

  //On loading the component get all the books from database
  React.useEffect(() => {
    onRefresh();
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
