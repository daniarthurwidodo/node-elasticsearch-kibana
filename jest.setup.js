jest.setTimeout(10000); // Increase timeout to 10 seconds

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Add a small delay to allow connections to close
});