import { WarrantyItem, NotificationSettings } from '../types';

export const INITIAL_WARRANTY_ITEMS: WarrantyItem[] = [
  {
    id: 'w-101',
    productName: 'MacBook Pro 16" M3 Max (64GB RAM, 2TB SSD)',
    merchant: 'Apple Store',
    purchaseDate: '2025-11-15',
    purchasePrice: 3499.00,
    currency: 'USD',
    category: 'Electronics',
    warrantyMonths: 24,
    warrantyExpirationDate: '2027-11-15',
    returnWindowDays: 14,
    returnExpirationDate: '2025-11-29',
    serialNumber: 'C02GX921LND2',
    modelNumber: 'MUW63LL/A',
    receiptImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    storeReturnPolicy: '14-day standard Apple hardware return policy. AppleCare+ extends repair coverage and adds up to two incidents of accidental damage protection every 12 months.',
    lineItems: [
      { id: 'li-1', name: 'MacBook Pro 16" Space Black', quantity: 1, price: 3499.00 },
      { id: 'li-2', name: 'AppleCare+ 3-Year Protection Plan', quantity: 1, price: 399.00 }
    ],
    boundingBoxes: [
      { id: 'b1', field: 'productName', label: 'Product Title', ymin: 12, xmin: 15, ymax: 22, xmax: 85, confidence: 99 },
      { id: 'b2', field: 'merchant', label: 'Store Name', ymin: 4, xmin: 30, ymax: 10, xmax: 70, confidence: 98 },
      { id: 'b3', field: 'purchaseDate', label: 'Purchase Date', ymin: 24, xmin: 15, ymax: 28, xmax: 50, confidence: 97 },
      { id: 'b4', field: 'purchasePrice', label: 'Total Amount', ymin: 78, xmin: 60, ymax: 84, xmax: 90, confidence: 99 },
      { id: 'b5', field: 'serialNumber', label: 'Serial Number', ymin: 30, xmin: 15, ymax: 36, xmax: 65, confidence: 94 }
    ],
    confidenceScores: {
      productName: 99,
      merchant: 98,
      purchaseDate: 97,
      purchasePrice: 99,
      warrantyMonths: 95,
      serialNumber: 94
    },
    rawOcrText: `APPLE STORE #R102
580 FIFTH AVENUE, NEW YORK, NY
DATE: 2025-11-15 14:32:01 EST
SERIAL #: C02GX921LND2
MODEL: MUW63LL/A

ITEMIZED PURCHASES:
1x MACBOOK PRO 16 SB M3 MAX    $3,499.00
1x APPLECARE+ PROTECTION PLAN    $399.00

SUBTOTAL: $3,898.00
TAX (8.875%): $345.95
TOTAL: $4,243.95
PAYMENT METHOD: VISA ENDING IN *8812
APPLE WARRANTY: 24 MONTHS INCLUDED`,
    notes: 'Primary work workstation. Registered with Apple ID.',
    createdAt: '2025-11-15T15:00:00Z',
    updatedAt: '2025-11-15T15:00:00Z'
  },
  {
    id: 'w-102',
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    merchant: 'Best Buy',
    purchaseDate: '2025-08-10',
    purchasePrice: 399.99,
    currency: 'USD',
    category: 'Electronics',
    warrantyMonths: 12,
    warrantyExpirationDate: '2026-08-10', // Expiring very soon relative to Aug 2026!
    returnWindowDays: 15,
    returnExpirationDate: '2025-08-25',
    serialNumber: 'S01-8849201-M',
    modelNumber: 'WH1000XM5/B',
    receiptImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    storeReturnPolicy: 'Standard 15-day Best Buy return window for non-Totaltech members. Receipts required for all warranty claims.',
    lineItems: [
      { id: 'li-3', name: 'Sony WH1000XM5 Black', quantity: 1, price: 399.99 }
    ],
    boundingBoxes: [
      { id: 'b10', field: 'productName', label: 'Item Name', ymin: 15, xmin: 10, ymax: 25, xmax: 90, confidence: 96 },
      { id: 'b11', field: 'merchant', label: 'Store Logo', ymin: 5, xmin: 20, ymax: 12, xmax: 80, confidence: 99 },
      { id: 'b12', field: 'purchasePrice', label: 'Total Paid', ymin: 80, xmin: 65, ymax: 88, xmax: 95, confidence: 98 }
    ],
    confidenceScores: {
      productName: 96,
      merchant: 99,
      purchaseDate: 95,
      purchasePrice: 98,
      warrantyMonths: 91,
      serialNumber: 88
    },
    rawOcrText: `BEST BUY STORE #0492
ORDER # BBY01-892019482
DATE: 2025-08-10

SONY WH1000XM5 ANC HEADPHONES
SKU: 6501021
SERIAL: S01-8849201-M
PRICE: $399.99
TAX: $35.50
TOTAL: $435.49

WARRANTY: 1 YEAR SONY LIMITED WARRANTY`,
    notes: 'Warranty expiring in 2 days! Check right ear cup battery if replacement needed.',
    createdAt: '2025-08-10T12:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'w-103',
    productName: 'LG OLED C3 65" 4K Smart TV',
    merchant: 'Costco Wholesale',
    purchaseDate: '2024-03-20',
    purchasePrice: 1599.99,
    currency: 'USD',
    category: 'Electronics',
    warrantyMonths: 36, // 3 years Costco warranty
    warrantyExpirationDate: '2027-03-20',
    returnWindowDays: 90,
    returnExpirationDate: '2024-06-18',
    serialNumber: '403RMVX0192',
    modelNumber: 'OLED65C3PUA',
    receiptImageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    storeReturnPolicy: '90 days on televisions and electronics. Costco provides 2nd year warranty + 1 year Allstate coverage included.',
    lineItems: [
      { id: 'li-4', name: 'LG 65IN OLED C3 SERIES', quantity: 1, price: 1599.99 }
    ],
    boundingBoxes: [
      { id: 'b20', field: 'productName', label: 'Item Description', ymin: 18, xmin: 12, ymax: 26, xmax: 88, confidence: 97 },
      { id: 'b21', field: 'purchasePrice', label: 'Amount', ymin: 75, xmin: 70, ymax: 82, xmax: 92, confidence: 99 }
    ],
    confidenceScores: {
      productName: 97,
      merchant: 99,
      purchaseDate: 96,
      purchasePrice: 99,
      warrantyMonths: 94,
      serialNumber: 90
    },
    rawOcrText: `COSTCO WHOLESALE #104
MEMBER: 11192830192
DATE: 03/20/2024

ITEM: 981204 LG OLED65C3PUA 65 TV
PRICE: $1599.99
COSTCO 2+1 YR TV WARRANTY INCLUDED

SUBTOTAL: $1599.99
TAX: $142.00
TOTAL: $1741.99`,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: 'w-104',
    productName: 'DeWalt 20V MAX Cordless Drill Combo Kit',
    merchant: 'The Home Depot',
    purchaseDate: '2023-05-10',
    purchasePrice: 229.00,
    currency: 'USD',
    category: 'Tools',
    warrantyMonths: 36,
    warrantyExpirationDate: '2026-05-10', // Expired recently!
    returnWindowDays: 90,
    returnExpirationDate: '2023-08-08',
    serialNumber: 'DW-2023-99104',
    modelNumber: 'DCK280C2',
    receiptImageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    storeReturnPolicy: '90-day Home Depot return window with proof of purchase. 3-Year Limited DeWalt Factory Warranty.',
    lineItems: [
      { id: 'li-5', name: 'DeWalt 20V MAX 2-Tool Kit', quantity: 1, price: 229.00 }
    ],
    boundingBoxes: [
      { id: 'b30', field: 'productName', label: 'Item Name', ymin: 16, xmin: 15, ymax: 24, xmax: 85, confidence: 95 }
    ],
    confidenceScores: {
      productName: 95,
      merchant: 98,
      purchaseDate: 92,
      purchasePrice: 97,
      warrantyMonths: 90,
      serialNumber: 85
    },
    rawOcrText: `THE HOME DEPOT #0912
STORE MGR: JOHN S.
05/10/2023

SKU 1002-991 DEWALT 20V COMBO KIT
$229.00
3 YEAR LIMITED MANUFACTURER WARRANTY`,
    notes: 'Warranty expired in May 2026.',
    createdAt: '2023-05-10T11:00:00Z',
    updatedAt: '2026-05-11T09:00:00Z'
  },
  {
    id: 'w-105',
    productName: 'Dyson V15 Detect Cordless Vacuum',
    merchant: 'Dyson Direct',
    purchaseDate: '2025-01-20',
    purchasePrice: 749.99,
    currency: 'USD',
    category: 'Home & Garden',
    warrantyMonths: 24,
    warrantyExpirationDate: '2027-01-20',
    returnWindowDays: 30,
    returnExpirationDate: '2025-02-19',
    serialNumber: 'VS2-US-NK29104',
    modelNumber: '368340-01',
    receiptImageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    storeReturnPolicy: '30-day money back guarantee from Dyson.com with free return shipping. 2-year warranty covers original defects and battery.',
    lineItems: [
      { id: 'li-6', name: 'Dyson V15 Detect Gold', quantity: 1, price: 749.99 }
    ],
    boundingBoxes: [],
    confidenceScores: {
      productName: 98,
      merchant: 99,
      purchaseDate: 96,
      purchasePrice: 99,
      warrantyMonths: 96
    },
    rawOcrText: `DYSON INC. ORDER # DYS-992102
DATE: JAN 20, 2025
DYSON V15 DETECT CORDLESS VACUUM
TOTAL: $749.99
2 YEAR DYSON GUARANTEE INCLUDED`,
    createdAt: '2025-01-20T14:00:00Z',
    updatedAt: '2025-01-20T14:00:00Z'
  },
  {
    id: 'w-106',
    productName: 'Breville Barista Touch Espresso Machine',
    merchant: 'Williams Sonoma',
    purchaseDate: '2025-12-01',
    purchasePrice: 999.95,
    currency: 'USD',
    category: 'Appliances',
    warrantyMonths: 24,
    warrantyExpirationDate: '2027-12-01',
    returnWindowDays: 30,
    returnExpirationDate: '2025-12-31',
    serialNumber: 'BES880BSS-2025',
    modelNumber: 'BES880BSS',
    receiptImageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    storeReturnPolicy: '30-day Williams Sonoma store return policy with receipt. 2-year Breville manufacturer repair guarantee.',
    lineItems: [
      { id: 'li-7', name: 'Breville Barista Touch Stainless Steel', quantity: 1, price: 999.95 }
    ],
    boundingBoxes: [],
    confidenceScores: {
      productName: 98,
      merchant: 98,
      purchaseDate: 95,
      purchasePrice: 99,
      warrantyMonths: 93
    },
    rawOcrText: `WILLIAMS SONOMA #402
DATE: 12/01/2025
BREVILLE BARISTA TOUCH ESPRESSO
PRICE: $999.95
TAX: $88.75
TOTAL: $1,088.70`,
    createdAt: '2025-12-01T16:00:00Z',
    updatedAt: '2025-12-01T16:00:00Z'
  }
];

export const INITIAL_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  webPushNotifications: true,
  emailAddress: 'arjundevrath001@gmail.com',
  trigger60Days: true,
  trigger30Days: true,
  trigger7Days: true,
  triggerDayOf: true,
  calendarSyncEnabled: true,
  calendarFeedToken: 'vault-sync-9821a0f823'
};

export const SAMPLE_RECEIPT_TEMPLATES = [
  {
    id: 'sample-1',
    name: 'Sonos Arc Soundbar (Best Buy)',
    merchant: 'Best Buy',
    price: 899.00,
    warrantyMonths: 12,
    category: 'Electronics' as const,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    sampleText: `BEST BUY STORE #0312
ORDER # BBY02-99812401
DATE: 2026-03-15
PRODUCT: SONOS ARC PREMIUM SMART SOUNDBAR BLACK
MODEL: ARCG1US1BLK
SERIAL: S-ARC-99120482
PRICE: $899.00
TAX: $79.79
TOTAL: $978.79
1-YEAR SONOS LIMITED WARRANTY INCLUDED
15-DAY BEST BUY RETURN POLICY`
  },
  {
    id: 'sample-2',
    name: 'Weber Genesis Smart Gas Grill',
    merchant: 'Lowe\'s Home Improvement',
    price: 1249.00,
    warrantyMonths: 120, // 10 years
    category: 'Home & Garden' as const,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    sampleText: `LOWES HOME IMPROVEMENT #0841
DATE: 2026-05-02
ITEM: 591202 WEBER GENESIS E-335 GAS GRILL
PRICE: $1,249.00
SERIAL: WBR-G335-88120
10-YEAR WEBER LIMITED WARRANTY ON COOKBOX & BURNERS
90-DAY LOWES RETURN POLICY`
  },
  {
    id: 'sample-3',
    name: 'Samsung Bespoke 4-Door Refrigerator',
    merchant: 'Home Depot',
    price: 2499.00,
    warrantyMonths: 60, // 5 years compressor
    category: 'Appliances' as const,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    sampleText: `THE HOME DEPOT #1024
DATE: 2026-01-10
ITEM: SAMSUNG BESPOKE 29CU FT REFRIGERATOR
MODEL: RF29BB8600QL
SERIAL: SAM-RF29-7710294
PRICE: $2,499.00
5-YEAR SEALED REFRIGERATION SYSTEM WARRANTY
90-DAY HOME DEPOT RETURN WINDOW`
  }
];
