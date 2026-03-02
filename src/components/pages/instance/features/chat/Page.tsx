import React, { useState, useRef, useEffect } from 'react';
import useMeiliInstance from '../../../../../hooks/useMeiliInstance';
import useMeiliIndex from '../../../../../hooks/useMeiliIndex';
import { chatCompletions } from '../../../../../services/meilisearch/search';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const ChatCompletionsPage: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const { meiliIndexState } = useMeiliIndex();
    const indexName = meiliIndexState.selectedIndex;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [model, setModel] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        const userMessage: ChatMessage = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsStreaming(true);
        setError(null);

        try {
            const body: any = {
                model: model || undefined,
                messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                stream: true,
            };

            const response = await chatCompletions(instanceState, body);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No response stream');

            const decoder = new TextDecoder();
            let assistantContent = '';
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(data);
                            const delta = parsed.choices?.[0]?.delta?.content || '';
                            assistantContent += delta;
                            setMessages(prev => {
                                const updated = [...prev];
                                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                                return updated;
                            });
                        } catch {
                            // skip non-JSON lines
                        }
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || 'Chat request failed');
        } finally {
            setIsStreaming(false);
        }
    };

    const handleClear = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="px-4 py-5 flex flex-col h-full">
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-semibold">Chat Completions</h1>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Experimental
                    </span>
                </div>
                <p className="text-gray-600">AI-powered chat completions using your Meilisearch data</p>
            </div>

            {/* Config */}
            <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Model (optional)"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <div className="text-sm text-gray-500 flex items-center">
                    Index: <span className="font-medium ml-1">{indexName || 'none selected'}</span>
                </div>
                <button
                    onClick={handleClear}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 ml-auto"
                >
                    Clear Chat
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto mb-4 min-h-[400px] max-h-[600px]">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Start a conversation with your data
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            <div className="text-xs opacity-60 mb-1">{msg.role}</div>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                    </div>
                ))}
                {isStreaming && messages[messages.length - 1]?.content === '' && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex gap-1">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>
            )}

            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                    disabled={isStreaming}
                />
                <button
                    onClick={handleSend}
                    disabled={isStreaming || !input.trim()}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                    {isStreaming ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatCompletionsPage;
