export default function Terms() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="section-title" style={{ marginBottom: '1rem' }}>Terms of Use</h1>
        <p style={{ color: 'var(--slate-500)', marginBottom: '2rem' }}>Last Updated: March 2026</p>

        <div className="card card-body" style={{ color: 'var(--slate-600)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h3>
            <p>By accessing and using FarmConnect GH, you accept and agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use our platform.</p>
          </section>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>2. User Responsibilities</h3>
            <p>You are responsible for the accuracy of all information you post. Farmers must ensure all listed produce meets health and safety standards. Buyers must uphold their end of any accepted offer and communicate respectfully.</p>
          </section>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>3. Prohibited Conduct</h3>
            <p>Scamming, posting fake listings, harassment, exploiting bugs, or providing false identities is strictly prohibited and will result in immediate account termination and possible legal action.</p>
          </section>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>4. Limitations of Liability</h3>
            <p>FarmConnect acts as an independent medium to connect buyers and sellers. We are not liable for disputes over produce quality, transportation damage, or payment failures between parties, though our team may assist with arbitration.</p>
          </section>
          <section>
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>5. Modifications</h3>
            <p>We reserve the right to modify these terms at any time. Significant changes will be communicated prominently via our platform or to your registered email address.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
