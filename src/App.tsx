
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, LineChart, Moon, Sun, Tag, Building2, Calculator, DollarSign, ExternalLink } from "lucide-react";

type Post = {
  id: string;
  title: string;
  ticker: string;
  company: string;
  sector: string;
  date: string;
  author?: string;
  tags: string[];
  thumbnail?: string;
  summary: string;
  valuation: {
    method: "DCF" | "Multiples" | "SOTP" | "Other";
    base: number;
    current: number;
    upsidePct: number;
  };
  content: {
    thesis: string;
    catalysts?: string[];
    risks?: string[];
    dcf?: {
      wacc: number;
      terminalGrowth: number;
      sharesOut: number;
      baseFcfNextYr: number;
      fcfCagr5y: number;
      notes?: string;
    };
    multiples?: {
      peers: Array<{ name: string; ticker?: string; metric: string; value: number }>;
      targetMultipleNote?: string;
    };
    quickMetrics?: Array<{ label: string; value: string }>;
    links?: Array<{ label: string; url: string }>;
  };
};

function classNames(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ");
}

function pctClass(p: number) {
  if (p > 20) return "text-green-600 dark:text-green-400";
  if (p > 0) return "text-emerald-600 dark:text-emerald-400";
  if (p > -10) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

function ValuationChip({ method }: { method: Post["valuation"]["method"] }) {
  const icon = method === "DCF" ? <Calculator size={14} /> : method === "Multiples" ? <LineChart size={14} /> : <TrendingUp size={14} />;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium">
      {icon}
      {method}
    </span>
  );
}

function PostCard({ post, onOpen }: { post: Post; onOpen: (p: Post) => void }) {
  return (
    <motion.div layout whileHover={{ y: -2 }} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white/70 dark:bg-zinc-900/60 shadow-sm">
      {post.thumbnail && (
        <div className="h-36 w-full bg-cover bg-center" style={{ backgroundImage: `url(${post.thumbnail})` }} />
      )}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Building2 size={14} /> <span>{post.company}</span>
            <span>•</span>
            <span>{post.ticker}</span>
          </div>
          <ValuationChip method={post.valuation.method} />
        </div>
        <h3 className="text-lg font-semibold leading-tight">{post.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">{post.summary}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px]">
              <Tag size={12} /> {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{post.sector}</span>
          <button onClick={() => onOpen(post)} className="text-indigo-600 hover:underline">Read →</button>
        </div>
      </div>
    </motion.div>
  );
}

function Reader({ post, onClose }: { post: Post; onClose: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-4xl w-full rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="text-xs text-zinc-500">{post.company} • {post.ticker} • {post.date}</div>
            <h2 className="text-xl font-semibold">{post.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-xl px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-700">Close</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
          <div className="md:col-span-2 space-y-4">
            <section>
              <h3 className="text-sm font-semibold mb-1">Investment Thesis</h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{post.content.thesis}</p>
            </section>

            {post.content.catalysts && post.content.catalysts.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold mb-1">Catalysts</h3>
                <ul className="list-disc ml-5 text-sm space-y-1">
                  {post.content.catalysts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            )}

            {post.content.risks && post.content.risks.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold mb-1">Risks</h3>
                <ul className="list-disc ml-5 text-sm space-y-1">
                  {post.content.risks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>
            )}

            {post.content.links && post.content.links.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold mb-1">Links</h3>
                <ul className="text-sm space-y-1">
                  {post.content.links.map((l, i) => (
                    <li key={i}>
                      <a className="inline-flex items-center gap-1 text-indigo-600" href={l.url} target="_blank" rel="noreferrer">
                        {l.label}
                        <ExternalLink size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Method" value={<ValuationChip method={post.valuation.method} />} />
              <Stat label="Intrinsic (Base)" value={<span>£{post.valuation.base.toFixed(2)}</span>} />
              <Stat label="Price" value={<span>£{post.valuation.current.toFixed(2)}</span>} />
              <Stat label="Upside" value={<span className={pctClass(post.valuation.upsidePct)}>{post.valuation.upsidePct.toFixed(1)}%</span>} />
              {post.content.quickMetrics?.slice(0,2).map((m) => (
                <Stat key={m.label} label={m.label} value={m.value} />
              ))}
            </div>

            {post.content.dcf && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex items-center gap-2 mb-2"><DollarSign size={16} /><h4 className="font-semibold">DCF Snapshot</h4></div>
                <ul className="text-sm space-y-1">
                  <li>WACC: {post.content.dcf.wacc.toFixed(1)}%</li>
                  <li>Terminal Growth: {post.content.dcf.terminalGrowth.toFixed(1)}%</li>
                  <li>FCF (Next Yr): ${post.content.dcf.baseFcfNextYr.toLocaleString()}</li>
                  <li>5Y FCF CAGR: {post.content.dcf.fcfCagr5y.toFixed(1)}%</li>
                  <li>Shares Out: {post.content.dcf.sharesOut.toLocaleString()}m</li>
                  {post.content.dcf.notes && <li className="text-zinc-500 text-xs">{post.content.dcf.notes}</li>}
                </ul>
              </div>
            )}

            {post.content.multiples && post.content.multiples.peers.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex items-center gap-2 mb-2"><LineChart size={16} /><h4 className="font-semibold">Peer Multiples</h4></div>
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-zinc-500">
                    <tr>
                      <th className="py-1">Peer</th>
                      <th className="py-1">Metric</th>
                      <th className="py-1">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post.content.multiples.peers.map((p, i) => (
                      <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
                        <td className="py-1">{p.name}{p.ticker ? ` (${p.ticker})` : ""}</td>
                        <td className="py-1">{p.metric}</td>
                        <td className="py-1">{p.value}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {post.content.multiples.targetMultipleNote && (
                  <p className="text-xs text-zinc-500 mt-2">{post.content.multiples.targetMultipleNote}</p>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </motion.div>
  );
}

export default function FinanceBlogApp() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string | "All">("All");
  const [method, setMethod] = useState<Post["valuation"]["method"] | "All">("All");
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/posts.json")
      .then(r => r.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  const sectors = useMemo(() => ["All", ...Array.from(new Set(posts.map(p => p.sector)))], [posts]);
  const methods = ["All", "DCF", "Multiples", "SOTP", "Other"] as const;

  const filtered = posts.filter(p => {
    const matchQ = [p.title, p.company, p.ticker, p.summary, p.tags.join(" "), p.sector].join(" ").toLowerCase().includes(q.toLowerCase());
    const matchSector = sector === "All" || p.sector === sector;
    const matchMethod = method === "All" || p.valuation.method === method;
    return matchQ && matchSector && matchMethod;
  });

  return (
    <div className={classNames("min-h-screen transition-colors", dark ? "dark bg-zinc-950 text-zinc-50" : "bg-zinc-50 text-zinc-900")}>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Company Breakdowns & Valuations</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(d => !d)} className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-3 py-2">
            <Search size={16} className="shrink-0" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tickers, companies, tags…" className="bg-transparent outline-none w-full text-sm" />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-3 py-2">
            <Filter size={16} className="shrink-0" />
            <select value={sector} onChange={e => setSector(e.target.value)} className="bg-transparent outline-none w-full text-sm">
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-3 py-2">
            <LineChart size={16} className="shrink-0" />
            <select value={method} onChange={e => setMethod(e.target.value as any)} className="bg-transparent outline-none w-full text-sm">
              {methods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <PostCard key={p.id} post={p} onOpen={setOpen} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-20 text-center text-sm text-zinc-500">No posts match your filters yet.</div>
        )}
      </div>

      {open && <Reader post={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
