import Redis from 'ioredis';

export default async (): Promise<any> => {
  const redis = new Redis();
  return redis;
};
