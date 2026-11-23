import React from 'react';
import { useStore } from './store';
import { Plus, FolderOpen, Cpu } from 'lucide-react';

export default function Dashboard() {
  const { savedProjects, loadProject, newProject } = useStore();

  return (
    <div style={{ flex: 1, background: '#f5f6f8', padding: '40px', overflowY: 'auto', width: '100%' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Your Projects</h2>
          <button onClick={newProject} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#00b4d8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
            <Plus size={18} /> Create New Project
          </button>
        </div>

        {savedProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '12px', border: '2px dashed #ccc' }}>
            <Cpu size={48} color="#ccc" style={{ margin: '0 auto 15px auto' }} />
            <h3 style={{ color: '#888', margin: '0 0 10px 0' }}>No projects found</h3>
            <p style={{ color: '#aaa', margin: 0 }}>Click "Create New Project" to start designing.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {savedProjects.map(project => (
              <div key={project.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#00b4d8', fontSize: '18px' }}>{project.name}</h3>
                  <p style={{ margin: '0 0 20px 0', color: '#888', fontSize: '13px' }}>Saved on: {project.date}</p>
                  <p style={{ margin: '0 0 20px 0', color: '#555', fontSize: '13px' }}>Components: {project.components?.length || 0}</p>
                </div>
                <button onClick={() => loadProject(project)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#f0f2f5', color: '#333', border: '1px solid #ddd', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <FolderOpen size={16} /> Open Project
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
