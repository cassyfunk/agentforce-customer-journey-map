import './index.css'
import { CollaborationProvider } from './context/CollaborationContext'
import JourneyMap from './components/JourneyMap'

export default function App() {
  return (
    <CollaborationProvider>
      <JourneyMap />
    </CollaborationProvider>
  )
}
