import { render, type RenderOptions } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement, ReactNode } from 'react'
import { createTestQueryClient } from './queryClient'

export function renderWithQuery(ui: ReactElement, options?: RenderOptions) {
  const queryClient = createTestQueryClient()
  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  })
}
