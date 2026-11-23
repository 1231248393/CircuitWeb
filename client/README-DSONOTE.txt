CircuitWeb DSO connection-direction fix

Contents:
  src/components/DSOModal.jsx

What this fixes:
  The DSO previously detected a channel only when the DSO pin was the END
  of a wire. If the user clicked the DSO pin first, the DSO pin became the
  START of the wire and the UI incorrectly displayed "CH1/CH2 NOT CONNECTED".

This patch checks both wire endpoints, for CH1, CH2 and GND.

Important limitation:
  This fixes DSO pin-presence detection only. It does NOT make the existing
  hard-coded GuidedLabUI waveform into a general circuit solver. The current
  Guided DSO still generates illustrative waveforms. The Sandbox simulation
  also selects a waveform by component types rather than solving the actual
  connected circuit. A separate netlist + SPICE integration is still needed
  for Tinkercad/Proteus-like arbitrary circuit simulation.

Install:
  From ~/circuitweb-clone/client:
    unzip -o ~/Downloads/circuitweb-dso-connection-fix.zip -d .

Then restart CircuitWeb.
