import { useState } from 'react';
import { useToast } from '../components/Toast';

export interface UploadedFileInfo {
  name: string;
  sizeKb: string;
  text: string;
}

/**
 * Shared file-read logic for both Log Observation and Import Field Notes,
 * consolidating the two near-duplicate implementations in the original
 * prototype. PDFs are not really parsed (same as the original) — the text
 * content is a placeholder telling the user to paste notes instead.
 */
export function useFileUpload() {
  const [file, setFile] = useState<UploadedFileInfo | null>(null);
  const toast = useToast();

  function readFile(f: File) {
    const sizeKb = (f.size / 1024).toFixed(1) + ' KB';
    if (f.name.toLowerCase().endsWith('.pdf')) {
      setFile({ name: f.name, sizeKb, text: `[PDF: ${f.name} — if text extraction fails, paste notes in the Paste tab]` });
      toast(`File loaded — ${f.name}`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile({ name: f.name, sizeKb, text: (e.target?.result as string) || '' });
      toast(`File loaded — ${f.name}`);
    };
    reader.readAsText(f);
  }

  function clear() {
    setFile(null);
  }

  return { file, readFile, clear };
}
