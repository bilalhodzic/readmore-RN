// const axios = require("axios");
// const fs = require("fs");
// const Path = require("path");

export function getDLink(book) {
  //LINK-- id(rounded)/md5(lower)/Author - Title-Publisher (Year).extension
  //firstPArt--non encoded part
  var firstPart = `http://31.42.184.140/main/${
    Math.floor(book.id / 1000) * 1000
  }/${book.md5.toLowerCase()}/`;

  //encoded URI
  var secondPart = `${book.author} - ${book.title}-${book.publisher}(${book.year}).${book.extension}`;

  var finalLink = firstPart + encodeURIComponent(secondPart);
  return finalLink;
}
// async function downloadFile(url, fileName) {
//   const path = Path.join(__dirname, "/store/library/", fileName);
//   const writer = fs.createWriteStream(path);

//   return axios({
//     url: url,
//     method: "GET",
//     responseType: "stream",
//   }).then((res) => {
//     return new Promise((resolve, reject) => {
//       res.data.pipe(writer);
//       let error = null;
//       writer.on("error", (err) => {
//         error = err;
//         writer.close();
//         reject(err);
//       });
//       writer.on("close", () => {
//         if (!error) {
//           resolve(true);
//         }
//       });
//     });
//   });
// }

// exports.downloadFile = downloadFile;
// exports.getDLinks = getDLinks;
