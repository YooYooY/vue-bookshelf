import books from "@/hacks/data/books";

export type Book = typeof books[number];
export type Books = Book[];