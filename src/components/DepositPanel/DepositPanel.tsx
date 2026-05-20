import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { CaretLeftIcon, PixLogoIcon } from '@phosphor-icons/react'
import { StakeKeyboard, type StakeKeyboardKey } from '../StakeKeyboard'
import './DepositPanel.css'

interface DepositPanelProps {
  isOpen: boolean
  onClose: () => void
}

type PanelMotionState = 'entering' | 'open' | 'closing'

const maxDepositCents = 99999999
const quickDepositOptions = [
  { label: 'R$25', amountCents: 2500 },
  { label: 'R$50', amountCents: 5000 },
  { label: 'R$150', amountCents: 15000 },
  { label: 'R$250', amountCents: 25000 },
]

const formatDepositAmount = (amountCents: number) => (
  (amountCents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
)

export function DepositPanel({ isOpen, onClose }: DepositPanelProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const [motionState, setMotionState] = useState<PanelMotionState>('entering')
  const [amountCents, setAmountCents] = useState(0)
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const openTimerRef = useRef<number | null>(null)
  const openFrameRef = useRef<number | null>(null)
  const shouldRenderRef = useRef(false)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return

    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }, [])

  const clearOpenFrame = useCallback(() => {
    if (openFrameRef.current === null) return

    window.cancelAnimationFrame(openFrameRef.current)
    openFrameRef.current = null
  }, [])

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current === null) return

    window.clearTimeout(openTimerRef.current)
    openTimerRef.current = null
  }, [])

  const requestClose = useCallback(() => {
    if (motionState === 'closing') return
    onClose()
  }, [motionState, onClose])

  const applyNumberKey = (key: string) => {
    setAmountCents((currentAmountCents) => {
      const nextDigits = `${currentAmountCents}${key}`.replace(/^0+(?=\d)/, '')
      const nextAmountCents = Math.min(Number(nextDigits), maxDepositCents)

      return Number.isFinite(nextAmountCents) ? nextAmountCents : currentAmountCents
    })
  }

  const removeNumberKey = () => {
    setAmountCents((currentAmountCents) => Math.floor(currentAmountCents / 10))
  }

  const openCalculator = () => {
    setIsCalculatorVisible(true)
  }

  const handleAmountPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    openCalculator()
  }

  const handleAmountClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) openCalculator()
  }

  const handleQuickOption = (amountCents: number) => {
    setAmountCents(amountCents)
    openCalculator()
  }

  const handleQuickOptionPointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    amountCents: number
  ) => {
    event.preventDefault()
    handleQuickOption(amountCents)
  }

  const handleQuickOptionClick = (
    event: MouseEvent<HTMLButtonElement>,
    amountCents: number
  ) => {
    if (event.detail === 0) handleQuickOption(amountCents)
  }

  const handleKeypadKey = (key: StakeKeyboardKey) => {
    if (key === 'ok') {
      setIsCalculatorVisible(false)
      return
    }

    openCalculator()

    if (key === 'backspace') {
      removeNumberKey()
      return
    }

    applyNumberKey(key)
  }

  const handleKeyPointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    key: StakeKeyboardKey
  ) => {
    event.preventDefault()
    handleKeypadKey(key)
  }

  const handleKeyClick = (
    event: MouseEvent<HTMLButtonElement>,
    key: StakeKeyboardKey
  ) => {
    if (event.detail === 0) handleKeypadKey(key)
  }

  useEffect(() => {
    shouldRenderRef.current = shouldRender
  }, [shouldRender])

  useEffect(() => {
    clearCloseTimer()
    clearOpenFrame()
    clearOpenTimer()

    if (isOpen) {
      openTimerRef.current = window.setTimeout(() => {
        openTimerRef.current = null
        setShouldRender(true)
        setMotionState('entering')
        openFrameRef.current = window.requestAnimationFrame(() => {
          openFrameRef.current = window.requestAnimationFrame(() => {
            openFrameRef.current = null
            setMotionState('open')
          })
        })
      }, 0)
      return () => {
        clearCloseTimer()
        clearOpenFrame()
        clearOpenTimer()
      }
    }

    if (!shouldRenderRef.current) return undefined

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      setMotionState('closing')
      closeTimerRef.current = window.setTimeout(() => {
        setShouldRender(false)
        setMotionState('entering')
        setAmountCents(0)
        setIsCalculatorVisible(false)
        closeTimerRef.current = null
      }, 320)
    }, 0)

    return () => {
      clearCloseTimer()
      clearOpenFrame()
      clearOpenTimer()
    }
  }, [clearCloseTimer, clearOpenFrame, clearOpenTimer, isOpen])

  useEffect(() => () => {
    clearCloseTimer()
    clearOpenFrame()
    clearOpenTimer()
  }, [clearCloseTimer, clearOpenFrame, clearOpenTimer])

  useEffect(() => {
    if (!shouldRender) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [shouldRender])

  useEffect(() => {
    if (!shouldRender) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose()
        return
      }

      if (!isCalculatorVisible) return

      if (/^[0-9]$/.test(event.key)) {
        applyNumberKey(event.key)
        return
      }

      if (event.key === 'Backspace') {
        removeNumberKey()
        return
      }

      if (event.key === 'Enter') {
        setIsCalculatorVisible(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCalculatorVisible, requestClose, shouldRender])

  if (!shouldRender) return null

  const amount = formatDepositAmount(amountCents)
  const hasAmount = amountCents > 0

  return createPortal(
    <div className="deposit-panel__container">
      <div
        className={`deposit-panel__overlay deposit-panel__overlay--${motionState}`}
        onClick={requestClose}
      />
      <aside
        className={[
          'deposit-panel',
          `deposit-panel--${motionState}`,
          isCalculatorVisible ? 'deposit-panel--calculator-visible' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Depositar"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="deposit-panel__header">
          <div className="header__bg-dark" aria-hidden="true" />
          <div className="header__bg-gradient" aria-hidden="true" />
          <button type="button" className="deposit-panel__back" aria-label="Voltar" onClick={requestClose}>
            <CaretLeftIcon aria-hidden="true" weight="bold" />
          </button>
          <h2 className="deposit-panel__title">Depositar</h2>
        </header>

        <div className="deposit-panel__content">
          <section className="deposit-panel__amount-section" aria-label="Valor do depósito">
            <button
              type="button"
              className="deposit-panel__amount-display"
              aria-label={`Editar valor do depósito: R$ ${amount}`}
              onPointerDown={handleAmountPointerDown}
              onClick={handleAmountClick}
            >
              <span className="deposit-panel__currency">R$</span>
              <span className={`deposit-panel__amount${hasAmount ? ' deposit-panel__amount--filled' : ''}`}>
                {amount}
              </span>
            </button>

            <div className="deposit-panel__quick-options" aria-label="Valores rápidos">
              {quickDepositOptions.map((option) => (
                <button
                  type="button"
                  className="deposit-panel__quick-option"
                  key={option.amountCents}
                  onPointerDown={(event) => handleQuickOptionPointerDown(event, option.amountCents)}
                  onClick={(event) => handleQuickOptionClick(event, option.amountCents)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <footer className="deposit-panel__footer">
            <div className="deposit-panel__payment-method">
              <span>Método de pagamento</span>
              <span className="deposit-panel__pix">
                <PixLogoIcon aria-hidden="true" weight="fill" />
                Pix
              </span>
            </div>

            <div className="deposit-panel__keyboard-stage">
              <StakeKeyboard
                isOpen={isCalculatorVisible}
                ariaLabel="Teclado de depósito"
                className="deposit-panel__stake-keyboard"
                onKeyPointerDown={handleKeyPointerDown}
                onKeyClick={handleKeyClick}
              />
            </div>

            <div className="deposit-panel__confirm-area">
              <button
                type="button"
                className="deposit-panel__confirm"
                disabled={!hasAmount}
              >
                Gerar código Pix
              </button>
              <p className="deposit-panel__legal">
                O Rei do Pitaco é autorizado e em conformidade com as leis
              </p>
            </div>
          </footer>
        </div>
      </aside>
    </div>,
    document.body
  )
}
