import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Users, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/guias', label: 'Guías', icon: FileText },
]

// AdminReglas kept in router but hidden from navigation (v3)
// const adminItems = [{ to: '/admin/reglas', label: 'Configuración', icon: Settings }]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative bg-card flex flex-col shrink-0 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand */}
      <div className="px-4 py-6 border-b border-border flex items-center">
        <div
          className={cn(
            'flex items-center gap-3',
            collapsed && 'justify-center w-full'
          )}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-xl">G</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="text-foreground font-semibold text-base leading-tight block truncate">
                Facturador de Guías
              </span>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                Gestión de Guías
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 h-6 w-6 rounded-full border-border p-0 text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {!collapsed && (
          <p className="text-muted-foreground text-xs uppercase tracking-widest px-2 mb-2">
            Principal
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    collapsed && 'justify-center',
                    isActive
                      ? 'bg-primary/20 text-primary border-l-2 border-primary pl-[10px]'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-border">
          <p className="text-muted-foreground text-xs">Facturador de Guías v2.4 · 2026</p>
        </div>
      )}
    </aside>
  )
}
