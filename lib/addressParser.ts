/**
 * Address Parser Utility
 * Handles both formats:
 * 1. Simple line-by-line list of addresses
 * 2. Blocks of text with addresses embedded in them
 */

// US State abbreviations and full names for matching
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

// Common street suffixes
const STREET_SUFFIXES = [
  'Street', 'St', 'Avenue', 'Ave', 'Road', 'Rd', 'Boulevard', 'Blvd',
  'Drive', 'Dr', 'Lane', 'Ln', 'Court', 'Ct', 'Circle', 'Cir',
  'Place', 'Pl', 'Square', 'Sq', 'Trail', 'Trl', 'Parkway', 'Pkwy',
  'Commons', 'Highway', 'Hwy', 'Way', 'Plaza', 'Terrace', 'Ter',
  'Loop', 'Path', 'Pike', 'Run', 'Point', 'Pt', 'Crossing', 'Xing'
];

/**
 * Enhanced regex pattern for US addresses
 * Matches patterns like:
 * - 123 Main Street, City, State ZIP
 * - 456 Oak Ave, City State 12345
 * - 789 Pine Rd Suite 100, City, ST
 */
function getAddressPattern(): RegExp {
  const statePattern = US_STATES.join('|');
  const suffixPattern = STREET_SUFFIXES.join('|');

  // Match: [number] [street name] [suffix], [city], [state] [zip]
  // Also handles variations with/without commas
  return new RegExp(
    `\\d+\\s+[A-Za-z0-9\\s]+\\s*(?:${suffixPattern})(?:[,\\s]+|\\s+)[A-Za-z\\s]+[,\\s]+(?:${statePattern})(?:\\s+\\d{5}(?:-\\d{4})?)?`,
    'gi'
  );
}

/**
 * Simple pattern for numbered addresses (more permissive)
 * Matches: number + words + optional comma + words + state/city pattern
 */
function getSimpleAddressPattern(): RegExp {
  return /\d+\s+[A-Za-z0-9\s,.'#-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Circle|Highway|Hwy|Way|Parkway|Pkwy|Plaza)[A-Za-z0-9\s,.'#-]*/gi;
}

/**
 * Check if a line looks like a standalone address
 */
function looksLikeAddress(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 5) return false;

  // Check if it starts with a number
  const startsWithNumber = /^\d+/.test(trimmed);

  // Check if it contains common address patterns
  const hasStreetSuffix = STREET_SUFFIXES.some(suffix =>
    new RegExp(`\\b${suffix}\\b`, 'i').test(trimmed)
  );

  const hasState = US_STATES.some(state =>
    new RegExp(`\\b${state}\\b`, 'i').test(trimmed)
  );

  // A line is likely an address if it:
  // 1. Starts with a number and has a street suffix, OR
  // 2. Has both street suffix and state
  return (startsWithNumber && hasStreetSuffix) || (hasStreetSuffix && hasState);
}

/**
 * Parse addresses from input text
 * Handles both:
 * 1. Simple line-by-line format
 * 2. Blocks of text with embedded addresses
 */
export function parseAddresses(input: string): string[] {
  if (!input || input.trim().length === 0) {
    return [];
  }

  const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Strategy 1: Check if input is a simple list (most common case)
  // If most lines look like addresses, treat it as a list
  const addressLikeLines = lines.filter(looksLikeAddress);
  const isSimpleList = addressLikeLines.length >= lines.length * 0.7; // 70% threshold

  if (isSimpleList) {
    // Return the lines that look like addresses
    return addressLikeLines;
  }

  // Strategy 2: Extract addresses from blocks of text using regex
  const addresses = new Set<string>();

  // Try comprehensive pattern first
  const comprehensiveMatches = input.match(getAddressPattern());
  if (comprehensiveMatches) {
    comprehensiveMatches.forEach(addr => addresses.add(addr.trim()));
  }

  // Try simpler pattern for addresses that might not match the full pattern
  const simpleMatches = input.match(getSimpleAddressPattern());
  if (simpleMatches) {
    simpleMatches.forEach(addr => {
      const trimmed = addr.trim();
      // Only add if it's reasonably long (avoid false positives)
      if (trimmed.length > 10) {
        addresses.add(trimmed);
      }
    });
  }

  // If regex didn't find anything, fall back to line-by-line with lower threshold
  if (addresses.size === 0 && addressLikeLines.length > 0) {
    return addressLikeLines;
  }

  // Remove duplicates and return as array
  return Array.from(addresses);
}

/**
 * Clean and normalize an address
 */
export function normalizeAddress(address: string): string {
  return address
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/,\s*,/g, ',') // Remove duplicate commas
    .replace(/\s*,\s*/g, ', '); // Standardize comma spacing
}
