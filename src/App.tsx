import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CryptoDetailsPage from './pages/CryptoDetailsPage'

function App() {
  return (
    // setting up routes
    <Routes>
      {/* home route */}
      <Route path="/" element={<HomePage />} />
      {/* crypto details route */}
      <Route path="/:cryptoId" element={<CryptoDetailsPage />} />
    </Routes>
  )
}

export default App