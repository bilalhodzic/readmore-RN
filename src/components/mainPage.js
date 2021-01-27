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
  Dialog,
  Portal,
  Subheading,
  Provider,
  RadioButton,
} from "react-native-paper";
import { useDarkMode } from "react-native-dynamic";

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
  var defaultSortBy = "Title";
  var searchOptions;
  const [searchError, setSearchError] = React.useState(false);
  const [activityLoad, setActivityLoad] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(defaultQuerySearch);
  const [visibleDialog, setVisibleDialog] = React.useState(false);

  const [books, setBooks] = React.useState([]);
  const [totalBooks, setTotalBooks] = React.useState(1);
  const [errorMessage, setErrorMessage] = React.useState(defaultErrorMsg);
  const [errorSnackbar, setErrorSnackbar] = React.useState(false);
  const [noResults, setNoResults] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("ID");
  const [sortMode, setSortMode] = React.useState("ASC");
  const [searchPage, setSearchPage] = React.useState(1);

  const isDarkMode = useDarkMode();
  React.useEffect(() => {
    console.log(isDarkMode);
  }, [isDarkMode]);
  const scrollRef = React.useRef(null);

  //options to search within the libgen-api
  searchOptions = {
    query: searchQuery,
    page: searchPage,
    sort: sortBy, //order by id, title, author..
    sortMode: sortMode, //sort by asc or desc
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
      searchOptions.page,
      " Sort by: ",
      searchOptions.sort
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
          setSearchPage(1);

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
        setSearchPage(1);

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
            setSearchPage(searchOptions.page);
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
            setSearchPage(searchOptions.page);

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
      <Provider>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            backgroundColor: isDarkMode ? "#000000e6" : "white",
            flexGrow: 1,
            fontFamily: "arial",
            padding: "2%",
          }}
        >
          <SafeAreaView style={{ alignItems: "center" }}>
            <Image
              style={{ width: 100, height: 100 }}
              source={
                isDarkMode
                  ? require("../../assets/icon_dark.png")
                  : require("../../assets/icon.png")
              }
            />
            <Headline style={styles.heading}>
              Search millions of{"\n"} books online
            </Headline>
            <Searchbar
              placeholder="Search any book"
              value={searchQuery}
              style={{ margin: 15, marginBottom: 5 }}
              onIconPress={getBooks}
              onChangeText={(text) => {
                setNoResults(false);
                setSearchQuery(text);
              }}
            />

            <HelperText type="error" visible={searchError}>
              Search text has to be at least 4 characters!
            </HelperText>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Subheading
                onPress={() => {
                  setVisibleDialog(true);
                }}
                style={{
                  paddingBottom: 4,
                  paddingRight: 20,
                  paddingLeft: 20,
                  marginBottom: 6,
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  alignItems: "center",
                }}
              >
                Search options{"  "}
                <MaterialCommunityIcons
                  name="settings"
                  size={17}
                  color={"#7fb7f2"}
                />
              </Subheading>
            </View>

            <Portal>
              <Dialog
                visible={visibleDialog}
                onDismiss={() => setVisibleDialog(false)}
              >
                <Dialog.ScrollArea>
                  <ScrollView>
                    <Dialog.Title style={{ marginTop: 5, marginBottom: 0 }}>
                      Sort by:
                    </Dialog.Title>
                    <Dialog.Content>
                      <RadioButton.Item
                        label={"ID (default)"}
                        value="ID"
                        status={sortBy === "ID" ? "checked" : "unchecked"}
                        onPress={() => setSortBy("ID")}
                        color={"#7fb7f2"}
                        uncheckedColor={"lightgray"}
                      />
                      <RadioButton.Item
                        label={"Title"}
                        value="Title"
                        status={sortBy === "Title" ? "checked" : "unchecked"}
                        onPress={() => setSortBy("Title")}
                        color={"#7fb7f2"}
                        uncheckedColor={"lightgray"}
                      />
                      <RadioButton.Item
                        label={"Author"}
                        value="Author"
                        status={sortBy === "Author" ? "checked" : "unchecked"}
                        onPress={() => setSortBy("Author")}
                        color={"#7fb7f2"}
                        uncheckedColor={"lightgray"}
                      />
                      <RadioButton.Item
                        label={"Language"}
                        value="Language"
                        status={sortBy === "Language" ? "checked" : "unchecked"}
                        onPress={() => setSortBy("Language")}
                        color={"#7fb7f2"}
                        uncheckedColor={"lightgray"}
                      />
                      <RadioButton.Item
                        label={"Year"}
                        value="Year"
                        status={sortBy === "Year" ? "checked" : "unchecked"}
                        onPress={() => setSortBy("Year")}
                        color={"#7fb7f2"}
                        uncheckedColor={"lightgray"}
                      />
                      <RadioButton.Item
                        label={"Pages"}
                        value="Pages"
                        status={sortBy === "Pages" ? "checked" : "unchecked"}
                        onPress={() => setSortBy("Pages")}
                        color={"#7fb7f2"}
                        uncheckedColor={"lightgray"}
                      />
                    </Dialog.Content>
                    <Dialog.Title style={{ marginTop: 0, marginBottom: 0 }}>
                      Order by:
                    </Dialog.Title>
                    <Dialog.Content>
                      <RadioButton.Item
                        label={"ASC (default)"}
                        value="ASC"
                        status={sortMode === "ASC" ? "checked" : "unchecked"}
                        onPress={() => setSortMode("ASC")}
                        color={"#7fb7f2"}
                        uncheckedColor={"lightgray"}
                      />
                      <RadioButton.Item
                        label={"DESC"}
                        value="DESC"
                        status={sortMode === "DESC" ? "checked" : "unchecked"}
                        onPress={() => setSortMode("DESC")}
                        color={"#7fb7f2"}
                        uncheckedColor={"lightgray"}
                      />
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button
                        color={"#006fe6b8"}
                        onPress={() => {
                          setSortBy("ID");
                          setSortMode("ASC");
                          setVisibleDialog(false);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        color={"#006fe6b8"}
                        onPress={() => {
                          setVisibleDialog(false);
                          getBooks();
                        }}
                      >
                        Search
                      </Button>
                    </Dialog.Actions>
                  </ScrollView>
                </Dialog.ScrollArea>
              </Dialog>
            </Portal>
            <Button
              mode="contained"
              color="#006fe6b8"
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
      </Provider>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    //backgroundColor: isDarkMode ? "black" : "white",
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
