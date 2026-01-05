import React from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { ShieldCheck, Workflow, Sparkle, ClipboardList } from 'lucide-react';

const features = [
  {
    title: 'Binary-safe delivery',
    body: 'All templates are generated at runtime. No .docx files are committed, keeping PRs binary-free.',
    icon: ShieldCheck,
  },
  {
    title: 'n8n first-class',
    body: 'Use VITE_N8N_WEBHOOK_URL to send RICEF payloads. n8n calls OpenAI and shapes responses.',
    icon: Workflow,
  },
  {
    title: 'Template-aware forms',
    body: 'Template uploads can pre-fill fields for faster submissions and consistent webhook payloads.',
    icon: ClipboardList,
  },
  {
    title: 'Refine and iterate',
    body: 'Send refinement instructions with prior ABAP output to tighten results without rework.',
    icon: Sparkle,
  },
];

export function FeatureCards() {
  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Why this stack</p>
          <h2 className="text-3xl font-bold text-slate-900">Fit for SAP build teams</h2>
          <p className="mt-2 text-slate-600">Designed for RICEF governance with clean downloads and webhook-first flows.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="flex flex-col gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <p className="text-sm text-slate-600">{feature.body}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
