import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
