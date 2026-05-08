import { useState } from 'react';
import 'lofi-kit';
import './App.css';
import { StructureSetupView } from './components/StructureSetupView';
import { TournamentCanvas } from './components/TournamentCanvas';
import { TeamManagement } from './components/TeamManagement/TeamManagement';

export default function App() {
  const [step, setStep] = useState<'structure' | 'bracket' | 'teams'>('structure');

  if (step === 'teams') {
    return <TeamManagement onBack={() => setStep('structure')} />;
  }

  if (step === 'structure') {
    return (
      <StructureSetupView
        onGenerated={() => setStep('bracket')}
        onTeams={() => setStep('teams')}
      />
    );
  }

  return <TournamentCanvas onBackToStructure={() => setStep('structure')} />;
}
