import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

export function MongoTestModule(customOpts: MongooseModuleOptions = {}) {
  return MongooseModule.forRootAsync({
    useFactory: async () => {
      mongo = await MongoMemoryServer.create();
      const uri = mongo.getUri();
      return {
        uri,
        ...customOpts,
      };
    },
  });
}

export const closeMongoConnection = async () => {
  if (mongo) await mongo.stop(true);
};
