import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>ABAP Code Assistant · n8n workflow + runtime Word templates</p>
        <p className="text-slate-500">Binary-free repository · Templates generated on demand</p>
      </div>
    </footer>
  );
}
