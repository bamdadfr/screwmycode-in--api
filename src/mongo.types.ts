export interface IMongoEnv {
    protocol: string,
    host: string,
    user: string,
    pass: string,
}

export interface IGetResponse {
    success: boolean,
    data?: object,
}