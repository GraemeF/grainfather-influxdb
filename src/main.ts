import { grainfatherNotifications } from './grainfatherNotifications';
import { fromEvent } from 'rxjs';
import Bluetooth from './Bluetooth';
import { map } from 'rxjs/operators';

const notificationStrings = fromEvent(new Bluetooth(), 'data').pipe(
  map((data) => data.toString()),
);

grainfatherNotifications(notificationStrings).subscribe((x) => console.log(x));
