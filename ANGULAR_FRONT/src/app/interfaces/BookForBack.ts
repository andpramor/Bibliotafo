export interface BookForBack {
    id?: number
    title: string
    ISBN: number
    publication_date: string
    synopsis: string
    cover?: string
    stock: number
    price: number
    style: string
    publisher?: number
    publishername?: string
    authors?: number[]
    authornames?: any[]
    genres?: number[]
    genrenames?: any[]
    themes?: number[]
    themenames?: any[]
}