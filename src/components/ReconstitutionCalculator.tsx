import { useState, useEffect } from 'react';
import { X, Calculator, Beaker, Syringe, Droplets } from 'lucide-react';

interface ReconstitutionCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReconstitutionCalculator({ isOpen, onClose }: ReconstitutionCalculatorProps) {
  const [peptideAmount, setPeptideAmount] = useState('10');
  const [waterVolume, setWaterVolume] = useState('2');
  const [desiredDose, setDesiredDose] = useState('0.25');
  const [doseUnit, setDoseUnit] = useState<'mg' | 'mcg'>('mg');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const peptideMg = parseFloat(peptideAmount) || 0;
  const waterMl = parseFloat(waterVolume) || 0;
  const doseMg = doseUnit === 'mg'
    ? parseFloat(desiredDose) || 0
    : (parseFloat(desiredDose) || 0) / 1000;

  const concentration = waterMl > 0 ? peptideMg / waterMl : 0;
  const injectionVolume = concentration > 0 ? doseMg / concentration : 0;
  const injectionUnits = injectionVolume * 100;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${visible ? 'bg-black/40' : 'bg-transparent'}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">Reconstitution Calculator</h2>
                <p className="text-xs text-blue-100">Calculate peptide dosing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
              <div className="text-xs text-amber-900">
                <strong>RESEARCH USE ONLY</strong> - For educational and research purposes. Consult qualified professionals for medical advice.
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Beaker className="w-4 h-4 text-blue-600" />
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Peptide Amount in Vial</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={peptideAmount}
                    onChange={(e) => setPeptideAmount(e.target.value)}
                    className="flex-1 px-3 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-base font-semibold bg-white"
                    placeholder="10"
                    step="0.1"
                  />
                  <span className="text-sm font-bold text-slate-600 bg-white px-3 py-2.5 rounded-lg border-2 border-blue-200">mg</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Bacteriostatic Water</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={waterVolume}
                    onChange={(e) => setWaterVolume(e.target.value)}
                    className="flex-1 px-3 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-600 text-base font-semibold bg-white"
                    placeholder="2"
                    step="0.1"
                  />
                  <span className="text-sm font-bold text-slate-600 bg-white px-3 py-2.5 rounded-lg border-2 border-cyan-200">mL</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Syringe className="w-4 h-4 text-emerald-600" />
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Desired Dose per Injection</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={desiredDose}
                    onChange={(e) => setDesiredDose(e.target.value)}
                    className="flex-1 px-3 py-2.5 border-2 border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600 text-base font-semibold bg-white"
                    placeholder="0.25"
                    step="0.01"
                  />
                  <select
                    value={doseUnit}
                    onChange={(e) => setDoseUnit(e.target.value as 'mg' | 'mcg')}
                    className="px-3 py-2.5 border-2 border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600 text-sm font-bold bg-white text-slate-700 cursor-pointer"
                  >
                    <option value="mg">mg</option>
                    <option value="mcg">mcg</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-bold text-white mb-4 text-center uppercase tracking-wider">Results</h3>

              <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20 mb-3">
                <div className="text-xs text-slate-400 mb-1">Concentration</div>
                <div className="text-2xl font-extrabold text-white">
                  {concentration.toFixed(2)} <span className="text-base text-cyan-300">mg/mL</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-4">
                  <div className="text-[10px] text-blue-100 mb-1 font-semibold uppercase tracking-wider">Inject Volume</div>
                  <div className="text-xl font-extrabold text-white">
                    {injectionVolume.toFixed(3)} <span className="text-xs">mL</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg p-4">
                  <div className="text-[10px] text-emerald-100 mb-1 font-semibold uppercase tracking-wider">Syringe Units</div>
                  <div className="text-xl font-extrabold text-white">
                    {injectionUnits.toFixed(1)} <span className="text-xs">units</span>
                  </div>
                </div>
              </div>
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2 py-2">
                <span className="text-blue-500 group-open:rotate-90 transition-transform inline-block">&#9654;</span>
                How to Use
              </summary>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                <ol className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Enter the total peptide amount in your vial (e.g., 10mg)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Enter bacteriostatic water amount (e.g., 2mL)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>Enter your desired dose per injection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>Read injection volume in mL and syringe units</span>
                  </li>
                </ol>
              </div>
            </details>

            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700 hover:text-rose-600 transition-colors flex items-center gap-2 py-2">
                <span className="text-rose-500 group-open:rotate-90 transition-transform inline-block">&#9654;</span>
                Safety Notes
              </summary>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mt-2">
                <ul className="space-y-1.5 text-xs text-rose-800">
                  <li className="flex items-start gap-1.5">
                    <span className="flex-shrink-0">-</span>
                    <span>Always use bacteriostatic water for reconstitution</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="flex-shrink-0">-</span>
                    <span>Inject water slowly down the vial side, never onto powder</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="flex-shrink-0">-</span>
                    <span>Gently swirl (do not shake) until dissolved</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="flex-shrink-0">-</span>
                    <span>Store reconstituted peptides at 2-8 C</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="flex-shrink-0">-</span>
                    <span>Use insulin syringes for accurate measurement</span>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
