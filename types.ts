

export enum UnitCategory {
  DISTANCE = 'Distance',
  WEIGHT = 'Weight',
  VOLUME = 'Volume',
  SPEED = 'Speed',
  TEMPERATURE = 'Temperature',
  AREA = 'Area'
}

export type UnitSystem = 'us' | 'metric';

export interface UnitDef {
  id: string;
  name: string;
  abbr: string;
  system: UnitSystem;
  factor: number; // Multiplier to convert TO the base unit of the category (e.g. meters)
}

export interface AIContextResponse {
  examples: string[];
  funFact: string;
}

export interface MeasurementLookupResponse {
  category: UnitCategory;
  value: number;
  fromUnitId: string;
  toUnitId: string;
  confidence: number;
  explanation: string; // Reasoning behind the estimated value
}

export interface ConversionState {
  category: UnitCategory;
  direction: 'us-to-metric' | 'metric-to-us';
  fromUnit: string;
  toUnit: string;
  value: number | '';
}