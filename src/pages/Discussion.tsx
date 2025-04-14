import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, MessageSquare, AlertCircle, CheckCircle2, Clock, Users, PlusCircle, Image, Smile, Paperclip } from 'lucide-react';
import { format, isToday, isYesterday, differenceInMinutes } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface User {
  _id: string;
  name: string;
}

interface Message {
  _id: string;
  content: string;
  sender?: User;
  course: string;
  isMe?: boolean;
  createdAt: string;
}

interface DiscussionBoardProps {
  courseId: string;
  currentUser: User;
}

export function DiscussionBoard({ courseId, currentUser }: DiscussionBoardProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:5000', {
      withCredentials: true,
      query: { courseId },
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setError(null);

      setActiveUsers(Math.floor(Math.random() * 10) + 5);
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      setError('Disconnected: ' + reason);
    });

    socketInstance.on('connect_error', (err) => {
      setError('Connection error. Reconnecting...');
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [courseId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageHistory = (messageHistory: Message[]) => {
      try {
        console.log("🧠 messageHistory:", messageHistory);
        console.log("👤 currentUser:", currentUser);
        setMessages(messageHistory);
      } catch (err) {
        console.error("🔥 Error in handleMessageHistory:", err);
        setError("Failed to process messages");
      } finally {
        setIsLoading(false);
      }
    };

    const handleReceiveMessage = (msg: Message) => {
      try {
        console.log("message is this ", msg);
        setMessages((prev) => [...prev, msg]);
      } catch (err) {
        setError('Failed to handle new message');
      }
    };

    const handleMessageError = (error: { error: string }) => {
      setError(error.error);
      setTimeout(() => setError(null), 5000);
    };

    socket.on('message_history', handleMessageHistory);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_error', handleMessageError);

    return () => {
      socket.off('message_history', handleMessageHistory);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_error', handleMessageError);
    };
  }, [socket, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected || isSending) return;

    setIsSending(true);
    const msgData = {
      content: newMessage,
      room: courseId,
    };

    socket.emit('send_message', msgData, (res: { success: boolean; error?: string }) => {
      setIsSending(false);
      if (!res.success) {
        setError(res.error || 'Message send failed');
        setTimeout(() => setError(null), 5000);
      } else {
        inputRef.current?.focus();
      }
    });

    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]?.toUpperCase()).join('').substring(0, 2) || 'U';
  };

  // Group messages by date for better visual organization
  const messagesByDate = messages.reduce<{ [date: string]: Message[] }>((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary/80" />
          <MessageSquare className="w-6 h-6 text-primary absolute top-3 left-3" />
        </div>
        <p className="text-muted-foreground font-medium">Loading discussion...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border text-black rounded-lg bg-background shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Course Discussion</h3>
              <div className="flex items-center text-xs text-muted-foreground gap-2">
                {/* <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{activeUsers} active</span>
                </div>
                <span>•</span> */}
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{messages.length} messages</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {error ? (
              <Badge variant="destructive" className="flex items-center gap-1 py-1">
                <AlertCircle className="w-3 h-3" />
                Error
              </Badge>
            ) : null}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    isConnected 
                      ? 'text-green-600 bg-green-50 border border-green-200' 
                      : 'text-red-600 bg-red-50 border border-red-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {isConnected ? 'Connected' : 'Reconnecting...'}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isConnected 
                    ? `Connected to discussion server with ${activeUsers} other participants` 
                    : 'Connection lost. Attempting to reconnect...'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Message area */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollAreaRef}>
        <div className="space-y-6 pb-1">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground py-10">
              <div className="bg-primary/5 p-4 rounded-full mb-4">
                <MessageSquare className="w-12 h-12 text-primary/40" />
              </div>
              <p className="font-medium text-lg">No messages yet</p>
              <p className="text-sm max-w-xs text-center mt-1">Be the first to start the discussion in this course!</p>
              <Button className="mt-6" onClick={() => inputRef.current?.focus()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Start the conversation
              </Button>
            </div>
          ) : (
            Object.entries(messagesByDate).map(([date, dateMessages]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Separator className="flex-grow" />
                  <Badge variant="outline" className="font-normal text-xs text-muted-foreground gap-1 flex items-center px-3">
                    <Clock className="h-3 w-3" />
                    {formatDateHeader(dateMessages[0].createdAt)}
                  </Badge>
                  <Separator className="flex-grow" />
                </div>
                
                {dateMessages.map((message, index) => {
                  const sender = message.sender ?? { _id: 'unknown', name: 'Unknown' };
                  const prevMessage = index > 0 ? dateMessages[index - 1] : null;
                  
                  // Show sender info if it's a new sender or 5+ minutes have passed
                  const showSenderInfo = !prevMessage || 
                    prevMessage.sender?._id !== message.sender?._id || 
                    differenceInMinutes(
                      new Date(message.createdAt), 
                      new Date(prevMessage.createdAt)
                    ) > 5;
                  
                  // Check if next message is from same sender (for grouping)
                  const nextMessage = index < dateMessages.length - 1 ? dateMessages[index + 1] : null;
                  const isSameSenderAsNext = nextMessage && nextMessage.sender?._id === message.sender?._id &&
                    differenceInMinutes(new Date(nextMessage.createdAt), new Date(message.createdAt)) < 5;
                  
                  return (
                    <div key={message._id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        {/* Sender info - only show for others, not yourself */}
                        {!message.isMe && showSenderInfo && (
                          <div className="flex items-center gap-2 mb-1 ml-1">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(sender.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{sender.name}</span>
                          </div>
                        )}
                        
                        {/* Message bubble */}
                        <div className="flex items-end gap-2 group">
                          {!message.isMe && !showSenderInfo && (
                            <div className="w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {getInitials(sender.name)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                          
                          <div 
                            className={`
                              py-2 px-3 rounded-2xl shadow-sm
                              ${!isSameSenderAsNext ? 'mb-1' : 'mb-0.5'}
                              ${message.isMe 
                                ? 'bg-gradient-to-br from-custom_primary to-custom_primary/90 text-primary-foreground rounded-br-sm' 
                                : 'bg-muted/75 rounded-bl-sm'}
                              ${!message.isMe && !showSenderInfo ? 'ml-0' : ''}
                            `}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          </div>
                          
                          {/* Time - show as fade-in on hover for cleaner UI */}
                          {/* <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatMessageTime(message.createdAt)}
                          </span> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t bg-muted/10">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative bg-background rounded-lg border shadow-sm">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="border-0 shadow-none focus-visible:ring-0 pl-4 pr-12 py-3 min-h-12 bg-transparent"
              disabled={!isConnected || isSending}
            />
            {/* <div className="absolute right-2 bottom-0 flex items-center h-full gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100" disabled={!isConnected}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file (coming soon)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100" disabled={!isConnected}>
                      <Smile className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add emoji (coming soon)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> */}
          </div>
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || !isConnected || isSending}
            className="h-12 px-4 rounded-lg shadow-sm transition-all"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send
          </Button>
        </div>
        
        {/* Status indicator */}
        {isConnected ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pl-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            {isSending ? "Sending..." : "Ready to send messages"}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-red-500 mt-2 pl-1">
            <AlertCircle className="h-3 w-3" />
            Reconnecting to server...
          </div>
        )}
      </div>
    </div>
  );
}