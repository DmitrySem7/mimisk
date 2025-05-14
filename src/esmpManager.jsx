import { createRoot } from 'react-dom/client'
import './index.css'
import ESMPManager from "./components/EsmpManager.jsx";

const esmp = createRoot(document.getElementById('esmp-manager'));
esmp.render(<ESMPManager />);