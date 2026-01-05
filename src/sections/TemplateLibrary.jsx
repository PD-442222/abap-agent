import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { ricefSchemas, ricefTypes } from '../lib/templateSchemas.js';
import { downloadTemplateDocx } from '../lib/docxGenerate.js';
import { FileDown } from 'lucide-react';

export function TemplateLibrary({ onSelect }) {
  const handleDownloadDocx = async (type) => {
    const schema = ricefSchemas[type];
    await downloadTemplateDocx(type, schema, {});
  };

  return (
    <section className="bg-white py-14" id="templates">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Templates</p>
            <h2 className="text-3xl font-bold text-slate-900">Generate RICEF Word templates on the fly</h2>
            <p className="text-slate-600">Download .docx at runtime or grab the Markdown outline. No binary templates live in the repo.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ricefTypes.map((type) => (
            <Card key={type} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{type}</span>
                  <Button size="sm" variant="ghost" onClick={() => onSelect?.(type)}>
                    Use form
                  </Button>
                </CardTitle>
                <p className="text-sm text-slate-600">{ricefSchemas[type].description}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button onClick={() => handleDownloadDocx(type)} className="w-full">
                  <FileDown className="mr-2 h-4 w-4" /> Download Word Template
                </Button>
                <a
                  className="text-sm font-semibold text-blue-700 hover:underline"
                  href={`/templates-source/${type.toLowerCase()}.md`}
                  download
                >
                  Download Markdown Template
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
