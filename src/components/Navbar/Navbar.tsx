import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import './Navbar.css'

import { productNavbarConfigs } from '../../data/homeProducts'
import { useSlidingActiveIndicator } from '../../hooks/useSlidingActiveIndicator'
import type { ProductMode } from '../../types/home'
import type { HeaderVisualVariant } from '../Header'

interface NavbarProps {
  activeProduct?: ProductMode
  visualVariant?: HeaderVisualVariant
  activeItemId?: string
  onItemSelect?: (itemId: string) => void
}

const navbarLiquidItemSwitchMs = 560

const isIosWebKitBrowser = () => {
  if (typeof navigator === 'undefined') return false

  const userAgent = navigator.userAgent || ''
  const platform = navigator.platform || ''

  return /iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function Navbar({
  activeProduct = 'apostas',
  visualVariant = 'default',
  activeItemId: controlledActiveItemId,
  onItemSelect,
}: NavbarProps = {}) {
  const navbarConfig = productNavbarConfigs[activeProduct]
  const isControlledActiveItem = controlledActiveItemId !== undefined
  const configuredActiveItemId = controlledActiveItemId ?? navbarConfig.activeItemId
  const isLiquidGlassV2 = visualVariant === 'liquid-glass-new'
  const useIosLiquidFallback = isLiquidGlassV2 && isIosWebKitBrowser()
  const [selectedItemId, setSelectedItemId] = useState(configuredActiveItemId)
  const [isItemSwitching, setIsItemSwitching] = useState(false)
  const itemsRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const pointerItemSelectionRef = useRef<string | null>(null)
  const pointerItemSelectionResetTimerRef = useRef<number | null>(null)
  const itemSwitchingFrameRef = useRef<number | null>(null)
  const itemSwitchingResetTimerRef = useRef<number | null>(null)
  const availableItemIds = [
    ...navbarConfig.mainItems.map((item) => item.id),
    navbarConfig.searchItem.id,
  ]
  const activeItemId = availableItemIds.includes(selectedItemId)
    ? selectedItemId
    : navbarConfig.activeItemId
  const activeMainItemId = navbarConfig.mainItems.some((item) => item.id === activeItemId)
    ? activeItemId
    : null
  const navClassName = [
    'navbar',
    isLiquidGlassV2 ? 'navbar--liquid-v2' : '',
    useIosLiquidFallback ? 'navbar--liquid-v2-ios' : '',
    isLiquidGlassV2 ? 'navbar--liquid-v2-casino' : '',
    isLiquidGlassV2 && isItemSwitching ? 'navbar--liquid-item-switching' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const panelClassName = ['navbar__panel', isLiquidGlassV2 ? 'navbar__panel--liquid-v2' : '']
    .filter(Boolean)
    .join(' ')

  const clearPointerItemSelectionResetTimer = useCallback(() => {
    if (pointerItemSelectionResetTimerRef.current === null) return

    window.clearTimeout(pointerItemSelectionResetTimerRef.current)
    pointerItemSelectionResetTimerRef.current = null
  }, [])

  const clearItemSwitchingTimers = useCallback(() => {
    if (itemSwitchingFrameRef.current !== null) {
      window.cancelAnimationFrame(itemSwitchingFrameRef.current)
      itemSwitchingFrameRef.current = null
    }

    if (itemSwitchingResetTimerRef.current !== null) {
      window.clearTimeout(itemSwitchingResetTimerRef.current)
      itemSwitchingResetTimerRef.current = null
    }
  }, [])

  const restartLiquidItemMotion = useCallback(() => {
    if (!isLiquidGlassV2) return

    clearItemSwitchingTimers()
    setIsItemSwitching(false)

    itemSwitchingFrameRef.current = window.requestAnimationFrame(() => {
      itemSwitchingFrameRef.current = null
      setIsItemSwitching(true)
      itemSwitchingResetTimerRef.current = window.setTimeout(() => {
        setIsItemSwitching(false)
        itemSwitchingResetTimerRef.current = null
      }, navbarLiquidItemSwitchMs)
    })
  }, [clearItemSwitchingTimers, isLiquidGlassV2])

  const selectNavbarItem = useCallback((itemId: string) => {
    restartLiquidItemMotion()
    if (!isControlledActiveItem) {
      setSelectedItemId(itemId)
    }
    onItemSelect?.(itemId)
  }, [isControlledActiveItem, onItemSelect, restartLiquidItemMotion])

  useEffect(() => {
    setSelectedItemId(configuredActiveItemId)
  }, [configuredActiveItemId])

  const handleItemPointerDown = (itemId: string) => (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    pointerItemSelectionRef.current = itemId
    clearPointerItemSelectionResetTimer()
    pointerItemSelectionResetTimerRef.current = window.setTimeout(() => {
      pointerItemSelectionRef.current = null
      pointerItemSelectionResetTimerRef.current = null
    }, 800)

    selectNavbarItem(itemId)
  }

  const handleItemClick = (itemId: string) => () => {
    if (pointerItemSelectionRef.current === itemId) {
      pointerItemSelectionRef.current = null
      clearPointerItemSelectionResetTimer()
      return
    }

    selectNavbarItem(itemId)
  }

  const getActiveMainItemElement = useCallback(() => (
    activeMainItemId ? itemRefs.current[activeMainItemId] : null
  ), [activeMainItemId])

  useSlidingActiveIndicator({
    activeKey: activeMainItemId,
    containerRef: itemsRef,
    getActiveElement: getActiveMainItemElement,
    readyClassName: 'navbar__items--indicator-ready',
    variablePrefix: 'navbar',
  })

  useEffect(() => () => {
    clearPointerItemSelectionResetTimer()
    clearItemSwitchingTimers()
  }, [clearItemSwitchingTimers, clearPointerItemSelectionResetTimer])

  return (
    <nav className={navClassName}>
      {isLiquidGlassV2 && !useIosLiquidFallback ? (
        <svg className="navbar__liquid-glass-filter" width="0" height="0" aria-hidden="true" focusable="false">
          <filter
            id="liquid-glass-distortion-v2"
            x="-24%"
            y="-24%"
            width="148%"
            height="148%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.007 0.012"
              numOctaves="2"
              seed="12"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="42"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      ) : null}
      <div className="navbar__shell">
        <div className={`${panelClassName} navbar__panel--main`}>
          <div className="navbar__items" ref={itemsRef}>
            <span className="navbar__active-indicator" aria-hidden="true" />
            {navbarConfig.mainItems.map((item) => {
              const isActive = activeItemId === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  ref={(node) => {
                    itemRefs.current[item.id] = node
                  }}
                  className={[
                    'navbar__item',
                    isActive ? 'navbar__item--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onPointerDown={handleItemPointerDown(item.id)}
                  onClick={handleItemClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  data-navbar-item-id={item.id}
                >
                  <span className="navbar__icon-slot">
                    <img
                      src={item.icon}
                      alt=""
                      className="navbar__icon"
                    />
                  </span>
                  <span className="navbar__label">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`${panelClassName} navbar__panel--search`}>
          <span
            className={[
              'navbar__search-indicator',
              activeItemId === navbarConfig.searchItem.id ? 'navbar__search-indicator--active' : '',
              isLiquidGlassV2 && isItemSwitching && activeItemId === navbarConfig.searchItem.id
                ? 'navbar__search-indicator--liquid-switching'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          />
          <button
            type="button"
            className={[
              'navbar__item',
              'navbar__item--search',
              activeItemId === navbarConfig.searchItem.id ? 'navbar__item--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onPointerDown={handleItemPointerDown(navbarConfig.searchItem.id)}
            onClick={handleItemClick(navbarConfig.searchItem.id)}
            aria-current={activeItemId === navbarConfig.searchItem.id ? 'page' : undefined}
            aria-label="Buscar"
            data-navbar-item-id={navbarConfig.searchItem.id}
          >
            <span className="navbar__icon-slot">
              <img src={navbarConfig.searchItem.icon} alt="" className="navbar__icon" />
            </span>
            <span className="navbar__label">{navbarConfig.searchItem.label}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
