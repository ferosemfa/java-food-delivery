import { useState } from 'react';
import { FiSend, FiSearch, FiUser, FiCheck, FiCheckCircle } from 'react-icons/fi';

const conversations = [
  { id: 1, name: 'Rahul Sharma', lastMsg: 'When will my order arrive?', time: '2m ago', unread: 2, avatar: 'RS', online: true },
  { id: 2, name: 'Priya Patel', lastMsg: 'Can I add extra cheese?', time: '15m ago', unread: 0, avatar: 'PP', online: false },
  { id: 3, name: 'Amit Kumar', lastMsg: 'Thanks for the quick delivery!', time: '1h ago', unread: 0, avatar: 'AK', online: true },
  { id: 4, name: 'Neha Singh', lastMsg: 'Is the biryani available?', time: '2h ago', unread: 1, avatar: 'NS', online: false },
];

const chatMessages = [
  { id: 1, from: 'customer', text: 'Hi, I placed an order #ORD-1245', time: '10:30 AM' },
  { id: 2, from: 'vendor', text: 'Hello Rahul! We have received your order and will start preparing it shortly.', time: '10:31 AM' },
  { id: 3, from: 'customer', text: 'Can you add extra raita to my order?', time: '10:33 AM' },
  { id: 4, from: 'vendor', text: 'Sure, I will add it. No extra charges.', time: '10:34 AM' },
  { id: 5, from: 'customer', text: 'When will my order arrive?', time: '10:35 AM' },
];

export default function CustomerMessaging() {
  const [activeChat, setActiveChat] = useState(1);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  const filtered = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      from: 'vendor',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setMessage('');
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Customer Messages</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex h-[600px]">
        <div className="w-80 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(conv => (
              <button key={conv.id} onClick={() => setActiveChat(conv.id)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${
                  activeChat === conv.id ? 'bg-orange-50 border-l-4 border-orange-500' : 'border-l-4 border-transparent'
                }`}>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {conv.avatar}
                  </div>
                  {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">{conv.name}</p>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMsg}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{conv.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">RS</div>
            <div>
              <p className="text-sm font-medium text-gray-800">Rahul Sharma</p>
              <p className="text-xs text-green-600 flex items-center gap-1"><FiCheckCircle className="text-xs" /> Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                  msg.from === 'vendor'
                    ? 'bg-orange-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === 'vendor' ? 'text-orange-200' : 'text-gray-400'} flex items-center gap-1 justify-end`}>
                    {msg.time}
                    {msg.from === 'vendor' && <FiCheck className="text-xs" />}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input type="text" placeholder="Type a message..." value={message} onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <button onClick={handleSend} className="bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1">
                <FiSend /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
