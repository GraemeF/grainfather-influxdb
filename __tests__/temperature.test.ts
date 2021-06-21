import { stringToTemperature, temperatureToString } from '../src/temperature';

describe('temperatureToString', () => {
  it('converts temperature to a string', async () => {
    expect(temperatureToString(23.068)).toStrictEqual('23068');
  });
});

describe('stringToTemperature', () => {
  it('converts string to temperature', async () => {
    expect(stringToTemperature('23068')).toStrictEqual(23.068);
  });
});
