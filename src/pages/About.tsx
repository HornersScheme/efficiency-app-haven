import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span role="img" aria-label="check">✅</span> About EfficiencyHub
        </h1>
        <div className="prose prose-lg text-dark-200 mb-8">
          <p>
            <strong>EfficiencyHub</strong> is a curated platform for discovering and sharing high-quality productivity tools — made by makers, for makers. Whether you're a developer, freelancer, or just someone obsessed with optimizing your workflow, EfficiencyHub helps you find tools that genuinely improve focus and output.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">Who Built This?</h2>
          <p>
            I'm an indie developer passionate about building tools that help people work better. Some of my previous projects include:
          </p>
          <ul className="list-disc ml-6">
            <li><strong>TabTimer</strong> — A Chrome extension to manage tabs and stay focused.</li>
            <li><strong>Nothing News</strong> — A minimal news reader that cuts through distractions.</li>
            <li><strong>EfficiencyHub</strong> — The platform you're on now.</li>
            <li><strong>Able</strong> — A tool for automating and streamlining repetitive workflows.</li>
          </ul>
          <p className="mt-4">
            If you're a creator, feel free to submit your own tool or reach out for collaboration!
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default About; 