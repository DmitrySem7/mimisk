import { useState, useEffect } from "react";
import { Check, Copy, Trash2 } from "lucide-react";

function OdpManager() {
    const [entries, setEntries] = useState([]);
    const [shortName, setShortName] = useState("");
    const [odp, setOdp] = useState("");

    const keywordHighlighting = {
        'эпик': 'bg-purple-300',
        'инцидент': 'bg-yellow-100',
        'важно': 'bg-pink-100',
        'срочно': 'bg-red-100',
    };

    const getHighlightClass = (text) => {
        if (!text) return '';
        const lowerText = text.toLowerCase();
        for (const keyword in keywordHighlighting) {
            if (lowerText.includes(keyword)) {
                return keywordHighlighting[keyword];
            }
        }
        return '';
    };


    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("odpEntries")) || [];
        setEntries(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem("odpEntries", JSON.stringify(entries));
    }, [entries]);

    const addEntry = () => {
        if (shortName.trim() && /^[0-9]{5}$/.test(odp)) {
            setEntries([...entries, { shortName, odp }]);
            setShortName("");
            setOdp("");
        } else {
            alert("Введите корректные данные: название и 5-значный ODP.");
        }
    };

    const copyEntry = (odp) => {
        const html = `<a href="https://ihelp.rt.ru/browse/ODP-${odp}">ODP-${odp}</a>`;
        const text = `https://ihelp.rt.ru/browse/ODP-${odp}`;

        // Проверяем поддержку
        if (navigator.clipboard && navigator.clipboard.write) {
            const htmlBlob = new Blob([html], { type: 'text/html' });
            const textBlob = new Blob([text], { type: 'text/plain' });

            const clipboardItems = [
                new ClipboardItem({
                    'text/html': htmlBlob,
                    'text/plain': textBlob
                })
            ];

            navigator.clipboard.write(clipboardItems).catch(console.error);
        } else {
            // fallback: копируем только текст
            navigator.clipboard.writeText(`https://ihelp.rt.ru/browse/ODP-${odp}`);
        }
    };


    const deleteEntry = (index) => {
        const updated = [...entries];
        updated.splice(index, 1);
        setEntries(updated);
    };

    return (
        <div className="p-4 max-h-screen overflow-y-auto flex flex-col items-center">
            {/* Форма ввода */}
            <div className="flex items-center gap-2 mb-6 max-w-md w-full bg-blue-100 p-1">
                <input
                    type="text"
                    placeholder="Краткое название"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className="border rounded px-2 py-0.5 w-1/2"
                />
                <input
                    type="text"
                    placeholder="ODP"
                    value={odp}
                    onChange={(e) => setOdp(e.target.value)}
                    maxLength={5}
                    className="border rounded px-2 py-0.5 w-1/4"
                />
                <button
                    onClick={addEntry}
                    className="p-1 bg-green-500 hover:bg-green-600 rounded text-white"
                >
                    <Check size={20} />
                </button>
            </div>

            {/* Список записей */}
            <div className="flex flex-col gap-2 w-full max-w-md">
                {entries.map((entry, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between
                        border-2 border-[#ADD8E6] rounded-md p-2 backdrop-blur-md shadow-md
                        ${getHighlightClass(entry.shortName) || 'bg-blue-100/50'}`}
                    >

                        <a
                            href={`https://ihelp.rt.ru/browse/ODP-${entry.odp}`}
                            onClick={(e) => {
                                e.preventDefault(); // отменяем стандартный переход
                                if (window.electronAPI && window.electronAPI.openExternal) {
                                    window.electronAPI.openExternal(`https://ihelp.rt.ru/browse/ODP-${entry.odp}`);
                                } else {
                                    console.error('electronAPI недоступен');
                                }
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {entry.odp}
                        </a>
                        <div className="flex-1 px-2 text-gray-800">{entry.shortName}</div>
                        <button
                            onClick={() => copyEntry(entry.odp)}
                            className="p-1 text-gray-600 hover:text-blue-600"
                        >
                            <Copy size={18}/>
                        </button>
                        <button
                            onClick={() => deleteEntry(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={18}/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OdpManager;






