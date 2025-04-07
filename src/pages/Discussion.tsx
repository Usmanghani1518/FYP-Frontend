import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSocket } from '@/redux/SocketContext';
import { FiSend, FiTrash2, FiPlus } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  avatar?: string;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  course: string;
  isPinned: boolean;
  createdAt: string;
  reactions?: {
    userId: string;
    emoji: string;
  }[];
}

interface DiscussionBoardProps {
  courseId: string;
  isTeacher: boolean;
}

export function DiscussionBoard({ courseId, isTeacher }: DiscussionBoardProps) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/v1/discussion/courses/${courseId}/messages`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [courseId]);

  // Socket.io listeners
  useEffect(() => {
    if (!socket) return;

    socket.emit('joinCourse', courseId);

    const handleNewMessage = (message: Message) => {
      setMessages(prev => [message, ...prev]);
    };

    const handleMessageUpdated = (updatedMessage: Message) => {
      setMessages(prev => prev.map(msg => 
        msg._id === updatedMessage._id ? updatedMessage : msg
      ));
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageUpdated', handleMessageUpdated);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageUpdated', handleMessageUpdated);
    };
  }, [socket, courseId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      content: newMessage,
      course: courseId
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (!socket) return;
    socket.emit('reactToMessage', { messageId, emoji });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Course Discussion</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message._id} 
              className={`flex gap-3 ${message.isPinned ? 'bg-muted/50 p-3 rounded-lg' : ''}`}
            >
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback>
                  {message.sender.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                  {/* {message.isPinned && (
                    <FiPin className="w-3 h-3 text-muted-foreground" />
                  )} */}
                </div>
                
                <p className="mt-1 text-sm whitespace-pre-wrap">{message.content}</p>
                
                {(message.reactions ?? []).length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {message.reactions?.map((reaction, idx) => (
                      <button
                        key={idx} 
                        className="text-xs bg-muted rounded-full px-2 py-1 hover:bg-muted/80 transition-colors"
                        onClick={() => handleReactToMessage(message._id, reaction.emoji)}
                      >
                        {reaction.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => handleReactToMessage(message._id, '👍')}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
                {(isTeacher || /* Add check for message owner if needed */ false) && (
                  <button className="p-1 rounded-full hover:bg-muted text-destructive">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
          >
            <FiSend className="mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}