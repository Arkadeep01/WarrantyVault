export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired';

export type ItemCategory = 
  | 'Electronics' 
  | 'Appliances' 
  | 'Home & Garden' 
  | 'Apparel' 
  | 'Tools' 
  | 'Automotive' 
  | 'Office' 
  | 'Fitness'
  | 'Other';

export interface BoundingBox {
  id: string;
  field: string;
  label: string;
  // Normalized 0..100 percentages or 0..1000 coords
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
  confidence: number;
}

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface WarrantyItem {
  id: string;
  productName: string;
  merchant: string;
  merchantLogo?: string;
  purchaseDate: string; // YYYY-MM-DD
  purchasePrice: number;
  currency: string;
  category: ItemCategory;
  
  // Warranty specific
  warrantyMonths: number;
  warrantyExpirationDate: string; // YYYY-MM-DD
  returnWindowDays: number;
  returnExpirationDate: string; // YYYY-MM-DD
  
  // Model & Serial
  serialNumber?: string;
  modelNumber?: string;
  
  // OCR and Document
  receiptImageUrl: string;
  rawOcrText?: string;
  storeReturnPolicy?: string;
  lineItems: LineItem[];
  boundingBoxes: BoundingBox[];
  confidenceScores: Record<string, number>;
  
  // Metadata
  notes?: string;
  claimHistory?: Array<{
    id: string;
    date: string;
    title: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    notes: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  webPushNotifications: boolean;
  emailAddress: string;
  trigger60Days: boolean;
  trigger30Days: boolean;
  trigger7Days: boolean;
  triggerDayOf: boolean;
  calendarSyncEnabled: boolean;
  calendarFeedToken: string;
}

export interface ExtractionResult {
  productTitle: string;
  merchantName: string;
  purchaseDate: string;
  price: number;
  currency: string;
  category: ItemCategory;
  warrantyMonths: number;
  returnWindowDays: number;
  serialNumber?: string;
  modelNumber?: string;
  lineItems: Array<{ name: string; quantity: number; price: number }>;
  storePolicySummary?: string;
  rawOcrText: string;
  confidenceScores: Record<string, number>;
  boundingBoxes: BoundingBox[];
}
