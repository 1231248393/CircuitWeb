import React from 'react';
import { getPins } from './pins';
import { getComponentMetadata } from './metadata';
import { BasicSymbol } from './symbols/BasicParts';
import { AdvancedSymbol } from './symbols/AdvancedParts';
import { CommunicationSymbol } from './symbols/CommunicationParts';

const basicTypes = ['resistor', 'voltage', 'led', 'capacitor', 'inductor', 'ground', 'switch', 'pushbutton', 'potentiometer', 'ldr', 'dc_motor', 'npn_transistor', 'rgb_led', 'breadboard'];
const communicationTypes = ['diode', 'varactor', 'transformer', 'transformer_ct']; 

export const ElectronicSymbol = (props) => {
  if (basicTypes.includes(props.type)) return <BasicSymbol {...props} />;
  if (communicationTypes.includes(props.type)) return <CommunicationSymbol {...props} />;
  // Everything else goes to Advanced (Arduino, Scopes, 7-Segment, AC Source, etc.)
  return <AdvancedSymbol {...props} />;
};

export { getPins, getComponentMetadata };
