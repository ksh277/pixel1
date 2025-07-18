import { useState } from 'react';
import { MessageCircle, X, Send, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: '안녕하세요. 올댓프린팅입니다! 😊\n발문해주셔서 감사합니다 :)',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'user',
        content: message,
        timestamp: new Date()
      }]);
      setMessage('');
      
      // 자동 응답 시뮬레이션
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'bot',
          content: '메시지를 확인했습니다. 곧 답변드리겠습니다.',
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  const businessHours = {
    weekday: 'AM 9시 ~ PM 6시',
    weekend: 'PM 12시 ~ PM 1시',
    holiday: '(주말/공휴일 휴무)'
  };

  return (
    <>
      {/* 채팅 위젯 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] h-96 max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">올댓</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm">올댓프린팅</h3>
                <p className="text-xs text-blue-100">운영시간 보기 &gt;</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-xs p-3 rounded-lg text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}>
                  {msg.content.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* 운영시간 안내 */}
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">상담 가능시간 안내 (영업일기준)</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>평일 {businessHours.weekday}</div>
                <div>점심시간 {businessHours.weekend}</div>
                <div>{businessHours.holiday}</div>
              </div>
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
              >
                문의하기 ▼
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              월요일 오전 9:00부터 운영해요
            </div>
          </div>

          {/* 하단 버튼들 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">다른 방법으로 문의</div>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 border-yellow-400"
                title="카카오톡"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 border-green-500"
                title="네이버 톡톡"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-12 h-12 rounded-full bg-gray-400 hover:bg-gray-500 border-gray-400"
                title="더보기"
              >
                <span className="text-white text-lg">⋯</span>
              </Button>
            </div>
            <div className="mt-3 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">채팅을 이용중</div>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-4 border-white"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-1">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">올댓</span>
                </div>
              </div>
              <MessageCircle className="h-4 w-4" />
            </div>
          )}
        </Button>
        
        {/* 말풍선 텍스트 */}
        {!isOpen && (
          <div className="absolute bottom-20 right-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 whitespace-nowrap">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">올댓프린팅</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">운영시간 보기 &gt;</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
          </div>
        )}
      </div>
    </>
  );
};