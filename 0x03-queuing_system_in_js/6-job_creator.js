import kue from 'kue';

const queue = kue.createQueue();

const jobData = {
    phoneNumber: string,
    message: string,
};

const job = queue.create('push_notification_code', jobData).save((err) => {
    if (err) {
        console.log('Error');
    } else {
        console.log(`Notification job created: ${push.id}`);
    }
});

job.on('complete', () => {
    console.log('Notification job completed');
});

job.on('failed', () => {
    console.log('Notification job failed');
});
