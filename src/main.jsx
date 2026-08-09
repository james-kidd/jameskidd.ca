import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// `npm run build` prerenders every route into static HTML, so in production the
// root already has markup and we hydrate it. In dev (and if prerendering is
// ever skipped) the root is empty and we mount from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
