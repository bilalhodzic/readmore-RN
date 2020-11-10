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

export function insertValue(book) {
  let sql = `insert into books(id,title,author,image,file,pages, extension) values (?, ?, ?, ?, ?, ?, ?)`;
  db.transaction(
    (tx) => {
      tx.executeSql(sql, [
        book.id,
        book.title,
        book.author,
        book.image,
        book.download,
        //book.file,
        book.pages,
        book.extension,
      ]);
    },
    (err) => {
      if (err) {
        return console.error(err.message);
      }
    },
    (result) => {
      console.log("radi ", result);
    }
  );
}
export function getAllValues() {
  db.transaction((tx) => {
    let sql = "select * from books";
    tx.executeSql(sql, (res) => {
      console.log(res);
    });
  });
}
getAllValues();
