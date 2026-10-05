import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import AnalysisPage from './pages/AnalysisPage'
import HelpPage from './pages/HelpPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/analysis/:id" element={<AnalysisPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
