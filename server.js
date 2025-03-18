const express = require("express");
const { Client } = require("@elastic/elasticsearch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/suggest", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(500).json([]);

  try {
    const { hits } = await esClient.search({
      index: "products",
      body: {
        query: {
          match_phrase_prefix: { name: query },
        },
      },
    });
    res.json(hits.hits.map((hit) => hit._source.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.NODE_ENV === 'test' ? 3009 : 3008;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Web UI is available at http://localhost:${port}`);
  console.log(`Elasticsearch is connected to ${process.env.ELASTICSEARCH_URL || "http://localhost:9200"}`);
});

module.exports = { app, server };
