import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job';

describe('createPushNotificationsJobs', function() {
  let queue;

  before(function() {
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  after(function() {
    queue.testMode.exit();
    queue.shutdown(5000, function(err) {
      console.log('Kue shutdown: ', err || '');
    });
  });

  it('should display an error message if jobs is not an array', function() {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
  });

  it('should create new jobs to the queue', function() {
    const jobs = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
      { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' }
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(2);
  });
});
