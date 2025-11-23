
import { UnitCategory, UnitDef, UnitSystem } from './types';

// Helper to create unit definitions
const u = (id: string, name: string, abbr: string, system: UnitSystem, factor: number): UnitDef => ({
  id, name, abbr, system, factor
});

export const UNIT_DATA: Record<UnitCategory, UnitDef[]> = {
  [UnitCategory.DISTANCE]: [
    // US
    u('inch', 'Inches', 'in', 'us', 0.0254),
    u('foot', 'Feet', 'ft', 'us', 0.3048),
    u('yard', 'Yards', 'yd', 'us', 0.9144),
    u('mile', 'Miles', 'mi', 'us', 1609.344),
    // Metric
    u('mm', 'Millimeters', 'mm', 'metric', 0.001),
    u('cm', 'Centimeters', 'cm', 'metric', 0.01),
    u('meter', 'Meters', 'm', 'metric', 1),
    u('km', 'Kilometers', 'km', 'metric', 1000),
  ],
  [UnitCategory.WEIGHT]: [
    // US
    u('ounce', 'Ounces', 'oz', 'us', 28.3495),
    u('pound', 'Pounds', 'lb', 'us', 453.592),
    u('stone', 'Stone', 'st', 'us', 6350.29),
    u('ton_us', 'US Tons', 'ton', 'us', 907185),
    // Metric
    u('mg', 'Milligrams', 'mg', 'metric', 0.001),
    u('gram', 'Grams', 'g', 'metric', 1),
    u('kg', 'Kilograms', 'kg', 'metric', 1000),
    u('ton_metric', 'Metric Tons', 't', 'metric', 1000000),
  ],
  [UnitCategory.VOLUME]: [
    // US
    u('tsp', 'Teaspoons', 'tsp', 'us', 4.92892),
    u('tbsp', 'Tablespoons', 'tbsp', 'us', 14.7868),
    u('floz', 'Fluid Ounces', 'fl oz', 'us', 29.5735),
    u('cup', 'Cups', 'cup', 'us', 236.588),
    u('pint', 'Pints', 'pt', 'us', 473.176),
    u('quart', 'Quarts', 'qt', 'us', 946.353),
    u('gallon', 'Gallons', 'gal', 'us', 3785.41),
    // Metric
    u('ml', 'Milliliters', 'ml', 'metric', 1),
    u('cl', 'Centiliters', 'cl', 'metric', 10),
    u('dl', 'Deciliters', 'dl', 'metric', 100),
    u('liter', 'Liters', 'L', 'metric', 1000),
  ],
  [UnitCategory.AREA]: [
    // US
    u('sq_in', 'Square Inches', 'sq in', 'us', 0.00064516),
    u('sq_ft', 'Square Feet', 'sq ft', 'us', 0.092903),
    u('sq_yd', 'Square Yards', 'sq yd', 'us', 0.836127),
    u('acre', 'Acres', 'ac', 'us', 4046.86),
    u('sq_mi', 'Square Miles', 'sq mi', 'us', 2589988),
    // Metric
    u('sq_cm', 'Square Centimeters', 'sq cm', 'metric', 0.0001),
    u('sq_m', 'Square Meters', 'sq m', 'metric', 1),
    u('hectare', 'Hectares', 'ha', 'metric', 10000),
    u('sq_km', 'Square Kilometers', 'sq km', 'metric', 1000000),
  ],
  [UnitCategory.SPEED]: [
    // US
    u('mph', 'Miles per Hour', 'mph', 'us', 0.44704),
    u('fps', 'Feet per Second', 'ft/s', 'us', 0.3048),
    // Metric
    u('kmh', 'Kilometers per Hour', 'km/h', 'metric', 0.277778),
    u('ms', 'Meters per Second', 'm/s', 'metric', 1),
  ],
  [UnitCategory.TEMPERATURE]: [
    // US
    u('fahrenheit', 'Fahrenheit', '°F', 'us', 1), 
    // Metric
    u('celsius', 'Celsius', '°C', 'metric', 1),
  ]
};

export const CATEGORIES = Object.values(UnitCategory);

// Smart defaults for conversions
export const RECOMMENDED_MAPPINGS: Record<string, string> = {
  // Distance
  'inch': 'cm', 
  'foot': 'meter', 
  'yard': 'meter', 
  'mile': 'km',
  'mm': 'inch', 
  'cm': 'inch', 
  'meter': 'foot', 
  'km': 'mile',

  // Weight
  'ounce': 'gram', 
  'pound': 'kg', 
  'stone': 'kg', 
  'ton_us': 'ton_metric',
  'mg': 'ounce', 
  'gram': 'ounce', 
  'kg': 'pound', 
  'ton_metric': 'ton_us',

  // Volume
  'tsp': 'ml', 
  'tbsp': 'ml', 
  'floz': 'ml', 
  'cup': 'ml', 
  'pint': 'liter', 
  'quart': 'liter', 
  'gallon': 'liter',
  'ml': 'floz', 
  'cl': 'floz', 
  'dl': 'cup', 
  'liter': 'gallon',

  // Area
  'sq_in': 'sq_cm',
  'sq_ft': 'sq_m',
  'sq_yd': 'sq_m',
  'acre': 'hectare',
  'sq_mi': 'sq_km',
  'sq_cm': 'sq_in',
  'sq_m': 'sq_ft',
  'hectare': 'acre',
  'sq_km': 'sq_mi',

  // Speed
  'mph': 'kmh', 
  'fps': 'ms',
  'kmh': 'mph', 
  'ms': 'fps',

  // Temp
  'fahrenheit': 'celsius', 
  'celsius': 'fahrenheit'
};

// Helper to filter units by system
export const getUnitsBySystem = (category: UnitCategory, system: UnitSystem) => {
  return UNIT_DATA[category].filter(u => u.system === system);
};

// Logic to convert values
export const convertValue = (val: number, from: UnitDef, to: UnitDef, category: UnitCategory): number => {
  if (category === UnitCategory.TEMPERATURE) {
    if (from.id === 'fahrenheit' && to.id === 'celsius') {
      return (val - 32) * (5 / 9);
    }
    if (from.id === 'celsius' && to.id === 'fahrenheit') {
      return (val * (9 / 5)) + 32;
    }
    return val; 
  }

  // Standard Linear Conversion
  const baseValue = val * from.factor;
  return baseValue / to.factor;
};
