import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Grid, OrbitControls } from '@react-three/drei';
import { useStore } from './store';

function BreadboardModel({position}) {
  const holes=[];
  for(let c=0;c<30;c++) {
    for(let r=0;r<5;r++) {
      holes.push([-.0 + (c-14.5)*.19, .085, -.72+r*.19]);
      holes.push([(c-14.5)*.19, .085, .28+r*.19]);
    }
    for(let r=0;r<2;r++) {
      holes.push([(c-14.5)*.19, .085, -1.12+r*.12]);
      holes.push([(c-14.5)*.19, .085, 1.28+r*.12]);
    }
  }
  return <group position={position}>
    <mesh position={[0,0,0]} castShadow receiveShadow><boxGeometry args={[6.1,.16,3.1]}/><meshStandardMaterial color="#e8edf0" roughness={.78}/></mesh>
    <mesh position={[0,.085,0]}><boxGeometry args={[5.9,.015,1.08]}/><meshStandardMaterial color="#d7dfe5"/></mesh>
    {holes.map((p,i)=><mesh key={i} position={p} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.035,.035,.025,12]}/><meshStandardMaterial color="#64748b" metalness={.45} roughness={.35}/></mesh>)}
    <mesh position={[0,.09,-1.43]}><boxGeometry args={[5.9,.018,.025]}/><meshStandardMaterial color="#dc2626"/></mesh>
    <mesh position={[0,.09,1.43]}><boxGeometry args={[5.9,.018,.025]}/><meshStandardMaterial color="#2563eb"/></mesh>
  </group>;
}
function ComponentModel({component}) {
  const position=[component.x/100,0,component.y/100];
  if(component.type==='breadboard') return <BreadboardModel position={position}/>;
  if(component.type==='arduino') return <group position={position}>
    <mesh position={[0,.12,0]} castShadow><boxGeometry args={[2.1,.18,1.35]}/><meshStandardMaterial color="#087f82" roughness={.5}/></mesh>
    <mesh position={[0,.24,0]}><boxGeometry args={[.62,.12,.52]}/><meshStandardMaterial color="#20252b" metalness={.35}/></mesh>
    <mesh position={[-.9,.18,0]}><boxGeometry args={[.35,.2,.55]}/><meshStandardMaterial color="#cbd5e1" metalness={.65}/></mesh>
  </group>;
  if(/^74hc|^ne555|^555/.test(component.type)) return <group position={position}>
    <mesh position={[0,.2,0]} castShadow><boxGeometry args={[1.35,.35,.62]}/><meshStandardMaterial color="#171a1d" roughness={.45}/></mesh>
    {Array.from({length:component.type.includes('555')?4:7},(_,i)=><mesh key={i} position={[-.48+i*(.16),.06,-.38]}><boxGeometry args={[.055,.16,.18]}/><meshStandardMaterial color="#c0c7ce" metalness={.8}/></mesh>)}
    {Array.from({length:component.type.includes('555')?4:7},(_,i)=><mesh key={`r${i}`} position={[-.48+i*(.16),.06,.38]}><boxGeometry args={[.055,.16,.18]}/><meshStandardMaterial color="#c0c7ce" metalness={.8}/></mesh>)}
  </group>;
  if(component.type==='resistor') return <group position={position}>
    <mesh position={[0,.2,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.13,.13,.72,20]}/><meshStandardMaterial color="#d6b77a"/></mesh>
    <mesh position={[-.5,.2,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.018,.018,.35,8]}/><meshStandardMaterial color="#b7bec6" metalness={.8}/></mesh>
    <mesh position={[.5,.2,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.018,.018,.35,8]}/><meshStandardMaterial color="#b7bec6" metalness={.8}/></mesh>
  </group>;
  const color=component.type==='led'?'#dc2626':component.type==='capacitor'?'#2563eb':'#64748b';
  return <group position={position}><mesh position={[0,.2,0]} castShadow><cylinderGeometry args={[.22,.22,.42,20]}/><meshStandardMaterial color={color} metalness={.18} roughness={.38}/></mesh></group>;
}
export default function Scene3DView(){
  const components=useStore(s=>s.components);
  return <div style={{flex:1,minWidth:0,minHeight:0,background:'#e9eef2',position:'relative'}}>
    <Canvas shadows camera={{position:[10,12,14],fov:42}}>
      <color attach="background" args={['#e9eef2']}/><ambientLight intensity={.7}/><directionalLight position={[8,12,7]} intensity={1.3} castShadow/>
      <Environment preset="city"/><Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={45} position={[0,-.02,0]}/>
      {components.map(c=><ComponentModel key={c.id} component={c}/>)}
      <OrbitControls makeDefault maxPolarAngle={Math.PI/2.05} minDistance={4} maxDistance={40}/>
    </Canvas>
    <div style={{position:'absolute',left:18,bottom:16,padding:'8px 12px',background:'#ffffffdd',border:'1px solid #cbd5e1',borderRadius:8,fontSize:12,color:'#334155'}}>3D preview · orbit with mouse · scroll to zoom</div>
  </div>;
}
