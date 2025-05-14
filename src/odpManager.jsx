import { createRoot } from 'react-dom/client'
import './index.css'
import OdpManager from "./components/OdpManager.jsx";

const opd = createRoot(document.getElementById('opd-manager'));
opd.render(<OdpManager />);