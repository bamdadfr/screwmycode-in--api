export interface IError extends Error {
    syscall?: string;
    code?: string;
    status?: number;
}