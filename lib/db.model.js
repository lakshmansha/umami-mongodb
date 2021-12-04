import { Schema, SchemaTypes } from 'mongoose';

const accountSchema = new Schema(
    {
        user_id: {
            type: SchemaTypes.Number,
            required: false,
        },
        username: {
            type: SchemaTypes.String,
            required: true,
        },
        password: {
            type: SchemaTypes.String,
            required: true,
        },
        is_admin: {
            type: SchemaTypes.String,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

const websiteSchema = new Schema(
    {
        website_id: {
            type: SchemaTypes.Number,
            required: false,
        },
        website_uuid: {
            type: SchemaTypes.String,
            required: true,
            unique: true,
        },
        user_id: {
            type: SchemaTypes.Number,
            required: true,
        },
        name: {
            type: SchemaTypes.String,
            required: true,
        },
        domain: {
            type: SchemaTypes.String,
            required: true,
        },
        share_id: {
            type: SchemaTypes.String,
            required: false,
            unique: true
        },
    },
    {
        timestamps: true,
    },
);

const sessionSchema = new Schema(
    {
        session_id: {
            type: SchemaTypes.Number,
            required: false,
        },
        session_uuid: {
            type: SchemaTypes.String,
            required: true,
            unique: true,
        },
        website_id: {
            type: SchemaTypes.Number,
            required: true,
        },
        hostname: {
            type: SchemaTypes.String,
            required: true,
        },
        browser: {
            type: SchemaTypes.String,
            required: false,
        },
        os: {
            type: SchemaTypes.String,
            required: false,
        },
        device: {
            type: SchemaTypes.String,
            required: false,
        },
        screen: {
            type: SchemaTypes.String,
            required: false,
        },
        language: {
            type: SchemaTypes.String,
            required: false,
        },
        country: {
            type: SchemaTypes.String,
            required: false,
        },
    },
    {
        timestamps: true
    }
);

const pageViewSchema = new Schema(
    {
        view_id: {
            type: SchemaTypes.Number,
            required: false,
        },
        session_id: {
            type: SchemaTypes.Number,
            required: true,
        },
        website_id: {
            type: SchemaTypes.Number,
            required: true,
        },
        url: {
            type: SchemaTypes.String,
            required: false,
        },
        referrer: {
            type: SchemaTypes.String,
            required: false,
        },
    },
    {
        timestamps: true
    }
);

const eventSchema = new Schema(
    {
        event_id: {
            type: SchemaTypes.Number,
            required: false,
        },
        session_id: {
            type: SchemaTypes.Number,
            required: true,
        },
        website_id: {
            type: SchemaTypes.Number,
            required: true,
        },
        url: {
            type: SchemaTypes.String,
            required: false,
        },
        event_type: {
            type: SchemaTypes.String,
            required: false,
        },
        event_value: {
            type: SchemaTypes.String,
            required: false,
        },
    },
    {
        timestamps: true
    }
);

export { accountSchema, websiteSchema, sessionSchema, pageViewSchema, eventSchema };