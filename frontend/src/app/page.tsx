'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, GraduationCap, Globe, Microscope } from 'lucide-react';

const QUESTIONS = [
  'What happens to bones during spaceflight?',
  'Do plants grow normally on the ISS?',
  'How does space affect sleep?',
  'Can radiation damage DNA in astronauts?',
];

const FOR_WHO = [
  {
    icon: GraduationCap,
    label: 'Students',
    title: 'Sources, not guesses.',
    body: 'Writing about space biology or medicine? Get cited answers with links to the original studies — no library required.',
  },
  {
    icon: Globe,
    label: 'Curious minds',
    title: 'The science, not just the headline.',
    body: "Space is covered in pop articles but the real research is buried. Raccly gives you direct access to what the studies actually say.",
  },
  {
    icon: Microscope,
    label: 'Educators & journalists',
    title: 'Verify before you publish.',
    body: "Every answer comes with the original source. Read the paper yourself — no need to take our word for it.",
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Ask in plain language.',
    body: "Type your question however you want. No search operators, no keywords — just write what you want to know.",
    visual: (
      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Your question</div>
        <div style={{ padding: '13px 16px', background: 'var(--bg-2)', border: '1.5px solid rgba(200,245,62,0.35)', borderRadius: '12px', boxShadow: '0 0 0 4px rgba(200,245,62,0.05)', fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
          What happens to muscles during long space missions?
          <span style={{ display: 'inline-block', width: '2px', height: '14px', background: 'var(--accent)', marginLeft: '3px', verticalAlign: 'middle', animation: 'blink 1s infinite' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {['Bone loss', 'Sleep', 'Radiation', 'Plants on ISS'].map(t => (
            <span key={t} style={{ padding: '3px 10px', borderRadius: '999px', background: 'var(--bg-3)', border: '1px solid var(--border)', fontSize: '10px', color: 'var(--text-3)' }}>{t}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    n: '2',
    title: 'We find the relevant research.',
    body: 'Raccly scans a curated database of peer-reviewed NASA space biology papers and ranks the most relevant ones to your question.',
    visual: (
      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Ranking studies by relevance</div>
        {[
          { label: 'Muscle Atrophy and Disuse in Spaceflight', match: '94%', color: 'var(--accent)', bg: 'rgba(200,245,62,0.10)', border: 'rgba(200,245,62,0.22)' },
          { label: 'Skeletal Muscle Changes After Bed Rest', match: '81%', color: 'var(--accent)', bg: 'rgba(200,245,62,0.07)', border: 'rgba(200,245,62,0.15)' },
          { label: 'Exercise Countermeasures on the ISS', match: '76%', color: '#f5d442', bg: 'rgba(245,212,66,0.08)', border: 'rgba(245,212,66,0.2)' },
          { label: 'Protein Synthesis Under Microgravity', match: '68%', color: '#f5d442', bg: 'rgba(245,212,66,0.06)', border: 'rgba(245,212,66,0.15)' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-2)', flex: 1, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
            <span style={{ padding: '1px 7px', borderRadius: '999px', fontSize: '9px', fontWeight: 700, color: item.color, background: item.bg, border: `1px solid ${item.border}`, flexShrink: 0, fontFamily: 'var(--font-display)' }}>{item.match}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '3',
    title: 'Get an answer with sources.',
    body: 'A structured response with numbered citations. Each one links to the exact study — so you can read the original if you want.',
    visual: (
      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Answer</div>
        <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.75 }}>
          Without gravity, muscles stop working as hard and begin to shrink — a process called <strong>disuse atrophy</strong> [<span style={{ color: 'var(--accent)' }}>1</span>]. Astronauts can lose up to <strong>20% of muscle mass</strong> on missions longer than 6 months [<span style={{ color: 'var(--accent)' }}>2</span>].
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {['[1] Muscle Atrophy and Disuse in Spaceflight', '[2] Skeletal Muscle Changes After Bed Rest'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '7px' }}>
              <span style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)' }}>{i + 1}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-2)', lineHeight: 1.3 }}>{t.slice(4)}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const TRUST = [
  'Peer-reviewed NASA research',
  'Cited answers — every claim has a source',
  'Links to the original papers',
  'Free · No account needed',
];

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);

  const go = (query: string) => {
    const t = query.trim();
    if (t) router.push(`/chat?q=${encodeURIComponent(t)}`);
  };

  return (
    <>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes grain {
          0%,100%{transform:translate(0,0)} 20%{transform:translate(-2%,-2%)}
          40%{transform:translate(3%,-1%)} 60%{transform:translate(-1%,2%)} 80%{transform:translate(2%,1%)}
        }
        .page-root::before {
          content:''; position:fixed; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:0.025; pointer-events:none; z-index:999; animation:grain 8s steps(1) infinite;
        }
        .q-chip {
          padding:5px 14px; border-radius:999px; cursor:pointer;
          background:var(--bg-3); border:1px solid var(--border);
          font-size:12px; color:var(--text-2); transition:all .15s;
          font-family:var(--font-body); white-space:nowrap;
        }
        .q-chip:hover { border-color:rgba(200,245,62,0.4); color:var(--accent); background:var(--bg-3); }
        .nav-link { font-size:13px; color:var(--text-2); text-decoration:none; transition:color .15s; }
        .nav-link:hover { color:var(--text); }
        .for-card {
          background:var(--bg-2); border:1px solid var(--border);
          border-radius:18px; padding:32px 28px;
          transition:border-color .2s, transform .2s;
        }
        .for-card:hover { border-color:rgba(200,245,62,0.25); transform:translateY(-3px); }
        .step-card {
          background:var(--bg-2); border:1px solid var(--border);
          border-radius:20px; overflow:hidden;
          display:grid; grid-template-columns:1fr 1fr;
        }
        .mockup { animation:float 7s ease-in-out infinite; }
        @media (max-width:920px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .hero-right { display:none !important; }
          .for-grid { grid-template-columns:1fr !important; }
          .step-card { grid-template-columns:1fr !important; }
          .step-visual { display:none !important; }
        }
        @media (max-width:600px) {
          .nav-links { display:none !important; }
          .trust-grid { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      <div className="page-root" style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text)' }}>

        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px', height: '58px',
          background: 'rgba(12,12,15,0.85)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', letterSpacing: '-0.04em' }}>
              <span style={{ color: 'var(--accent)' }}>R</span>accly
            </span>
            <div className="nav-links" style={{ display: 'flex', gap: '24px' }}>
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#for-who" className="nav-link">Who is it for</a>
            </div>
          </div>
          <button
            onClick={() => router.push('/chat')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 16px', borderRadius: '9px',
              background: 'var(--accent)', color: '#07070a',
              border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-body)',
              transition: 'opacity .15s',
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            Try it free <ArrowUpRight size={14} />
          </button>
        </nav>

        <section style={{
          minHeight: '100vh',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          padding: '100px 48px 60px',
          gap: '64px', maxWidth: '1280px', margin: '0 auto',
          position: 'relative',
        }} className="hero-grid">

          <div aria-hidden style={{
            position: 'absolute', top: '-120px', right: '-60px',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,245,62,0.06) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div className="fade-up">
            <h1 style={{ fontFamily: 'var(--font-display)', lineHeight: 1.05, marginBottom: '24px', marginTop: '8px' }}>
              <span style={{ display: 'block', fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 300, color: 'var(--text-2)', letterSpacing: '-0.03em' }}>
                Space biology is fascinating.
              </span>
              <span style={{ display: 'block', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.045em' }}>
                Finding answers
              </span>
              <span style={{ display: 'block', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.045em' }}>
                shouldn't be hard.
              </span>
            </h1>

            <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: '36px', maxWidth: '420px' }}>
              Ask anything about how spaceflight affects the body, plants, or life in general. Get a cited answer drawn from peer-reviewed NASA research.
            </p>

            <form onSubmit={e => { e.preventDefault(); go(q); }} style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                background: 'var(--bg-2)',
                border: `1.5px solid ${focused ? 'rgba(200,245,62,0.45)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '14px', padding: '7px 7px 7px 20px', gap: '8px',
                boxShadow: focused ? '0 0 0 4px rgba(200,245,62,0.06)' : 'none',
                transition: 'border-color .2s, box-shadow .2s',
              }}>
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="What happens to your heart in space?"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: 'var(--text)', fontFamily: 'var(--font-body)' }}
                />
                <button type="submit" style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px', borderRadius: '10px', flexShrink: 0,
                  background: q.trim() ? 'var(--accent)' : 'var(--bg-4)',
                  color: q.trim() ? '#07070a' : 'var(--text-3)',
                  border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-body)',
                  transition: 'all .15s',
                }}>
                  Ask <ArrowRight size={13} />
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Try →</span>
              {QUESTIONS.map(s => (
                <button key={s} className="q-chip" onClick={() => go(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="hero-right fade-up delay-2" style={{ position: 'relative' }}>
            <div aria-hidden style={{
              position: 'absolute', inset: '-48px',
              background: 'radial-gradient(ellipse at 55% 50%, rgba(200,245,62,0.07) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />

            <div className="mockup" style={{
              position: 'relative', zIndex: 1,
              background: 'var(--bg-2)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 48px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
            }}>
              <div style={{ padding: '11px 14px', background: 'var(--bg-3)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                    <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c, opacity: 0.8 }} />
                  ))}
                </div>
                <div style={{ flex: 1, background: 'var(--bg-4)', borderRadius: '5px', padding: '3px 10px', fontSize: '10px', color: 'var(--text-3)', maxWidth: '150px' }}>
                  raccly.app
                </div>
              </div>

              <div style={{ display: 'flex', height: '340px' }}>
                <div style={{ width: '110px', flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--bg-2)', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', padding: '2px 4px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--accent)' }}>R</span>accly
                  </span>
                  <div style={{ padding: '5px 8px', background: 'var(--accent-dim)', border: '1px solid rgba(200,245,62,0.2)', borderRadius: '6px', fontSize: '9px', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>
                    New chat
                  </div>
                  {[
                    { t: 'Bone density...', active: true },
                    { t: 'ISS plants...', active: false },
                    { t: 'Radiation...', active: false },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: '5px 8px', borderRadius: '6px', fontSize: '9px',
                      color: item.active ? 'var(--text)' : 'var(--text-3)',
                      background: item.active ? 'rgba(200,245,62,0.07)' : 'transparent',
                      border: `1px solid ${item.active ? 'rgba(200,245,62,0.15)' : 'transparent'}`,
                    }}>{item.t}</div>
                  ))}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ maxWidth: '80%', padding: '8px 11px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px 10px 3px 10px', fontSize: '10px', color: 'var(--text)', lineHeight: 1.5 }}>
                        What happens to bones during long missions?
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                      <div style={{ flexShrink: 0, width: '18px', height: '18px', borderRadius: '5px', background: 'var(--accent-dim)', border: '1px solid rgba(200,245,62,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>R</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '10px', lineHeight: 1.7, color: 'var(--text)', margin: '0 0 8px' }}>
                          Astronauts can lose <strong>1–2% of bone density per month</strong> in space [<span style={{ color: 'var(--accent)' }}>1</span>]. This happens because bones don't bear weight in microgravity and stop remodeling at the usual rate [<span style={{ color: 'var(--accent)' }}>2</span>].
                        </p>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '9px', padding: '2px 8px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '999px', color: 'var(--text-3)' }}>● 2 references</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ padding: '7px 10px', background: 'var(--bg-3)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '10px', color: 'var(--text-3)' }}>
                      Ask a follow-up…
                    </div>
                  </div>
                </div>

                <div style={{ width: '140px', flexShrink: 0, borderLeft: '1px solid var(--border)', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>Sources</span>
                    <span style={{ padding: '1px 5px', background: 'var(--accent-dim)', borderRadius: '999px', fontSize: '8px', color: 'var(--accent)', fontWeight: 700 }}>2</span>
                  </div>
                  <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      { t: 'Bone Loss During Spaceflight', y: '2020', score: '91%' },
                      { t: 'Skeletal Remodeling in Microgravity', y: '2018', score: '78%' },
                    ].map((src, i) => (
                      <div key={i} style={{ padding: '7px 8px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '7px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginBottom: '3px' }}>
                          <div style={{ fontSize: '8px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, flex: 1 }}>{src.t.slice(0, 24)}…</div>
                          <span style={{ fontSize: '7px', padding: '1px 4px', background: 'rgba(200,245,62,0.10)', border: '1px solid rgba(200,245,62,0.2)', borderRadius: '999px', color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>{src.score}</span>
                        </div>
                        <div style={{ fontSize: '7px', color: 'var(--text-3)', marginBottom: '4px' }}>{src.y} · NASA</div>
                        <span style={{ fontSize: '7px', padding: '1px 6px', background: 'var(--accent)', borderRadius: '999px', color: '#07070a', fontWeight: 700 }}>Read</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              position: 'absolute', bottom: '-16px', left: '20px', zIndex: 10,
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', background: 'var(--bg-2)', border: '1px solid var(--border-2)',
              borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              <span className="blink" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>NASA Space Apps 2024</span>
            </div>
          </div>
        </section>

        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '18px 48px' }}>
            <div className="trust-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px', alignItems: 'center' }}>
              {TRUST.map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 400 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="how-it-works" style={{ padding: '96px 48px 80px', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', fontWeight: 600, marginBottom: '12px' }}>How it works</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 3.2vw, 44px)', letterSpacing: '-0.035em', maxWidth: '460px', lineHeight: 1.1 }}>
              From question to cited answer in seconds.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STEPS.map((step, i) => (
              <div key={i} className="step-card">
                <div style={{
                  order: i % 2 === 0 ? 0 : 1,
                  padding: '52px 48px', position: 'relative', overflow: 'hidden',
                }}>
                  <div aria-hidden style={{
                    position: 'absolute', fontFamily: 'var(--font-display)', fontSize: '120px',
                    fontWeight: 800, color: 'rgba(200,245,62,0.04)',
                    top: '-16px', left: '-6px', lineHeight: 1, letterSpacing: '-0.06em',
                    userSelect: 'none', pointerEvents: 'none',
                  }}>{step.n}</div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', borderRadius: '999px',
                      background: 'var(--accent)', color: '#07070a',
                      fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-display)',
                      marginBottom: '20px',
                    }}>{step.n}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.03em', marginBottom: '14px', lineHeight: 1.2 }}>{step.title}</h3>
                    <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '360px' }}>{step.body}</p>
                  </div>
                </div>
                <div className="step-visual" style={{
                  order: i % 2 === 0 ? 1 : 0,
                  background: 'var(--bg-3)',
                  borderLeft: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                  borderRight: i % 2 !== 0 ? '1px solid var(--border)' : 'none',
                  minHeight: '240px', position: 'relative', overflow: 'hidden',
                  display: 'flex', alignItems: 'center',
                }}>
                  <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(200,245,62,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ width: '100%' }}>{step.visual}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="for-who" style={{ padding: '0 48px 96px', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '44px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', fontWeight: 600, marginBottom: '12px' }}>Who is it for</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(26px, 2.8vw, 40px)', letterSpacing: '-0.035em', lineHeight: 1.1 }}>
              Made for people, not researchers.
            </h2>
          </div>

          <div className="for-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {FOR_WHO.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="for-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'var(--accent-dim)', border: '1px solid rgba(200,245,62,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{item.label}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.025em', marginBottom: '10px', lineHeight: 1.2 }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.75 }}>{item.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div style={{ padding: '96px 48px', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            borderRadius: '24px', overflow: 'hidden', position: 'relative',
            background: 'var(--bg-2)', border: '1px solid var(--border-2)',
            padding: '80px 64px', textAlign: 'center' as const,
          }}>
            <div aria-hidden style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,245,62,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div aria-hidden style={{ position: 'absolute', bottom: '-80px', left: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,245,62,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 48px)', letterSpacing: '-0.04em', marginBottom: '14px', lineHeight: 1.05 }}>
                Ready when you are.
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '32px' }}>
                No account. No setup. Ask your question and see what the research says.
              </p>
              <button
                onClick={() => router.push('/chat')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '16px 32px', borderRadius: '13px',
                  background: 'var(--accent)', color: '#07070a',
                  border: 'none', cursor: 'pointer',
                  fontSize: '16px', fontWeight: 800,
                  fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
                  transition: 'opacity .15s',
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                Open Raccly <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '28px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          maxWidth: '1280px', margin: '0 auto',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.04em' }}>
            <span style={{ color: 'var(--accent)' }}>R</span>accly
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            NASA Space Apps Challenge 2024 · MIT License
          </span>
        </footer>

      </div>
    </>
  );
}
