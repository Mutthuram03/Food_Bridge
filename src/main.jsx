import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css'
import AppHome from './App.jsx'

// A wrapper App to pass setPage if AppHome expects it
function RootApp() {
  const [page, setPage] = useState("Home")
  // Since FoodBridge.jsx contains several components and HomePage is just one,
  // we need to see how FoodBridge.jsx is structured to render properly. Wait,
  // FoodBridge.jsx exports nothing currently but defines multiple pages.
  // Actually, I need to check FoodBridge.jsx exports.
  // Let's import the default export from App.jsx or create a proper App component.
  return <AppHome />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
)
