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