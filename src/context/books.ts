import { Books, Book } from '@/types'
import { Ref, ref } from '@vue/reactivity'
import { computed, inject, provide } from '@vue/runtime-core'

type BookContext = {
  books: Ref<Books>
  setBooks: (value: Books) => void
  finishedBooks: Ref<Books>
  addFinishedBooks: (book: Book) => void
  removeFinishedBooks: (book: Book) => void
  hasReadedBook: (book: Book) => boolean
  booksAvaluable: Ref<Books>
}

const BookSymbol = Symbol()

export const useBookListProvide = () => {
  // 全部图书
  let books = ref<Books>([])
  const setBooks = (value: Books) => {
    books.value = value;
  }

  // 已阅图书
  const finishedBooks = ref<Books>([])
  const addFinishedBooks = (book: Book) => {
      finishedBooks.value.push(book)
  }
  
  // 删除已阅图书
  const removeFinishedBooks = (book: Book) => {
    finishedBooks.value = finishedBooks.value.filter(({ id }) => id !== book.id)
  }

  // 可选图书
  const booksAvaluable = computed(() => {
    return books.value.filter(
      (book) => !finishedBooks.value.find(({ id }) => id === book.id)
    )
  })

  // 是否已阅
  const hasReadedBook = (book: Book) => finishedBooks.value.includes(book)

  provide(BookSymbol, {
    books,
    setBooks,
    finishedBooks,
    addFinishedBooks,
    removeFinishedBooks,
    booksAvaluable,
    hasReadedBook,
  })
}

export const useBookListInject = () => {
  const booksContext = inject<BookContext>(BookSymbol)

  if (!booksContext) {
    throw new Error('useBookListInject must be used affer useBookListProvide')
  }

  return booksContext
}
