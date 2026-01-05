import { convertToHtml } from 'mammoth/mammoth.browser';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractPlaceholders(text) {
  const regex = /{{([^}]+)}}/g;
  const found = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    found.add(match[1].trim());
  }
  return Array.from(found);
}

export async function extractDocxText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await convertToHtml({ arrayBuffer });
  const text = value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

export function parseValuesFromText(text, schema) {
  const values = {};
  schema.fields.forEach((field) => {
    const labelRegex = new RegExp(`${escapeRegex(field.label)}[:\n]?\\s*([^\n]+)`, 'i');
    const match = text.match(labelRegex);
    if (match && match[1]) {
      const cleaned = match[1].replace(/{{[^}]+}}/, '').trim();
      if (cleaned) {
        values[field.name] = cleaned;
      }
    }
  });

  const placeholders = extractPlaceholders(text);
  placeholders.forEach((placeholder) => {
    const normalized = placeholder.replace(/\s+/g, '').toLowerCase();
    const matchField = schema.fields.find((f) => f.name.toLowerCase() === normalized || f.label.replace(/\s+/g, '').toLowerCase() === normalized);
    if (matchField && !values[matchField.name]) {
      values[matchField.name] = '';
    }
  });

  return values;
}
