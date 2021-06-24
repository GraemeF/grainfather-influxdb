/* eslint-disable jest/expect-expect */
import { TestScheduler } from 'rxjs/testing';
import { grainfatherNotifications } from '../src/grainfatherNotifications';

describe('grainfatherNotifications', () => {
  let scheduler: TestScheduler;

  beforeEach(async () => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('timer notification', () => {
    it('skips duplicated timer notifications when there are other notifications between', async () => {
      scheduler.run(({ cold, expectObservable }) => {
        const temperatures = {
          a: 'X61.0,23.8,ZZZZZZ',
          b: 'T0,0,0,0,ZZZZZZZZ',
        };
        const temperatures$ = cold('bab', temperatures);
        expectObservable(grainfatherNotifications(temperatures$).timer$).toBe(
          'b--',
          {
            b: {
              type: 'timer',
              timerActive: false,
              timeLeftMinutes: 0,
              timerTotalStartTime: 0,
              timeLeftSeconds: 0,
            },
          },
        );
      });
    });

    it('ignores changes to seconds', async () => {
      scheduler.run(({ cold, expectObservable }) => {
        const notifications = {
          a: 'T0,3,0,10,ZZZZZZZZ',
          b: 'T0,3,0,9,ZZZZZZZZ',
          c: 'T0,3,0,8,ZZZZZZZZ',
          d: 'T0,2,0,8,ZZZZZZZZ',
        };
        const notifications$ = cold('abcd', notifications);
        expectObservable(grainfatherNotifications(notifications$).timer$).toBe(
          'a--d',
          {
            a: {
              type: 'timer',
              timerActive: false,
              timeLeftMinutes: 3,
              timerTotalStartTime: 0,
              timeLeftSeconds: 10,
            },
            d: {
              type: 'timer',
              timerActive: false,
              timeLeftMinutes: 2,
              timerTotalStartTime: 0,
              timeLeftSeconds: 8,
            },
          },
        );
      });
    });
  });

  describe('temperature notification', () => {
    it('parses multiple temperature notifications', async () => {
      scheduler.run(({ cold, expectObservable }) => {
        const temperatures = {
          a: 'X61.0,23.8,ZZZZZZ',
          b: 'X62.0,24.8,ZZZZZZ',
          c: 'X63.0,25.8,ZZZZZZ',
        };
        const temperatures$ = cold('a 10s b 10s c', temperatures);
        expectObservable(
          grainfatherNotifications(temperatures$).temperature$,
        ).toBe('a 10s b 10s c', {
          a: {
            type: 'temperature',
            currentTemperature: 23.8,
            targetTemperature: 61.0,
          },
          b: {
            type: 'temperature',
            currentTemperature: 24.8,
            targetTemperature: 62.0,
          },
          c: {
            type: 'temperature',
            currentTemperature: 25.8,
            targetTemperature: 63.0,
          },
        });
      });
    });

    it('skips duplicated temperature notifications', async () => {
      scheduler.run(({ cold, expectObservable }) => {
        const temperatures = {
          a: 'X61.0,23.8,ZZZZZZ',
          c: 'X63.0,25.8,ZZZZZZ',
        };
        const temperatures$ = cold('a 10s a 10s c', temperatures);
        expectObservable(
          grainfatherNotifications(temperatures$).temperature$,
        ).toBe('a 10s - 10s c', {
          a: {
            type: 'temperature',
            currentTemperature: 23.8,
            targetTemperature: 61.0,
          },
          c: {
            type: 'temperature',
            currentTemperature: 25.8,
            targetTemperature: 63.0,
          },
        });
      });
    });

    it('skips duplicated temperature notifications when there are other notifications between', async () => {
      scheduler.run(({ cold, expectObservable }) => {
        const temperatures = {
          a: 'X61.0,23.8,ZZZZZZ',
          b: 'T0,0,0,0,ZZZZZZZZ',
        };
        const temperatures$ = cold('aba', temperatures);
        expectObservable(
          grainfatherNotifications(temperatures$).temperature$,
        ).toBe('a--', {
          a: {
            type: 'temperature',
            currentTemperature: 23.8,
            targetTemperature: 61.0,
          },
        });
      });
    });

    it('throttles the temperatures', async () => {
      scheduler.run(({ cold, expectObservable }) => {
        const notifications = {
          a: 'X61.0,10.0,ZZZZZZ',
          b: 'X61.0,11.0,ZZZZZZ',
          c: 'X61.0,12.0,ZZZZZZ',
        };
        const notification$ = cold('a 500ms b 500ms c', notifications);
        expectObservable(
          grainfatherNotifications(notification$).temperature$,
        ).toBe('a 500ms - 500ms c', {
          a: {
            type: 'temperature',
            targetTemperature: 61,
            currentTemperature: 10,
          },
          c: {
            type: 'temperature',
            targetTemperature: 61,
            currentTemperature: 12,
          },
        });
      });
    });
  });
});
