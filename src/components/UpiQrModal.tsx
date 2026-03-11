import { useState, useEffect } from 'react';
import { X, CheckCircle, RotateCcw, MessageCircle } from 'lucide-react';

const TOTAL_SECONDS = 120;
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 263.9

interface UpiQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Grand total in INR */
  amount: number;
  /** Called when user confirms payment — saves order & navigates */
  onConfirm: () => Promise<void>;
  /** Fallback WhatsApp URL if the user prefers to order that way */
  whatsappUrl: string;
}

export default function UpiQrModal({
  isOpen,
  onClose,
  amount,
  onConfirm,
  whatsappUrl,
}: UpiQrModalProps) {
  const [timeLeft,     setTimeLeft]     = useState(TOTAL_SECONDS);
  const [timerExpired, setTimerExpired] = useState(false);
  /** Increment to force a timer restart while modal stays open */
  const [timerKey,     setTimerKey]     = useState(0);
  const [confirming,   setConfirming]   = useState(false);

  // Reset + run timer whenever modal opens, or when timerKey changes (restart)
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(TOTAL_SECONDS);
      setTimerExpired(false);
      setConfirming(false);
      return;
    }
    setTimeLeft(TOTAL_SECONDS);
    setTimerExpired(false);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timerKey]);

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  const handleRestart = () => setTimerKey(k => k + 1);

  const minutes     = Math.floor(timeLeft / 60);
  const seconds     = timeLeft % 60;
  const timerColor  = timeLeft > 60 ? '#22c55e' : timeLeft > 30 ? '#f59e0b' : '#ef4444';
  const strokeOffset = CIRCUMFERENCE * (1 - timeLeft / TOTAL_SECONDS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* ── Purple PhonePe header ── */}
        <div className="bg-[#5f259f] px-5 pt-5 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              {/* "Pe" logo mark */}
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-[#5f259f] font-black text-sm leading-none">Pe</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">PhonePe</p>
                <p className="text-purple-300 text-[10px] leading-none mt-0.5">BHIM UPI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-purple-300 text-xs uppercase tracking-widest mb-1 font-medium">
            Amount to Pay
          </p>
          <p className="text-white text-3xl font-black tracking-tight">
            ₹{amount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-5">

          {/* QR code */}
          <div className="flex flex-col items-center mb-5">
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-3 shadow-sm">
              <img
                src="/ypay.jpeg"
                alt="PhonePe UPI QR Code — Mahalakshmistore"
                className="w-56 h-56 object-contain rounded-xl"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Mahalakshmistore · Terminal 17
            </p>
          </div>

          {/* Countdown timer */}
          <div className="flex flex-col items-center mb-5">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                {/* Track ring */}
                <circle
                  cx="50" cy="50" r={RADIUS}
                  fill="none" stroke="#e2e8f0" strokeWidth="7"
                />
                {/* Progress ring */}
                <circle
                  cx="50" cy="50" r={RADIUS}
                  fill="none"
                  stroke={timerColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeOffset}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                />
              </svg>
              {/* Digital readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-900 tabular-nums leading-none">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">
                  left
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              {timerExpired ? 'Timer ended' : 'Complete your UPI payment within this time'}
            </p>
          </div>

          {/* Timer-expired warning */}
          {timerExpired && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center">
              <p className="text-sm font-bold text-amber-800 mb-1">
                Time's up — but don't worry!
              </p>
              <p className="text-xs text-amber-700 mb-2.5 leading-relaxed">
                If you already paid, tap Confirm below. Your order will still be saved.
              </p>
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart Timer
              </button>
            </div>
          )}

          {/* ── Confirm payment button ── */}
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full flex items-center justify-center gap-2.5 bg-[#5f259f] hover:bg-[#4e1d84] active:bg-[#3d1668] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            {confirming ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                I've Completed the Payment
              </>
            )}
          </button>

          {/* WhatsApp fallback */}
          <button
            onClick={() => { window.open(whatsappUrl, '_blank'); onClose(); }}
            className="w-full mt-2.5 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
          >
            <MessageCircle className="w-4 h-4" />
            Having trouble? Order via WhatsApp instead
          </button>
        </div>

      </div>
    </div>
  );
}
