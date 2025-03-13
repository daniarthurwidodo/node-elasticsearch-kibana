const request = require('supertest');
const { app } = require('./server');
const { getClient, closeClient } = require('./elasticsearch');

describe('Search API Tests', () => {
  let client;

  beforeAll(async () => {
    client = getClient();
    // Create test index and add test data
    await client.indices.create({
      index: 'products-test',
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' }
          }
        }
      }
    });

    // Add test data
    await client.bulk({
      body: [
        { index: { _index: 'products-test' } },
        { name: 'iPhone 12', description: 'Apple smartphone', price: 999.99 },
        { index: { _index: 'products-test' } },
        { name: 'Samsung Galaxy', description: 'Android smartphone', price: 899.99 }
      ]
    });

    // Wait for indexing
    await client.indices.refresh({ index: 'products-test' });
  });

  afterAll(async () => {
    // Clean up test index
    await client.indices.delete({ index: 'products-test' });
    await closeClient();
  });

  describe('GET /suggest', () => {
    it('should return suggestions for valid query', async () => {
      const response = await request(app)
        .get('/suggest')
        .query({ q: 'iph' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/suggest')
        .query({ q: 'nonexistentproduct' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });

    it('should handle empty query parameter', async () => {
      const response = await request(app)
        .get('/suggest')
        .query({ q: '' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });
  });
});

describe('Elasticsearch Client Mock Tests', () => {
  let client;

  beforeEach(() => {
    client = {
      search: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should handle elasticsearch client errors', async () => {
    client.search.mockRejectedValue(new Error('Elasticsearch error'));
    
    const response = await request(app)
      .get('/suggest')
      .query({ q: 'test' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});