const actions = {
  GET: '01',
  SET: '00'
}

const commands = {
  POWER: '0130',
  CALIBRATION_PRESET: '0002',
  ASPECT_RATIO: '0020',
  INPUT: '0001',
  GET_STATUS_ERROR: '0101',
  GET_STATUS_POWER: '0102',
  GET_STATUS_LAMP_TIMER: '0113'
}

const inputs = {
  HDMI1: '0002',
  HDMI2: '0003'
}

const aspectRatio = {
  NORMAL: '0001',
  V_STRETCH: '000B',
  ZOOM_1_85: '000C',
  ZOOM_2_35: '000D',
  STRETCH: '000E',
  SQUEEZE: '000F'
}

const powerStatus = {
  STANDBY: '0000',
  START_UP: '0001',
  START_UP_LAMP: '0002',
  POWER_ON: '0003',
  COOLING: '0004',
  COOLING2: '0005'
}

const calibPreset = {
  CINEMA_1: '0000',
  CINEMA_2: '0001',
  REF: '0002',
  TV: '0003',
  PHOTO: '0004',
  GAME: '0005',
  BRT_CINE: '0006',
  BRT_TV: '0007',
  USER: '0008'
}

module.exports = {
  commands,
  inputs,
  calibPreset,
  actions,
  aspectRatio,
  powerStatus
}
