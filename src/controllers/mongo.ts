import Youtube from '../models/youtube'
import { IGetResponse } from './mongo.types'

const doesExist = async (id: string): Promise<boolean> => {

    const result = await Youtube.exists ({ id })

    return result

}

const save = (obj: void): void => {

    const newYoutube = new Youtube (obj)

    newYoutube.save ()

}

const get = async (id: string): Promise<IGetResponse> => new Promise ((resolve) => {

    doesExist (id)
        .then ((exists) => {

            if (exists) {

                Youtube.find ({
                    id,
                })
                    .sort ({
                        'date': 'desc',
                    })
                    .limit (1)
                    .exec ((err: any, r: any) => {

                        // eslint-disable-next-line no-console
                        if (err) return console.log (err)

                        const dateNow = parseInt (Date.now ()
                            .toString ()
                            .slice (0, 10), 10)

                        if (dateNow < r[0].expireDate) {

                            resolve ({
                                'success': true,
                                'data': r,
                            })

                        } else {

                            resolve ({
                                'success': false,
                            })

                        }

                        return null

                    })

            } else {

                resolve ({
                    'success': false,
                })

            }

        })

})

export default {
    save,
    get,
}