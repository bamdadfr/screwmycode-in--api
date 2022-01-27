import { Injectable } from '@nestjs/common';
import { ReadAppDto } from './dto/read-app.dto.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

@Injectable()
export class AppService {
  index(): ReadAppDto {
    return {
      success: true,
      version: packageJson.version,
    };
  }
}
