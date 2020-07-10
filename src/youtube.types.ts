export interface IYoutubeModel {
    date: number,
    expireDate: number,
    id: string,
    title: string,
    url: string,
}

export interface IYoutubeReadResponse {
    success: boolean,
    data?: object,
}

export interface IYoutubeControllerResponse {
    success: boolean,
    error?: string,
    title?: string,
    url?: string,
}

export interface IYoutubeRawData {
    success: boolean,
    isDash: boolean,
    title: string,
    url: string,
}

export interface IYTDLResponse {
    formats?: string,
    title?: string,
}