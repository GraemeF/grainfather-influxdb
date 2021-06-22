import { grainfatherNotifications } from './grainfatherNotifications';
import { fromEvent } from 'rxjs';
import Bluetooth from './Bluetooth';
import { map } from 'rxjs/operators';

const notificationStrings = fromEvent(new Bluetooth(), 'data').pipe(
  map((data) => data.toString()),
);

const notifications = grainfatherNotifications(notificationStrings);

notifications.temperature$.subscribe((x) => console.log(x));
notifications.config$.subscribe((x) => console.log(x));
notifications.misc$.subscribe((x) => console.log(x));
notifications.status$.subscribe((x) => console.log(x));
notifications.timer$.subscribe((x) => console.log(x));
notifications.interaction$.subscribe((x) => console.log(x));
