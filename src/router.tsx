import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout/AppLayout'
import ClientesPage from './pages/Clientes'
import GuiasPage from './pages/Guias'
import HistorialPage from './pages/Historial'
import PreviewPage from './pages/Preview'
import AdminReglasPage from './pages/AdminReglas'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/clientes" replace />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/guias" element={<GuiasPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/admin/reglas" element={<AdminReglasPage />} />
      </Route>
    </Routes>
  )
}
