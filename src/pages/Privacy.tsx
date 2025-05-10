import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span role="img" aria-label="check">✅</span> Privacy Policy
        </h1>
        <div className="prose prose-lg text-dark-200 mb-8">
          <p><strong>Last updated:</strong> [2025-05-07]</p>
          <p>EfficiencyHub respects your privacy. We collect only the data necessary to operate the site and provide a great experience.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">What We Collect</h2>
          <ul className="list-disc ml-6">
            <li>Your email address (for login and communication)</li>
            <li>Information you submit (tool name, description, images)</li>
            <li>Anonymous usage metrics</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-2">How We Use Your Data</h2>
          <ul className="list-disc ml-6">
            <li>To manage your account and submissions</li>
            <li>To show your submitted tools publicly</li>
            <li>To improve our services</li>
          </ul>
          <p>We do not sell or share your personal data with third parties.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">Cookies</h2>
          <p>We use minimal cookies for session management only. No third-party tracking or advertising cookies are used.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">Your Rights</h2>
          <p>You can request your data or account to be deleted at any time by contacting us at 3lsh916@gmail.com</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy; 