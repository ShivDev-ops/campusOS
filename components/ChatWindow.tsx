'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessageAction } from '@/app/actions/chat'

interface Message {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
  profiles?: {
    full_name: string
    permission_tier: string
  } | null
}

interface Props {
  roomId: string
  userId: string
  initialMessages: Message[]
  roomName: string
}

export default function ChatWindow({ roomId, userId, initialMessages, roomName }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Scroll to bottom on load and new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages, roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Subscribe to real-time database changes
  useEffect(() => {
    const channel = supabase
      .channel(`chat_room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          const newMessage = payload.new as any
          
          // Check if we already have this message to avoid double render
          if (messages.some(m => m.id === newMessage.id)) return

          // Fetch profile of the sender in background
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, permission_tier')
            .eq('id', newMessage.sender_id)
            .single()

          const messageWithProfile: Message = {
            id: newMessage.id,
            room_id: newMessage.room_id,
            sender_id: newMessage.sender_id,
            content: newMessage.content,
            created_at: newMessage.created_at,
            profiles: profile || null
          }

          setMessages(prev => [...prev, messageWithProfile])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase, messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!inputText.trim() || isSending) return

    setIsSending(true)
    const textToSend = inputText
    setInputText('')

    const response = await sendMessageAction(roomId, textToSend)
    setIsSending(false)

    if (response?.error) {
      alert(`Error sending: ${response.error}`)
      setInputText(textToSend) // restore text
    }
  }

  return (
    <section className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-white relative">
      {/* Header */}
      <div className="px-6 h-16 border-b border-rule-grey flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-ink-navy rounded flex items-center justify-center text-white font-mono text-sm font-bold uppercase">
            {roomName[0] || 'G'}
          </div>
          <div>
            <h2 className="font-headline text-base font-bold leading-tight text-ink-navy">{roomName}</h2>
            <p className="text-[10px] font-mono text-success-sage flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success-sage rounded-full animate-pulse"></span>
              Live Channel Active
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-paper-bg/10 custom-scrollbar">
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.sender_id === userId
            const senderName = isMe ? 'You' : (msg.profiles?.full_name || 'Anonymous')
            const isSellerVerified = msg.profiles?.permission_tier === 'Trader' || msg.profiles?.permission_tier === 'Admin'
            const tier = msg.profiles?.permission_tier || 'Reader'
            const timeFormatted = new Date(msg.created_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && (
                  <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-rule-grey bg-paper-bg flex items-center justify-center font-bold text-sm">
                    {senderName[0]?.toUpperCase()}
                  </div>
                )}
                <div className={`max-w-[70%] space-y-1 ${isMe ? 'flex flex-col items-end' : ''}`}>
                  <div className={`flex items-center gap-1.5 text-[10px] font-mono text-outline ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-sans font-bold text-ink-navy">{senderName}</span>
                    {!isMe && isSellerVerified && (
                      <span className="material-symbols-outlined text-[12px] text-verified-gold" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    )}
                    {!isMe && (
                      <span className="px-1 py-0.5 rounded bg-paper-bg border border-rule-grey text-[8px] uppercase">
                        {tier}
                      </span>
                    )}
                    <span>{timeFormatted}</span>
                  </div>
                  <div
                    className={`p-3 rounded-xl shadow-sm text-sm leading-relaxed ${
                      isMe
                        ? 'bg-ink-navy text-white rounded-br-none'
                        : 'bg-white border border-rule-grey text-on-surface rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-60">
            <span className="material-symbols-outlined text-outline text-5xl">chat_bubble_outline</span>
            <p className="text-sm font-sans">No messages yet. Send a message to start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-rule-grey bg-white">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <div className="flex-1 min-h-[48px] bg-paper-bg border border-rule-grey rounded-xl p-1 flex items-center gap-1 focus-within:border-ink-navy transition-colors">
            <textarea
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-3 resize-none outline-none max-h-24"
              placeholder={`Type a message to ${roomName}...`}
              rows={1}
              value={inputText}
              disabled={isSending}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="h-12 w-12 bg-ink-navy text-white rounded-xl flex items-center justify-center hover:bg-ink-navy/90 active:scale-95 transition-all disabled:opacity-40"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </section>
  )
}
