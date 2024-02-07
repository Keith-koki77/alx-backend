const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const queue = require('kue');

const app = express();
const redisClient = redis.createClient();
const redisGetAsync = promisify(redisClient.get).bind(redisClient);
const redisSetAsync = promisify(redisClient.set).bind(redisClient);

app.use(express.json());

queue.process('reserve_seat', async (job, done) => {
  try {
    const availableSeats = await redisGetAsync('available_seats');
    if (availableSeats === '0') {
      return done(new Error('Not enough seats available'));
    }
    await redisSetAsync('available_seats', parseInt(availableSeats, 10) - 1);
    console.log(`Seat reservation job ${job.id} completed`);
    return done();
  } catch (err) {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
    return done(err);
  }
});

app.get('/available_seats', async (req, res) => {
  try {
    const availableSeats = await redisGetAsync('available_seats');
    res.status(200).json({ numberOfAvailableSeats: availableSeats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get available seats' });
  }
});

app.get('/reserve_seat', async (req, res) => {
  try {
    const availableSeats = await redisGetAsync('available_seats');
    if (availableSeats === '0') {
      return res.status(409).json({ status: 'Reservation are blocked' });
    }
    const job = queue.create('reserve_seat').save();
    res.status(202).json({ status: 'Reservation in process' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reservation job' });
  }
});

app.get('/process', async (req, res) => {
  try {
    console.log('Queue processing');
    await queue.process('reserve_seat');
    res.status(200).json({ status: 'Queue processing' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process queue' });
  }
});

redisSetAsync('available_seats', 50);
const reservationEnabled = true;

app.listen(1245, () => {
  console.log('Server listening on port 1245');
});
