export default function Privacy() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="section-title" style={{ marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--slate-500)', marginBottom: '2rem' }}>Last Updated: March 2026</p>
        
        <div className="card card-body" style={{ color: 'var(--slate-600)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>1. Information We Collect</h3>
            <p>We collect information you provide directly to us when you create an account, list a product, or engage in messages. This includes your name, farm details, phone number, physical address, and device data.</p>
          </section>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>2. How We Use Your Information</h3>
            <p>Your data is strictly used to facilitate transactions on FarmConnect, improve our services, and verify your authenticity to maintain platform trust. We do not sell your personal data to third-party marketers.</p>
          </section>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>3. Data Security</h3>
            <p>We implement strict security measures to protect your data. However, remember that no method of transmission over the internet or electronic storage is 100% secure.</p>
          </section>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>4. Your Rights</h3>
            <p>You have the right to access, edit, or delete your data at any time through your Profile Dashboard. If you require further assistance regarding your privacy, contact our support team.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
