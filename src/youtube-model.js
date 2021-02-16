const mongoose = require ('mongoose')

/**
 * mongo schema for youtube service
 * @type {module:mongoose.Schema<Document, Model<Document>, undefined>}
 */
const YoutubeSchema = new mongoose.Schema ({
    'date': Number,
    'expireDate': Number,
    'id': String,
    'title': String,
    'url': String,
})

const YoutubeModel = mongoose.model ('Youtube', YoutubeSchema)

module.exports.YoutubeModel = YoutubeModel