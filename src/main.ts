import {
  GrainfatherNotification,
  grainfatherNotifications,
} from './grainfatherNotifications';
import { fromEvent } from 'rxjs';
import Bluetooth from './Bluetooth';
import { map } from 'rxjs/operators';

const notificationStrings = fromEvent(new Bluetooth(), 'data').pipe(
  map((data) => data.toString()),
);

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
