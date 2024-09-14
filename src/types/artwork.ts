export default interface Artwork {
  id: number
  title: string
  type: string
  url: string
  date: string | null
  artist: string | null
  origin: string | null
  medium: string | null
  preview: string
  images: string[]
}