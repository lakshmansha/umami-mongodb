import { getMongoDb, SetupModels } from './db.mongo';
import { accountSeeders } from './db.seeders';

let mongodb;
let dbModels;

if (process.env.NODE_ENV === 'production') { 
  mongodb = getMongoDb();
  dbModels = SetupModels();
} else {  
  if (!global.mongodb) {
    const mongodb = getMongoDb();
    const dbModels = SetupModels();
    
    // Set Seeders
    accountSeeders(dbModels.accountModel);

    global.dbModels = dbModels;
    global.mongodb = mongodb;
  }

  mongodb = global.mongodb;
  dbModels = global.dbModels;
}

export { mongodb, dbModels };
