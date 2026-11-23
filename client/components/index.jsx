import React from 'react';
import { getPins } from './pins';
import { getComponentMetadata } from './metadata';
import { BasicSymbol } from './symbols/BasicParts';
import { AdvancedSymbol } from './symbols/AdvancedParts';
import { ExtraSymbol } from './symbols/ExtraParts';
import { CommunicationSymbol } from './symbols/CommunicationParts';

const basicTypes = ['resistor', 'voltage', 'led', 'capacitor', 'inductor', 'ground', 'switch', 'pushbutton', 'potentiometer'];
const communicationTypes = ['diode', 'transformer', 'transformer_ct']; 

export const ElectronicSymbol = (props) => {
  if (basicTypes.includes(props.type)) return <BasicSymbol {...props} />;
  if (communicationTypes.includes(props.type)) return <CommunicationSymbol {...props} />;
  return <AdvancedSymbol {...props} />;
};
export { getPins, getComponentMetadata };
