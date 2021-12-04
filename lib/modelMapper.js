import objectMapper from 'object-mapper';

const accountMapperModel = {
    "user_id": "user_id",
    "username": "username",
    "password": "password",
    "is_admin": "is_admin",
    "createdAt": "created_at",
    "updatedAt": "updated_at"
}

const websiteMapperModel = {
    "website_id": "website_id",
    "website_uuid": "website_uuid",
    "user_id": "user_id",
    "name": "name",
    "domain": "domain",
    "share_id": "share_id",
    "createdAt": "created_at"    
}

const sessionMapperModel = {
    "session_id": "session_id",
    "session_uuid": "session_uuid",
    "website_id": "website_id",
    "hostname": "hostname",
    "browser": "browser",
    "os": "os",
    "device": "device",
    "screen": "screen",
    "language": "language",
    "country": "country",
    "createdAt": "created_at"    
}

const pageViewMapperModel = {
    "view_id": "view_id",
    "session_id": "session_id",
    "website_id": "website_id",
    "url": "url",
    "referrer": "referrer",    
    "createdAt": "created_at"    
}

const eventMapperModel = {
    "event_id": "event_id",
    "session_id": "session_id",
    "website_id": "website_id",
    "url": "url",
    "event_type": "event_type",
    "event_value": "event_value",    
    "createdAt": "created_at"    
}

const accountMapper = (value) => {
    let rtnValue;
    if(Array.isArray(value)) {
        rtnValue = [];
        value.forEach((element) => {
            const _value = objectMapper.merge(element, accountMapperModel);
            rtnValue.push(_value);
        });
    } else 
    if (typeof value === 'object') {
        if (Object.keys(value).length > 0) {
            const _value = objectMapper.merge(value, accountMapperModel);
            rtnValue = _value;
        }
    }

    return rtnValue;
}

const webSiteMapper = (value) => {
    let rtnValue;
    if(Array.isArray(value)) {
        rtnValue = [];
        value.forEach((element) => {
            const _value = objectMapper.merge(element, websiteMapperModel);
            rtnValue.push(_value);
        });
    } else 
    if (typeof value === 'object') {
        if (Object.keys(value).length > 0) {
            const _value = objectMapper.merge(value, websiteMapperModel);
            rtnValue = _value;
        }
    }

    return rtnValue;
}

const sessionMapper = (value) => {
    let rtnValue;
    if(Array.isArray(value)) {
        rtnValue = [];
        value.forEach((element) => {
            const _value = objectMapper.merge(element, sessionMapperModel);
            rtnValue.push(_value);
        });
    } else 
    if (typeof value === 'object') {
        if (Object.keys(value).length > 0) {
            const _value = objectMapper.merge(value, sessionMapperModel);
            rtnValue = _value;
        }
    }

    return rtnValue;
}

const pageViewMapper = (value) => {
    let rtnValue;
    if(Array.isArray(value)) {
        rtnValue = [];
        value.forEach((element) => {
            const _value = objectMapper.merge(element, pageViewMapperModel);
            rtnValue.push(_value);
        });
    } else 
    if (typeof value === 'object') {
        if (Object.keys(value).length > 0) {
            const _value = objectMapper.merge(value, pageViewMapperModel);
            rtnValue = _value;
        }
    }

    return rtnValue;
}

const eventMapper = (value) => {
    let rtnValue;
    if(Array.isArray(value)) {
        rtnValue = [];
        value.forEach((element) => {
            const _value = objectMapper.merge(element, eventMapperModel);
            rtnValue.push(_value);
        });
    } else 
    if (typeof value === 'object') {
        if (Object.keys(value).length > 0) {
            const _value = objectMapper.merge(value, eventMapperModel);
            rtnValue = _value;
        }
    }

    return rtnValue;
}

export { accountMapper, webSiteMapper, sessionMapper, pageViewMapper, eventMapper };