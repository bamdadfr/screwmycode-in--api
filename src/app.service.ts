import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  index(): { success: boolean } {
    return {
      success: true,
    };
  }
}
