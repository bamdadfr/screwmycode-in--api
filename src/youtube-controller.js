const { YoutubeQueryCreate, YoutubeQueryRead } = require ('./youtube-queries')
const { isValidID, getExpireDate, getYoutubeInfo } = require ('./youtube-utils')
const { YoutubeConstantsErrorBadID } = require ('./youtube-constants')

/**
 * mongo controller for youtube service
 * @param id {string} - youtube id
 * @returns {Promise<{success: boolean, title: string, isDash: boolean, url: unknown}|{success: boolean, title: string, isDash: boolean, url: string}|{success: boolean, error: *}|{success: boolean, error: string}|{success: null, title: null, url: null}>}
 * @constructor
 */
const YoutubeController = async (id) => {

    if (!isValidID (id)) return YoutubeConstantsErrorBadID

    // format of the response to send through the API
    const responseToSend = {
        'success': null,
        'title': null,
        'url': null,
    }

    const responseInDatabase = await YoutubeQueryRead (id)

    if (responseInDatabase.success) {

        // if exists in database
        responseToSend.success = true

        responseToSend.title = responseInDatabase.data[0].title

        responseToSend.url = responseInDatabase.data[0].url

        return responseToSend

    }

    // if does not exist in database
    const responseToSave = {
        'date': null,
        'expireDate': null,
        'id': null,
        'title': null,
        'url': null,
    }

    // trigger youtubeDL(id)
    const youtubeRawData = await getYoutubeInfo (id)

    if (youtubeRawData.success === false) return youtubeRawData

    responseToSave.date = Date.now ()

    if (youtubeRawData.isDash) {

        responseToSave.expireDate = parseInt (getExpireDate (youtubeRawData.url, true), 10)

    } else {

        responseToSave.expireDate = parseInt (getExpireDate (youtubeRawData.url, false), 10)

    }

    responseToSave.id = id

    responseToSave.title = youtubeRawData.title

    responseToSave.url = youtubeRawData.url

    YoutubeQueryCreate (responseToSave)

    responseToSend.success = youtubeRawData.success

    responseToSend.title = youtubeRawData.title

    responseToSend.url = youtubeRawData.url

    return responseToSend

}

module.exports.YoutubeController = YoutubeController