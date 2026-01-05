import React, { useRef } from 'react';
import { Hero } from './sections/Hero.jsx';
import { HowItWorks } from './sections/HowItWorks.jsx';
import { TemplateLibrary } from './sections/TemplateLibrary.jsx';
import { GenerateSection } from './sections/GenerateSection.jsx';
import { FeatureCards } from './sections/FeatureCards.jsx';
import { Footer } from './sections/Footer.jsx';

export default function App() {
  const generatorRef = useRef(null);

  const handleSelectTemplate = (type) => {
    const el = document.getElementById('generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (generatorRef.current) {
      generatorRef.current(type);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Hero />
      <HowItWorks />
      <TemplateLibrary onSelect={handleSelectTemplate} />
      <GenerateSection ref={generatorRef} />
      <FeatureCards />
      <Footer />
    </div>
  );
}
