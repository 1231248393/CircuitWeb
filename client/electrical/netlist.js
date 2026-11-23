import { breadboardNetId } from './breadboard.js';
/** Converts component-pin wires and breadboard insertions into electrical nets. */
export function buildElectricalNetlist(wires=[], insertions=[]) {
  const parent=new Map();
  const find=x=>{ if(!parent.has(x)) parent.set(x,x); const p=parent.get(x); if(p!==x) parent.set(x,find(p)); return parent.get(x); };
  const union=(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb)parent.set(rb,ra);};
  const pinKey=(compId,pin)=>`pin:${compId}:${pin}`;
  wires.forEach(w=>{if(w?.from&&w?.to)union(pinKey(w.from.compId,w.from.pin),pinKey(w.to.compId,w.to.pin));});
  insertions.forEach(i=>{ if(i?.compId!=null&&i?.pin!=null&&i?.hole) union(pinKey(i.compId,i.pin),breadboardNetId(i.hole.zone,i.hole.column,i.hole.row)); });
  const nets={};
  for(const node of parent.keys()){const id=find(node);(nets[id]??=[]).push(node);}
  return {nets, nodeCount:parent.size, netCount:Object.keys(nets).length};
}
