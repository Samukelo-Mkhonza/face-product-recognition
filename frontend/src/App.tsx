import { useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import './App.css'
import { AddProductPanel } from './components/AddProductPanel'
import { EnrollFacePanel } from './components/EnrollFacePanel'
import { PackagePlusIcon, ScanFaceIcon, ScanObjectIcon, UserPlusIcon } from './components/Icons'
import { IdentifyFacesPanel } from './components/IdentifyFacesPanel'
import { RecognizeProductsPanel } from './components/RecognizeProductsPanel'

interface NavItem {
  id: 'identify-faces' | 'enroll-face' | 'recognize-products' | 'add-product'
  label: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'People',
    items: [
      {
        id: 'identify-faces',
        label: 'Identify faces',
        description: 'Upload a photo to detect faces and match them against enrolled people.',
        icon: ScanFaceIcon,
      },
      {
        id: 'enroll-face',
        label: 'Enroll a person',
        description: 'Add a known person so they can be identified in future photos.',
        icon: UserPlusIcon,
      },
    ],
  },
  {
    label: 'Catalog',
    items: [
      {
        id: 'recognize-products',
        label: 'Recognize products',
        description: 'Upload a photo to detect products and match them against your catalog.',
        icon: ScanObjectIcon,
      },
      {
        id: 'add-product',
        label: 'Add a product',
        description: 'Add a reference photo of a product to the catalog for future recognition.',
        icon: PackagePlusIcon,
      },
    ],
  },
]

type PageId = NavItem['id']

const PANELS: Record<PageId, ComponentType> = {
  'identify-faces': IdentifyFacesPanel,
  'enroll-face': EnrollFacePanel,
  'recognize-products': RecognizeProductsPanel,
  'add-product': AddProductPanel,
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <ScanFaceIcon width={18} height={18} />
    </span>
  )
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('identify-faces')

  const activeItem = NAV_GROUPS.flatMap((group) => group.items).find(
    (item) => item.id === activePage,
  )!
  const ActivePanel = PANELS[activePage]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <BrandMark />
          <div className="brand-text">
            <span className="brand-name">Face &amp; Product</span>
            <span className="brand-sub">Recognition</span>
          </div>
        </div>

        <nav className="nav" aria-label="Main">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="nav-group">
              <span className="nav-group-label">{group.label}</span>
              {group.items.map((item) => {
                const ItemIcon = item.icon
                const isActive = item.id === activePage
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-item${isActive ? ' nav-item-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setActivePage(item.id)}
                  >
                    <ItemIcon width={18} height={18} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <p className="sidebar-footer">Runs entirely on your own backend. Images are processed on your server.</p>
      </aside>

      <div className="content">
        <header className="page-header">
          <h1>{activeItem.label}</h1>
          <p className="page-description">{activeItem.description}</p>
        </header>
        <main className="page-main">
          <ActivePanel />
        </main>
      </div>
    </div>
  )
}

export default App
