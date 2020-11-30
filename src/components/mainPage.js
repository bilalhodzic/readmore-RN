import React from "react";
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  View,
  FlatList,
} from "react-native";
import { searchBooks } from "../../libgen-api/search";
import DisplayBooks from "./displayBooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Headline,
  HelperText,
  DefaultTheme,
  ActivityIndicator,
  Searchbar,
  Button,
  FAB,
  Snackbar,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0063cc",
    background: "#0063cc",
  },
};

//if tapped anywhere outside keyboard, hide it
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

//options to search within the libgen-api

var searchOptions = {
  query: "search",
  page: 1,
  //sort:def, //order by id, title, author..
  //sortMode: ASC  //sort by asc or desc
  //resNumber:25 //Numberr of result per page (default 25)
};

export default function MainPage({ navigation }) {
  const [searchError, setSearchError] = React.useState(false);
  const [activityLoad, setActivityLoad] = React.useState(false);
  const [books, setBooks] = React.useState([]);
  const [totalBooks, setTotalBooks] = React.useState(1);
  const [isListEnd, setIsListEnd] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("no error");
  const [errorSnackbar, setErrorSnackbar] = React.useState(false);
  const [noResults, setNoResults] = React.useState(false);

  const scrollRef = React.useRef(null);

  const getBooks = () => {
    if (searchOptions.query.length < 4) {
      setSearchError(true);
      return;
    }

    console.log(
      "search Query is: ",
      searchOptions.query,
      " Page: ",
      searchOptions.page
    );

    //if the error is displayed--hide it
    setSearchError(false);

    //dispplay loading indicator--until it loads the data
    setActivityLoad(true);

    searchBooks(searchOptions)
      .then((data) => {
        //stop loading indicator and set books to state
        setActivityLoad(false);

        //if there is no results exit function
        if (data[0].numberOfFiles == 0) {
          setBooks([]);
          setNoResults(true);

          return;
        }

        //for now only pdf books are supported
        let bookstoDisplay = [];
        data.forEach((book) => {
          if (book.extension === "pdf") {
            bookstoDisplay.push(book);
          }
        });

        //at the first index is number of total books
        setTotalBooks(data[0].numberOfFiles);
        setNoResults(false);

        setBooks(bookstoDisplay);
        backToTop();
      })
      .catch((err) => {
        setActivityLoad(false);
        setErrorMessage(err.message);
        setErrorSnackbar(true);

        return console.log("Error: ", err.message);
      });
  };

  const backToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const renderListFooter = () => {
    return (
      <View style={{ padding: 10 }}>
        {activityLoad ? (
          <ActivityIndicator color="black" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  const itemView = ({ item }) => {
    return (
      <DisplayBooks
        book={item}
        navigation={navigation}
        pathname={"mainPage"}
        //key={index}
      />
    );
  };

  const NavFooter = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          mode="contained"
          color="#7fb7f2"
          icon="page-previous-outline"
          disabled={searchOptions.page === 1}
          contentStyle={{ height: 40 }}
          uppercase={false}
          dark={true}
          style={{ borderRadius: 20, margin: 15 }}
          onPress={() => {
            searchOptions.page -= 1;
            getBooks();
          }}
        >
          Prev
        </Button>
        <Button
          mode="contained"
          color="#7fb7f2"
          contentStyle={{ height: 40 }}
          uppercase={false}
          dark={true}
          style={{ borderRadius: 20, margin: 15 }}
          onPress={() => {
            searchOptions.page += 1;
            getBooks();
          }}
        >
          Next <MaterialCommunityIcons name="page-next-outline" size={14} />
        </Button>
      </View>
    );
  };

  return (
    <DismissKeyboard>
      <>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
          <SafeAreaView style={{ alignItems: "center" }}>
            <Headline style={styles.heading}>
              Search millions of{"\n"} books online
            </Headline>
            <Searchbar
              placeholder="Search any book"
              //value={searchOptions.query}
              style={{ margin: 15, marginBottom: 5 }}
              onIconPress={getBooks}
              onChangeText={(text) => (
                (searchOptions.page = 1), (searchOptions.query = text)
              )}
            />

            <HelperText type="error" visible={searchError}>
              Search text has to be at least 4 characters!
            </HelperText>

            <Button
              mode="contained"
              color="#006fe6"
              icon="book-search"
              contentStyle={{ height: 40 }}
              labelStyle={{
                textTransform: "none",
                fontSize: 16,
                fontWeight: "500",
              }}
              style={{ borderRadius: 20, margin: 10, marginBottom: 25 }}
              onPress={() => {
                getBooks();
                Keyboard.dismiss();
              }}
            >
              Search books
            </Button>
            {/* <SafeAreaView style={{ flex: 1 }}>
              <FlatList
                data={books}
                keyExtractor={(item, index) => index.toString()}
                renderItem={itemView}
                ListFooterComponent={renderListFooter}
                onEndReached={getBooks}
                //onEndReachedThreshold={0.5}
              />
            </SafeAreaView> */}

            {books &&
              books.map((book, index) => (
                <DisplayBooks
                  book={book}
                  navigation={navigation}
                  pathname={"mainPage"}
                  key={index}
                />
              ))}
            <HelperText
              type="error"
              style={{
                fontSize: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: "lightgray",
              }}
              visible={noResults}
            >
              {`0 results found for "${searchOptions.query}"`}
            </HelperText>
            {books.length > 0 && errorMessage === "no error" ? (
              <NavFooter />
            ) : (
              <View style={{ height: 35, width: "100%" }}>
                <Snackbar
                  visible={errorSnackbar}
                  onDismiss={() => setErrorSnackbar(false)}
                  duration={7000}
                  style={{
                    backgroundColor: "gray",
                  }}
                >
                  {errorMessage}
                </Snackbar>
              </View>
            )}
          </SafeAreaView>
        </ScrollView>
        <ActivityIndicator
          animating={activityLoad}
          size="large"
          style={{
            top: "70%",
            left: "45%",
            position: "absolute",
            zIndex: 3,
          }}
          color="#ff0000"
        />
        {books.length > 1 && (
          <FAB
            style={styles.fab}
            icon="chevron-double-up"
            small
            animated={true}
            onPress={backToTop}
          />
        )}
      </>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    fontFamily: "arial",
    padding: "2%",
  },
  heading: {
    textAlign: "center",
    letterSpacing: 1,
    fontSize: 25,
    marginTop: "30%",
  },
  fab: {
    backgroundColor: "#ff0000",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
