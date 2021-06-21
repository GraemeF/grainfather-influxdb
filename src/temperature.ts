export function temperatureToString(temperature: number): string {
  return (temperature * 1000).toFixed(0).toString();
}

export function stringToTemperature(s: string): number {
  return parseInt(s) / 1000;
}
