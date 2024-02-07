import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => { 
    console.log(`Redis client not connected to the server: ${err}`) 
});
client.on('connect', () => { 
    console.log('Redis client connected to the server') 
});

const hash_key = 'HolbertonSchools';

const keys = ['Portland', 'Seattle', 'New York', 'Bogota', 'Cali', 'Paris'];
const values = [50, 80, 20, 20, 40, 2];

keys.forEach((key, index) => {
    client.hset(hash_key, key, values[index], redis.print);
});

client.hgetall(hash_key, (err, value) => {
    console.log(value);
});
