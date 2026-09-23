import React, { useState, useEffect } from 'react'
import { getSubmissions } from '../lib/supabase'
import { SCENARIOS } from '../lib/scenarios'

const LOGO = 'https://marca.bling.com.br/__l5e/assets-v1/6510914f-e5bd-4d68-a8ab-a547771c74d5/logo-verde-escuro.svg'
const ADMIN_PASSWORD = 'TesteL3@Bling123'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdErr, setPwdErr] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  const login = () => {
    if (pwd === ADMIN_PASSWORD) { setAuthed(true); loadData() }
    else setPwdErr(true)
  }

  const loadData = async () => {
    setLoading(true)
    try { setSubmissions(await getSubmissions()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const inp = { width: '100%', background: '#03302F', border: '1px solid rgba(147,245,116,0.15)', borderRadius: 10, padding: '13px 15px', color: '#fff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none' }

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(147,245,116,0.15)' }}>
        <img style={{ height: 26 }} src={LOGO} alt="Bling" />
        <span style={{ fontSize: 12, fontWeight: 500, color: '#93F574', border: '1px solid rgba(147,245,116,0.3)', padding: '4px 14px', borderRadius: 99 }}>Painel Admin</span>
      </header>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, maxWidth: 400, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 36, color: '#93F574', marginBottom: 20 }}>⬡</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>Acesso restrito</h2>
        <p style={{ fontSize: 14, color: '#B9C9C9', marginBottom: 28, textAlign: 'center' }}>Digite a senha para acessar o painel de avaliação.</p>
        <div style={{ width: '100%', marginBottom: 14 }}>
          <input style={inp} type="password" placeholder="Senha de acesso" value={pwd} onChange={e => { setPwd(e.target.value); setPwdErr(false) }} onKeyDown={e => e.key === 'Enter' && login()} />
          {pwdErr && <p style={{ fontSize: 12, color: '#E55B5B', marginTop: 5 }}>Senha incorreta.</p>}
        </div>
        <button style={{ background: '#93F574', color: '#002726', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 600, fontFamily: 'Inter,sans-serif', cursor: 'pointer', width: '100%' }} onClick={login}>Entrar</button>
      </div>
    </div>
  )

  const fmt = d => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(147,245,116,0.15)' }}>
        <img style={{ height: 26 }} src={LOGO} alt="Bling" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#B9C9C9' }}>{submissions.length} submissão{submissions.length !== 1 ? 'ões' : ''}</span>
          <button onClick={loadData} style={{ background: 'transparent', border: '1px solid rgba(147,245,116,0.3)', borderRadius: 8, padding: '6px 14px', color: '#93F574', fontSize: 13, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}>↻ Atualizar</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selected ? '320px 1fr' : '1fr', overflow: 'hidden', height: 'calc(100vh - 70px)' }}>
        {/* List */}
        <div style={{ overflowY: 'auto', padding: 28, borderRight: selected ? '1px solid rgba(147,245,116,0.15)' : 'none' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Submissões</h2>
          {loading && <p style={{ color: '#678A88', fontSize: 14 }}>Carregando…</p>}
          {!loading && submissions.length === 0 && <p style={{ color: '#678A88', fontSize: 14 }}>Nenhuma submissão ainda.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submissions.map(sub => (
              <div key={sub.id} onClick={() => setSelected(sub)} style={{ background: selected?.id === sub.id ? 'rgba(147,245,116,.09)' : '#03302F', border: `1px solid ${selected?.id === sub.id ? 'rgba(147,245,116,.3)' : 'rgba(147,245,116,.15)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{sub.name}</div>
                <div style={{ fontSize: 12, color: '#678A88', marginBottom: 6 }}>{sub.email}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, background: 'rgba(147,245,116,.1)', color: '#93F574', padding: '2px 8px', borderRadius: 99 }}>{sub.time_used}</span>
                  <span style={{ fontSize: 11, color: '#678A88' }}>{fmt(sub.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ overflowY: 'auto', padding: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{selected.name}</h2>
                <p style={{ fontSize: 14, color: '#678A88' }}>{selected.email} · {selected.time_used} · {fmt(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: '1px solid rgba(147,245,116,0.15)', borderRadius: 8, padding: '6px 12px', color: '#B9C9C9', fontSize: 13, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}>✕ Fechar</button>
            </div>

            {SCENARIOS.map((sc, i) => (
              <div key={i} style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(147,245,116,.15)' }}>
                  <span style={{ fontSize: 11, color: '#93F574', background: 'rgba(147,245,116,.1)', padding: '3px 10px', borderRadius: 99 }}>{sc.tag}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 500 }}>{sc.title}</h3>
                </div>
                {sc.questions.map((q, qi) => {
                  const key = `c${i+1}_q${qi+1}`
                  const val = selected[key]
                  return (
                    <div key={qi} style={{ marginBottom: 18 }}>
                      <p style={{ fontSize: 12, color: '#678A88', marginBottom: 6, display: 'flex', gap: 6 }}>
                        <span style={{ color: '#93F574', fontWeight: 600 }}>{qi+1}.</span>
                        <span>{q}</span>
                      </p>
                      <div style={{ background: '#03302F', border: '1px solid rgba(147,245,116,.15)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: val ? '#E3EBEB' : '#40615E', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                        {val || '— Não respondido'}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
