import Bluetooth from './Bluetooth';
import GrainfatherCommands from './GrainfatherCommands';
import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface GrainfatherTemperatureNotification {
  type: 'temperature';
  targetTemperature: number;
  currentTemperature: number;
}

interface GrainfatherStatusNotification {
  type: 'status';
  heatPower: string;
  pumpStatus: string;
  autoModeStatus: string;
  stageRampStatus: string;
  interactionModeStatus: string;
  interactionCode: string;
  stageNumber: number;
  delayedHeatMode: string;
}

interface GrainfatherTimerNotification {
  type: 'timer';
  timerActive: string;
  timeLeftMinutes: number;
  timerTotalStartTime: number;
  timeLeftSeconds: number;
}

interface GrainfatherInteractionNotification {
  type: 'interaction';
  interactionCode: string;
}

interface GrainfatherMiscNotification {
  type: 'misc';
  heatPowerOutputPercentage: number;
  isTimerPaused: string;
  stepMashMode: string;
  isRecipeInterrupted: string;
  manualPowerMode: string;
  spargeWaterAlertDisplayed: string;
}

interface GrainfatherConfigNotification {
  type: 'config';
  boilTemperature: number;
}

type GrainfatherNotification =
  | GrainfatherTemperatureNotification
  | GrainfatherStatusNotification
  | GrainfatherTimerNotification
  | GrainfatherInteractionNotification
  | GrainfatherMiscNotification
  | GrainfatherConfigNotification;

export function grainfatherData(): Observable<GrainfatherNotification | undefined> {
  const grainfatherCommands = new GrainfatherCommands();

  return fromEvent(new Bluetooth(), 'data').pipe(
    map((data) => data.toString()),
    map((dataString) => grainfatherCommands.parseNotification(dataString)),
    filter(isGrainfatherNotification),
  );
}

function isGrainfatherNotification(x: { type: string }): x is GrainfatherNotification {
  return ['temperature', 'status', 'timer', 'interaction', 'misc', 'config'].includes(x?.type);
}

grainfatherData().subscribe((x) => console.log(x));
