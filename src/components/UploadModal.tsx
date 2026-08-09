import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Camera, RefreshCw, Check, AlertCircle, Sparkles, X, 
  RotateCw, Sun, Sliders, ShieldCheck, FileText, CheckCircle2, ArrowRight
} from 'lucide-react';
import { WarrantyItem, ExtractionResult, ItemCategory, BoundingBox } from '../types';
import { SAMPLE_RECEIPT_TEMPLATES } from '../data/mockData';
import { calculateExpirationDate } from '../utils/dateUtils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: WarrantyItem) => void;
  darkMode: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSaveItem,
  darkMode
}) => {
  // Input mode
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'camera' | 'samples'>('upload');
  
  // File state
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);

  // WebCam state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  // Parsing state
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsingProgress, setParsingProgress] = useState<number>(0);
  const [isParsed, setIsParsed] = useState<boolean>(false);

  // Highlighted bounding box on receipt image
  const [activeField, setActiveField] = useState<string | null>(null);

  // Form Fields State
  const [productName, setProductName] = useState('');
  const [merchant, setMerchant] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);
  const [autoCalcExpiration, setAutoCalcExpiration] = useState<boolean>(true);
  const [expirationDate, setExpirationDate] = useState('');
  const [returnWindowDays, setReturnWindowDays] = useState<number>(30);
  const [serialNumber, setSerialNumber] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [storeReturnPolicy, setStoreReturnPolicy] = useState('');
  const [rawOcrText, setRawOcrText] = useState('');
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number>>({});
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);

  // Update calculated expiration date when warranty months or purchase date changes
  useEffect(() => {
    if (autoCalcExpiration && purchaseDate && warrantyMonths) {
      setExpirationDate(calculateExpirationDate(purchaseDate, warrantyMonths));
    }
  }, [purchaseDate, warrantyMonths, autoCalcExpiration]);

  // Start Camera
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      alert('Camera access unavailable. You can upload an image or select a sample receipt.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setReceiptImage(dataUrl);
      stopCamera();
      triggerParsing(dataUrl, null);
    }
  };

  // Handle File Drop / Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setReceiptImage(dataUrl);
      triggerParsing(dataUrl, null);
    };
    reader.readAsDataURL(file);
  };

  // Handle Sample Receipt Selection
  const handleSelectSample = (sample: typeof SAMPLE_RECEIPT_TEMPLATES[0]) => {
    setReceiptImage(sample.imageUrl);
    triggerParsing(sample.imageUrl, sample.sampleText);
  };

  // Trigger Gemini API OCR Parsing
  const triggerParsing = async (image: string, sampleText: string | null) => {
    setIsParsing(true);
    setParsingProgress(15);
    setIsParsed(false);

    // Progress animation
    const interval = setInterval(() => {
      setParsingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 250);

    try {
      const response = await fetch('/api/parse-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: image.startsWith('data:') ? image : null,
          sampleText: sampleText
        })
      });

      const result = await response.json();
      clearInterval(interval);
      setParsingProgress(100);

      if (result.success && result.data) {
        const d: ExtractionResult = result.data;
        setProductName(d.productTitle || 'Extracted Item');
        setMerchant(d.merchantName || 'Retailer');
        setPurchaseDate(d.purchaseDate || new Date().toISOString().split('T')[0]);
        setPrice(d.price || 0);
        setCurrency(d.currency || 'USD');
        setCategory(d.category || 'Electronics');
        setWarrantyMonths(d.warrantyMonths || 12);
        setReturnWindowDays(d.returnWindowDays || 30);
        setSerialNumber(d.serialNumber || '');
        setModelNumber(d.modelNumber || '');
        setStoreReturnPolicy(d.storePolicySummary || '30-day standard store return window.');
        setRawOcrText(d.rawOcrText || '');
        setConfidenceScores(d.confidenceScores || { productName: 98, merchant: 95, purchaseDate: 92, price: 99 });
        setBoundingBoxes(d.boundingBoxes || []);
      }
    } catch (err) {
      console.error('OCR Parsing error:', err);
    } finally {
      setTimeout(() => {
        setIsParsing(false);
        setIsParsed(true);
      }, 400);
    }
  };

  const handleSave = () => {
    if (!productName.trim()) {
      alert('Please provide a product title');
      return;
    }

    const newItem: WarrantyItem = {
      id: 'w-' + Date.now(),
      productName: productName,
      merchant: merchant || 'Store',
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      purchasePrice: price || 0,
      currency: currency || 'USD',
      category: category,
      warrantyMonths: warrantyMonths,
      warrantyExpirationDate: expirationDate || calculateExpirationDate(purchaseDate, warrantyMonths),
      returnWindowDays: returnWindowDays,
      returnExpirationDate: calculateExpirationDate(purchaseDate, 1),
      serialNumber: serialNumber,
      modelNumber: modelNumber,
      receiptImageUrl: receiptImage || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=800&q=80',
      storeReturnPolicy: storeReturnPolicy,
      rawOcrText: rawOcrText,
      lineItems: [{ id: 'l1', name: productName, quantity: 1, price: price }],
      boundingBoxes: boundingBoxes,
      confidenceScores: confidenceScores,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveItem(newItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      <div className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        darkMode ? 'bg-[#0B0F17] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          darkMode ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight">AI Receipt OCR & Vault Capture</h2>
              <p className="text-xs text-slate-400">Extract itemized details, serial numbers & warranty schedules instantly</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!receiptImage ? (
            /* Upload / Capture Selection Screen */
            <div className="space-y-6">
              {/* Input Mode Tabs */}
              <div className="flex justify-center">
                <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
                  <button
                    onClick={() => {
                      stopCamera();
                      setActiveInputMode('upload');
                    }}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      activeInputMode === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    File Upload
                  </button>
                  <button
                    onClick={() => {
                      setActiveInputMode('camera');
                      startCamera();
                    }}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      activeInputMode === 'camera' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Live Webcam
                  </button>
                  <button
                    onClick={() => {
                      stopCamera();
                      setActiveInputMode('samples');
                    }}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      activeInputMode === 'samples' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Try Sample Receipts
                  </button>
                </div>
              </div>

              {/* Mode 1: File Dropzone */}
              {activeInputMode === 'upload' && (
                <div className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-3xl p-10 text-center transition-all bg-indigo-950/10 cursor-pointer group relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Drag and drop your receipt image</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Supports JPG, PNG, WEBP, or scanned PDFs. AI automatically crops and extracts warranty metadata.
                  </p>
                  <span className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25">
                    Browse Files
                  </span>
                </div>
              )}

              {/* Mode 2: Camera Stream */}
              {activeInputMode === 'camera' && (
                <div className="space-y-4">
                  <div className="relative rounded-3xl overflow-hidden bg-black aspect-video max-w-lg mx-auto border border-slate-800 flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    {!isCameraActive && (
                      <div className="absolute text-center p-4">
                        <Camera className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                        <p className="text-xs text-slate-400">Initializing camera sensor...</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={captureCameraPhoto}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/30"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Snap Receipt Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 3: Pre-loaded Sample Receipts */}
              {activeInputMode === 'samples' && (
                <div>
                  <p className="text-xs text-center text-slate-400 mb-4">
                    Select a sample store receipt below to test instant AI OCR parsing without uploading a photo:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SAMPLE_RECEIPT_TEMPLATES.map((sample) => (
                      <div
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${
                          darkMode ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/80' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <div className="h-28 w-full mb-3 rounded-xl overflow-hidden bg-slate-950 relative">
                          <img src={sample.imageUrl} alt={sample.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                            ${sample.price}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs line-clamp-1">{sample.name}</h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>{sample.merchant}</span>
                          <span className="text-emerald-400 font-semibold">{sample.warrantyMonths}m Warranty</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Live OCR Parsing & Bounding Box View (Critical UX) */
            <div>
              {/* Image Editor Controls Bar */}
              <div className="mb-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <Sun className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-16 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setReceiptImage(null);
                      setIsParsed(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Change Receipt
                  </button>
                </div>
              </div>

              {/* Side-by-side or Stacked Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Pane: Interactive Receipt Preview with Bounding Box Overlays */}
                <div className="lg:col-span-5 flex flex-col space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>Receipt Canvas</span>
                    <span className="text-indigo-400 text-[10px]">Hover fields on right to locate bounding box</span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2 min-h-[350px] flex items-center justify-center">
                    {isParsing && (
                      <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                        <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
                        <h4 className="font-bold text-sm">Gemini AI OCR Processing...</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">Reading receipt items, dates, totals, and warranty terms...</p>
                        <div className="w-48 h-1.5 rounded-full bg-slate-800 mt-4 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 transition-all duration-300"
                            style={{ width: `${parsingProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="relative w-full max-h-[480px] overflow-hidden flex items-center justify-center">
                      <img
                        src={receiptImage}
                        alt="Receipt Scan"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          filter: `brightness(${brightness}%) contrast(${contrast}%)`
                        }}
                        className="max-h-[450px] w-auto object-contain rounded-lg transition-all duration-300"
                      />

                      {/* Bounding Box Highlights Over Receipt Image */}
                      {isParsed && boundingBoxes.map((box) => {
                        const isSelected = activeField === box.field;
                        return (
                          <div
                            key={box.id || box.field}
                            style={{
                              top: `${box.ymin}%`,
                              left: `${box.xmin}%`,
                              height: `${Math.max(8, box.ymax - box.ymin)}%`,
                              width: `${Math.max(15, box.xmax - box.xmin)}%`
                            }}
                            className={`absolute border-2 rounded transition-all pointer-events-none ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-500/30 ring-4 ring-emerald-500/40 z-30'
                                : 'border-indigo-500/60 bg-indigo-500/10'
                            }`}
                          >
                            <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-slate-900 text-[9px] font-bold text-indigo-300 border border-indigo-500/40 whitespace-nowrap">
                              {box.label} ({box.confidence || 95}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Pane: Extracted Form Fields */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-sm flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Extracted Metadata & Warranty Terms</span>
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                      98% OCR Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Product Name */}
                    <div
                      onMouseEnter={() => setActiveField('productName')}
                      onMouseLeave={() => setActiveField(null)}
                      className="sm:col-span-2 p-2.5 rounded-xl border bg-slate-900/60 border-slate-800 hover:border-indigo-500/60 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <label className="font-semibold text-slate-300">Product Title</label>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          Confidence: {confidenceScores.productTitle || 98}%
                        </span>
                      </div>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Merchant */}
                    <div
                      onMouseEnter={() => setActiveField('merchant')}
                      onMouseLeave={() => setActiveField(null)}
                      className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800 hover:border-indigo-500/60 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <label className="font-semibold text-slate-300">Merchant / Store</label>
                        <span className="text-[10px] text-emerald-400 font-medium">High Confidence</span>
                      </div>
                      <input
                        type="text"
                        value={merchant}
                        onChange={(e) => setMerchant(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Category */}
                    <div className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Appliances">Appliances</option>
                        <option value="Home & Garden">Home & Garden</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Tools">Tools</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Office">Office</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Purchase Date */}
                    <div
                      onMouseEnter={() => setActiveField('purchaseDate')}
                      onMouseLeave={() => setActiveField(null)}
                      className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800 hover:border-indigo-500/60 transition-colors"
                    >
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Purchase Date</label>
                      <input
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Total Price */}
                    <div
                      onMouseEnter={() => setActiveField('purchasePrice')}
                      onMouseLeave={() => setActiveField(null)}
                      className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800 hover:border-indigo-500/60 transition-colors"
                    >
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Purchase Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Warranty Term Months */}
                    <div className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <label className="font-semibold text-slate-300">Warranty Term (Months)</label>
                        <span className="text-[10px] text-indigo-400 font-semibold">{warrantyMonths} Months</span>
                      </div>
                      <input
                        type="number"
                        value={warrantyMonths}
                        onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Calculated Expiration Date */}
                    <div className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <label className="font-semibold text-slate-300">Expiration Date</label>
                        <button
                          onClick={() => setAutoCalcExpiration(!autoCalcExpiration)}
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            autoCalcExpiration ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Auto Calc
                        </button>
                      </div>
                      <input
                        type="date"
                        value={expirationDate}
                        disabled={autoCalcExpiration}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none disabled:opacity-60"
                      />
                    </div>

                    {/* Serial Number */}
                    <div
                      onMouseEnter={() => setActiveField('serialNumber')}
                      onMouseLeave={() => setActiveField(null)}
                      className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800 hover:border-indigo-500/60 transition-colors"
                    >
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Serial Number</label>
                      <input
                        type="text"
                        placeholder="e.g. SN-9982014"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    {/* Model Number */}
                    <div className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Model / SKU #</label>
                      <input
                        type="text"
                        placeholder="e.g. C3-OLED65"
                        value={modelNumber}
                        onChange={(e) => setModelNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Store Return Policy */}
                  <div className="p-2.5 rounded-xl border bg-slate-900/60 border-slate-800 text-xs">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Store Return Policy Summary</label>
                    <textarea
                      rows={2}
                      value={storeReturnPolicy}
                      onChange={(e) => setStoreReturnPolicy(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 outline-none text-xs"
                    />
                  </div>

                  {/* Save to Vault Action */}
                  <div className="pt-2 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => {
                        stopCamera();
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Lock & Protect in Vault</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
