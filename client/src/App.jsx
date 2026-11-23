import React, { useState, useEffect } from 'react';
import SandboxUI from './components/SandboxUI';
import GuidedLabUI from './components/GuidedLabUI';

export default function App() {
  const [mode, setMode] = useState('sandbox');
  const [experiment, setExperiment] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const expParam = params.get('experiment');
    if (expParam) {
      setMode('guided');
      setExperiment(expParam);
    } else {
      setMode('sandbox');
    }
  }, []);

  if (mode === 'guided') {
    return <GuidedLabUI experiment={experiment} />;
  }

  return <SandboxUI />;
}
