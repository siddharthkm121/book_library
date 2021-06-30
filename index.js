require("dotenv").config();

const express = require("express");
const mongoose=require("mongoose");


// Database
const database = require("./database");

//Models
const BookModels = require("./database/index");
const AuthorModels = require("./database/author");
const PublicationModel = require("./database/publication");

// Initialization
const booky = express();

//configuration
booky.use(express.json());


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then (() => console.log("connection established"));

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
Route           /is
Description     Get specific books based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /c
Description     Get specific books based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/
booky.get("/c/:category", (req, res) => {
  const getSpecificBook = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ book: getSpecificBook });
});
/*
Route           /l
Description     Get specific books based on language
Access          PUBLIC
Parameter       language
Methods         GET
*/
booky.get("/l/:language",(req,res)=>{
  const getSpecificBook = database.books.filter((book)=>
  book.language===req.params.language);
 if(getSpecificBook.length===0) {
   return res.json({
     error:`No language found for the category of ${req.params.language}`,
   });
 }
 return res.json({book:getSpecificBook});
});

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/author", (req, res) => {
  return res.json({ authors: database.author });
});

/*
Route           /author/book/name
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/author/book/:id", (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.ISBN === req.params.isbn
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificAuthor });
});

/*
Route           /author/book
Description     get all authors based on books
Access          PUBLIC
Parameter       id
Methods         GET
*/
booky.get("/author/book/:id", (req, res) => {
  const getSpecificAuthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No Author found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthor });
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/publications", (req, res) => {
  return res.json({ publications: database.publication });
});

/*
Route           /publications/book/name
Description     get all publications
Access          PUBLIC
Parameter       id
Methods         GET
*/
booky.get("/publications/book/:id", (req, res) => {
  const getSpecificPublications = database.publications.filter(
    (publications) => publications.ISBN === req.params.isbn
  );

  if (getSpecificPublications.length === 0) {
    return res.json({
      error: `No publications found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificPublications });
});

/*
Route           /publications/book
Description     get all authors based on books
Access          PUBLIC
Parameter       id
Methods         GET
*/
booky.get("/publications/book/:id", (req, res) => {
  const getSpecificPublications = database.publications.filter((publications) =>
    publications.books.includes(req.params.isbn)
  );

  if (getSpecificPublications.length === 0) {
    return res.json({
      error: `No Publications found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificPublications });
});

/*
Route           /book/add
Description     add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/book/add", (req, res) => {
  const { newBook } = req.body;
  database.books.push(newBook);
  return res.json({ books: database.books });
});

/*
Route           /author/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/author/add", (req, res) => {
  const { newAuthor } = req.body;
  database.author.push(newAuthor);
  return res.json({ authors: database.author });
});

/*
Route           /publication/add
Description     add new publication 
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/publication/add", (req, res) => {
  const { newPublication } = req.body;
  database.publication.push(newPublication);
  return res.json({ publication: database.publication });
});

/*
Route           /book/update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.newBookTitle;
      return;
    }
  });

  return res.json({ books: database.books });
});

/*
Route           /book/update/author
Description     update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
  // update book database

  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.author.push(parseInt(req.params.authorId));
    }
  });

  // update author database

  database.author.forEach((author) => {
    if (author.id === parseInt(req.params.authorId))
      return author.books.push(req.params.isbn);
  });

  return res.json({ books: database.books, author: database.author });
});

/*
Route           /book/update/author/id
Description     Update author id
Access          PUBLIC
Parameter       id
Methods         PUT
*/
booky.put("/book/update/author/:id", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.author = req.body.newBookAuthor;
      return;
    }
  });
  return res.json({ books: database.books });
});

/*
Route           /book/update/publication/id
Description     Update publication name
Access          PUBLIC
Parameter       id
Methods         PUT
*/
booky.put("/book/update/publication/isbn/:name", (req, res) => {
  database.books.forEach((book) => {
    if (book.id === req.params.id) {
      book.publication = req.body.newBookPublication;
      return;
    }
  });
  return res.json({ books: database.books });
});

/*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
booky.put("/publication/update/book/:isbn", (req, res) => {
  // update the publication database
  database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "Successfully updated publication",
  });
})
/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
booky.delete("/book/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.books = updatedBookDatabase;
  return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.authors = newAuthorList;
      return;
    }
  });

  // update the author database
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );

      author.books = newBooksList;
      return;
    }
  });

  return res.json({
    message: "author was deleted!!!!!!😪",
    book: database.books,
    author: database.authors,
  });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
booky.delete("/book/delete/:id", (req, res) => {
  const updatedAuthorDatabase = database.author.filter(
    (author) => author.id !== req.params.id
  );

  database.author = updatedAuthorDatabase;
  return res.json({ author: database.author });
});

/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  // update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
  });
});

/*
Route           /publications/delete
Description     delete publication
Access          PUBLIC
Parameters      id
Method          DELETE
*/
booky.delete("/book/delete/:id", (req, res) => {
  const updatedPubicationDatabase = database.publication.filter(
    (publication) => publication.id !== req.params.id
  );

  database.publication = updatedPublicationDatabase;
  return res.json({ publication: database.publication });
});

booky.listen(3000, () => console.log("HEy server is running! 😎"));

//talk to mongodb 