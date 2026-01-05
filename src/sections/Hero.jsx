import React from 'react';
import { Button } from '../components/ui/button.jsx';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const scrollToGenerator = () => {
    const el = document.getElementById('generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 text-center">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
          <Sparkles size={16} />
          n8n-powered ABAP code assistant
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Generate ABAP deliverables fast with runtime Word templates and an n8n workflow
          </h1>
          <p className="text-lg text-slate-600 sm:text-xl">
            Upload or generate Word-like templates in the browser, fill RICEF details, and send them to an n8n webhook that calls OpenAI for ABAP output.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={scrollToGenerator}>
            Try the generator <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <a href="#workflow" className="text-sm font-semibold text-blue-700 hover:underline">
            View workflow setup
          </a>
        </div>
      </div>
    </section>
  );
}
