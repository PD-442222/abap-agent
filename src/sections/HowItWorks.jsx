import React from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { UploadCloud, Download, Bot, FileCode2 } from 'lucide-react';

const steps = [
  {
    title: 'Download a runtime Word template',
    description: 'Generate a .docx in the browser for any RICEF type or grab the Markdown source.',
    icon: Download,
  },
  {
    title: 'Upload and pre-fill',
    description: 'Upload your .docx or .md template, extract text with Mammoth, and auto-map placeholders.',
    icon: UploadCloud,
  },
  {
    title: 'Send to n8n',
    description: 'The generator POSTs to your VITE_N8N_WEBHOOK_URL and n8n calls OpenAI internally.',
    icon: Bot,
  },
  {
    title: 'Ship ABAP deliverables',
    description: 'Copy code, download .abap or Word output, and refine iteratively with prior results.',
    icon: FileCode2,
  },
];

export function HowItWorks() {
  return (
    <section id="workflow" className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Workflow</p>
            <h2 className="text-3xl font-bold text-slate-900">How the assistant works</h2>
            <p className="mt-2 text-slate-600">All calls route through your n8n webhook; no binary templates live in the repo.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader className="flex flex-col gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <step.icon className="h-5 w-5" />
                </div>
                <CardTitle>{step.title}</CardTitle>
                <p className="text-sm text-slate-600">{step.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
