import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { formatDateString } from './utils.js';

function buildParagraph(label, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value || '—' }),
    ],
  });
}

function buildTemplateDoc(type, schema, values = {}) {
  const paragraphs = [
    new Paragraph({
      text: `${type} Template`,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    }),
    new Paragraph({ text: 'Fill in the fields and upload or paste them into the generator form.', spacing: { after: 200 } }),
  ];

  schema.fields.forEach((field) => {
    paragraphs.push(buildParagraph(field.label, values[field.name] || `{{${field.label.replace(/\s+/g, '')}}}`));
  });

  paragraphs.push(new Paragraph({
    text: `Generated on ${formatDateString()}`,
    spacing: { before: 300 },
  }));

  return new Document({ sections: [{ properties: {}, children: paragraphs }] });
}

function buildResultDoc(type, schema, variables, response, meta) {
  const paragraphs = [
    new Paragraph({ text: `${type} ABAP Output`, heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }),
    new Paragraph({ text: 'Inputs', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
  ];

  schema.fields.forEach((field) => {
    paragraphs.push(buildParagraph(field.label, variables[field.name] || ''));
  });

  if (meta.additionalRequirements) {
    paragraphs.push(buildParagraph('Additional Requirements', meta.additionalRequirements));
  }

  if (meta.templateText) {
    paragraphs.push(buildParagraph('Template Text', meta.templateText.slice(0, 2000)));
  }

  if (meta.refinementInstructions) {
    paragraphs.push(buildParagraph('Refinement Instructions', meta.refinementInstructions));
  }

  paragraphs.push(new Paragraph({ text: 'ABAP Code', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));

  const codeLines = (response.abapCode || 'No code returned').split('\n');
  codeLines.forEach((line) => {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: line, font: 'Courier New' })],
      spacing: { after: 20 },
    }));
  });

  if (response.notes) {
    paragraphs.push(new Paragraph({ text: 'Notes', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 80 } }));
    paragraphs.push(new Paragraph({ text: response.notes }));
  }

  if (response.questions?.length) {
    paragraphs.push(new Paragraph({ text: 'Questions', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 80 } }));
    response.questions.forEach((q) => {
      paragraphs.push(new Paragraph({ text: `- ${q}` }));
    });
  }

  return new Document({ sections: [{ properties: {}, children: paragraphs }] });
}

async function downloadDocx(doc, filename) {
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

export async function downloadTemplateDocx(type, schema, values) {
  const doc = buildTemplateDoc(type, schema, values);
  await downloadDocx(doc, `${type.toLowerCase()}-template.docx`);
}

export async function downloadResultDocx(type, schema, variables, response, meta = {}) {
  const doc = buildResultDoc(type, schema, variables, response, meta);
  await downloadDocx(doc, `${type.toLowerCase()}-abap-output.docx`);
}
