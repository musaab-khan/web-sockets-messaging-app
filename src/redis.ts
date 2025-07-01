import { createClient } from 'redis';

let redis;

try {
    redis = createClient({
        socket: {
        host: 'localhost',
        port: 6379
        }
    });

    redis.on('error', (err) => {
        console.error('Redis Client Error:', err);
    });

    await redis.connect();
    console.log('Redis connected on port 6342');
}
catch (err) {
    console.error('Failed to connect to Redis:', err);
}

export default redis;
