import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import imgPromoPiggy from '../../assets/img-promo-piggy.png'
import imgPromoRabbit from '../../assets/img-promo-rabbit.png'
import imgMissaoVerdao from '../../assets/imgMissaoVerdao.png'
import type { ProductMode } from '../../types/home'

type PromotionsFilterId = 'todos' | ProductMode

interface MissionPromotionCard {
  id: string
  expiresLabel: string
  mediaImage?: string
  mediaTitleLines: string[]
  products: ProductMode[]
  title: string
  description: string
}

interface PromotionsMissionsSectionProps {
  activeFilter: PromotionsFilterId
}

const missionCards: MissionPromotionCard[] = [
  {
    id: 'palmeiras-libertadores',
    expiresLabel: 'Termina em 3 dias',
    mediaImage: imgMissaoVerdao,
    mediaTitleLines: ['Aposte no', 'Verdão'],
    products: ['apostas'],
    title: 'Aposte no Palmeiras na Liberta e ganhe 10 Créditos.',
    description: 'Aposte R$50 no jogo do Palmeiras na Libertadores e ganhe R$10 em créditos para usar no Pitaco.',
  },
  {
    id: 'fortune-rabbit-coroas',
    expiresLabel: 'Termina em 3 dias',
    mediaImage: imgPromoRabbit,
    mediaTitleLines: ['Missão', 'Fortune Rabbit'],
    products: ['cassino'],
    title: 'Aposte no Fortune Rabbit e ganhe 50 coroas.',
    description: 'Aposte R$100 no jogo Fortune Rabbit e ganhe 50 coroas para continuar jogando no Rei.',
  },
  {
    id: 'lucky-piggy-rodadas',
    expiresLabel: 'Termina em 3 dias',
    mediaImage: imgPromoPiggy,
    mediaTitleLines: ['Missão', 'Lucky Piggy'],
    products: ['cassino'],
    title: 'Aposte no Lucky Piggy e ganhe 5 rodadas.',
    description: 'Aposte R$20 no Lucky Piggy e ganhe 5 rodadas grátis para tentar a sorte no Pitaco.',
  },
]

const productLabels: Record<ProductMode, string> = {
  apostas: 'Apostas',
  cassino: 'Cassino',
}

export function PromotionsMissionsSection({ activeFilter }: PromotionsMissionsSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const visibleCards = missionCards.filter((card) =>
    activeFilter === 'todos' || card.products.includes(activeFilter)
  )

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0
    }
  }, [activeFilter])

  if (visibleCards.length === 0) return null

  const snapToNearestCard = (dragDelta: number = 0) => {
    if (!scrollRef.current) return
    const cardWidth = 304 + 8
    const currentScroll = scrollRef.current.scrollLeft
    const currentIndex = currentScroll / cardWidth

    let targetIndex: number
    if (dragDelta > 30) {
      targetIndex = Math.ceil(currentIndex)
    } else if (dragDelta < -30) {
      targetIndex = Math.floor(currentIndex)
    } else {
      targetIndex = Math.round(currentIndex)
    }

    const maxIndex = Math.max(
      0,
      Math.ceil((scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / cardWidth)
    )
    targetIndex = Math.max(0, Math.min(targetIndex, maxIndex))

    scrollRef.current.scrollTo({
      left: targetIndex * cardWidth,
      behavior: 'smooth',
    })
  }

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    startX.current = event.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const handleMouseUp = () => {
    const delta = scrollRef.current ? scrollRef.current.scrollLeft - scrollLeft.current : 0
    setIsDragging(false)
    snapToNearestCard(delta)
  }

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return
    event.preventDefault()
    const x = event.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseLeave = () => {
    if (!isDragging) return
    const delta = scrollRef.current ? scrollRef.current.scrollLeft - scrollLeft.current : 0
    setIsDragging(false)
    snapToNearestCard(delta)
  }

  return (
    <section id="section-promocoes-missoes" className="promotions-missions-section">
      <div className="promotions-missions-section__header">
        <h2 className="promotions-missions-section__title">Missões</h2>
      </div>

      <div
        className={[
          'promotions-missions-section__list',
          isDragging ? 'promotions-missions-section__list--dragging' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="Cards de missões promocionais"
      >
        {visibleCards.map((card) => (
          <article key={card.id} className="promotions-mission-card">
            <div
              className="promotions-mission-card__media"
              style={
                card.mediaImage
                  ? ({
                      '--promotions-mission-card-image': `url(${card.mediaImage})`,
                    } as CSSProperties)
                  : undefined
              }
            >
              <div className="promotions-mission-card__expires">
                <span className="promotions-mission-card__expires-dot" aria-hidden="true" />
                <span className="promotions-mission-card__expires-text">{card.expiresLabel}</span>
              </div>

              <div className="promotions-mission-card__media-title">
                {card.mediaTitleLines.map((line) => (
                  <span key={line} className="promotions-mission-card__media-title-line">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="promotions-mission-card__body">
              <div className="promotions-mission-card__tags" aria-label="Produtos">
                {card.products.map((product) => (
                  <span key={product} className="promotions-mission-card__tag">
                    {productLabels[product]}
                  </span>
                ))}
              </div>

              <h3 className="promotions-mission-card__title">{card.title}</h3>
              <p className="promotions-mission-card__description">{card.description}</p>

              <div className="promotions-mission-card__actions">
                <button type="button" className="promotions-mission-card__button">
                  Label
                </button>
                <button type="button" className="promotions-mission-card__link-button">
                  Saiba Mais
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
