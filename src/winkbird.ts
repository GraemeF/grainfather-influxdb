import express from 'express';
import { createServer, Server } from 'http';
import { Observable, Subscription } from 'rxjs';
import history from 'connect-history-api-fallback';
import {
  tap,
  map,
  distinctUntilChanged,
  bufferTime,
  distinctUntilKeyChanged,
  timestamp,
} from 'rxjs/operators';
import { Point } from '@influxdata/influxdb-client';
import { grainfatherData } from './source';


export class WinkbirdServer {
  public static readonly PORT: number = 80;
  private readonly _app: express.Application;
  private readonly server: Server;
  private readonly port: string | number;

  constructor() {
    this._app = express();
    this.port = process.env.PORT ?? WinkbirdServer.PORT;
    this.server = createServer(this._app);
    this.listen();


    // const org = process.env.INFLUXDB_ORG;
    // const bucket = process.env.INFLUXDB_BUCKET;
    // const client = new InfluxDB({ url: process.env.INFLUXDB_URL, token: process.env.INFLUXDB_TOKEN });

    const data$ = grainfatherData();

    data$.subscribe(x => console.log(x));
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this._app.use(express.json());
    this._app.use(history());
    this._app.use(express.static(process.env.FRONTEND ?? 'frontend'));
  }

  get app(): express.Application {
    return this._app;
  }
}

export const mapTemperaturesToPoints = (
  temperatures$: Observable<number>,
): Observable<Point> =>
  temperatures$.pipe(
    timestamp(),
    tap(console.log),
    distinctUntilKeyChanged('value'),
    map((t) => ({
      measurement: 'temperature',
      tags: {
        location: 'Kegerator',
        reading: 'air',
        deviceType: 'DS18B20 Digital Temperature Sensors',
        deviceId: '28-011930a41025',
      },
      fields: {
        temperature: t.value,
      },
      timestamp: new Date(t.timestamp),
    })),
    tap(console.log),
  );

export function publishTemperatures(
  temperatures$: Observable<number>,
  publish: (x: Point[]) => void,
): Subscription {
  return mapTemperaturesToPoints(temperatures$)
    .pipe(bufferTime(120000, null, 10))
    .subscribe(publish);
}

function powerFridge(on: boolean) {
  console.log('Turn fridge', on ? 'ON' : 'OFF');
}

export function controlPower(temperatures$: Observable<number>): Subscription {
  return temperatures$
    .pipe(
      map((t) => t >= 3.5),
      distinctUntilChanged(),
    )
    .subscribe(powerFridge);
}
