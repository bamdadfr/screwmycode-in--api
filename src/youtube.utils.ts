import fetch from 'node-fetch'
import parser from 'fast-xml-parser'
import { YoutubeModel } from './youtube.model'

const ytdl = require ('ytdl-core')

export const getExpireDate = (string: string, isDash: boolean): string => {

    if (isDash) {

        const regEx = /expire\/[0-9]{10}/gm

        return regEx.exec (string)[0].replace ('expire/', '')

    }

    const regEx = /expire=[0-9]{10}/gm

    return regEx.exec (string)[0].replace ('expire=', '')

}

export const getYoutubeDashData = async (url: string): Promise<string> => new Promise ((resolve, reject) => {

    fetch (url)
        .then ((res) => res.text ())
        .then ((xml) => parser.parse (xml, {
            'ignoreAttributes': false,
        }))
        .then ((json) => {

            resolve (json.MPD.Period.AdaptationSet[1].Representation.BaseURL)

        })
        .catch ((err) => reject (err))

})

export const getYoutubeRawData = async (id: string): Promise<object> => {

    const url = `https://www.youtube.com/watch?v=${id}`

    // does not exist in database, triggering youtube-dl
    return ytdl.getInfo (
        url,
        { 
            'filter': 'audio',
        },
        (err: any, info: any) => {

            if (err) throw err

            const format = ytdl.chooseFormat (info.formats, {
                'quality': '140',
            })

            if (format.isDashMPD) {

                return getYoutubeDashData (format.url)
                    .then ((r) => ({
                        'success': true,
                        'isDash': true,
                        'title': info.title,
                        'url': r,
                    }))
                    .catch (err => ({
                        'success': false,
                        'error': err,
                    }))

            }

            return ({
                'success': true,
                'isDash': false,
                'title': info.title,
                'url': format.url,
            })

        },
    )

}

export const isExisting = async (id: string): Promise<boolean> => {

    const result = await YoutubeModel.exists ({ id })

    return result

}

export const isValidID = (id: any): any => {

    const regEx = /^([0-9A-Za-z_-]{11})$/

    return regEx.test (id)

}

