# Desafio Técnico — L3 Operações e Qualidade

Aplicação React para o processo seletivo interno do time de Suporte L3 do Bling.

## Como importar no Lovable

1. Suba este repositório no seu GitLab
2. Acesse [lovable.dev](https://lovable.dev)
3. Clique em **Import from GitLab**
4. Selecione este repositório
5. O Lovable vai criar o banco de dados Supabase automaticamente

## Banco de dados

O Lovable vai criar automaticamente a tabela `submissions` com as colunas:
- `id`, `created_at`
- `name`, `email`, `time_used`, `timed_out`
- `c1_q1` até `c4_q4` (respostas de cada pergunta)

## Rotas

- `/` — Desafio para o candidato
- `/admin` — Painel de avaliação (senha: TesteL3@Bling123)

## Variáveis de ambiente

O Lovable configura automaticamente:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
