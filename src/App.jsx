import React, { useState, useEffect, useRef } from 'react'
import { SCENARIOS } from './lib/scenarios'
import { saveSubmission } from './lib/supabase'

const LOGO = 'https://marca.bling.com.br/__l5e/assets-v1/6510914f-e5bd-4d68-a8ab-a547771c74d5/logo-verde-escuro.svg'
const TOTAL_SECS = 7200

const s = {
  hdr: { padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' },
  logo: { height: 26 },
  badge: { fontSize: 12, fontWeight: 500, color: 'var(--green)', border: '1px solid var(--border2)', padding: '4px 14px', borderRadius: 99 },
  btnP: { background: 'var(--green)', color: 'var(--dark)', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 600, fontFamily: 'Inter,sans-serif', cursor: 'pointer', width: '100%' },
  btnS: { background: 'transparent', color: 'var(--mist)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 22px', fontSize: 14, fontFamily: 'Inter,sans-serif', cursor: 'pointer' },
}

function Header() {
  return (
    <header style={s.hdr}>
      <img style={s.logo} src={LOGO} alt="Bling" />
      <span style={s.badge}>Processo Seletivo Interno</span>
    </header>
  )
}

// ── WELCOME ──────────────────────────────────────────────────
function Welcome({ onNext }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center' }}>
      <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 20, letterSpacing: '.04em' }}>Suporte Técnico L3</p>
      <h1 style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.15, marginBottom: 18 }}>
        Desafio Técnico<br /><span style={{ color: 'var(--green)' }}>L3 Operações e Qualidade</span>
      </h1>
      <p style={{ fontSize: 15, color: 'var(--mist)', marginBottom: 36, maxWidth: 480 }}>
        Quatro cenários do dia a dia da vaga. Não existe resposta certa ou errada — queremos entender como você raciocina, prioriza e se comunica.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 440, marginBottom: 36 }}>
        {[['Tempo','2 horas'],['Cenários','4 situações práticas'],['Formato','Escrito + apresentação'],['Respostas','Salvas automaticamente']].map(([l,v]) => (
          <div key={l} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</div>
            <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
      <button style={{ ...s.btnP, maxWidth: 300 }} onClick={onNext}>Começar</button>
    </div>
  )
}

// ── EMAIL ─────────────────────────────────────────────────────
function EmailScreen({ onStart }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState(false)

  const handle = () => {
    if (!name.trim() || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr(true); return }
    setErr(false)
    onStart(name.trim(), email.trim())
  }

  const inp = { width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 15px', color: 'var(--white)', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none' }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, maxWidth: 480, margin: '0 auto', textAlign: 'center', width: '100%' }}>
      <p style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 14, letterSpacing: '.05em' }}>Antes de começar</p>
      <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 10 }}>Suas informações</h2>
      <p style={{ fontSize: 14, color: 'var(--mist)', marginBottom: 28 }}>Suas respostas serão salvas com seu e-mail para identificação durante a avaliação.</p>
      <div style={{ width: '100%', marginBottom: 14, textAlign: 'left' }}>
        <label style={{ fontSize: 13, color: 'var(--mist)', marginBottom: 6, display: 'block' }}>Nome completo</label>
        <input style={inp} type="text" placeholder="Seu nome completo" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ width: '100%', marginBottom: 14, textAlign: 'left' }}>
        <label style={{ fontSize: 13, color: 'var(--mist)', marginBottom: 6, display: 'block' }}>E-mail corporativo</label>
        <input style={inp} type="email" placeholder="seu@bling.com.br" value={email} onChange={e => setEmail(e.target.value)} />
        {err && <p style={{ fontSize: 12, color: '#E55B5B', marginTop: 5 }}>Preencha nome e e-mail válidos para continuar.</p>}
      </div>
      <button style={{ ...s.btnP, marginTop: 8 }} onClick={handle}>Iniciar o desafio</button>
    </div>
  )
}

// ── CHALLENGE ─────────────────────────────────────────────────
function Challenge({ name, email, onFinish }) {
  const [cur, setCur] = useState(0)
  const [answers, setAnswers] = useState(SCENARIOS.map(s => s.questions.map(() => '')))
  const [secs, setSecs] = useState(TOTAL_SECS)
  const [saveStatus, setSaveStatus] = useState('Rascunho salvo automaticamente')
  const [saveOk, setSaveOk] = useState(false)
  const saveT = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setSecs(s => {
      if (s <= 1) { clearInterval(id); return 0 }
      return s - 1
    }), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (secs === 0) handleFinish(true)
  }, [secs])

  const fmt = s => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }
  const timerColor = secs <= 600 ? '#E55B5B' : secs <= 1800 ? '#F6C343' : 'var(--green)'

  const updateAns = (qi, val) => {
    setAnswers(prev => { const n = prev.map(a => [...a]); n[cur][qi] = val; return n })
    clearTimeout(saveT.current)
    setSaveStatus('Salvando…'); setSaveOk(false)
    saveT.current = setTimeout(() => { setSaveStatus('Salvo ✓'); setSaveOk(true) }, 700)
  }

  const handleFinish = async (timeout = false) => {
    const used = TOTAL_SECS - secs
    const hu = Math.floor(used / 3600), mu = Math.floor((used % 3600) / 60)
    const timeStr = hu > 0 ? `${hu}h ${mu}min` : `${mu} min`
    const payload = { name, email, time_used: timeStr, timed_out: timeout }
    SCENARIOS.forEach((sc, i) => sc.questions.forEach((_, qi) => { payload[`c${i+1}_q${qi+1}`] = answers[i][qi] || '' }))
    try { await saveSubmission(payload) } catch (e) { console.error(e) }
    onFinish({ name, email, timeStr, answers })
  }

  const sc = SCENARIOS[cur]
  const hasAns = i => answers[i].some(v => v.trim())

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ background: 'var(--card)', borderRight: '1px solid var(--border)', padding: '28px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 11, color: 'var(--t2)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>Cenários</p>
        {SCENARIOS.map((sc, i) => (
          <button key={i} onClick={() => setCur(i)} style={{ background: cur === i ? 'rgba(147,245,116,.09)' : 'transparent', border: `1px solid ${cur === i ? 'var(--border2)' : 'transparent'}`, borderRadius: 10, padding: '11px 13px', textAlign: 'left', cursor: 'pointer', fontFamily: 'Inter,sans-serif', width: '100%' }}>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 2 }}>{sc.tag}</div>
            <div style={{ fontSize: 13, color: 'var(--white)', fontWeight: 500 }}>{sc.title}</div>
            {hasAns(i) && <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 2 }}>✓ Respondido</div>}
          </button>
        ))}
        <div style={{ marginTop: 'auto', background: 'rgba(147,245,116,.05)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 5, letterSpacing: '.04em' }}>Tempo restante</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>{fmt(secs)}</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ overflowY: 'auto', padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 22 }}>
          <p style={{ fontSize: 12, color: 'var(--green)', letterSpacing: '.04em', marginBottom: 8 }}>{sc.tag} de 4</p>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 14 }}>{sc.title}</h2>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px' }}>
            <p style={{ fontSize: 11, color: 'var(--t2)', letterSpacing: '.05em', marginBottom: 8, textTransform: 'uppercase' }}>Situação</p>
            <p style={{ fontSize: 13, color: 'var(--mist)', lineHeight: 1.75 }}>{(sc.ctx || '').split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</p>
            {sc.quote && <p style={{ borderLeft: '2px solid var(--green)', paddingLeft: 14, margin: '12px 0', fontStyle: 'italic', color: 'var(--mist2)', fontSize: 13 }}>{sc.quote}</p>}
            {sc.ctx2 && <p style={{ fontSize: 13, color: 'var(--mist)', lineHeight: 1.75, marginTop: 10 }}>{sc.ctx2}</p>}
            {sc.list && <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {sc.list.map((l, i) => <div key={i} style={{ fontSize: 13, color: 'var(--mist)', padding: '9px 13px', background: 'rgba(147,245,116,.03)', border: '1px solid var(--border)', borderRadius: 8 }}>{l}</div>)}
            </div>}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {sc.questions.map((q, qi) => (
            <div key={qi}>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--white)', marginBottom: 9, display: 'flex', gap: 9, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--green)', fontWeight: 600, flexShrink: 0 }}>{qi + 1}.</span>
                <span>{q}</span>
              </p>
              <textarea
                value={answers[cur][qi]}
                onChange={e => updateAns(qi, e.target.value)}
                placeholder="Escreva sua resposta aqui…"
                style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 15px', color: 'var(--white)', fontSize: 13, fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'vertical', minHeight: 96, lineHeight: 1.65 }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
          <span style={{ fontSize: 12, color: saveOk ? 'var(--green)' : 'var(--t2)' }}>{saveStatus}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {cur > 0 && <button style={s.btnS} onClick={() => setCur(cur - 1)}>← Anterior</button>}
            {cur < 3
              ? <button style={{ ...s.btnP, width: 'auto', padding: '12px 26px' }} onClick={() => setCur(cur + 1)}>Próximo →</button>
              : <button style={{ ...s.btnP, width: 'auto', padding: '12px 26px' }} onClick={() => handleFinish(false)}>Finalizar desafio</button>
            }
          </div>
        </div>
      </main>
    </div>
  )
}

// ── FINISH ────────────────────────────────────────────────────
function Finish({ result }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ fontSize: 44, color: 'var(--green)', marginBottom: 22 }}>✦</div>
      <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 10 }}>Desafio <span style={{ color: 'var(--green)' }}>concluído</span></h2>
      <p style={{ fontSize: 14, color: 'var(--mist)', marginBottom: 36, maxWidth: 420 }}>Suas respostas foram registradas. O próximo passo é a apresentação para a banca, onde você vai explicar seu raciocínio em cada cenário.</p>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, width: '100%', textAlign: 'left', marginBottom: 28 }}>
        {[['Candidato', result.name], ['E-mail', result.email], ['Tempo utilizado', result.timeStr],
          ...SCENARIOS.map((sc, i) => [sc.tag + ' — ' + sc.title, result.answers[i].some(v => v.trim()) ? '✓ Respondido' : '— Não respondido'])
        ].map(([l, v], i, arr) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
            <span style={{ color: 'var(--mist)' }}>{l}</span>
            <span style={{ color: v.startsWith('✓') ? 'var(--green)' : v.startsWith('—') ? 'var(--t2)' : 'var(--white)', fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: 'var(--t2)' }}>Dúvidas? Entre em contato com o RH.</p>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState('welcome')
  const [user, setUser] = useState(null)
  const [result, setResult] = useState(null)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      {step === 'welcome' && <Welcome onNext={() => setStep('email')} />}
      {step === 'email' && <EmailScreen onStart={(n, e) => { setUser({ name: n, email: e }); setStep('challenge') }} />}
      {step === 'challenge' && <Challenge name={user.name} email={user.email} onFinish={r => { setResult(r); setStep('finish') }} />}
      {step === 'finish' && <Finish result={result} />}
    </div>
  )
}
