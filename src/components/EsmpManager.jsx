import React, { useState, useEffect } from 'react';

const priorityColors = {
    1: 'bg-red-600',
    2: 'bg-orange-600',
    3: 'bg-gray-400',
};

const actionsOptions = [
    'обработать',
    'позвонить',
    'проинформировать',
    'перевести',
    'привязать к Jira',
    'закрыть'
];

const getInitialData = () => {
    const data = localStorage.getItem('requests');
    if (data) return JSON.parse(data);
    return { queued: [], waiting: [] };
};

const saveData = (queued, waiting) => {
    localStorage.setItem('requests', JSON.stringify({ queued, waiting }));
};

function ESMPManager() {
    const [queued, setQueued] = useState([]);
    const [waiting, setWaiting] = useState([]);
    const [inputError, setInputError] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [newReq, setNewReq] = useState({ number: '', action: 'обработать', priority: 3 });

    useEffect(() => {
        const data = getInitialData();
        setQueued(data.queued);
        setWaiting(data.waiting);
    }, []);

    useEffect(() => {
        saveData(queued, waiting);
    }, [queued, waiting]);

    const updateRequestAction = (id, newAction) => {
        setQueued(prev => prev.map(r => r.id === id ? { ...r, action: newAction } : r));
        setWaiting(prev => prev.map(r => r.id === id ? { ...r, action: newAction } : r));
    };

    const handleAddRequest = () => {
        if (!newReq.number || newReq.number.length !== 13 || isNaN(newReq.number)) {
            setInputError(true);
        }else{
            setInputError(false);
            const newRequest = {
                id: newReq.number,
                action: newReq.action,
                priority: newReq.priority,
            };
            setQueued(prev => [...prev, newRequest].sort((a, b) => a.priority - b.priority));
            setShowModal(false);
            setNewReq({ number: '', action: 'обработать', priority: 2 });
        }
    };

    const moveToWaiting = (req) => {
        setQueued(prev => prev.filter(r => r.id !== req.id));
        setWaiting(prev => [...prev, req]);
    };

    const moveToQueue = (req) => {
        setWaiting(prev => prev.filter(r => r.id !== req.id));
        setQueued(prev => [...prev, req]);
    };

    const deleteRequest = (req) => {
        setQueued(prev => prev.filter(r => r.id !== req.id));
        setWaiting(prev => prev.filter(r => r.id !== req.id));
    };

    const handleStartNewDay = () => {
        setQueued([]);
        setWaiting([]);
        localStorage.removeItem('requests');
    };

    return (
        <div className="p-4 min-h-screen bg-gray-50 flex flex-col items-center font-sans">
            {/* Кнопка для добавления */}
            <button
                className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                Добавить заявку
            </button>

            {/* Модальное окно добавления */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-sm w-full">
                        <h3 className="mb-2 text-lg font-semibold">Добавить заявку</h3>
                        {inputError &&
                            <div className="text-red-600">
                                Введите 13-значный номер заявки
                            </div>
                        }
                        <input
                            className="w-full mb-2 border border-gray-300 rounded px-2 py-1 text-[0.75rem]"
                            placeholder="Номер заявки (13 цифр)"
                            value={newReq.number}
                            onChange={(e) => setNewReq(prev => ({ ...prev, number: e.target.value }))}
                        />
                        {/* Поле выбора действия */}
                        <select
                            className="w-full mb-2 border border-gray-300 rounded px-2 py-1 text-[0.75rem]"
                            value={newReq.action}
                            onChange={(e) => setNewReq(prev => ({ ...prev, action: e.target.value }))}
                        >
                            {actionsOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        {/* Приоритет */}
                        <select
                            className="w-full mb-2 border border-gray-300 rounded px-2 py-1 text-[0.75rem]"
                            value={newReq.priority}
                            onChange={(e) => setNewReq(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                        >
                            <option value={1}>1 (срочный)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                        {/* Кнопки */}
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                onClick={handleAddRequest}
                            >
                                Добавить
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer"
                                onClick={() => setShowModal(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Основная панель списков */}
            <div className="flex flex-1 w-full max-w-5xl border border-gray-300 rounded-lg overflow-hidden mt-4 divide-x divide-gray-300 min-h-[200px]">
                {/* В очереди */}
                <div className="flex-1 p-2 overflow-y-auto">
                    {queued.map((r) => (
                        <div className="bg-[#FFEDD5]">
                            <div key={r.id} className="flex items-center px-3 py-2 mb-2 rounded-lg">
                                {/* Срочность (круг) */}
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full ${priorityColors[r.priority]}`}>
                                    <span className="text-white font-semibold">{r.priority}</span>
                                </div>
                                {/* Номер заявки */}
                                <div
                                    className="mx-2 cursor-pointer text-xs"
                                    onClick={() => navigator.clipboard.writeText(r.id)}
                                    title="Клик для копирования"
                                >
                                    {r.id}
                                </div>
                                {/* Поле действия */}
                                <div className="mx-2 flex-1 min-w-[100px]">
                                    <select
                                        className="w-full text-xs"
                                        value={r.action}
                                        onChange={(e) => updateRequestAction(r.id, e.target.value)}
                                    >
                                        {actionsOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Кнопки — внутри строки */}
                                <div className="mx-2 cursor-pointer text-xs">
                                    <button
                                        className="px-1 py-0.5 rounded text-[0.625rem] cursor-pointer hover:bg-[#FFE0B2]"
                                        title="В ожидание"
                                        onClick={() => moveToWaiting(r)}
                                    >
                                        ⏳
                                    </button>
                                </div>
                                <div className="mx-2 cursor-pointer text-xs">
                                    <button
                                        className="px-1 py-0.5 rounded text-[0.625rem] cursor-pointer hover:bg-[#FFE0B2]"
                                        title="Удалить"
                                        onClick={() => deleteRequest(r)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* В ожидании */}
                <div className="flex-1 p-2 overflow-y-auto bg-[#F8F8F8]">
                    {waiting.map((r) => (
                        <div key={r.id} className="flex items-center px-3 py-2 mb-2 bg-white rounded-lg">
                            {/* Срочность */}
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${priorityColors[r.priority]}`}>
                                <span className="text-white font-semibold">{r.priority}</span>
                            </div>
                            {/* Номер */}
                            <div
                                className="mx-2 cursor-pointer text-xs"
                                onClick={() => navigator.clipboard.writeText(r.id)}
                                title="Клик для копирования"
                            >
                                {r.id}
                            </div>
                            {/* Поле действия */}
                            <div className="mx-2 flex-1 min-w-[100px]">
                                <select
                                    className="w-full text-xs"
                                    value={r.action}
                                    onChange={(e) => updateRequestAction(r.id, e.target.value)}
                                >
                                    {actionsOptions.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Кнопки */}
                            <div className="flex space-x-1 ml-2">
                                <button
                                    className="bg-[#F8F8F8] px-1 py-0.5 rounded text-[0.625rem] cursor-pointer hover:bg-[#EEE]"
                                    title="Вернуть в очередь"
                                    onClick={() => moveToQueue(r)}
                                >
                                    🔄
                                </button>
                                <button
                                    className="bg-[#F8F8F8] px-1 py-0.5 rounded text-[0.625rem] cursor-pointer hover:bg-[#EEE]"
                                    title="Удалить"
                                    onClick={() => deleteRequest(r)}
                                >
                                🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Кнопка "Начать новый день" */}
            <div className="mt-4">
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    onClick={handleStartNewDay}
                >
                    Начать новый день
                </button>
            </div>
        </div>
    );
}

export default ESMPManager;
