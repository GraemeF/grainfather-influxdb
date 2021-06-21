/* eslint-disable jest/expect-expect */
import { mapTemperaturesToPoints } from '../src/winkbird';
import { TestScheduler } from 'rxjs/testing';
import { map } from 'rxjs/operators';

describe('winkbird', () => {
  let scheduler: TestScheduler;

  beforeEach(async () => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('generates multiple influxdb points', async () => {
    scheduler.run(({ cold, expectObservable }) => {
      const temperatures = { a: 1, b: 2, c: 3 };
      const temperatures$ = cold('abc', temperatures);
      expectObservable(
        mapTemperaturesToPoints(temperatures$).pipe(
          map((x) => x.fields.temperature),
        ),
      ).toBe('abc', {
        b: temperatures.b,
        c: temperatures.c,
        a: temperatures.a,
      });
    });
  });

  it('skips duplicated temperatures', async () => {
    scheduler.run(({ cold, expectObservable }) => {
      const temperatures = { a: 1, b: 1, c: 3 };
      const temperatures$ = cold('abc', temperatures);
      expectObservable(
        mapTemperaturesToPoints(temperatures$).pipe(
          map((x) => x.fields.temperature),
        ),
      ).toBe('a-c', {
        a: temperatures.a,
        c: temperatures.c,
      });
    });
  });
});
