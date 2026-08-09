import { WarrantyItem, WarrantyStatus } from '../types';

export function calculateDaysRemaining(targetDateStr: string): number {
  if (!targetDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getWarrantyStatus(expirationDateStr: string): WarrantyStatus {
  const daysLeft = calculateDaysRemaining(expirationDateStr);
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 30) return 'expiring_soon';
  return 'active';
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function calculateExpirationDate(startDateStr: string, months: number): string {
  if (!startDateStr || isNaN(months)) return startDateStr;
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return startDateStr;
  
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

export function getWarrantyProgressPercentage(purchaseDateStr: string, expirationDateStr: string): {
  consumedPercent: number;
  remainingDays: number;
  totalDays: number;
} {
  const purchase = new Date(purchaseDateStr).getTime();
  const expiration = new Date(expirationDateStr).getTime();
  const now = new Date().getTime();
  
  const totalDuration = Math.max(1, expiration - purchase);
  const consumedDuration = Math.max(0, now - purchase);
  
  let percent = Math.min(100, Math.max(0, (consumedDuration / totalDuration) * 100));
  const remainingDays = calculateDaysRemaining(expirationDateStr);
  const totalDays = Math.round(totalDuration / (1000 * 60 * 60 * 24));

  return {
    consumedPercent: Math.round(percent),
    remainingDays,
    totalDays
  };
}
