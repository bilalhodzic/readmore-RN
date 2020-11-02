import React from "react";
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import { searchBooks } from "../../libgen-api/search";
import DisplayBooks from "./displayBooks";
import {
  Headline,
  HelperText,
  DefaultTheme,
  ActivityIndicator,
  Searchbar,
  Button,
  FAB,
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
  const [searchQuery, setSearchQuery] = React.useState("search");
  const [searchError, setSearchError] = React.useState(false);
  const [activityLoad, setActivityLoad] = React.useState(false);
  const [books, setBooks] = React.useState([]);
  const [totalBooks, setTotalBooks] = React.useState(1);

  const scrollRef = React.useRef(null);

  const getBooks = () => {
    if (searchQuery.length < 4) {
      setSearchError(true);
      return;
    }
    console.log("searchQuery is: ", searchQuery);

    //if the error is displayed--hide it
    setSearchError(false);

    //dispplay loading indicator--until it loads the data
    setActivityLoad(true);

    //options to search within the libgen-api
    let options = {
      query: searchQuery,
      page: 1,
      //sort:def, //order by id, title, author..
      //sortMode: ASC  //sort by asc or desc
      //resNumber:25 //Numberr of result per page (default 25)
    };

    searchBooks(options)
      .then((data) => {
        //stop loading indicator and set books to state
        setActivityLoad(false);
        setBooks(data.slice(1));
        setTotalBooks(data[0].numberOfFiles);

        //console.log('Total books: ',totalBooks)

        //console.log(data)
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const backToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
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
                <DisplayBooks book={book} navigation={navigation} key={index} />
              ))}
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
