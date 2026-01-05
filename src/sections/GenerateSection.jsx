import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { Select } from '../components/ui/select.jsx';
import { getSchema, ricefTypes } from '../lib/templateSchemas.js';
import { downloadResultDocx } from '../lib/docxGenerate.js';
import { extractDocxText, parseValuesFromText } from '../lib/docxExtract.js';
import { generateAbap } from '../lib/n8nClient.js';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { Copy, Loader2, RefreshCcw, Upload } from 'lucide-react';

function createInitialValues(schema) {
  const values = {};
  schema.fields.forEach((field) => {
    values[field.name] = '';
  });
  return values;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function parseMarkdownValues(text, schema) {
  const values = {};
  const lines = text.split(/\n|\r/);
  lines.forEach((line) => {
    schema.fields.forEach((field) => {
      const regex = new RegExp(`^\s*${escapeRegex(field.label)}[:|-]?\s*(.+)$`, 'i');
      const match = line.match(regex);
      if (match && match[1]) {
        const val = match[1].replace(/{{[^}]+}}/, '').trim();
        if (val) {
          values[field.name] = val;
        }
      }
    });
  });
  return values;
}

function mergeValues(base, updates) {
  return { ...base, ...updates };
}

export const GenerateSection = forwardRef(function GenerateSection(_, ref) {
  const [selectedType, setSelectedType] = useState(ricefTypes[0]);
  const schema = useMemo(() => getSchema(selectedType), [selectedType]);
  const [values, setValues] = useState(createInitialValues(schema));
  const [templateText, setTemplateText] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [refinementInstructions, setRefinementInstructions] = useState('');
  const [previousAbapCode, setPreviousAbapCode] = useState('');
  const [response, setResponse] = useState({ abapCode: '', notes: '', questions: [] });
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => (type) => {
    setSelectedType(type);
    resetValues(type);
  });

  const resetValues = (type) => {
    const newSchema = getSchema(type);
    setValues(createInitialValues(newSchema));
    setTemplateText('');
    setAdditionalRequirements('');
    setRefinementInstructions('');
    setPreviousAbapCode('');
    setResponse({ abapCode: '', notes: '', questions: [] });
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    resetValues(type);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.toLowerCase();
    try {
      let text = '';
      if (extension.endsWith('.docx')) {
        text = await extractDocxText(file);
        toast.success('Extracted text from Word template');
      } else {
        text = await readTextFile(file);
        toast.success('Loaded Markdown template');
      }
      setTemplateText(text);
      const parsed = extension.endsWith('.docx') ? parseValuesFromText(text, schema) : parseMarkdownValues(text, schema);
      if (Object.keys(parsed).length) {
        setValues((prev) => mergeValues(prev, parsed));
      }
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      event.target.value = '';
    }
  };

  const handleGenerate = async (action) => {
    setLoading(true);
    try {
      const payload = {
        ricefType: selectedType,
        templateVariables: values,
        templateText,
        additionalRequirements,
        previousAbapCode: action === 'refine' ? (previousAbapCode || response.abapCode) : undefined,
        refinementInstructions: action === 'refine' ? refinementInstructions : undefined,
      };
      const result = await generateAbap(payload);
      setResponse(result);
      if (action === 'refine' && !previousAbapCode) {
        setPreviousAbapCode(response.abapCode || '');
      }
      toast.success('Received ABAP output from n8n');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!response.abapCode) return;
    await navigator.clipboard.writeText(response.abapCode);
    toast.success('ABAP code copied to clipboard');
  };

  const handleDownloadAbap = () => {
    const blob = new Blob([response.abapCode || ''], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${selectedType.toLowerCase()}-output.abap`);
  };

  const handleDownloadWord = async () => {
    await downloadResultDocx(selectedType, schema, values, response, {
      additionalRequirements,
      templateText,
      refinementInstructions,
    });
  };

  return (
    <section id="generator" className="bg-slate-50 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Generator</p>
            <h2 className="text-3xl font-bold text-slate-900">Fill the template and call n8n</h2>
            <p className="text-slate-600">Use the form below to generate or refine ABAP output. Uploads pre-fill values.</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="type" className="sr-only">
              RICEF type
            </Label>
            <Select id="type" value={selectedType} onChange={handleTypeChange} className="w-48">
              {ricefTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Template fill form</CardTitle>
              <p className="text-sm text-slate-600">Fields align to the generated Word template and webhook payload.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block text-slate-800">Upload template (.docx or .md)</Label>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 hover:border-blue-400">
                  <Upload className="h-4 w-4" />
                  <span>Drop or choose a template file</span>
                  <input type="file" accept=".docx,.md,.markdown" className="hidden" onChange={handleUpload} />
                </label>
                <p className="mt-2 text-xs text-slate-500">Only text content is parsed. Generated Word templates from this app are supported.</p>
              </div>
              {schema.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    value={values[field.name] || ''}
                    placeholder={field.placeholder}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="templateText">Template Text (optional)</Label>
                <Textarea
                  id="templateText"
                  value={templateText}
                  placeholder="Paste extracted text from a template to keep the webhook context"
                  onChange={(e) => setTemplateText(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                <Textarea
                  id="additionalRequirements"
                  value={additionalRequirements}
                  placeholder="Performance, security, testing expectations"
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled={loading} onClick={() => handleGenerate('generate')}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate with n8n
                </Button>
                <Button
                  variant="outline"
                  disabled={loading || !response.abapCode}
                  onClick={() => handleGenerate('refine')}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                  Refine output
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ABAP output</CardTitle>
              <p className="text-sm text-slate-600">Copy, download as .abap, or export a Word report.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                <div className="flex justify-between pb-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Code</span>
                  <button
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-200 hover:text-white"
                    onClick={handleCopy}
                    disabled={!response.abapCode}
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                </div>
                <pre className="max-h-80 overflow-auto text-xs leading-relaxed">
                  <code>{response.abapCode || 'Run a generation to see results.'}</code>
                </pre>
              </div>
              {response.notes ? (
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Notes</p>
                  <p className="mt-1 whitespace-pre-wrap">{response.notes}</p>
                </div>
              ) : null}
              {response.questions?.length ? (
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Questions</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {response.questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" disabled={!response.abapCode} onClick={handleDownloadAbap}>
                  Download .abap
                </Button>
                <Button variant="ghost" disabled={!response.abapCode} onClick={handleDownloadWord}>
                  Download Word output
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});
