import { map } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { GrainfatherNotificationStreams } from './grainfatherNotifications';

export class InfluxDBWriter {
  readonly influxPoints$: Observable<Point>;

  constructor(streams: GrainfatherNotificationStreams) {
    this.influxPoints$ = merge(
      streams.temperature$.pipe(
        map((update) =>
          new Point('temperature')
            .floatField('temperature', update.currentTemperature)
            .floatField('targetTemperature', update.targetTemperature),
        ),
      ),
      streams.status$.pipe(
        map((update) =>
          new Point('status')
            .floatField('isAutoModeOn', update.autoModeStatus ? 1 : 0)
            .floatField('isHeatPowerOn', update.heatPower ? 1 : 0)
            .floatField(
              'isInteractionModeOn',
              update.interactionModeStatus ? 1 : 0,
            )
            .floatField('isPumpPowerOn', update.pumpStatus ? 1 : 0)
            .floatField('isStageRampOn', update.stageRampStatus ? 1 : 0)
            .floatField(
              'isInteractionModeOn',
              update.interactionModeStatus ? 1 : 0,
            )
            .intField('stageNumber', update.stageNumber),
        ),
      ),
      streams.timer$.pipe(
        map((update) =>
          new Point('timer')
            .floatField('isTimerActive', update.timerActive ? 1 : 0)
            .floatField('timeLeftMinutes', update.timeLeftMinutes)
            .floatField('timeLeftSeconds', update.timeLeftSeconds)
            .floatField('timerTotalStartTime', update.timerTotalStartTime),
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

    this.influxPoints$
      .pipe(
        map((point) =>
          point
            .tag('source', 'grainfather-influxdb')
            .tag('deviceType', 'Grainfather G30')
            .tag('deviceId', 'TODO'),
        ),
      )
      .subscribe((point) => writeApi.writePoint(point));
  }
}
