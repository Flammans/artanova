import Artwork from './artwork.ts'

export default interface Collection {
  uuid: string
  title: string
  userId: number
  elements: Element[]
}

export interface Element {
  id: number
  artwork: Artwork
}