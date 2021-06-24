import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

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

export type GrainfatherNotification =
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

function isTemperatureNotification(x: {
  type: string;
}): x is GrainfatherTemperatureNotification {
  return ['temperature'].includes(x?.type);
}

function isStatusNotification(x: {
  type: string;
}): x is GrainfatherStatusNotification {
  return ['status'].includes(x?.type);
}

function isTimerNotification(x: {
  type: string;
}): x is GrainfatherTimerNotification {
  return ['timer'].includes(x?.type);
}

function isInteractionNotification(x: {
  type: string;
}): x is GrainfatherInteractionNotification {
  return ['interaction'].includes(x?.type);
}

function isMiscNotification(x: {
  type: string;
}): x is GrainfatherMiscNotification {
  return ['misc'].includes(x?.type);
}

function isConfigNotification(x: {
  type: string;
}): x is GrainfatherConfigNotification {
  return ['config'].includes(x?.type);
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

export function grainfatherNotifications(notifications: Observable<string>): {
  temperature$: Observable<GrainfatherTemperatureNotification>;
  status$: Observable<GrainfatherStatusNotification>;
  timer$: Observable<GrainfatherTimerNotification>;
  interaction$: Observable<GrainfatherInteractionNotification>;
  misc$: Observable<GrainfatherMiscNotification>;
  config$: Observable<GrainfatherConfigNotification>;
} {
  const parsed$ = notifications.pipe(
    map((dataString) => parseNotification(dataString)),
    filter(isGrainfatherNotification),
  );

  return {
    temperature$: parsed$.pipe(
      filter(isTemperatureNotification),
      distinctUntilChanged(
        (a, b) =>
          a.targetTemperature === b.targetTemperature &&
          a.currentTemperature === b.currentTemperature &&
          a.type === b.type,
      ),
    ),
    status$: parsed$.pipe(
      filter(isStatusNotification),
      distinctUntilChanged(
        (a, b) =>
          a.autoModeStatus === b.autoModeStatus &&
          a.delayedHeatMode === b.delayedHeatMode &&
          a.heatPower === b.heatPower &&
          a.interactionCode === b.interactionCode &&
          a.interactionModeStatus === b.interactionModeStatus &&
          a.pumpStatus === b.pumpStatus &&
          a.stageNumber === b.stageNumber &&
          a.stageRampStatus === b.stageRampStatus &&
          a.type === b.type,
      ),
    ),
    timer$: parsed$.pipe(
      filter(isTimerNotification),
      distinctUntilChanged(
        (a, b) =>
          a.timerTotalStartTime === b.timerTotalStartTime &&
          a.timerActive === b.timerActive &&
          a.timeLeftMinutes === b.timeLeftMinutes &&
          a.type === b.type,
      ),
    ),
    interaction$: parsed$.pipe(
      filter(isInteractionNotification),
      distinctUntilChanged(
        (a, b) => a.interactionCode === b.interactionCode && a.type === b.type,
      ),
    ),
    misc$: parsed$.pipe(
      filter(isMiscNotification),
      distinctUntilChanged(
        (a, b) =>
          a.heatPowerOutputPercentage === b.heatPowerOutputPercentage &&
          a.isRecipeInterrupted === b.isRecipeInterrupted &&
          a.isTimerPaused === b.isTimerPaused &&
          a.manualPowerMode === b.manualPowerMode &&
          a.spargeWaterAlertDisplayed === b.spargeWaterAlertDisplayed &&
          a.stepMashMode === b.stepMashMode &&
          a.type === b.type,
      ),
    ),
    config$: parsed$.pipe(
      filter(isConfigNotification),
      distinctUntilChanged(
        (a, b) => a.boilTemperature === b.boilTemperature && a.type === b.type,
      ),
    ),
  };
}
