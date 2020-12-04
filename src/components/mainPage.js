import React from "react";
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  View,
  Image,
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

export default function MainPage({ navigation }) {
  var defaultErrorMsg = "No Error";
  var defaultQuerySearch = "";

  const [searchError, setSearchError] = React.useState(false);
  const [activityLoad, setActivityLoad] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(defaultQuerySearch);
  const [books, setBooks] = React.useState([]);
  const [totalBooks, setTotalBooks] = React.useState(1);
  const [errorMessage, setErrorMessage] = React.useState(defaultErrorMsg);
  const [errorSnackbar, setErrorSnackbar] = React.useState(false);
  const [noResults, setNoResults] = React.useState(false);

  const scrollRef = React.useRef(null);

  //options to search within the libgen-api
  var searchOptions = {
    query: searchQuery,
    page: 1,
    sort: "def", //order by id, title, author..
    sortMode: "ASC", //sort by asc or desc
    resNumber: 25, //Numberr of result per page (default 25)
  };

  const getBooks = () => {
    if (searchQuery.length < 4) {
      setSearchError(true);
      return;
    }

    console.log(
      "search Query is: ",
      searchQuery,
      " Page: ",
      searchOptions.page
    );

    //set default message to default on new search
    setErrorMessage(defaultErrorMsg);

    //if the error is displayed--hide it
    setSearchError(false);

    //dispplay loading indicator--until it loads the data
    setActivityLoad(true);

    searchBooks(searchOptions)
      .then((data) => {
        //stop loading indicator and set books to state
        setActivityLoad(false);

        //for now only pdf books are supported
        let bookstoDisplay = [];
        data.forEach((book) => {
          if (book.extension === "pdf") {
            bookstoDisplay.push(book);
          }
        });

        //if there is no results exit function
        if (data[0].numberOfFiles == 0 || bookstoDisplay.length === 0) {
          setBooks([]);
          setNoResults(true);
          searchOptions.page = 1;

          return;
        }
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
        searchOptions.page = 1;

        return console.log("Error: ", err.message);
      });
  };

  const backToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
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
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../assets/icon.png")}
            />
            <Headline style={styles.heading}>
              Search millions of{"\n"} books online
            </Headline>
            <Searchbar
              placeholder="Search any book"
              value={searchQuery}
              style={{ margin: 15, marginBottom: 5 }}
              onIconPress={getBooks}
              onChangeText={(text) => setSearchQuery(text)}
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
              {`0 results found for "${searchQuery}" for page ${searchOptions.page} `}
            </HelperText>
            {books.length > 0 && errorMessage === defaultErrorMsg ? (
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
    //marginTop: "30%",
  },
  fab: {
    backgroundColor: "#ff1919CC",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
