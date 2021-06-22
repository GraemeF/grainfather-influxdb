import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { isDeepStrictEqual } from 'util';

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

function isGrainfatherNotification(x: {
  type: string;
}): x is GrainfatherNotification {
  return [
    'temperature',
    'status',
    'timer',
    'interaction',
    'misc',
    'config',
  ].includes(x?.type);
}

function parseNotification(notification): GrainfatherNotification | undefined {
  const components = notification.substring(1).split(',').slice(0, -1);
  const type = notification[0];

  switch (type) {
    case 'X':
      return {
        type: 'temperature',
        targetTemperature: Math.min(parseFloat(components[0]), 100),
        currentTemperature: Math.min(parseFloat(components[1]), 100),
      };

    case 'Y':
      return {
        type: 'status',
        heatPower: components[0],
        pumpStatus: components[1],
        autoModeStatus: components[2],
        stageRampStatus: components[3],
        interactionModeStatus: components[4],
        interactionCode: components[5],
        stageNumber: parseInt(components[6], 10),
        delayedHeatMode: components[7],
      };

    case 'T':
      return {
        type: 'timer',
        timerActive: components[0],
        timeLeftMinutes: parseInt(components[1], 10),
        timerTotalStartTime: parseInt(components[2], 10),
        timeLeftSeconds: parseInt(components[3], 10),
      };

    case 'I':
      return {
        type: 'interaction',
        interactionCode: components[0],
      };

    case 'W':
      return {
        type: 'misc',
        heatPowerOutputPercentage: parseInt(components[0], 10),
        isTimerPaused: components[1],
        stepMashMode: components[2],
        isRecipeInterrupted: components[3],
        manualPowerMode: components[4],
        spargeWaterAlertDisplayed: components[5],
      };

    case 'C':
      return {
        type: 'config',
        boilTemperature: parseFloat(components[0]),
      };

    default:
      return undefined;
  }
}

export function grainfatherNotifications(
  notifications: Observable<string>,
): Observable<GrainfatherNotification | undefined> {
  return notifications.pipe(
    map((dataString) => parseNotification(dataString)),
    filter(isGrainfatherNotification),
    distinctUntilChanged(isDeepStrictEqual),
  );
}
