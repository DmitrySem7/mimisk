import { createRoot } from 'react-dom/client'
import './index.css'
import CopyManager from "./components/CopyManager.jsx";

const copy = createRoot(document.getElementById('copy-manager'));
copy.render(<CopyManager />);