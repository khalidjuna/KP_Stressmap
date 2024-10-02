import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const link = document.createElement('link');
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap, https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);
