import { Photo } from "./Photo"

export interface Member {
    id: number
    username: string
    photoURL: string
    age: number
    knownAs: string
    created: Date
    lastActive: Date
    gender: string
    introduction: string
    lookingFor: string
    interests: string
    city: string
    country: string
    photos: Photo[]
  }
  
