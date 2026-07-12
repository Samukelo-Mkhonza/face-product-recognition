import { useState } from 'react'
import './App.css'
import { AddProductPanel } from './components/AddProductPanel'
import { EnrollFacePanel } from './components/EnrollFacePanel'
import { IdentifyFacesPanel } from './components/IdentifyFacesPanel'
import { RecognizeProductsPanel } from './components/RecognizeProductsPanel'

const TABS = [
  { id: 'identify-faces', label: 'Identify Faces' },
  { id: 'enroll-face', label: 'Enroll Face' },
  { id: 'recognize-products', label: 'Recognize Products' },
  { id: 'add-product', label: 'Add Product' },
] as const

type TabId = (typeof TABS)[number]['id']

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('identify-faces')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Face &amp; Product Recognition</h1>
        <p>Open-source face and product recognition, running entirely on your own backend.</p>
      </header>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab${activeTab === tab.id ? ' tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'identify-faces' && <IdentifyFacesPanel />}
        {activeTab === 'enroll-face' && <EnrollFacePanel />}
        {activeTab === 'recognize-products' && <RecognizeProductsPanel />}
        {activeTab === 'add-product' && <AddProductPanel />}
      </main>
    </div>
  )
}

export default App
