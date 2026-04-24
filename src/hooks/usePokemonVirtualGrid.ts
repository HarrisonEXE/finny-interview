import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useRef, useState } from 'react'

export const CARD_GAP = 24

const ROW_ESTIMATE = 420
const VIRTUAL_OVERSCAN = 4
const FETCH_THRESHOLD_ROWS = 3

type UsePokemonVirtualGridOptions = {
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  itemCount: number
}

export function usePokemonVirtualGrid({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  itemCount
}: UsePokemonVirtualGridOptions) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [gridWidth, setGridWidth] = useState(0)
  const [scrollMargin, setScrollMargin] = useState(0)

  useEffect(() => {
    const gridElement = gridRef.current
    if (!gridElement) return

    const updateGridMetrics = () => {
      setGridWidth(gridElement.clientWidth)
      setScrollMargin(gridElement.getBoundingClientRect().top + window.scrollY)
    }

    updateGridMetrics()

    const resizeObserver = new ResizeObserver(() => updateGridMetrics())
    resizeObserver.observe(gridElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const columns = getColumnCount(gridWidth)
  const rowCount = Math.ceil(itemCount / columns)

  const noScrollCorrection = useCallback(
    (
      offset: number,
      options: { adjustments?: number; behavior?: ScrollBehavior },
      instance: { options: { horizontal?: boolean } }
    ) => {
      if (options.adjustments !== undefined) return
      window.scrollTo({
        behavior: options.behavior,
        [instance.options.horizontal ? 'left' : 'top']: offset
      })
    },
    []
  )

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ROW_ESTIMATE,
    gap: CARD_GAP,
    overscan: VIRTUAL_OVERSCAN,
    scrollMargin,
    scrollToFn: noScrollCorrection
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  useEffect(() => {
    const gridElement = gridRef.current
    if (!gridElement) return

    setGridWidth(gridElement.clientWidth)
    setScrollMargin(gridElement.getBoundingClientRect().top + window.scrollY)
  }, [itemCount])

  useEffect(() => {
    rowVirtualizer.measure()
  }, [columns, rowVirtualizer])

  useEffect(() => {
    const lastRow = virtualRows[virtualRows.length - 1]

    if (
      !lastRow ||
      !hasNextPage ||
      isFetchingNextPage ||
      lastRow.index < Math.max(rowCount - FETCH_THRESHOLD_ROWS, 0)
    ) {
      return
    }

    void fetchNextPage()
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    itemCount,
    rowCount,
    virtualRows
  ])

  return {
    columns,
    gridRef,
    measureElement: rowVirtualizer.measureElement,
    rowCount,
    scrollMargin,
    totalSize: rowVirtualizer.getTotalSize(),
    virtualRows
  }
}

function getColumnCount(width: number) {
  if (width >= 1280) return 4
  if (width >= 1024) return 3
  if (width >= 640) return 2
  return 1
}
