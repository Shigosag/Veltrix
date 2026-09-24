export const prismaConfig = {
  seedBatchSize: 50,
  logLevel: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};
