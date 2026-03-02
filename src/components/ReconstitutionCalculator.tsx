import { useState } from 'react';
import { Calculator, Beaker, Syringe, Droplets } from 'lucide-react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
} from '@heroui/react';

interface ReconstitutionCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReconstitutionCalculator({ isOpen, onClose }: ReconstitutionCalculatorProps) {
  const [peptideAmount, setPeptideAmount] = useState('10');
  const [waterVolume, setWaterVolume] = useState('2');
  const [desiredDose, setDesiredDose] = useState('0.25');
  const [doseUnit, setDoseUnit] = useState<'mg' | 'mcg'>('mg');
  const [syringeType, setSyringeType] = useState<'u100' | 'u40'>('u100');

  const peptideMg = parseFloat(peptideAmount) || 0;
  const waterMl = parseFloat(waterVolume) || 0;
  const doseMg = doseUnit === 'mg'
    ? parseFloat(desiredDose) || 0
    : (parseFloat(desiredDose) || 0) / 1000;

  const concentration = waterMl > 0 ? peptideMg / waterMl : 0;
  const injectionVolume = concentration > 0 ? doseMg / concentration : 0;
  const unitsPerMl = syringeType === 'u100' ? 100 : 40;
  const injectionUnits = injectionVolume * unitsPerMl;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      scrollBehavior="inside"
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight">Reconstitution Calculator</h2>
            <p className="text-xs text-slate-400 font-normal">Calculate peptide dosing</p>
          </div>
        </ModalHeader>

        <ModalBody className="gap-4 py-5">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
            <div className="text-xs text-amber-900">
              <strong>RESEARCH USE ONLY</strong> - For educational and research purposes. Consult qualified professionals for medical advice.
            </div>
          </div>

          <Card shadow="none" classNames={{ base: 'bg-slate-50 border border-slate-200' }}>
            <CardBody className="gap-3 p-4">
              <div className="flex items-center gap-2">
                <Beaker className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Peptide Amount in Vial</label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={peptideAmount}
                  onValueChange={setPeptideAmount}
                  placeholder="10"
                  step={0.1}
                  variant="bordered"
                  size="md"
                  classNames={{ input: 'font-semibold' }}
                />
                <span className="text-sm font-bold text-slate-600 bg-white px-3 py-2.5 rounded-lg border-2 border-slate-200">mg</span>
              </div>
            </CardBody>
          </Card>

          <Card shadow="none" classNames={{ base: 'bg-slate-50 border border-slate-200' }}>
            <CardBody className="gap-3 p-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Bacteriostatic Water</label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={waterVolume}
                  onValueChange={setWaterVolume}
                  placeholder="2"
                  step={0.1}
                  variant="bordered"
                  size="md"
                  classNames={{ input: 'font-semibold' }}
                />
                <span className="text-sm font-bold text-slate-600 bg-white px-3 py-2.5 rounded-lg border-2 border-slate-200">mL</span>
              </div>
            </CardBody>
          </Card>

          <Card shadow="none" classNames={{ base: 'bg-slate-50 border border-slate-200' }}>
            <CardBody className="gap-3 p-4">
              <div className="flex items-center gap-2">
                <Syringe className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Desired Dose per Injection</label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={desiredDose}
                  onValueChange={setDesiredDose}
                  placeholder="0.25"
                  step={0.01}
                  variant="bordered"
                  size="md"
                  classNames={{ input: 'font-semibold' }}
                />
                <Select
                  selectedKeys={[doseUnit]}
                  onChange={(e) => setDoseUnit(e.target.value as 'mg' | 'mcg')}
                  variant="bordered"
                  size="md"
                  className="w-28"
                  classNames={{ value: 'font-bold' }}
                  aria-label="Dose unit"
                >
                  <SelectItem key="mg">mg</SelectItem>
                  <SelectItem key="mcg">mcg</SelectItem>
                </Select>
              </div>
            </CardBody>
          </Card>

          <Card shadow="none" classNames={{ base: 'bg-slate-50 border border-slate-200' }}>
            <CardBody className="gap-3 p-4">
              <div className="flex items-center gap-2">
                <Syringe className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Syringe Type</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={syringeType === 'u100' ? 'solid' : 'bordered'}
                  color={syringeType === 'u100' ? 'default' : 'default'}
                  onPress={() => setSyringeType('u100')}
                  className={`font-bold text-sm ${syringeType === 'u100' ? 'bg-slate-800 text-white' : ''}`}
                  size="md"
                >
                  U-100 (100 units/mL)
                </Button>
                <Button
                  variant={syringeType === 'u40' ? 'solid' : 'bordered'}
                  color={syringeType === 'u40' ? 'default' : 'default'}
                  onPress={() => setSyringeType('u40')}
                  className={`font-bold text-sm ${syringeType === 'u40' ? 'bg-slate-800 text-white' : ''}`}
                  size="md"
                >
                  U-40 (40 units/mL)
                </Button>
              </div>
            </CardBody>
          </Card>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm font-bold text-white mb-4 text-center uppercase tracking-wider">Results</h3>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20 mb-3">
              <div className="text-xs text-slate-400 mb-1">Concentration</div>
              <div className="text-2xl font-extrabold text-white">
                {concentration.toFixed(2)} <span className="text-base text-emerald-400">mg/mL</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-4">
                <div className="text-[10px] text-emerald-300 mb-1 font-semibold uppercase tracking-wider">Inject Volume</div>
                <div className="text-xl font-extrabold text-white">
                  {injectionVolume.toFixed(3)} <span className="text-xs">mL</span>
                </div>
              </div>

              <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-4">
                <div className="text-[10px] text-emerald-300 mb-1 font-semibold uppercase tracking-wider">{syringeType === 'u100' ? 'U-100' : 'U-40'} Units</div>
                <div className="text-xl font-extrabold text-white">
                  {injectionUnits.toFixed(1)} <span className="text-xs">units</span>
                </div>
              </div>
            </div>
          </div>

          <Accordion variant="bordered">
            <AccordionItem key="how-to-use" title="How to Use" classNames={{ title: 'text-sm font-semibold' }}>
              <ol className="space-y-2 text-xs text-slate-700 pb-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">1.</span>
                  <span>Enter the total peptide amount in your vial (e.g., 10mg)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">2.</span>
                  <span>Enter bacteriostatic water amount (e.g., 2mL)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">3.</span>
                  <span>Enter your desired dose per injection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">4.</span>
                  <span>Read injection volume in mL and syringe units</span>
                </li>
              </ol>
            </AccordionItem>
            <AccordionItem key="safety" title="Safety Notes" classNames={{ title: 'text-sm font-semibold' }}>
              <ul className="space-y-1.5 text-xs text-rose-800 pb-2">
                <li>- Always use bacteriostatic water for reconstitution</li>
                <li>- Inject water slowly down the vial side, never onto powder</li>
                <li>- Gently swirl (do not shake) until dissolved</li>
                <li>- Store reconstituted peptides at 2-8 C</li>
                <li>- Use insulin syringes for accurate measurement</li>
              </ul>
            </AccordionItem>
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
