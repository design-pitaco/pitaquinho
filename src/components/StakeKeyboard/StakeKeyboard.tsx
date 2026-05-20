import type { MouseEvent, PointerEvent } from 'react'
import { BackspaceIcon } from '@phosphor-icons/react'
import './StakeKeyboard.css'

const stakeKeyboardKeys = [
  { key: '1', label: '1', variant: 'wide' },
  { key: '2', label: '2', variant: 'wide' },
  { key: '3', label: '3', variant: 'wide' },
  { key: '4', label: '4', variant: 'wide' },
  { key: '5', label: '5', variant: 'wide' },
  { key: '6', label: '6', variant: 'wide' },
  { key: '7', label: '7', variant: 'wide' },
  { key: '8', label: '8', variant: 'wide' },
  { key: '9', label: '9', variant: 'wide' },
  { key: 'backspace', label: 'Apagar', variant: 'wide' },
  { key: '0', label: '0', variant: 'wide' },
  { key: 'ok', label: 'OK', variant: 'wide' },
] as const

export type StakeKeyboardKey = typeof stakeKeyboardKeys[number]['key']

interface StakeKeyboardProps {
  id?: string
  isOpen: boolean
  ariaLabel?: string
  className?: string
  onKeyPointerDown: (event: PointerEvent<HTMLButtonElement>, key: StakeKeyboardKey) => void
  onKeyClick: (event: MouseEvent<HTMLButtonElement>, key: StakeKeyboardKey) => void
}

export function StakeKeyboard({
  id,
  isOpen,
  ariaLabel = 'Teclado de valor',
  className,
  onKeyPointerDown,
  onKeyClick,
}: StakeKeyboardProps) {
  const keyboardClassName = [
    'betslip-page__stake-keyboard',
    isOpen ? 'betslip-page__stake-keyboard--open' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      id={id}
      className={keyboardClassName}
      aria-label={ariaLabel}
      aria-hidden={!isOpen}
    >
      {stakeKeyboardKeys.map((key) => (
        <button
          key={key.key}
          type="button"
          className={`betslip-page__stake-key betslip-page__stake-key--${key.variant}`}
          aria-label={key.key === 'backspace' ? 'Apagar valor' : undefined}
          tabIndex={isOpen ? undefined : -1}
          onPointerDown={(event) => onKeyPointerDown(event, key.key)}
          onClick={(event) => onKeyClick(event, key.key)}
        >
          {key.key === 'backspace' ? (
            <BackspaceIcon aria-hidden="true" weight="bold" />
          ) : (
            key.label
          )}
        </button>
      ))}
    </div>
  )
}
