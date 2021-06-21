import Bluetooth from './Bluetooth';
import GrainfatherCommands from './GrainfatherCommands';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';


export function grainfatherData(): any {
  const bluetooth = new Bluetooth();
  const grainfatherCommands = new GrainfatherCommands();

  bluetooth.on('data', (data) => {
    const notification = grainfatherCommands.parseNotification(data.toString());
    console.log(notification);
  });

  const dataEvents = fromEvent(bluetooth, 'data');
  return dataEvents.pipe(map(data => grainfatherCommands.parseNotification(data.toString())));
}
