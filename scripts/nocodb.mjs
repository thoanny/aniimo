import fs from 'node:fs';

const NOCODB_DOMAIN = process.env.NOCODB_DOMAIN;
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
const NOCODB_BASE = process.env.NOCODB_BASE;

const NOCODB_URL = `${NOCODB_DOMAIN}/api/v3/data/${NOCODB_BASE}`;

const endpoints = {
  aniimo: {
    path: './src/data/aniimo.json',
    url: `${NOCODB_URL}/medh4olnqzb8tj3/records?pageSize=9999&viewId=vwanp45xf4ysbfk6`,
  },
  elements: {
    path: './src/data/elements.json',
    url: `${NOCODB_URL}/m3rdnw6s4n00lel/records?pageSize=9999&viewId=vwg92h7i5soe93z8`,
  },
  roles: {
    path: './src/data/roles.json',
    url: `${NOCODB_URL}/m1aqmiqn9a6wpna/records?pageSize=9999&viewId=vwfgn1kw56ytkjen`,
  },
  forms: {
    path: './src/data/forms.json',
    url: `${NOCODB_URL}/m5fge5s0sosoxy7/records?pageSize=9999&viewId=vwgld7ohzpfo9nvj`,
  },
  homelandAbillities: {
    path: './src/data/homeland-abilities.json',
    url: `${NOCODB_URL}/meerqi8tt4pu0eo/records?pageSize=9999&viewId=vwqqohwn2q4qouj8`,
  },
  aniimoHomelandAbillities: {
    path: './src/data/aniimo-homeland-abilities.json',
    url: `${NOCODB_URL}/mpgwdbkvtsaycx7/records?pageSize=9999&viewId=vwjocit65zq8kfww`,
  },
  events: {
    path: './src/data/events.json',
    url: `${NOCODB_URL}/m3n0lri1b6dahdj/records?pageSize=9999&viewId=vwnsue7wtzaaug2o`,
  },
};

Object.keys(endpoints).forEach((endpoint) => {
  const { url, path } = endpoints[endpoint];
  saveOnlineJsonToLocal(url, path);
});

async function saveOnlineJsonToLocal(url, path) {
  if (!url || !path) {
    throw new Error('No Url or Path provided');
  }
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xc-token': NOCODB_TOKEN,
      },
    });
    const content = await response.json();
    fs.writeFile(path, JSON.stringify(content.records), (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
