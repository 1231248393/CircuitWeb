import React from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import SchematicView from './SchematicView';
import CodeView from './CodeView';
import Scene3D from './Scene3D'; // 🔥 Import the 3D scene
import { useStore } from './store';
import './App.css';

function App() {
  const activeTab = useStore(state => state.activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <TopBar />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 🔥 TEMPORARILY SHOW 3D SCENE INSTEAD OF CANVAS */}
        {activeTab === 'Circuits' ? (
          <>
            <Scene3D /> 
            <Sidebar />
          </>
        ) : activeTab === 'Schematic' ? (
          <SchematicView />
        ) : (
          <CodeView />
        )}
      </div>
    </div>
  );
}

export default App;