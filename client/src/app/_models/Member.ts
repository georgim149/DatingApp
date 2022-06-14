import { Photo } from "./Photo"

export interface Member {
    id: number
    userName: string
    photoURL: string
    age: number
    knownAs: string
    created: Date
    lastActive: Date
    gender: string
    introduction: string
    lookingFor: string
    city: string
    country: string
    photos: Photo[]
  }
  
