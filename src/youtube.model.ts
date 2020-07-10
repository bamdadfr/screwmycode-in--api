import mongoose from 'mongoose'

const YoutubeSchema = new mongoose.Schema ({
    'date': Number,
    'expireDate': Number,
    'id': String,
    'title': String,
    'url': String,
})

export default mongoose.model ('Youtube', YoutubeSchema)
