import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

import { accountSchema, eventSchema, pageViewSchema, sessionSchema, websiteSchema } from './db.model';

const dbConnection = {
    url: process.env.MONGO_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};

const getMongoDb = () => {
    const mongodb = mongoose.createConnection(dbConnection.url, dbConnection.options);

    // If the connection throws an error
    mongodb.on('error', function (err) {
        console.error(`MongoDB default connection error @ ${dbConnection.url}, Error: ${err}`);
    });

    // When the connection is disconnected
    mongodb.on('disconnected', function () {
        console.info(`MongoDB connection disconnected @ ${dbConnection.url}`);
    });

    return mongodb;
};

const SetupModels = () => {
    const mongodb = getMongoDb();

    const AutoIncrement = AutoIncrementFactory(mongodb);

    accountSchema.plugin(AutoIncrement, { id: 'userid_seq', inc_field: 'user_id' });
    websiteSchema.plugin(AutoIncrement, { id: 'websiteid_seq', inc_field: 'website_id' });
    sessionSchema.plugin(AutoIncrement, { id: 'sessionid_seq', inc_field: 'session_id' });
    pageViewSchema.plugin(AutoIncrement, { id: 'pageviewid_seq', inc_field: 'view_id' });
    eventSchema.plugin(AutoIncrement, { id: 'eventid_seq', inc_field: 'event_id' });

    websiteSchema.index({ user_id: 1 });

    sessionSchema.index({ createdAt: 1});
    sessionSchema.index({ website_id: 1 });
    
    pageViewSchema.index({ createdAt: 1 });
    pageViewSchema.index({ website_id: 1 });
    pageViewSchema.index({ session_id: 1 });
    pageViewSchema.index({ website_id: 1, createdAt: 1 });
    pageViewSchema.index({ website_id: 1, session_id: 1, createdAt: 1 });

    eventSchema.index({ createdAt: 1 });
    eventSchema.index({ website_id: 1 });
    eventSchema.index({ session_id: 1 });

    const accountModel = mongodb.model('account', accountSchema, 'account');
    const websiteModel = mongodb.model('website', websiteSchema, 'website');
    const sessionModel = mongodb.model('session', sessionSchema, 'session');
    const pageViewModel = mongodb.model('pageview', pageViewSchema, 'pageview');
    const eventModel = mongodb.model('event', eventSchema, 'event');    

    const dbModels = {
        accountModel: accountModel,
        websiteModel: websiteModel,
        sessionModel: sessionModel,
        pageViewModel: pageViewModel,
        eventModel: eventModel
    }

    return dbModels;
}

export { getMongoDb, SetupModels };