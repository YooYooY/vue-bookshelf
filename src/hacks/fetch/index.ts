import books from "@/hacks/data/books";

const mockBooks = books;
const wait = (ms: number) => new Promise(r=>setTimeout(r,ms));

export const getBooks = async () => {
    await wait(1000);
    return mockBooks
}