import mongoose from 'mongoose'

// interface
export interface IYoutube {
    date: number,
    expireDate: number,
    id: string,
    title: string,
    url: string,
}

// mongo schema
const YoutubeSchema = new mongoose.Schema ({
    'date': Number,
    'expireDate': Number,
    'id': String,
    'title': String,
    'url': String,
})

export default mongoose.model ('Youtube', YoutubeSchema)
