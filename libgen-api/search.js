const cheerio = require("react-native-cheerio");
const axios = require("react-native-axios");

export const searchBooks = async (options) => {
  //return error if the search is bad
  if (!options.query || options.query.length < 3) {
    throw new Error("Search query is bad. Try again.");
  }

  //default number page is 1
  const page = options.page || 1;

  //Order by: ID, Title, Publisher, Year, Pages, Language, Size, Extension
  const sort = options.sort || "def";

  //ASC or DESC
  const sortMode = options.sortMode || "ASC";

  //number of results per one page--default to 25
  const resNumber = options.resNumber || 25;

  //if the query is more than one word join them and make it as one word
  const finalquery = encodeURIComponent(options.query);

  //finalURL to scrape the data
  const siteURL = `http://gen.lib.rus.ec/search.php?req=${finalquery}&open=0&res=${resNumber}&view=detailed&phrase=1&column=def&sort=${sort}&sortmode=${sortMode}&page=${page}`;

  //using axios to get data from website
  const response = await axios.get(siteURL);

  if (response === null || response === undefined) {
    throw new Error("Couldn't get the response! Try again");
  }

  //gives the Jquery functionality on node.js
  const $ = cheerio.load(response.data, {
    normalizeWhitespace: true,
    xmlMode: true,
  });

  //if there is no books in the given URL (reached the end of the search)
  if ($('font:contains("Pages")').length === 1 && page > 1) {
    throw new Error("No next page available");
  }

  //search tagName 'font'-- index [2] is always  number of files
  let filesFound = $("font")[2].children[0].data;
  let numberFilesFound = filesFound.split(" ")[0];

  var books = [];

  let loopLength = numberFilesFound < resNumber ? numberFilesFound : resNumber;

  //first item will be total number of files
  books.push({ numberOfFiles: numberFilesFound });
  var authorIndex = 0;

  for (var i = 0; i < loopLength; i++) {
    //sometimes there is no page number
    let getPage = $("font:contains('Pages')")[i + 1].parent.next.next
      .children[0];

    //only td with attr colspan=2 has the title data
    let getTitle = $("td[colspan='2']")[i].children[0].children[0].children[0];

    books.push({
      image: `http://gen.lib.rus.ec${$("img")[i].attribs.src}`,

      //In some cases there is no title, we need to check and handle that
      title: getTitle !== undefined ? getTitle.data : "No title",
      id: $("font:contains('ID')")[i + 1].parent.next.next.children[0].data,

      //need to check if there is number of pages
      pages: getPage !== undefined ? getPage.data : 0,
      extension: $("font:contains('Extension')")[i + 1].parent.next.next
        .children[0].data,
    });

    //on some books there are more than one authors
    let getAuthor = $("td[colspan='3'] b a")[authorIndex];

    //always increment author index after calling getAuthor
    authorIndex += 1;

    //on some books there is no author--we need to check that
    if (getAuthor.children[0] === undefined) {
      books[i + 1].author = "undefined";
    } else {
      books[i + 1].author = getAuthor.children[0].data;

      //Check if there is more authors
      if (getAuthor.next !== null) {
        //call another time because index has changed
        getAuthor = $("td[colspan='3'] b a")[authorIndex];
        authorIndex += 1;

        //while loop to check all the author from the book
        do {
          //first add another author
          books[i + 1].author += ", " + getAuthor.children[0].data;

          //then check if there is another one
          if (getAuthor.next === null) break;
          else {
            getAuthor = $("td[colspan='3'] b a")[authorIndex];
            authorIndex += 1;
          }
        } while (getAuthor.next !== null);
      }
    }
  }

  //return array of books
  return books;
};

//options example
var options = {
  query: "example",

  //default 1
  page: 2,

  //Order by: ID, Title, Publisher, Year, Pages, Language, Size, Extension
  sort: "def",

  //ASC(default) or DESC
  sortMode: "ASC",

  //number of results per one page--default to 25
  resNumber: 25,
};
//searchBooks(options);
