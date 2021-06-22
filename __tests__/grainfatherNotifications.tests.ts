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

  it('parses multiple temperature notifications', async () => {
    scheduler.run(({ cold, expectObservable }) => {
      const temperatures = {
        a: 'X61.0,23.8,ZZZZZZ',
        b: 'X62.0,24.8,ZZZZZZ',
        c: 'X63.0,25.8,ZZZZZZ',
      };
      const temperatures$ = cold('abc', temperatures);
      expectObservable(
        grainfatherNotifications(temperatures$).temperature$,
      ).toBe('abc', {
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
      const temperatures$ = cold('aac', temperatures);
      expectObservable(
        grainfatherNotifications(temperatures$).temperature$,
      ).toBe('a-c', {
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
            timerActive: '0',
            timeLeftMinutes: 0,
            timerTotalStartTime: 0,
            timeLeftSeconds: 0,
          },
        },
      );
    });
  });
});
