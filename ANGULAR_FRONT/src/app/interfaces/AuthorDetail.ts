import { Book } from "./Book"

export interface AuthorDetail {
    id?: number
    author_name: string
    biography: string
    author_photo?: string
    books: Book[]
}