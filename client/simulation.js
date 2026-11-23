export const simulateCircuit = (components, wires) => {
  if (!components || components.length === 0) return { success: false, message: "Add components to simulate." };
  const hasAudio = components.some(c => c.type === 'signal_gen');
  const hasCarrier = components.some(c => c.type === 'carrier_gen');
  if (hasAudio && hasCarrier) return { success: true, type: 'communication', message: "RF Active!", voltage: 5, current: 0 };
  return { success: true, type: 'dc', message: "Circuit Closed.", voltage: 9, current: 15 };
};
