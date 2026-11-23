export const simulateCircuit = (components, wires) => {
  if (!components || components.length === 0) return { success: false, message: "Add components to simulate." };

  const types = components.map(c => c.type);
  let waveType = 'default';

  if (types.includes('adc') && types.includes('dac')) {
    waveType = 'adc_dac';
  } else if (types.includes('transformer_ct') && types.filter(t => t === 'diode').length >= 4) {
    waveType = 'dsbsc';
  } else if ((types.includes('jfet') || types.includes('npn_transistor')) && types.includes('inductor')) {
    waveType = 'fm';
  } else if (types.includes('transformer_ct') && types.filter(t => t === 'diode').length === 2) {
    waveType = 'detector';
  } else if (types.includes('signal_gen') && types.includes('diode') && types.includes('capacitor') && !types.includes('transformer_ct')) {
    waveType = 'am_envelope';
  }

  return { success: true, type: 'communication', waveType, message: "Circuit Running!" };
};

export function generateWaveformData(width, timeWindow, fm, fc, phaseOffset, waveType) {
  const points = [];
  const numPoints = 1500; 
  
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * timeWindow + phaseOffset;
    const audio = Math.sin(2 * Math.PI * fm * t);
    const carrierSine = Math.sin(2 * Math.PI * fc * t);
    
    let ch1 = 0;
    let ch2 = 0;

    if (waveType === 'adc_dac') {
      ch1 = audio; 
      ch2 = Math.round(audio * 2) / 2; 
    } else if (waveType === 'dsbsc') {
      ch1 = audio;
      ch2 = audio * (carrierSine >= 0 ? 1 : -1);
    } else if (waveType === 'fm') {
      ch1 = audio;
      ch2 = Math.sin(2 * Math.PI * fc * t + 5 * Math.sin(2 * Math.PI * fm * t));
    } else if (waveType === 'detector') {
      // 🔥 FORCE CH1 to be the FM input wave, and CH2 to be the recovered audio wave
      ch1 = Math.sin(2 * Math.PI * fc * t + 5 * Math.sin(2 * Math.PI * fm * t));
      ch2 = audio; 
    } else if (waveType === 'am_envelope') {
      const amWave = (1 + 0.5 * audio) * carrierSine;
      ch1 = amWave;
      ch2 = Math.abs(amWave); 
    } else {
      ch1 = audio;
      ch2 = carrierSine * audio;
    }

    points.push({ x: (i / numPoints) * width, ch1, ch2 });
  }
  return points;
}
