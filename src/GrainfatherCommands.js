class GrainfatherCommands {
  constructor() {
    this.dismissBoilAdditionAlert = 'A';
    this.cancelTimer = 'C';
    this.decrementTargetTemp = 'D';
    this.cancelOrFinishSession = 'F';
    this.pauseOrResumeTimer = 'G';
    this.toggleHeat = 'H';
    this.interactionComplete = 'I';
    this.turnOffHeat = 'K0';
    this.turnOnHeat = 'K1';
    this.turnOffPump = 'L0';
    this.turnOnPump = 'L1';
    this.getCurrentBoilTemp = 'M';
    this.togglePump = 'P';
    this.disconnectManualModeNoAction = 'Q0';
    this.disconnectAndCancelSession = 'Q1';
    this.disconnectAutoModeNoAction = 'Q2';
    this.pressSet = 'T';
    this.incrementTargetTemp = 'U';
    this.disableSpargeWaterAlert = 'V';
    this.getFirmwareVersion = 'X';
    this.resetController = 'Z';
    this.resetRecipeInterrupted = '!';
    this.turnOffSpargeCounterMode = 'd0';
    this.turnOnSpargeCounterMode = 'd1';
    this.turnOffBoilControlMode = 'e0';
    this.turnOnBoilControlMode = 'e1';
    this.exitManualPowerControlMode = 'f0';
    this.enterManualPowerControlMode = 'f1';
    this.getControllerVoltageAndUnits = 'g';
    this.turnOffSpargeAlertMode = 'h0';
    this.turnOnSpargeAlertMode = 'h1';
  }

  getDismissBoilAdditionAlert() {
    return this.dismissBoilAdditionAlert;
  }

  getCancelTimer() {
    return this.cancelTimer;
  }

  getDecrementTargetTemp() {
    return this.decrementTargetTemp;
  }

  getCancelOrFinishSession() {
    return this.cancelOrFinishSession;
  }

  getPauseOrResumeTimer() {
    return this.pauseOrResumeTimer;
  }

  getToggleHeat() {
    return this.toggleHeat;
  }

  getInteractionComplete() {
    return this.interactionComplete;
  }

  getTurnOffHeat() {
    return this.turnOffHeat;
  }

  getTurnOnHeat() {
    return this.turnOnHeat;
  }

  getTurnOffPump() {
    return this.turnOffPump;
  }

  getTurnOnPump() {
    return this.turnOnPump;
  }

  getGetCurrentBoilTemp() {
    return this.getCurrentBoilTemp;
  }

  getTogglePump() {
    return this.togglePump;
  }

  getDisconnectManualModeNoAction() {
    return this.disconnectManualModeNoAction;
  }

  getDisconnectAndCancelSession() {
    return this.disconnectAndCancelSession;
  }

  getDisconnectAutoModeNoAction() {
    return this.disconnectAutoModeNoAction;
  }

  getPressSet() {
    return this.pressSet;
  }

  getIncrementTargetTemp() {
    return this.incrementTargetTemp;
  }

  getDisableSpargeWaterAlert() {
    return this.disableSpargeWaterAlert;
  }

  getGetFirmwareVersion() {
    return this.getFirmwareVersion;
  }

  getResetController() {
    return this.resetController;
  }

  getResetRecipeInterrupted() {
    return this.resetRecipeInterrupted;
  }

  getTurnOffSpargeCounterMode() {
    return this.turnOffSpargeCounterMode;
  }

  getTurnOnSpargeCounterMode() {
    return this.turnOnSpargeCounterMode;
  }

  getTurnOffBoilControlMode() {
    return this.turnOffBoilControlMode;
  }

  getTurnOnBoilControlMode() {
    return this.turnOnBoilControlMode;
  }

  getExitManualPowerControlMode() {
    return this.exitManualPowerControlMode;
  }

  getEnterManualPowerControlMode() {
    return this.enterManualPowerControlMode;
  }

  getGetControllerVoltageAndUnits() {
    return this.getControllerVoltageAndUnits;
  }

  getTurnOffSpargeAlertMode() {
    return this.turnOffSpargeAlertMode;
  }

  getTurnOnSpargeAlertMode() {
    return this.turnOnSpargeAlertMode;
  }

  getSetDelayedHeatFunction(minutes, seconds) {
    return `B${minutes},${seconds},`;
  }

  getSetLocalBoilTempTo(temperature) {
    return `E${temperature},`;
  }

  getSetBoilTimeTo(minutes) {
    return `J${minutes},`;
  }

  getSkipToStep(
    stepNum,
    canEditTime,
    timeLeftMin,
    timeLeftSec,
    skipRamp,
    disableAddGrain,
  ) {
    return `N${stepNum},${canEditTime},${timeLeftMin},${timeLeftSec},${skipRamp},${disableAddGrain},`;
  }

  getSetNewTimer(minutes) {
    return `S${minutes},`;
  }

  getSetNewTimerWithSeconds(minutes, seconds) {
    return `W${minutes},${seconds},`;
  }

  getSetTargetTempTo(temperature) {
    return `$${temperature},`;
  }

  getEditControllerStoredTempAndTime(stageNum, newTime, newTemperature) {
    return `a${stageNum},${newTime},${newTemperature},`;
  }

  getSetSpargeProgressTo(progress) {
    return `b$${progress},`;
  }

  getSkipToInteraction(code) {
    return `c${code},`;
  }

  getRecipeCommands(
    boilTime,
    mashSteps,
    mashVolume,
    spargeVolume,
    showWaterTreatmentAlert,
    showSpargeCounter,
    showSpargeAlert,
    delayedSession,
    skipStart,
    name,
    hopStandTime,
    boilAdditions,
    boilPowerMode,
    strikeTempMode,
  ) {
    let commands = [];

    commands.push(
      `R${boilTime},${mashSteps.length},${mashVolume},${spargeVolume},`,
    );
    commands.push(
      `${showWaterTreatmentAlert},${showSpargeCounter},${showSpargeAlert},${delayedSession},${skipStart},`,
    );
    commands.push(`${name}`);
    commands.push(
      `${hopStandTime},${
        Object.keys(boilAdditions).length
      },${boilPowerMode},${strikeTempMode},`,
    );

    for (const stop of boilAdditions) {
      commands.push(stop.toString());
    }

    if (strikeTempMode) {
      commands.push('0');
    }

    for (let mashStep of mashSteps) {
      commands.push(`${mashStep[0]}:${mashStep[1]}`);
    }

    return commands;
  }
}

module.exports = { GrainfatherCommands };
