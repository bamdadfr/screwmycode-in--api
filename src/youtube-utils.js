const fetch = require ('node-fetch')
const parser = require ('fast-xml-parser')
const ytdl = require ('ytdl-core')

/**
 * check the expiry date with regex
 * @param string {string} - string to test with regex
 * @param isDash {boolean} - specific rules for dash files from youtube
 * @returns {string}
 */
const getExpireDate = (string, isDash) => {

    if (isDash) {

        const regEx = /expire\/[0-9]{10}/gm

        return regEx.exec (string)[0].replace ('expire/', '')

    }

    const regEx = /expire=[0-9]{10}/gm

    return regEx.exec (string)[0].replace ('expire=', '')

}

module.exports.getExpireDate = getExpireDate

/**
 * get information for the id when the file format is dash
 * @param url {string} - full youtube URL
 * @returns {Promise<unknown>}
 */
const getYoutubeDashInfo = async (url) => new Promise ((resolve, reject) => {

    (async () => {

        try {

            const response = await fetch (url)
            const text = await response.text ()

            const json = parser.parse (text, {
                'ignoreAttributes': false,
            })

            resolve (json.MPD.Period.AdaptationSet[1].Representation.BaseURL)

        } catch (error) {

            reject (error)

        }

    }) ()

})

module.exports.getYoutubeDashInfo = getYoutubeDashInfo

// noinspection JSValidateJSDoc
/**
 * get youtube information for the given id
 * @param id {string} - youtube id
 * @returns {Promise<{success: boolean, title: string, isDash: boolean, url: minimist.Opts.unknown}|{success: boolean, title: string, isDash: boolean, url: string}|{success: boolean, error}>}
 */
const getYoutubeInfo = async (id) => {

    const url = `https://www.youtube.com/watch?v=${id}`

    try {

        const info = await ytdl.getInfo (url, {
            'filter': 'audio',
        })

        const format = ytdl.chooseFormat (info.formats, {
            'quality': '140',
        })

        if (format.isDashMPD) {

            return getYoutubeDashInfo (format.url)
                .then ((r) => ({
                    'success': true,
                    'isDash': true,
                    'title': info.videoDetails.title,
                    'url': r,
                }))

        }

        return ({
            'success': true,
            'isDash': false,
            'title': info.videoDetails.title,
            'url': format.url,
        })

    } catch (error) {

        return {
            'success': false,
            error,
        }

    }

}

module.exports.getYoutubeInfo = getYoutubeInfo

/**
 * test the id with regex to test compliance with youtube's pattern
 * @param id {string} - youtube id
 * @returns {boolean}
 */
const isValidID = (id) => {

    const regEx = /^([0-9A-Za-z_-]{11})$/

    return regEx.test (id)

}

module.exports.isValidID = isValidID