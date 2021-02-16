const { YoutubeModel } = require ('./youtube-model')
const { YoutubeConstantsErrorQuery } = require ('./youtube-constants')
/**
 * does the given id already exist in database?
 * @param id {string} - youtube id
 * @returns {Promise<boolean>}
 * @constructor
 */
const YoutubeQueryExists = async (id) => await YoutubeModel.exists ({ id })

module.exports.YoutubeQueryExists = YoutubeQueryExists

/**
 * create id in database
 * @param obj {json}
 * @constructor
 */
const YoutubeQueryCreate = (obj) => {

    const newYoutube = new YoutubeModel (obj)

    newYoutube.save ()

}

module.exports.YoutubeQueryCreate = YoutubeQueryCreate

/**
 * read id from database
 * @param id {string} - youtube id
 * @returns {Promise<unknown>}
 * @constructor
 */
const YoutubeQueryRead = async (id) => new Promise ((resolve) => {

    (async () => {

        const doesExist = await YoutubeQueryExists (id)

        if (!doesExist) return resolve (YoutubeConstantsErrorQuery)

        try {

            YoutubeModel
                .find ({
                    id,
                })
                .sort ({
                    'date': 'desc',
                })
                .limit (1)
                .exec (
                    (error, response) => {

                        if (error) throw error

                        const dateNow = parseInt (
                            Date.now ()
                                .toString ()
                                .slice (0, 10),
                            10,
                        )

                        if (dateNow < response[0].expireDate) {

                            return resolve ({
                                'success': true,
                                'data': response,
                            })

                        } else {

                            return resolve ({
                                'success': false,
                            })

                        }

                    })

        } catch (error) {

            // reject (error)
            resolve (YoutubeConstantsErrorQuery)

        }

    }) ()

})

module.exports.YoutubeQueryRead = YoutubeQueryRead