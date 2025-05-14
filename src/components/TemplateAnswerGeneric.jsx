import { Copy } from "lucide-react";
import { useState } from "react";

function TemplateAnswerGeneric({ data, includeDate = false, className = "" }) {
    const keys = Object.keys(data);
    const [selected, setSelected] = useState(keys[0]);

    function getMoscowDateTimeString() {
        const date = new Date();
        const options = {
            timeZone: 'Europe/Moscow',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        const formatter = new Intl.DateTimeFormat('ru-RU', options);
        const parts = formatter.formatToParts(date);
        const dateParts = {};
        parts.forEach(({ type, value }) => {
            dateParts[type] = value;
        });
        return `${dateParts.day}.${dateParts.month}.${dateParts.year} ${dateParts.hour}:${dateParts.minute}`;
    }

    const handleCopy = () => {
        const text = includeDate
            ? `${getMoscowDateTimeString()} - ${data[selected]}`
            : data[selected];
        navigator.clipboard.writeText(text);
    };

    return (
        <div className={`bg-green-100 p-1 rounded-md shadow-md max-w-sm ${className}`}>
            <div className="flex items-center gap-2">
                <select
                    className="w-80 max-h-20 border border-gray-300 bg-green-200 text-black rounded px-2 py-1 text-xs"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                >
                    {keys.map((key, index) => (
                        <option key={index} value={key}>{key}</option>
                    ))}
                </select>
                <div
                    className="flex items-center justify-center bg-green-300 p-2 rounded cursor-pointer hover:bg-green-400 transition-colors duration-150"
                    onClick={handleCopy}
                >
                    <Copy size={20} className="text-white" />
                </div>
            </div>
        </div>
    );
}

export default TemplateAnswerGeneric;
