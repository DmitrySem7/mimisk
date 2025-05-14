import { useState } from 'react';

function QueryManagement() {
    const [screenshot, setScreenshot] = useState(null);
    const [ticket, setTicket] = useState('');
    const [error, setError] = useState('');

    const handleTest = async () => {
        // Проверяем формат тикета: число из 13 цифр
        const isValid = /^\d{13}$/.test(ticket);
        if (!isValid) {
            setError('Введите число из 13 цифр');
            return; // выход, если невалидный формат
        }
        setError(''); // сброс ошибок при успешной проверке
        try {
            const response = await window.electronAPI?.runPuppeteer(ticket);
            if (response.success) {
                setScreenshot(`data:image/png;base64,${response.data}`);
            } else {
                console.error('Ошибка Puppeteer:', response.error);
                alert('Ошибка при создании скриншота');
            }
        } catch (err) {
            console.error('Ошибка вызова IPC:', err);
            alert('Произошла ошибка');
        }
    };

    return (
        <div>
            {/* Оформление поля тикета */}
            <div className="bg-yellow-200 rounded px-4 py-2 mb-4 shadow-md w-full max-w-md mx-auto">
                <p className="mb-2 font-semibold text-gray-700">Внести комментарий ESMP</p>
                <div className="relative">
                    <input
                        className={`w-full px-4 py-2 rounded border border-gray-300 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            error ? 'border-red-500' : ''
                        }`}
                        placeholder="Введите число из 13 цифр"
                        value={ticket}
                        onChange={(e) => setTicket(e.target.value)}
                    />
                    {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                    )}
                </div>
            </div>
            {/* Кнопка */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={handleTest}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!/^\d{13}$/.test(ticket)}
                >
                    TestButton
                </button>
            </div>
            {/* Отображение скриншота */}
            {screenshot && (
                <div className="mt-4 max-w-xl mx-auto p-4 bg-gray-50 rounded shadow">
                    <h3 className="mb-2 font-semibold">Скриншот сайта</h3>
                    <img src={screenshot} alt="Скриншот" className="max-w-full border rounded" />
                </div>
            )}
        </div>
    );
}

export default QueryManagement;

