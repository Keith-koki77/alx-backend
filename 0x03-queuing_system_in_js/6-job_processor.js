import kue from 'kue';

const queue = kue.createQueue()

function sendNotification(phonenumber, message) {
    console.log(`Sending notification to ${phonenumber}, with message: ${message}`);
}

queue.process('push_notification_code', 2, (job, done) => {
    sendNotification(job.data.phonenumber, job.data.message);
    done();
});
