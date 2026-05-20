import {
  ArrowLeftIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import './HandoffPage.css'

interface HandoffPageProps {
  homePath: string
}

const homeOrderItems = [
  {
    title: 'Topo',
    description: 'Identidade, saldo, troca Apostas/Cassino e trilho principal sempre visíveis no primeiro contexto.',
  },
  {
    title: 'Trilho',
    description: 'Entrada rápida por destaques, esporte e competições relevantes para o momento.',
  },
  {
    title: 'Banner de destaque',
    description: 'Oferta principal da Home geral, com evento, mercado ou promoção de maior impacto.',
  },
  {
    title: 'Conteúdo vivo e pré-jogo',
    description: 'Listas priorizadas por agora, hoje e próximos eventos úteis para apostar.',
  },
]

const validationItems = [
  'A competição aparece próxima do esporte ao qual pertence.',
  'A Home geral prioriza conteúdo ao vivo antes de hoje e amanhã.',
  'O banner não contradiz o filtro ativo do usuário.',
  'Estados vazios não quebram a ordem da página.',
  'A tela continua legível com poucos ou muitos eventos.',
]

export function HandoffPage({ homePath }: HandoffPageProps) {
  return (
    <main className="handoff-page">
      <header className="handoff-hero">
        <a className="handoff-hero__back-link" href={homePath}>
          <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
          Home
        </a>
        <p className="handoff-hero__eyebrow">Handoff</p>
        <h1 className="handoff-hero__title">Regras da Home</h1>
        <p className="handoff-hero__description">
          Decisões de produto traduzidas em comportamento esperado para o desenvolvedor implementar e validar.
        </p>
      </header>

      <nav className="handoff-nav" aria-label="Seções do handoff da Home">
        <a href="#objetivo">Objetivo</a>
        <a href="#trilho">Trilho</a>
        <a href="#banner">Banner</a>
        <a href="#conteudo">Conteúdo</a>
        <a href="#checklist">Checklist</a>
      </nav>

      <section className="handoff-section" id="objetivo">
        <div className="handoff-section__header">
          <p className="handoff-section__eyebrow">Visão geral</p>
          <h2>O papel da Home</h2>
        </div>
        <p className="handoff-lead">
          A Home deve responder rapidamente: o que está acontecendo agora, o que é relevante hoje e qual é o
          próximo caminho natural para apostar.
        </p>

        <div className="handoff-flow" aria-label="Ordem esperada da Home">
          {homeOrderItems.map((item, index) => (
            <article className="handoff-flow__item" key={item.title}>
              <span className="handoff-flow__index">{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="handoff-section" id="trilho">
        <div className="handoff-section__header">
          <p className="handoff-section__eyebrow">Regra 01</p>
          <h2>Trilho de esportes e competições</h2>
        </div>

        <article className="handoff-rule">
          <div className="handoff-rule__content">
            <h3>Regra</h3>
            <p>
              O trilho pode misturar esportes e competições, mas cada competição deve ficar agrupada junto do
              esporte ao qual pertence.
            </p>
          </div>
          <div className="handoff-rule__content">
            <h3>Motivo</h3>
            <p>
              A competição sozinha perde contexto. O usuário precisa entender rapidamente que Brasileirão pertence a
              Futebol e NBA pertence a Basquete.
            </p>
          </div>
          <div className="handoff-rule__content">
            <h3>Critério de validação</h3>
            <p>
              Ao renderizar o trilho, nenhuma competição pode aparecer antes de seu esporte pai ou distante do grupo
              desse esporte.
            </p>
          </div>
        </article>

        <div className="handoff-examples">
          <div className="handoff-example handoff-example--good">
            <CheckCircleIcon size={18} weight="fill" aria-hidden="true" />
            <div>
              <h3>Correto</h3>
              <p>Futebol, Brasileirão, Champions, Basquete, NBA, Tênis.</p>
            </div>
          </div>
          <div className="handoff-example handoff-example--bad">
            <WarningCircleIcon size={18} weight="fill" aria-hidden="true" />
            <div>
              <h3>Evitar</h3>
              <p>Futebol, NBA, Champions, Basquete, Brasileirão.</p>
            </div>
          </div>
        </div>

        <article className="handoff-note">
          <h3>Ordenação</h3>
          <p>
            A ordem deve refletir relevância do momento: eventos ao vivo, competições em destaque no dia, volume de
            jogos e interesse esperado do usuário. “Mais” fica no fim como expansão, não como prioridade.
          </p>
        </article>
      </section>

      <section className="handoff-section" id="banner">
        <div className="handoff-section__header">
          <p className="handoff-section__eyebrow">Regra 02</p>
          <h2>Banner de destaque</h2>
        </div>

        <article className="handoff-rule">
          <div className="handoff-rule__content">
            <h3>Regra</h3>
            <p>
              O banner deve representar a melhor oportunidade da Home geral: ao vivo, evento forte de hoje, odd
              aumentada, super combo ou novidade relevante.
            </p>
          </div>
          <div className="handoff-rule__content">
            <h3>Comportamento por contexto</h3>
            <p>
              Na Home geral, o banner aparece antes das listas. Quando o usuário entra em um esporte ou competição,
              banners genéricos devem sair se não conversarem com o contexto ativo.
            </p>
          </div>
          <div className="handoff-rule__content">
            <h3>Critério de validação</h3>
            <p>
              O banner precisa ter rótulo de tempo ou contexto, nome do evento ou competição e ação clara quando
              houver mercado selecionável.
            </p>
          </div>
        </article>
      </section>

      <section className="handoff-section" id="conteudo">
        <div className="handoff-section__header">
          <p className="handoff-section__eyebrow">Regra 03</p>
          <h2>Conteúdo abaixo do banner</h2>
        </div>

        <article className="handoff-rule">
          <div className="handoff-rule__content">
            <h3>Home geral</h3>
            <p>
              Depois do banner, a Home deve priorizar promoções aplicáveis, eventos ao vivo, ofertas e pré-jogo. A
              leitura esperada é: agora, hoje, próximos.
            </p>
          </div>
          <div className="handoff-rule__content">
            <h3>Esporte selecionado</h3>
            <p>
              Ao selecionar um esporte, o conteúdo passa a ser filtrado por esse esporte. Ofertas e calendário devem
              substituir a vitrine geral.
            </p>
          </div>
          <div className="handoff-rule__content">
            <h3>Competição selecionada</h3>
            <p>
              Ao abrir uma competição, a página deve trazer listagem ao vivo, hoje e amanhã, preservando o contexto do
              esporte de origem.
            </p>
          </div>
        </article>

        <div className="handoff-priority">
          <span>Prioridade de eventos</span>
          <ol>
            <li>Ao vivo</li>
            <li>Hoje</li>
            <li>Amanhã</li>
            <li>Próximos relevantes</li>
          </ol>
        </div>
      </section>

      <section className="handoff-section" id="checklist">
        <div className="handoff-section__header">
          <p className="handoff-section__eyebrow">Validação</p>
          <h2>Checklist de handoff</h2>
        </div>

        <ul className="handoff-checklist">
          {validationItems.map((item) => (
            <li key={item}>
              <CheckCircleIcon size={18} weight="fill" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
