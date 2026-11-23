import React from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import { useStore } from './store';
import './App.css';

function App() {
  const activeTab = useStore(state => state.activeTab);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <TopBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {activeTab === 'Circuits' ? (
          <><Canvas /><Sidebar /></>
        ) : (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', color: '#888' }}>
            {activeTab} View Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
