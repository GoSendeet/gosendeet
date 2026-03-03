/**
 * Form Validation Utilities
 * Centralized validation functions for forms and modals
 */

// Character limits for address fields
export const ADDRESS_LIMITS = {
  STREET_MAX_LENGTH: 200,
  APARTMENT_MAX_LENGTH: 100,
} as const;

/**
 * Validates that a string contains only numbers and optional decimal point
 */
export const validateNumberInput = (value: string): boolean => {
  return /^\d*\.?\d*$/.test(value);
};

/**
 * Validates weight input against maximum weight
 */
export const validateWeight = (
  value: string,
  maxWeight?: number
): { valid: boolean; message?: string } => {
  if (!value.trim()) {
    return { valid: false, message: "Weight is required" };
  }

  const numericValue = parseFloat(value);

  if (isNaN(numericValue) || numericValue <= 0) {
    return { valid: false, message: "Weight must be greater than 0" };
  }

  if (maxWeight && numericValue > maxWeight) {
    return {
      valid: false,
      message: `Weight cannot exceed ${maxWeight}`,
    };
  }

  return { valid: true };
};

/**
 * Validates dimensions input
 */
export const validateDimensions = (
  length: string,
  width: string,
  height: string,
  maxLength?: number,
  maxWidth?: number,
  maxHeight?: number
): { valid: boolean; message?: string } => {
  const l = parseFloat(length);
  const w = parseFloat(width);
  const h = parseFloat(height);

  if (isNaN(l) || isNaN(w) || isNaN(h)) {
    return { valid: false, message: "All dimensions must be valid numbers" };
  }

  if (l <= 0 || w <= 0 || h <= 0) {
    return { valid: false, message: "All dimensions must be greater than 0" };
  }

  if (maxLength && l > maxLength) {
    return { valid: false, message: `Length cannot exceed ${maxLength}` };
  }

  if (maxWidth && w > maxWidth) {
    return { valid: false, message: `Width cannot exceed ${maxWidth}` };
  }

  if (maxHeight && h > maxHeight) {
    return { valid: false, message: `Height cannot exceed ${maxHeight}` };
  }

  return { valid: true };
};

/**
 * Parses dimensions string (e.g., "10 x 20 x 30") into individual values
 */
export const parseDimensionsString = (
  dimString: string
): [string, string, string] => {
  const parts = dimString
    .split(/\s*[×x]\s*/)
    .map((p) => p.trim().replace(/[^\d.]/g, ""));

  if (parts.length >= 3) {
    return [parts[0] || "", parts[1] || "", parts[2] || ""];
  }

  return ["", "", ""];
};

/**
 * Formats dimensions into standard string (e.g., "10 x 20 x 30 cm")
 */
export const formatDimensions = (
  length: string | number,
  width: string | number,
  height: string | number,
  unit: string = "cm"
): string => {
  return `${length} × ${width} × ${height} ${unit}`;
};

/**
 * Validates manual address input
 * Note: apartment is optional and not validated for presence
 */
export const validateManualAddress = (
  street: string,
  apartment?: string,
  city?: string,
  state?: string
): { valid: boolean; message?: string } => {
  if (!street.trim()) {
    return { valid: false, message: "Street address is required" };
  }

  if (street.length > ADDRESS_LIMITS.STREET_MAX_LENGTH) {
    return {
      valid: false,
      message: `Street address cannot exceed ${ADDRESS_LIMITS.STREET_MAX_LENGTH} characters`,
    };
  }

  if (apartment && apartment.length > ADDRESS_LIMITS.APARTMENT_MAX_LENGTH) {
    return {
      valid: false,
      message: `Apartment/House number cannot exceed ${ADDRESS_LIMITS.APARTMENT_MAX_LENGTH} characters`,
    };
  }

  if (!city || !city.trim()) {
    return { valid: false, message: "City is required" };
  }

  if (!state || !state.trim()) {
    return { valid: false, message: "State is required" };
  }

  return { valid: true };
};

/**
 * Validates item price
 */
export const validateItemPrice = (
  value: string
): { valid: boolean; message?: string } => {
  if (!value.trim()) {
    return { valid: false, message: "Item price is required" };
  }

  const numericValue = parseFloat(value);

  if (isNaN(numericValue) || numericValue < 0) {
    return { valid: false, message: "Item price must be a valid number" };
  }

  return { valid: true };
};

/**
 * Safe number input handler for React inputs
 */
export const handleNumberInput = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<string>>
): void => {
  if (validateNumberInput(value)) {
    setter(value);
  }
};
