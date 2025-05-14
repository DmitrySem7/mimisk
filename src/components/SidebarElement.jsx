import { useState } from "react";

function SidebarElement() {
    const [active, setActive] = useState(null);

    const toggleIcon = (icon) => {
        setActive(prev => (prev === icon ? null : icon));
    };

    const handleJira = () => {
        if (window.electronAPI) window.electronAPI.toggleJira();
    };

    const handleESMP = () => {
        if (window.electronAPI) window.electronAPI.toggleESMP();
    };

    const handleCopy = () => {
        if (window.electronAPI) window.electronAPI.toggleCopy();
    };

    return (
        <div
            className="fixed left-0 top-0 h-full w-[44px] bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900 shadow-xl flex flex-col items-center py-10 space-y-10">
            <button onClick={() => {
                toggleIcon('jira');
                handleJira();
            }}>
                <img
                    src="jira2.svg"
                    alt="Jira Logo"
                    className={`w-8 h-8 transition-transform hover:scale-130 relative z-10 
                    ${active === 'jira' ? 'animate-breathe drop-shadow-glow' : ''}`}
                />
            </button>

            <button onClick={() => {
                toggleIcon('esmp');
                handleESMP();
            }}>
                <img
                    src="esmp.svg"
                    alt="ESMP Logo"
                    className={`w-8 h-8 transition-transform hover:scale-130 relative z-10 
                    ${active === 'esmp' ? 'animate-breathe drop-shadow-glow' : ''}`}
                />
            </button>

            <button onClick={() => {
                toggleIcon('copy');
                handleCopy();
            }}>
                <img
                    src="copy.svg"
                    alt="Copy Logo"
                    className={`w-8 h-8 transition-transform hover:scale-130 relative z-10 
                    ${active === 'copy' ? 'animate-breathe drop-shadow-glow' : ''}`}
                />
            </button>

            <div className="mt-auto">
                <img src="logo3.png" alt="Mimisk Logo" className="w-15 h-15 opacity-90"/>
            </div>
        </div>
    );
}

export default SidebarElement;
