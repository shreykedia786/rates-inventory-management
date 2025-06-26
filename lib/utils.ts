/**
 * Utility Functions for Rates & Inventory Management Platform
 * Common helper functions and utilities
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format as dateFnsFormat, parseISO } from 'date-fns';

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency values with proper locale and currency symbol
 */
export function formatCurrency(value: number, currency: string = 'SAR'): string {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats dates in different formats
 */
export function formatDate(date: Date | string, formatType: 'short' | 'medium' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  switch (formatType) {
    case 'short':
      return dateFnsFormat(dateObj, 'MMM d');
    case 'medium':
      return dateFnsFormat(dateObj, 'MMM d, yyyy');
    case 'long':
      return dateFnsFormat(dateObj, 'EEEE, MMMM d, yyyy');
    default:
      return dateFnsFormat(dateObj, 'MMM d');
  }
}

/**
 * Generates an array of dates between start and end dates
 */
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Debounces a function to limit its execution rate
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function to limit its execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone) as any;
  }

  if (obj instanceof Object) {
    const copy = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepClone(obj[key]);
      }
    }
    return copy;
  }

  return obj;
}

/**
 * Calculates percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Validates rate values
 */
export function validateRate(
  value: number,
  min: number = 0,
  max: number = 10000
): { isValid: boolean; error?: string } {
  if (isNaN(value)) {
    return { isValid: false, error: 'Rate must be a number' };
  }

  if (value < min) {
    return { isValid: false, error: `Rate must be at least ${min}` };
  }

  if (value > max) {
    return { isValid: false, error: `Rate cannot exceed ${max}` };
  }

  return { isValid: true };
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
} 