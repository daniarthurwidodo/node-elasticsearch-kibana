const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const esClient = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

app.get('/suggest', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json([]);

    try {
        const { hits } = await esClient.search({
            index: 'products',
            body: {
                query: {
                    match_phrase_prefix: { name: query }
                }
            }
        });

        res.json(hits.hits.map(hit => hit._source.name));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
