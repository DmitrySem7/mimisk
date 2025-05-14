import { useState, useEffect } from "react";
import { ClipboardCopy } from "lucide-react";
import passList from "../jsonData/userPassList.json";

export default function FastPassResources() {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        try {
            if (!passList || typeof passList !== "object") return;

            const filtered = Object.entries(passList).filter(
                ([, creds]) =>
                    creds &&
                    typeof creds === "object" &&
                    creds.log?.trim() &&
                    creds.pas?.trim()
            );

            setResources(filtered);
        } catch (err) {
            console.error("Ошибка при загрузке JSON:", err);
        }
    }, []);

    const handleCopy = async (value) => {
        try {
            await navigator.clipboard.writeText(value);
        } catch (err) {
            console.error("Ошибка копирования:", err);
        }
    };

    if (resources.length === 0) {
        return (
            <div className="bg-gray-50 p-6 border border-gray-200 text-gray-500 text-sm">
                Нет доступных ресурсов
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-4 border border-gray-200 rounded-none">
            <div className="grid grid-cols-2 gap-3">
                {resources.map(([name, creds]) => (
                    <div
                        key={name}
                        className="rounded-md shadow-sm p-2 bg-white border border-gray-200 text-xs"
                    >
                        <div className="font-medium mb-1 truncate">{name}</div>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => handleCopy(creds.log)}
                                className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                title="Скопировать логин"
                            >
                                <ClipboardCopy className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleCopy(creds.pas)}
                                className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                title="Скопировать пароль"
                            >
                                <ClipboardCopy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


