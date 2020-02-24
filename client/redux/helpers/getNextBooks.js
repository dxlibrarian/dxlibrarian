export function getNextBooks(books, bookId, updater, upsert) {
  const nextBooks = books.concat([]);
  const countBooks = books.length;

  for (let bookIndex = 0; bookIndex < countBooks; bookIndex++) {
    const book = nextBooks[bookIndex];
    if (book.bookId === bookId) {
      nextBooks[bookIndex] = updater(book);
      return nextBooks;
    }
  }

  if (upsert) {
    return nextBooks.concat(updater());
  } else {
    return nextBooks;
  }
}
