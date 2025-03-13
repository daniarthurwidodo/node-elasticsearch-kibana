// elasticsearch.js
const { Client } = require('@elastic/elasticsearch');

let client = null;

const getClient = () => {
  if (!client) {
    client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
    });
  }
  return client;
};

const closeClient = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};

module.exports = { getClient, closeClient };