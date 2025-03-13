# Search Suggestion API with Elasticsearch

This project implements a search suggestion API using Node.js, Express, and Elasticsearch.

## Prerequisites

- Docker and Docker Compose
- Node.js 20 (if running locally)
- Postman (for testing APIs)

## Setup and Running

### Using Docker Compose (for Elasticsearch and Kibana only)

1. Start Elasticsearch and Kibana:

```sh
docker-compose up -d
```

2. Install dependencies:

```sh
npm install
```

3. Run the application locally:

```sh
node server.js
```

The services will be available at:

- Elasticsearch: <http://localhost:9200>
- Kibana: <http://localhost:5601>
- Backend API: <http://localhost:3000>

## API Endpoints

### GET /suggest

Returns search suggestions based on product names.

Query Parameters:

- `q`: Search query string (required)

Example Request:

```sh
curl "http://localhost:3000/suggest?q=iPh"
```

Example Response:

```json
[
  {
    "name": "iPhone 12",
    "description": "Apple smartphone",
    "price": 999.99
  }
]
```

## Testing

Run the test suite:

```sh
npm test
```

The tests will:

- Create a test index in Elasticsearch
- Run all test cases
- Clean up the test data automatically

## Development

### Environment Variables

Create a `.env` file in the root directory:

```sh
ELASTICSEARCH_URL=http://localhost:9200
PORT=3000
```

### Available Scripts

- `npm start`: Start the application
- `npm test`: Run test suite
- `npm run dev`: Start with nodemon (for development)

## Project Structure

```
├── server.js           # Main application entry point
├── elasticsearch.js    # Elasticsearch client configuration
├── docker-compose.yml  # Docker services configuration
├── __tests__/         # Test files
└── README.md          # Project documentation
```

## Technology Stack

- Node.js
- Express
- Elasticsearch 8.12.0
- Kibana 8.12.0
- Jest (Testing)
- Docker & Docker Compose

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
