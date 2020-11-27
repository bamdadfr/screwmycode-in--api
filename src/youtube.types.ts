export interface IYoutubeModel {
    date: number;
    expireDate: number;
    id: string;
    title: string;
    url: string;
}

export interface IYoutubeReadResponse {
    success: boolean;
    data?: object;
}

export interface IYoutubeControllerResponse {
    success: boolean;
    error?: object|string;
    title?: string;
    url?: string;
}

export interface IYoutubeInfo {
    success: boolean;
    error?: object|string;
    isDash?: boolean;
    title?: string;
    url?: string;
}

export interface IYTDLResponse {
    formats?: string;
    title?: string;
}