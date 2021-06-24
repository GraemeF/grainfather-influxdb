import {
  GrainfatherNotification,
  grainfatherNotifications,
} from './grainfatherNotifications';
import { fromEvent, Observable } from 'rxjs';
import Bluetooth from './Bluetooth';
import { map } from 'rxjs/operators';
import { InfluxDBWriter } from './InfluxDBWriter';

const notificationStrings: Observable<string> = fromEvent(
  new Bluetooth(),
  'data',
).pipe(map((data) => data.toString()));

const notifications = grainfatherNotifications(notificationStrings);

function log(x: GrainfatherNotification) {
  console.log(x.type, JSON.stringify(x));
}

notifications.temperature$.subscribe(log);
notifications.config$.subscribe(log);
notifications.misc$.subscribe(log);
notifications.status$.subscribe(log);
notifications.timer$.subscribe(log);
notifications.interaction$.subscribe(log);

const influxUrl = process.env['INFLUXDB_URL'];
if (influxUrl) {
  console.log(`Sending points to ${influxUrl}`);
  const writer = new InfluxDBWriter(notifications);
  writer.subscribe({
    url: influxUrl!,
    token: process.env['INFLUXDB_TOKEN']!,
    bucket: process.env['INFLUXDB_BUCKET']!,
    org: process.env['INFLUXDB_ORG']!,
  });
}
