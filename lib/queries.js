import moment from 'moment-timezone';
import { dbModels } from 'lib/db';
import { subMinutes } from 'date-fns';
import {
  MONGO_DATE_FORMATS,
  URL_LENGTH,
} from 'lib/constants';
import { accountMapper, eventMapper, pageViewMapper, sessionMapper, webSiteMapper } from './modelMapper';

function getModel(type) {
  let model = null;
  switch (type) {
    case 'pageview':
      model = dbModels.pageViewModel;
      break;
    case 'event':
      model = dbModels.eventModel;
      break;
    case 'session':
      model = dbModels.sessionModel
    default:
      break;
  }
  return model;
}

//#region Website Table Queries

export async function getWebsiteById(website_id) {
  const _website = await dbModels.websiteModel.findOne({ website_id });
  const website = webSiteMapper(_website);
  return website;
}

export async function getWebsiteByUuid(website_uuid) {
  const _website = await dbModels.websiteModel.findOne({ website_uuid });
  const website = webSiteMapper(_website);
  return website;
}

export async function getWebsiteByShareId(share_id) {
  const _website = await dbModels.websiteModel.findOne({ share_id });
  const website = webSiteMapper(_website);
  return website;
}

export async function getUserWebsites(user_id) {
  const _websites = await dbModels.websiteModel.find({ user_id });
  const websites = webSiteMapper(_websites);
  return websites;
}

export async function createWebsite(user_id, data) {
  const _website = await dbModels.websiteModel.create({ user_id, ...data });
  const website = webSiteMapper(_website);
  return website;
}

export async function updateWebsite(website_id, data) {
  const _website = await dbModels.websiteModel.updateOne({ website_id }, data);
  const website = webSiteMapper(_website);
  return website;
}

export async function resetWebsite(website_id) {
  await dbModels.sessionModel.deleteMany({ website_id });
}

export async function deleteWebsite(website_id) {
  await dbModels.websiteModel.deleteOne({ website_id });
}

//#endregion

//#region Handling Session Create & Fetch. Event & Page View Creation.

export async function createSession(website_id, data) {
  data.country = data.country !== undefined ? data.country : null;
  const _session = await dbModels.sessionModel.create({ website_id, ...data });
  const session = sessionMapper(_session);
  return session;
}

export async function getSessionByUuid(session_uuid) {
  const _session = await dbModels.sessionModel.findOne({ session_uuid });
  if (_session) {
    const session = sessionMapper(_session);
    return session;
  } else {
    return _session;
  }
}

export async function savePageView(website_id, session_id, url, referrer) {
  const pageViewEntry = {
    website_id: website_id,
    session_id: session_id,
    url: url?.substr(0, URL_LENGTH),
    referrer: referrer?.substr(0, URL_LENGTH),
  };
  const _pageView = await dbModels.pageViewModel.create({ ...pageViewEntry });
  const pageView = pageViewMapper(_pageView);
  return pageView;
}

export async function saveEvent(website_id, session_id, url, event_type, event_value) {
  const eventEntry = {
    website_id: website_id,
    session_id: session_id,
    url: url?.substr(0, URL_LENGTH),
    event_type: event_type?.substr(0, 50),
    event_value: event_value?.substr(0, 50),
  };
  const _event = await dbModels.eventModel.create({ ...eventEntry });
  const event = eventMapper(_event);
  return event;
}

//#endregion

//#region Account Table Queries

export async function getAccounts() {
  const _accounts = await dbModels.accountModel.find({});
  const accounts = accountMapper(_accounts);
  return accounts;
}

export async function getAccountById(user_id) {
  const _accounts = await dbModels.accountModel.findOne({ user_id });
  const accounts = _accounts ? accountMapper(_accounts): _accounts;
  return accounts;
}

export async function getAccountByUsername(username) {
  const _accounts = await dbModels.accountModel.findOne({ username });
  const accounts = _accounts ? accountMapper(_accounts): _accounts;
  return accounts;
}

export async function updateAccount(user_id, data) {
  const _accounts = await dbModels.accountModel.updateOne({ user_id }, data);
  const accounts = accountMapper(_accounts);
  return accounts;
}

export async function deleteAccount(user_id) {
  await dbModels.accountModel.deleteOne({ user_id });
}

export async function createAccount(data) {
  const _accounts = await dbModels.accountModel.create({ ...data });
  const accounts = accountMapper(_accounts);
  return accounts;
}

//#endregion

/** Completed */
export async function getWebsiteStats(website_id, start_at, end_at, filters = {}) {
  const { url, ref } = filters;

  const match = {
    website_id: website_id,
    createdAt: {
      $gte: new Date(start_at.toISOString()),
      $lte: new Date(end_at.toISOString())
    }
  };

  if (url) {
    match['url'] = decodeURIComponent(url);
  }

  if (ref) {
    match['referrer'] = {
      $regex: decodeURIComponent(ref)
    };
  }

  const groupQuery = [
    {
      '$match': match
    }, {
      '$group': {
        '_id': {
          'session_id': '$session_id',
          'createdAt': {
            '$dateToString': {
              'format': MONGO_DATE_FORMATS['hour'],
              'date': '$createdAt'
            }
          }
        },
        'count': {
          '$sum': 1
        },
        'min': {
          '$min': '$createdAt'
        },
        'max': {
          '$max': '$createdAt'
        }
      }
    }, {
      '$replaceWith': {
        'session_id': '$_id.session_id',
        'createdAt': '$_id.createdAt',
        'ccount': '$count',
        'time': {
          '$divide': [{ '$subtract': [ '$max', '$min'] }, 1000]
        }
      }
    }, {
      '$group': {
        '_id': null,
        'bounces': {
          '$sum': {
            '$cond': [
              {
                '$eq': [
                  '$ccount', 1
                ]
              }, 1, 0
            ]
          }
        },
        'unique': {
          '$addToSet': '$session_id'
        },
        'pageview': {
          '$sum': '$ccount'
        },
        'ttltime': {
          '$sum': '$time'
        }
      }
    }, {
      '$replaceWith': {
        'pageviews': '$pageview',
        'uniques': {
          '$size': '$unique'
        },
        'bounces': '$bounces',
        'totaltime': '$ttltime'
      }
    }
  ];

  const websiteStats = await dbModels.pageViewModel.aggregate(groupQuery);
  if (websiteStats.length > 0)
    return websiteStats;
  else {
    const stats = { "pageviews": 0, "uniques": 0, "bounces": 0, "totaltime": 0 };
    return [stats];
  }
}

/** Completed */
export async function getPageviewStats(
  website_id,
  start_at,
  end_at,
  timezone = 'utc',
  unit = 'day',
  count = '*',
  filters = {},
) {
  const { url, ref } = filters;

  const tz = moment.tz(timezone).format('Z');
  const match = {
    website_id: website_id,
    createdAt: {
      $gte: new Date(start_at.toISOString()),
      $lte: new Date(end_at.toISOString())
    }
  };

  if (url) {
    match['url'] = decodeURIComponent(url);
  }

  if (ref) {
    match['referrer'] = {
      $regex: decodeURIComponent(ref)
    };
  }

  const groupQuery = [];

  groupQuery.push({
    '$match': match
  });

  let groupCount = {
    '$sum': 1
  }

  if (count === 'distinct session_id') {
    groupCount = {
      '$addToSet': '$session_id'
    }
  }

  groupQuery.push({
    '$group': {
      '_id': {
        'createdAt': {
          '$dateToString': {
            'format': MONGO_DATE_FORMATS[unit],
            'date': '$createdAt',
            'timezone': tz
          }
        }
      },
      'count': groupCount
    }
  });

  if (count === 'distinct session_id') {
    groupQuery.push({
      '$project': {
        'count': {
          '$size': '$count'
        }
      }
    });
  }

  groupQuery.push({
    '$replaceWith': {
      't': '$_id.createdAt',
      'y': '$count'
    }
  });

  groupQuery.push({
    '$sort': {
      't': 1
    }
  });

  const pageViewStats = await dbModels.pageViewModel.aggregate(groupQuery);
  return pageViewStats;
}

/** Completed */
export async function getSessionMetrics(website_id, start_at, end_at, field, filters = {}) {
  const { url } = filters;
  const filter = {
    website_id: website_id,
    createdAt: {
      $gte: new Date(start_at.toISOString()),
      $lte: new Date(end_at.toISOString())
    }
  };

  if (url) {
    filter['url'] = decodeURIComponent(url);
  }

  const _data = await dbModels.pageViewModel.distinct('session_id', filter);

  const mainFilter = [
    {
      '$match': {
        'session_id': {
          '$in': _data
        }
      }
    }, {
      '$group': {
        '_id': '$' + field,
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$replaceWith': {
        'x': '$_id',
        'y': '$count'
      }
    }
  ]

  const session = await dbModels.sessionModel.aggregate(mainFilter);
  return session;
}

export async function getPageviewMetrics(website_id, start_at, end_at, field, table, filters = {}) {
  const { domain, url } = filters;

  const match = {
    website_id: website_id,
    createdAt: {
      $gte: new Date(start_at.toISOString()),
      $lte: new Date(end_at.toISOString())
    }
  };

  if (domain) {
    const array = ['/', '://${domain}/'];
    const myRegex = new RegExp(array.join('|'), i)
    match['referrer'] = {
      $not: {
        $in: myRegex
      }
    };
  }

  if (url) {
    match['url'] = decodeURIComponent(url);
  }

  const groupId = field !== 'event' ? '$' + field : {
    $concat: ['$event_type', '\t', '$event_value']
  }

  const filter = [
    {
      '$match': match
    }, {
      '$group': {
        '_id': groupId,
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$replaceWith': {
        'x': '$_id',
        'y': '$count'
      }
    }, {
      '$sort': {
        'y': 1
      }
    }
  ];

  const collection = getModel(table);
  const dataStats = await collection.aggregate(filter);
  return dataStats;
}

/** Completed */
export async function getActiveVisitors(website_id) {
  const date = subMinutes(new Date(), 5);

  const filter = [
    {
      '$match': {
        'website_id': 1,
        'createdAt': {
          '$gte': new Date(date.toISOString())
        }
      }
    }, {
      '$group': {
        '_id': {
          'session_id': '$session_id',
          'website_id': '$website_id'
        },
        'x': {
          '$sum': 1
        }
      }
    }, {
      '$count': 'x'
    }
  ]

  const pageView = await dbModels.pageViewModel.aggregate(filter);
  return pageView;
}

/** Completed */
export async function getEventMetrics(
  website_id,
  start_at,
  end_at,
  timezone = 'utc',
  unit = 'day',
  filters = {},
) {
  const { url, event_type } = filters;

  const tz = moment.tz(timezone).format('Z');

  const match = {
    website_id: website_id,
    createdAt: {
      $gte: new Date(start_at.toISOString()),
      $lte: new Date(end_at.toISOString())
    }
  };

  if (url) {
    match['url'] = decodeURIComponent(url);
  }

  if (event_type) {
    match['event_type'] = event_type;
  }

  const filter = [
    {
      '$match': match
    }, {
      '$group': {
        '_id': {
          'event_value': '$event_value',
          'createdAt': {
            '$dateToString': {
              'format': MONGO_DATE_FORMATS[unit],
              'date': '$createdAt',
              'timezone': tz
            }
          }
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$replaceWith': {
        'x': '$_id.event_value',
        't': '$_id.createdAt',
        'y': '$count'
      }
    }, {
      '$sort': {
        'y': -1
      }
    }
  ]

  const events = await dbModels.eventModel.aggregate(filter);

  return events;
}

/** Completed */
//#region Real Time Data Functions

export async function getPageviews(websites, start_at) {
  const _pageViews = await dbModels.pageViewModel.find({
    website_id: {
      $in: websites
    },
    createdAt: {
      $gte: start_at
    }
  });

  const pageViews = pageViewMapper(_pageViews);
  return pageViews;
}

export async function getEvents(websites, start_at) {
  const _events = await dbModels.eventModel.find({
    website_id: {
      $in: websites
    },
    createdAt: {
      $gte: start_at
    }
  });

  const events = eventMapper(_events);
  return events;
}

export async function getSessions(websites, start_at) {
  const _session = await dbModels.sessionModel.find({
    website_id: {
      $in: websites
    },
    createdAt: {
      $gte: start_at
    }
  });

  const session = sessionMapper(_session);
  return session;
}

export async function getRealtimeData(websites, time) {
  const [pageviews, sessions, events] = await Promise.all([
    getPageviews(websites, time),
    getSessions(websites, time),
    getEvents(websites, time),
  ]);

  return {
    pageviews: pageviews.map(({ view_id, ...props }) => ({
      __id: `p${view_id}`,
      view_id,
      ...props,
    })),
    sessions: sessions.map(({ session_id, ...props }) => ({
      __id: `s${session_id}`,
      session_id,
      ...props,
    })),
    events: events.map(({ event_id, ...props }) => ({
      __id: `e${event_id}`,
      event_id,
      ...props,
    })),
    timestamp: Date.now(),
  };
}

//#endregion
