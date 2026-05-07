import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Create from './pages/Create'
import Generating from './pages/Generating'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import Preview from './pages/Preview'
import Success from './pages/Success'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<Create />} />
        <Route path="/generating" element={<Generating />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
