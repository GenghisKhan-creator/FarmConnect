import { useSearchParams } from 'react-router-dom';
import { HelpCircle, FileText, Users, ShoppingBag } from 'lucide-react';

export default function Support() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'faq';

  const TABS = [
    { key: 'how', label: 'How it works', icon: <HelpCircle size={18} /> },
    { key: 'faq', label: 'FAQs', icon: <FileText size={18} /> },
    { key: 'farmer', label: 'Farmer Guide', icon: <Users size={18} /> },
    { key: 'buyer', label: 'Buyer Guide', icon: <ShoppingBag size={18} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '3rem 0' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Support Center</h1>
        
        <div className="tabs" style={{ marginBottom: '2rem' }}>
          {TABS.map(t => (
            <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setSearchParams({ tab: t.key })}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{t.icon} {t.label}</span>
            </button>
          ))}
        </div>

        <div className="card card-body" style={{ minHeight: '50vh', animation: 'fadeIn 0.3s ease' }}>
          {tab === 'how' && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>How FarmConnect Works</h2>
              <p style={{ color: 'var(--slate-600)', lineHeight: 1.8 }}>
                FarmConnect connects farmers directly to buyers. Farmers can create free accounts, list their produce with details like price and quantity, and manage incoming orders. Buyers can browse these listings, compare prices, and send offers directly to the farmers. Once an offer is accepted, both parties coordinate delivery or pickup through our secure messaging system.
              </p>
            </div>
          )}
          {tab === 'faq' && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>Is registration free?</h4>
                  <p style={{ color: 'var(--slate-600)' }}>Yes, registering as either a farmer or buyer is completely free.</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 600 }}>How do I pay for my orders?</h4>
                  <p style={{ color: 'var(--slate-600)' }}>Currently, all payments are negotiated directly between the buyer and farmer after an order is confirmed.</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 600 }}>How do I report a fraudulent listing?</h4>
                  <p style={{ color: 'var(--slate-600)' }}>You can use the 'Report Fraud' button on any product listing detail page to alert our admin team.</p>
                </div>
              </div>
            </div>
          )}
          {tab === 'farmer' && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Farmer Guide</h2>
              <ul style={{ color: 'var(--slate-600)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                <li>Register and complete your profile to get the <strong>Verified</strong> badge.</li>
                <li>Take clear pictures of your produce. Good photos increase sales by 40%.</li>
                <li>Regularly update your listing prices to reflect real market values.</li>
                <li>Check your messages screen frequently to respond to offers swiftly.</li>
              </ul>
            </div>
          )}
          {tab === 'buyer' && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Buyer Guide</h2>
              <ul style={{ color: 'var(--slate-600)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                <li>Browse through different categories or use our smart search.</li>
                <li>Check the farmer's rating before making a large purchase.</li>
                <li>You can send an order offer below the listing price, but it is subject to the farmer's approval.</li>
                <li>For massive orders, coordinate delivery logistics securely through the messaging tab.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
