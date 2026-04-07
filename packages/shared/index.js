export const NOISE_LEVELS = {
  QUIET: 'quiet',
  MODERATE: 'moderate',
  COLLABORATIVE: 'collaborative'
};

export const AMENITIES = {
  OUTLETS: 'outlets',
  WHITEBOARD: 'whiteboard',
  PRINTER: 'printer',
  NATURAL_LIGHT: 'natural_light',
  LOCKERS: 'lockers',
  COMPUTERS: 'computers',
  PROJECTOR: 'projector'
};

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};

export const OCCUPANCY_STATUS = {
  AVAILABLE: { label: 'Available', min: 0, max: 30 },
  MODERATE: { label: 'Moderate', min: 31, max: 60 },
  BUSY: { label: 'Busy', min: 61, max: 85 },
  FULL: { label: 'Full', min: 86, max: 100 }
};

export const DATA_SOURCES = {
  WIFI: 'wifi',
  CHECKIN: 'checkin',
  SIMULATED: 'simulated'
};

export const TENANT_SLUGS = {
  UMASS: 'umass',
  DEMO: 'demo'
};

export const SPACE_TYPES = {
  OPEN_AREA: 'open_area',
  GROUP_ROOM: 'group_room',
  INDIVIDUAL: 'individual',
  COMPUTER_LAB: 'computer_lab'
};

export function getOccupancyStatus(percentage) {
  if (percentage === null || percentage === undefined) return null;
  for (const status of Object.values(OCCUPANCY_STATUS)) {
    if (percentage >= status.min && percentage <= status.max) {
      return status;
    }
  }
  return null;
}
