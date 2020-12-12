import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("books");

function checkTable() {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE if not exists books (	id integer PRIMARY KEY,	title text NOT NULL,	author varchar(30) NOT NULL,	image text ,    file text NOT NULL,  pages int default 0,  pageRead int default 1, extension text )"
    );
  });
}
checkTable();

export async function insertValue(book) {
  let sql = `insert into books(id,title,author,image,file,pages, extension) values (?, ?, ?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [
          book.id,
          book.title,
          book.author,
          book.image,
          book.file, //book.download,
          book.pages,
          book.extension,
        ],
        (_) => {
          console.log("Added one book");
          resolve(true);
        },
        (err) => {
          console.log("Error occured");
          reject(err);
        }
      );
    });
  });
}
export async function getAllValues() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      let sql = "select * from books";
      tx.executeSql(
        sql,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (err) => {
          if (err) reject(err);
        }
      );
    });
  });
}
export async function getValueById(id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      let sql = "select * from books where id = ?";
      tx.executeSql(
        sql,
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array[0]);
        },
        (err) => {
          if (err) reject(err);
        }
      );
    });
  });
}

export async function deleteValue(id) {
  let sql = "delete from books where id = ?";

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [id],
        (_) => {
          console.log("book deleted");
          resolve(true);
        },
        (err) => {
          console.log("error ocured");
          reject(err);
        }
      );
    });
  });
}
export async function updateBookPage(id, page) {
  let sql = "update books set pageRead = (?) where id = (?)";
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [page, id],
        (_) => {
          console.log("book page updated to: ", page);
          resolve(true);
        },
        (err) => {
          console.log("error ocured");
          reject(err);
        }
      );
    });
  });
}
