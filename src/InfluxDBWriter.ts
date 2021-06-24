import { map } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { GrainfatherNotificationStreams } from './grainfatherNotifications';

export class InfluxDBWriter {
  readonly influxPoints$: Observable<Point>;

  constructor(streams: GrainfatherNotificationStreams) {
    this.influxPoints$ = merge(
      streams.temperature$.pipe(
        map((temperatureUpdate) =>
          new Point('temperature')
            .floatField('temperature', temperatureUpdate.currentTemperature)
            .floatField(
              'targetTemperature',
              temperatureUpdate.targetTemperature,
            )
            .tag('source', 'grainfather-influxdb')
            .tag('deviceType', 'Grainfather G30')
            .tag('deviceId', 'TODO'),
        ),
      ),
    );
  }

  public subscribe({
    url,
    token,
    org,
    bucket,
  }: {
    url: string;
    org: string;
    bucket: string;
    token: string;
  }): void {
    const client = new InfluxDB({ url, token });
    const writeApi = client.getWriteApi(org, bucket);

    this.influxPoints$.subscribe((point) => writeApi.writePoint(point));
  }
}
