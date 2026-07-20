import { AlertTriangle } from 'lucide-react'

export interface SummaryRow {
  label: string
  value: string
  highlight?: boolean
}

interface ConfirmDialogProps {
  open: boolean
  titulo: string
  /** @deprecated use subtitulo */
  mensaje?: string
  subtitulo?: string
  warning?: string
  summary?: SummaryRow[]
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  titulo,
  mensaje,
  subtitulo,
  warning,
  summary,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const displaySub = subtitulo ?? mensaje
  if (!open) return null

  const handleCancel = () => {
    onCancel()
  }

  return (
    <div
      data-testid="confirm-dialog"
      className="fixed inset-0 z-[800] flex items-center justify-center transition-opacity"
      style={{ backgroundColor: 'rgba(11,24,41,.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel() }}
    >
      <div
        className="bg-card rounded-xl shadow-2xl border border-border w-[520px] max-w-[92vw] p-7"
        style={{ transform: 'scale(1)' }}
      >
        {/* Title */}
        <h2
          data-testid="confirm-dialog-titulo"
          className="text-[17px] font-bold text-foreground mb-1"
        >
          {titulo}
        </h2>
        {displaySub && (
          <p
            data-testid="confirm-dialog-mensaje"
            className="text-sm text-muted-foreground mb-4"
          >
            {displaySub}
          </p>
        )}

        {/* Warning box */}
        {warning && (
          <div className="flex gap-3 items-start rounded-lg p-3.5 mb-5"
            style={{ backgroundColor: '#fff3e0', border: '1px solid #fed7aa' }}
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#e65100' }} />
            <p className="text-sm leading-relaxed" style={{ color: '#7c3a00' }}
              dangerouslySetInnerHTML={{ __html: warning }}
            />
          </div>
        )}

        {/* Summary rows */}
        {summary && summary.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden mb-5">
            {summary.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm gap-3"
                style={{
                  borderBottom: i < summary.length - 1 ? '1px solid var(--border)' : 'none',
                  backgroundColor: row.highlight ? 'var(--secondary)' : undefined,
                  fontWeight: row.highlight ? 700 : undefined,
                }}
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    color: row.highlight ? 'var(--primary)' : 'var(--foreground)',
                    fontSize: row.highlight ? '14px' : undefined,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 justify-end">
          <button
            data-testid="btn-cancelar"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Cancelar
          </button>
          <button
            data-testid="btn-confirmar"
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
