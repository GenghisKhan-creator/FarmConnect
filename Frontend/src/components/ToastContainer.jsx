import { useData } from '../context/DataContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useData();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      pointerEvents: 'none',
      maxWidth: 360,
      width: 'calc(100vw - 3rem)'
    }}>
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const Icon = isSuccess ? CheckCircle : isError ? AlertCircle : Info;
        
        return (
          <div
            key={toast.id}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${isSuccess ? 'var(--green-200)' : isError ? '#fca5a5' : 'var(--blue-200)'}`,
              borderLeft: `4px solid ${isSuccess ? 'var(--green-500)' : isError ? '#ef4444' : 'var(--blue-500)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
              pointerEvents: 'auto',
              animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          >
            <Icon size={20} color={isSuccess ? 'var(--green-500)' : isError ? '#ef4444' : 'var(--blue-500)'} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)', lineHeight: 1.4 }}>
              {toast.text}
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: 0, marginTop: 2 }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
