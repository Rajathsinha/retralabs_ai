import { useState } from 'react';
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

  if (!isOpen) return null;

  const peptideMg = parseFloat(peptideAmount) || 0;
  const waterMl = parseFloat(waterVolume) || 0;
  const doseMg = doseUnit === 'mg'
    ? parseFloat(desiredDose) || 0
    : (parseFloat(desiredDose) || 0) / 1000;

  const concentration = waterMl > 0 ? peptideMg / waterMl : 0;
  const injectionVolume = concentration > 0 ? doseMg / concentration : 0;
  const injectionUnits = injectionVolume * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Reconstitution Calculator</h2>
              <p className="text-sm text-blue-100 mt-0.5">Calculate peptide dosing accurately</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-2">
              <span className="text-2xl">⚠️</span>
              <div className="text-sm text-amber-900">
                <strong className="font-bold">RESEARCH USE ONLY</strong> - This calculator is for educational and research purposes. Always consult qualified professionals for medical advice.
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-5 h-5 text-blue-600" />
                <label className="text-sm font-bold text-slate-900">Peptide Amount in Vial</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={peptideAmount}
                  onChange={(e) => setPeptideAmount(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg font-semibold"
                  placeholder="10"
                  step="0.1"
                />
                <span className="text-lg font-bold text-slate-700 bg-white px-4 py-3 rounded-lg border-2 border-blue-200">mg</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-cyan-600" />
                <label className="text-sm font-bold text-slate-900">Bacteriostatic Water to Add</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={waterVolume}
                  onChange={(e) => setWaterVolume(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-600 text-lg font-semibold"
                  placeholder="2"
                  step="0.1"
                />
                <span className="text-lg font-bold text-slate-700 bg-white px-4 py-3 rounded-lg border-2 border-cyan-200">mL</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Syringe className="w-5 h-5 text-emerald-600" />
                <label className="text-sm font-bold text-slate-900">Desired Dose per Injection</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={desiredDose}
                  onChange={(e) => setDesiredDose(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600 text-lg font-semibold"
                  placeholder="0.25"
                  step="0.01"
                />
                <select
                  value={doseUnit}
                  onChange={(e) => setDoseUnit(e.target.value as 'mg' | 'mcg')}
                  className="px-4 py-3 border-2 border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600 text-lg font-bold bg-white text-slate-700 cursor-pointer"
                >
                  <option value="mg">mg</option>
                  <option value="mcg">mcg</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border-2 border-slate-700">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Calculation Results</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20">
                <div className="text-sm text-slate-300 mb-1">Concentration</div>
                <div className="text-3xl font-extrabold text-white">
                  {concentration.toFixed(2)} <span className="text-xl text-cyan-300">mg/mL</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 border-2 border-blue-400">
                  <div className="text-xs text-blue-100 mb-2 font-semibold">Injection Volume</div>
                  <div className="text-2xl font-extrabold text-white">
                    {injectionVolume.toFixed(3)} <span className="text-sm">mL</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-5 border-2 border-emerald-400">
                  <div className="text-xs text-emerald-100 mb-2 font-semibold">Syringe Units</div>
                  <div className="text-2xl font-extrabold text-white">
                    {injectionUnits.toFixed(1)} <span className="text-sm">units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">💡</span>
              How to Use This Calculator
            </h4>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                <span>Enter the total peptide amount in your vial (usually printed on the label, e.g., 10mg)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                <span>Enter how much bacteriostatic water you plan to add (e.g., 2mL)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                <span>Enter your desired dose per injection (e.g., 0.25mg or 250mcg)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                <span>The calculator shows how much to inject each time in both mL and syringe units</span>
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl p-5">
            <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
              <span>⚕️</span>
              Important Safety Notes
            </h4>
            <ul className="space-y-1.5 text-sm text-rose-800">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Always use bacteriostatic water for reconstitution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Inject water slowly down the side of the vial, never directly onto the powder</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Gently swirl the vial (do not shake) until powder fully dissolves</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Store reconstituted peptides in the refrigerator (2-8°C)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Use appropriate insulin syringes for accurate measurement</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
