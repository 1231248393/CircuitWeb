import { getPins } from './pins';
import { getComponentMetadata } from './metadata';
import { BasicSymbol } from './symbols/BasicParts';
import { AdvancedSymbol } from './symbols/AdvancedParts';
import React from 'react';

// This combines the basic and advanced symbols into one component
export const ElectronicSymbol = (props) => {
  const Basic = BasicSymbol(props);
  if (Basic) return Basic;
  
  const Advanced = AdvancedSymbol(props);
  if (Advanced) return Advanced;

  return <div>[{props.type}]</div>;
};

export { getPins, getComponentMetadata };