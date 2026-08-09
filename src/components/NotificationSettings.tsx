import React, { useState } from 'react';
import { 
  BellRing, Calendar, Mail, Smartphone, Check, Sparkles, Download, Copy, RefreshCw, Send, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { NotificationSettings, WarrantyItem } from '../types';

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  items: WarrantyItem[];
  darkMode: boolean;
}

export const NotificationSettingsView: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdateSettings,
  items,
  darkMode
}) => {
  const [copiedFeed, setCopiedFeed] = useState<boolean>(false);
  const [testAlertSent, setTestAlertSent] = useState<boolean>(false);

  const calendarFeedUrl = `${window.location.origin}/api/calendar/feed/${settings.calendarFeedToken}.ics`;

  const copyCalendarUrl = () => {
    navigator.clipboard.writeText(calendarFeedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2000);
  };

  const downloadIcsFile = async () => {
    try {
      const response = await fetch('/api/calendar/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'warranty-vault-calendar.ics';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading iCal:', err);
      alert('Failed to export calendar file.');
    }
  };

  const triggerTestAlert = () => {
    setTestAlertSent(true);
    setTimeout(() => setTestAlertSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6">
      {/* Toast Notification Simulation */}
      {testAlertSent && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 text-amber-100" />
            <div>
              <h4 className="font-bold text-sm">⚠️ Simulated Test Expiration Alert</h4>
              <p className="text-xs text-amber-100">
                "Sony WH-1000XM5 Headphones" warranty expires in 2 days! Claim package ready.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-lg">
            Delivered to {settings.emailAddress}
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Alert & Calendar Sync Configuration</h2>
            <p className="text-xs text-slate-400">Never miss a warranty expiration deadline or store return window</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Trigger Schedules */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="font-bold text-sm border-b pb-2 border-slate-800 flex items-center justify-between">
            <span>Alert Schedule Triggers</span>
            <span className="text-xs text-indigo-400 font-normal">Automated Lifecycle Triggers</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* 60 Days */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <div className="font-semibold text-slate-200">60 Days Before Expiration</div>
                <div className="text-[11px] text-slate-400">Early warning for high-value appliances & electronics</div>
              </div>
              <input
                type="checkbox"
                checked={settings.trigger60Days}
                onChange={(e) => onUpdateSettings({ ...settings, trigger60Days: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            {/* 30 Days */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <div className="font-semibold text-slate-200">30 Days Before Expiration</div>
                <div className="text-[11px] text-amber-400 font-medium">Standard claim preparation window</div>
              </div>
              <input
                type="checkbox"
                checked={settings.trigger30Days}
                onChange={(e) => onUpdateSettings({ ...settings, trigger30Days: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            {/* 7 Days */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <div className="font-semibold text-slate-200">7 Days Before Expiration</div>
                <div className="text-[11px] text-rose-400 font-medium">Urgent final countdown alert</div>
              </div>
              <input
                type="checkbox"
                checked={settings.trigger7Days}
                onChange={(e) => onUpdateSettings({ ...settings, trigger7Days: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            {/* Day of */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <div className="font-semibold text-slate-200">Day of Expiration</div>
                <div className="text-[11px] text-slate-400">Final expiration notice</div>
              </div>
              <input
                type="checkbox"
                checked={settings.triggerDayOf}
                onChange={(e) => onUpdateSettings({ ...settings, triggerDayOf: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 2. Notification Channels */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="font-bold text-sm border-b pb-2 border-slate-800 flex items-center justify-between">
            <span>Delivery Channels</span>
            <span className="text-xs text-indigo-400 font-normal">Active Endpoints</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Email Channel */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center space-x-1.5 text-indigo-300">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>Email Alerts</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => onUpdateSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <input
                type="email"
                value={settings.emailAddress}
                onChange={(e) => onUpdateSettings({ ...settings, emailAddress: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono outline-none focus:border-indigo-500"
                placeholder="you@domain.com"
              />
            </div>

            {/* Web Push */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold flex items-center space-x-1.5 text-indigo-300">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>Browser Web Push</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Desktop & Mobile push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.webPushNotifications}
                onChange={(e) => onUpdateSettings({ ...settings, webPushNotifications: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            {/* Send Test Alert Button */}
            <div className="pt-2">
              <button
                onClick={triggerTestAlert}
                className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Simulate Immediate Test Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. iCal & Google Calendar Feed Sync Section */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-slate-800">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Calendar Feed & iCal Sync</h3>
          </div>
          <button
            onClick={downloadIcsFile}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .ics Calendar File</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Subscribe to your WarrantyVault feed in Google Calendar, Apple Calendar, or Outlook to automatically show warranty expiration milestones directly on your daily agenda.
        </p>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <span className="font-mono text-indigo-400 truncate flex-1">{calendarFeedUrl}</span>
          <button
            onClick={copyCalendarUrl}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1 whitespace-nowrap"
          >
            {copiedFeed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFeed ? 'Copied' : 'Copy Feed Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
