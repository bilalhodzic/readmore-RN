const axios = require("react-native-axios");

export const searchWithIndex = async (id) => {
  //check if the ids are passed to function
  if (id === null || id === undefined) {
    throw new Error("No id available");
  }

  //you can change the url to retrieve whatever you want
  const Url = `http://gen.lib.rus.ec/json.php?ids=${id}&fields=Author,Title,Pages,Publisher, Year,Extension, Filesize,MD5,Coverurl,descr`;

  const response = await axios.get(Url);

  if (response === null || response === undefined) {
    throw new Error("Couldn't get the response! Try again");
  }
  //data is an array
  //first element is always a book
  let book = response.data[0];

  //pass the id from parameter
  book.id = id;

  //link to image and file to download the book
  book.image = `http://gen.lib.rus.ec/covers/${book.coverurl}`;
  book.download = `http://library.lol/main/${book.md5}`;

  //displaying filesize in MB and KB
  if (book.filesize % 1048576 > 0) {
    book.filesize = (book.filesize / 1048576).toFixed(2) + "MB";
  } else if (book.filesize % 1024 > 0) {
    book.filesize = (book.filesize / 1024).toFixed(2) + "KB";
  } else {
    book.filesize = book.filesize.toFixed(2) + "Bytes";
  }
  return book;
};

