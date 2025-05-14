import { useState } from "react";
import { ClipboardCopy } from "lucide-react";
import passList from "../jsonData/userPassList.json";

export default function ResourceCards() {
    const [copied, setCopied] = useState(null);

    const handleCopy = async (value, label) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(label);
            setTimeout(() => setCopied(null), 1500);
        } catch (err) {
            console.error("Не удалось скопировать:", err);
        }
    };

    // Проверка и фильтрация ресурсов
    const filteredResources = passList && typeof passList === "object"
        ? Object.entries(passList).filter(
            ([, creds]) =>
                creds &&
                typeof creds === "object" &&
                creds.log &&
                creds.pas &&
                creds.log.trim() !== "" &&
                creds.pas.trim() !== ""
        )
        : [];

    if (filteredResources.length === 0) {
        return (
            <div className="p-4 text-gray-500 text-sm">
                Нет доступных ресурсов
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
            {filteredResources.map(([name, creds]) => (
                <div
                    key={name}
                    className="rounded-xl shadow-sm p-3 bg-white border border-gray-200 text-sm"
                >
                    <div className="font-medium mb-2 truncate">{name}</div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => handleCopy(creds.log, `${name}-log`)}
                            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            title="Скопировать логин"
                        >
                            <ClipboardCopy className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleCopy(creds.pas, `${name}-pas`)}
                            className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            title="Скопировать пароль"
                        >
                            <ClipboardCopy className="w-4 h-4" />
                        </button>
                        {copied?.startsWith(name) && (
                            <span className="text-xs text-gray-400 ml-2">Скопировано</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
