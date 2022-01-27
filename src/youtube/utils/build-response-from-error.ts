import { ReadYoutubeDto } from '../dto/read-youtube.dto.js';

/**
 * @description build controller response from service error
 */
export function buildResponseFromError(error): ReadYoutubeDto {
  return {
    success: false,
    error: {
      message: error.message,
    },
  };
}
