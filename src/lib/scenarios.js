export const SCENARIOS = [
  {
    tag: 'Cenário 01',
    title: 'Triagem de Ouvidoria',
    ctx: 'O time de qualidade te encaminha uma Ouvidoria de um cliente Elite com as seguintes informações:',
    quote: '"Cliente relata que está com erro ao emitir nota fiscal desde sexta-feira. Já tentou refazer o processo algumas vezes e o erro persiste. Segue print da tela de erro anexo."',
    ctx2: 'O print mostra uma mensagem genérica de erro do sistema, sem código específico. O time de qualidade não conseguiu identificar a causa e encaminhou para você por não ter conhecimento técnico para avançar na análise.',
    questions: [
      'Com as informações que chegaram, o que você consegue identificar de imediato? O que ainda está faltando?',
      'Quais são os primeiros passos que você toma — o que você busca no sistema e por quê?',
      'Durante a sua investigação, como você mantém o time de qualidade informado sobre o andamento?',
      'Após investigar, você identifica que é um bug real que precisa do especialista de Fiscal. O que você entrega para ele — e em que formato — para que ele avance sem recomeçar do zero?',
      'Como você define a prioridade desse caso considerando que o cliente é Elite e está sem emitir NF há 3 dias?',
    ],
  },
  {
    tag: 'Cenário 02',
    title: 'Gestão de Incidente',
    ctx: 'São 10h de uma segunda-feira. O sistema está com lentidão generalizada. Em 15 minutos, 47 tickets foram abertos por clientes diferentes relatando o mesmo problema. O time de Desenvolvimento já está investigando, mas ainda não tem previsão de resolução.\n\nNo Bling, quando há um incidente, é criado um aviso visível para a equipe de atendimento e para os clientes na plataforma. Ao final, uma mensagem de encerramento é enviada para todos os clientes impactados.',
    questions: [
      'Quais são suas prioridades nos primeiros 10 minutos?',
      'Escreva o texto do aviso de incidente que você criaria no sistema — será visto pela equipe de atendimento e pelos clientes ao mesmo tempo. Ainda não há previsão de resolução.',
      'Como você acompanha e atualiza o incidente enquanto o time de Desenvolvimento investiga? O que você monitora?',
      'O problema é resolvido 2 horas depois. Escreva a mensagem de encerramento que será enviada para todos os clientes impactados.',
    ],
  },
  {
    tag: 'Cenário 03',
    title: 'Priorização sob pressão',
    ctx: 'É uma terça-feira de manhã e chegaram as seguintes demandas ao mesmo tempo:',
    list: [
      'A) Ouvidoria de um cliente Diamante aberta há 5 dias sem resposta, sobre uma nota fiscal emitida com erro',
      'B) Cliente Elite ligando para o suporte relatando que não consegue emitir nenhuma NF desde ontem',
      'C) 12 tickets de clientes Add-on com o mesmo erro de integração — todos abertos hoje',
      'D) O time de L2 pedindo orientação sobre como tratar um tipo de chamado que está gerando muitas devoluções',
      'E) Solicitação do time de CSM para entender o status de um bug que está afetando uma conta estratégica',
    ],
    questions: [
      'Em que ordem você trata cada uma dessas demandas? Justifique.',
      'Alguma delas você delegaria ou redirecionaria? Para quem e por quê?',
      'Como você comunica para quem está esperando que ainda não foi atendido?',
    ],
  },
  {
    tag: 'Cenário 04',
    title: 'Processo e documentação',
    ctx: 'Você percebe que nos últimos 2 meses o time de L2 escalou para o L3 mais de 40 chamados sobre o mesmo tema — erro de configuração de uma integração específica — sendo que a maioria poderia ter sido resolvida no próprio L2 com o procedimento correto.',
    questions: [
      'Como você confirma que o problema é falta de processo e não falta de capacidade técnica do L2?',
      'O que você faz para resolver isso de forma definitiva — não só para esse caso, mas para evitar que aconteça com outros temas?',
      'Escreva um exemplo de como seria o início de um procedimento ou artigo de base de conhecimento para esse cenário.',
      'Como você mede se a solução funcionou?',
    ],
  },
]
