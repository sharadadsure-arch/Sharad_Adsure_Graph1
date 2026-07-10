import { useState } from 'react';
import { CODE_TEMPLATES } from '../data';
import { Code, Copy, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CodeSection() {
  const [activeLang, setActiveLang] = useState<keyof typeof CODE_TEMPLATES>('CPP');
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_TEMPLATES[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages = [
    { key: 'CPP', name: 'C++ (Kruskal)' },
    { key: 'C', name: 'C (Prim)' },
    { key: 'Java', name: 'Java (Prim)' },
    { key: 'Python', name: 'Python (Prim)' },
    { key: 'JavaScript', name: 'JavaScript (Kruskal)' }
  ] as const;

  return (
    <div id="code-section" className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wider font-sans flex items-center justify-center gap-2">
          <Code className="w-5 h-5 text-indigo-500" />
          CODING TEMPLATES
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Explore production-ready, annotated implementations of Minimum Spanning Tree algorithms across five distinct programming languages.
        </p>
      </div>

      <div className="bg-slate-900 text-white rounded-lg overflow-hidden shadow-lg border border-slate-800">
        {/* Toolbar header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {languages.map(lang => (
              <button
                key={lang.key}
                onClick={() => { setActiveLang(lang.key); setCopied(false); }}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeLang === lang.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Code"}
            </button>

            {/* Minimize toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 bg-slate-850 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer border border-slate-800"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "" : "rotate-180"}`} />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <pre className="p-6 text-xs font-mono leading-relaxed overflow-x-auto select-text bg-slate-900 text-slate-100 block whitespace-pre">
                <code>{CODE_TEMPLATES[activeLang]}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
