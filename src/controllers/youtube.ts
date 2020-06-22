// import ytdl from 'ytdl-core'
import fetch from 'node-fetch'
import parser from 'fast-xml-parser'
import mongoController from './mongo'

const ytdl = require ('ytdl-core')

const testId = (id: any): any => {

    const regEx = /^([0-9A-Za-z_-]{11})$/

    return regEx.test (id)

}

const findExpireDate = (string: string, isDash: boolean) => {

    if (isDash) {

        const regEx = /expire\/[0-9]{10}/gm

        return regEx.exec (string)[0].replace ('expire/', '')

    }

    const regEx = /expire=[0-9]{10}/gm

    return regEx.exec (string)[0].replace ('expire=', '')

}

const fetchDash = async (url: string) => new Promise ((resolve, reject) => {

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

const youtubeDL = async (id: string): Promise<any> => {

    const url = `https://www.youtube.com/watch?v=${id}`

    // does not exist in database, triggering youtube-dl
    return ytdl.getInfo (url, { 
        'filter': 'audio',
    }, (err: any, info: any) => {

        if (err) throw err

        const format = ytdl.chooseFormat (info.formats, {
            'quality': '140',
        })

        if (format.isDashMPD) {

            return fetchDash (format.url)
                .then ((r) => ({
                    'success': true,
                    'isDash': true,
                    'title': info.title,
                    'url': r,
                }))

        }

        return ({
            'success': true,
            'isDash': false,
            'title': info.title,
            'url': format.url,
        })

    })

}

export default async (id: string): Promise<any> => {

    // first, checking if ID provided is OK
    if (testId (id)) {
        
        // format of the response to send through the API
        const responseToSend: any = {
            'success': null,
            'title': null,
            'url': null,
        }
        
        const responseInDatabase: any = await mongoController.get (id)
        
        if (responseInDatabase.success) {

            // if exists in database
            responseToSend.success = true
            
            responseToSend.title = responseInDatabase.data[0].title
            
            responseToSend.url = responseInDatabase.data[0].url
         
            return responseToSend

        }
        
        // if does not exist in database
        const responseToSave: any = {
            'date': null,
            'expireDate': null,
            'id': null,
            'title': null,
            'url': null,
        }

        // trigger youtubeDL(id)
        const youtubeDLResult: any = await youtubeDL (id)
            .catch (() => ({
                'success': false,
                'error': 'error fetching id',
            }))

        // return now if youtubeDL(id) failed
        if (youtubeDLResult.success === false) {

            return youtubeDLResult

        }

        if (youtubeDLResult.success) {

            responseToSave.date = Date.now ()

            if (youtubeDLResult.isDash) {

                responseToSave.expireDate = parseInt (findExpireDate (youtubeDLResult.url, true), 10)

            } else {

                responseToSave.expireDate = parseInt (findExpireDate (youtubeDLResult.url, false), 10)

            }

            responseToSave.id = id

            responseToSave.title = youtubeDLResult.title

            responseToSave.url = youtubeDLResult.url

            mongoController.save (responseToSave)

            responseToSend.success = youtubeDLResult.success

            responseToSend.title = youtubeDLResult.title

            responseToSend.url = youtubeDLResult.url

            return responseToSend

        }

    } else {

        return ({
            'success': false,
            'error': 'bad id',
        })

    }

    return null

}
