import { HelpCategory } from '../models/help-topic';

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'primeiros-passos',
    title: 'Primeiros passos',
    description: 'Conheça o painel e o que cada cargo pode fazer.',
    icon: 'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216 288-288-56-56-232 232-112-112-56 56 168 168Z',
    articles: [
      { id: 'navegar-no-painel', title: 'Como navegar pelo painel', summary: 'Os links da sidebar levam direto a cada seção da home. Cadastros e Outros abrem mais opções. No celular o menu vira uma faixa no topo e as tabelas viram cards.', keywords: ['sidebar', 'menu', 'barra lateral', 'atalhos', 'home', 'seções', 'celular', 'mobile', 'responsivo', 'tela inicial'] },
      { id: 'cargos-e-permissoes', title: 'Cargos e permissões', summary: 'Proprietário acessa todos os quiosques e cadastra gerentes. Gerente cuida do próprio quiosque e da equipe. Funcionário acompanha pedidos e itens. Telas sem permissão levam de volta à home.', keywords: ['proprietário', 'gerente', 'funcionário', 'cargos', 'perfis', 'acesso', 'não vejo', 'sem permissão', 'redirecionado', 'quiosque vinculado'] },
    ],
  },
  {
    id: 'conta-acesso',
    title: 'Conta e acesso',
    description: 'Cadastro, login e dados do proprietário.',
    icon: 'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z',
    articles: [
      { id: 'criar-conta-e-entrar', title: 'Criar conta e entrar no painel', summary: 'Proprietários criam a conta em "Crie sua conta!" na tela de login. Para entrar, informe credencial e senha. "Lembrar de mim" mantém a sessão após fechar o navegador.', keywords: ['cadastro', 'criar conta', 'login', 'entrar', 'credencial', 'senha', 'lembrar de mim', 'sessão', 'primeiro acesso', 'sair', 'logout'] },
      { id: 'alterar-perfil', title: 'Alterar perfil e senha', summary: 'No menu Outros > Alterar perfil, o proprietário edita nome, e-mail, telefone, foto e senha (mínimo de 8 caracteres). Trocar o e-mail exige entrar novamente.', keywords: ['editar perfil', 'dados pessoais', 'trocar senha', 'alterar senha', 'senha atual', 'foto', 'e-mail', 'proprietário'], minRole: 'proprietario' },
    ],
  },
  {
    id: 'quiosques',
    title: 'Quiosques',
    description: 'Cadastre, edite e acompanhe cada unidade.',
    icon: 'M841-518v318q0 33-23.5 56.5T761-120H201q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518Z',
    articles: [
      { id: 'selecionar-quiosque', title: 'Selecionar e filtrar quiosques', summary: 'Na sidebar, o proprietário escolhe um quiosque ou "Todos"; pedidos, equipe e itens seguem a escolha. Na seção Quiosques, filtre por abertos ou fechados.', keywords: ['alternar', 'trocar', 'seletor', 'todos', 'quiosque selecionado', 'abertos', 'fechados', 'filtro', 'vários quiosques'], minRole: 'proprietario' },
      { id: 'card-do-quiosque', title: 'Entendendo o card do quiosque', summary: 'Mostra imagem, aberto ou fechado, nota, horário, categorias, pedidos de hoje, tempo médio, faturamento e ticket médio. O status é calculado pelo horário de funcionamento.', keywords: ['card', 'aberto', 'fechado', 'nota', 'faturamento', 'ticket médio', 'tempo médio', 'pedidos hoje', 'resumo', 'status'], minRole: 'gerente' },
      { id: 'cadastrar-quiosque', title: 'Cadastrar ou editar um quiosque', summary: 'Informe nome, CNPJ, e-mail, endereço, localização no mapa, horário, dias de funcionamento, distância de atendimento (m) e imagem. Editar é pelo lápis no card.', keywords: ['novo quiosque', 'cadastro', 'editar', 'cnpj', 'cep', 'uf', 'cidade', 'mapa', 'latitude', 'longitude', 'horário', 'dias da semana', 'distância', 'banner', 'imagem', 'lápis'], minRole: 'gerente' },
    ],
  },
  {
    id: 'equipe',
    title: 'Equipe',
    description: 'Cadastre funcionários e acompanhe os turnos.',
    icon: 'M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Z',
    articles: [
      { id: 'cadastrar-funcionario', title: 'Cadastrar e editar funcionários', summary: 'Use Cadastros > Funcionários e informe nome, e-mail, telefone, quiosque, cargo, turno e dias. O proprietário cadastra Funcionário ou Gerente; o gerente, só Funcionário. E-mail e quiosque não mudam na edição.', keywords: ['novo funcionário', 'adicionar', 'colaborador', 'cargo', 'turno', 'editar', 'telefone', 'e-mail', 'já existe', 'duplicado'], minRole: 'gerente' },
      { id: 'equipe-turnos-remocao', title: 'Acompanhar a equipe e remover funcionários', summary: 'A seção Equipe mostra quiosque, cargo, turno e se a pessoa está em turno agora. Para remover, abra a edição e use "Remover funcionário"; a ação não pode ser desfeita.', keywords: ['lista', 'tabela', 'em turno', 'fora de turno', 'status', 'remover', 'excluir', 'desligar', 'equipe'], minRole: 'gerente' },
    ],
  },
  {
    id: 'pedidos',
    title: 'Pedidos',
    description: 'Acompanhe, atualize e monte pedidos.',
    icon: 'M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Z',
    articles: [
      { id: 'acompanhar-pedidos', title: 'Acompanhar e filtrar pedidos', summary: 'A lista mostra por padrão os pedidos em andamento. Use os filtros para ver Finalizado, Avaliado, Cancelado ou Recusado. Itens com "-" foram removidos e com "+" são complementos.', keywords: ['fila', 'lista', 'status', 'filtro', 'esperando confirmação', 'preparando', 'entregando', 'finalizado', 'cancelado', 'recusado', 'ingredientes removidos', 'complementos', 'desatualizado', 'tentar novamente'] },
      { id: 'atualizar-status-pedido', title: 'Aceitar, avançar e finalizar pedidos', summary: 'Em "Esperando confirmação", o check aceita e o X recusa. Depois, "Avançar" leva a Preparando, Entregando e Finalizado. Pedido do cliente pede o código de 4 caracteres; pedido interno só pede confirmação.', keywords: ['aceitar', 'recusar', 'rejeitar', 'avançar', 'finalizar', 'código', 'código incorreto', 'verificação', 'balcão', 'pedido interno', 'mudar status'] },
      { id: 'criar-pedido', title: 'Montar um pedido no painel', summary: 'Em "Criar pedido", escolha o quiosque (proprietário), busque itens, remova ingredientes, adicione complementos e ajuste quantidades. No carrinho, o nome do cliente é opcional e, se vazio, vira "Balcão".', keywords: ['novo pedido', 'criar pedido', 'carrinho', 'buscar item', 'cardápio', 'quantidade', 'complemento', 'cliente', 'balcão', 'total'] },
    ],
  },
  {
    id: 'itens-cardapio',
    title: 'Itens e cardápio',
    description: 'Gerencie produtos, categorias e preços.',
    icon: 'M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm160-640h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720Z',
    articles: [
      { id: 'cadastrar-item', title: 'Cadastrar, editar e remover itens', summary: 'Use Cadastros > Item do cardápio e informe imagem, nome, quiosque, categoria, descrição e valor (maior que zero). Depois de salvo, quiosque e categoria ficam bloqueados. Remover pede confirmação.', keywords: ['novo item', 'produto', 'cardápio', 'editar', 'lápis', 'remover', 'excluir', 'valor', 'preço', 'imagem', 'prévia', 'adicionar outro'] },
      { id: 'ingredientes-complementos-categorias', title: 'Ingredientes, complementos e categorias', summary: 'Cadastre os ingredientes do item (o cliente pode removê-los) e complementos com preço. Escolha a categoria do quiosque ou crie uma nova pelo botão "+".', keywords: ['ingredientes', 'complementos', 'extras', 'adicionais', 'categoria', 'criar categoria', 'lanches', 'bebidas', 'porções', 'duplicado'] },
    ],
  },
  {
    id: 'problemas-comuns',
    title: 'Solução de problemas',
    description: 'Resolva os imprevistos mais comuns.',
    icon: 'M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM40-120l440-760 440 760H40Z',
    articles: [
      { id: 'avisos-e-erros-comuns', title: 'Avisos e erros mais comuns', summary: 'Credencial inválida: confira os dados. Sem quiosque vinculado: peça ao proprietário. Falha de conexão ou sessão expirada: recarregue ou entre de novo. Imagem não enviada: reenvie na edição. Campos inválidos: corrija os destacados.', keywords: ['erro', 'credencial ou senha inválida', 'não vinculado', 'sem quiosque', 'conexão', 'api', 'sessão expirou', 'não salva', 'falha', 'imagem não aparece', 'reenviar', 'campo obrigatório', 'cnpj inválido', 'e-mail inválido', 'senhas não coincidem', '5 mb', 'telefone'] },
    ],
  },
];
