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

async function downloadFile(downloadURL, fileurl) {
  const callback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    this.setState({
      downloadProgress: progress,
    });
  };
  const downloadResumable = FileSystem.createDownloadResumable(
    downloadURL,
    fileurl,

    {},
    callback
  );

  try {
    const { uri } = await downloadResumable.downloadAsync();
    console.log("Finished downloading to ", uri);
    return uri;
  } catch (e) {
    console.error(e);
  }
  try {
    await downloadResumable.pauseAsync();
    console.log("Paused download operation, saving for future retrieval");
    AsyncStorage.setItem(
      "pausedDownload",
      JSON.stringify(downloadResumable.savable())
    );
  } catch (e) {
    console.error(e);
  }
  try {
    const { uri } = await downloadResumable.resumeAsync();
    console.log("Finished downloading to ", uri);
    return uri;
  } catch (e) {
    console.error(e);
  }
}

// exports.downloadFile = downloadFile;
// exports.getDLinks = getDLinks;
