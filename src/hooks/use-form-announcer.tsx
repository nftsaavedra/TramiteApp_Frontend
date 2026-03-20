import { useEffect, useRef } from 'react'

interface UseFormAnnouncerProps {
  errors: Record<string, string>
  formId?: string
}

export function useFormAnnouncer({ errors, formId = 'form' }: UseFormAnnouncerProps) {
  const liveRegionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (liveRegionRef.current && Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join(', ')
      liveRegionRef.current.textContent = `Error en ${formId}: ${errorMessages}`
    }
  }, [errors, formId])

  const announceErrors = () => (
    <div
      ref={liveRegionRef}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    />
  )

  return {
    announceErrors,
    liveRegionRef,
  }
}

interface UseLoadingAnnouncerProps {
  isLoading: boolean
  loadingMessage?: string
  completedMessage?: string
}

export function useLoadingAnnouncer({
  isLoading,
  loadingMessage = 'Cargando...',
  completedMessage = 'Carga completada',
}: UseLoadingAnnouncerProps) {
  const liveRegionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = isLoading ? loadingMessage : completedMessage
    }
  }, [isLoading, loadingMessage, completedMessage])

  const announceLoading = () => (
    <div
      ref={liveRegionRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )

  return {
    announceLoading,
    liveRegionRef,
  }
}
