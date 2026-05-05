"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { Send, MessageSquare, ArrowLeft, CheckCheck } from "lucide-react";

type Conversation = {
  id: string;
  vendor: { id: string; businessName: string; category: string; photos: string[] };
  messages: { text: string; createdAt: string }[];
  _count: { messages: number };
  updatedAt: string;
};

type Message = {
  id: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  sender: { id: string; name: string | null };
};

const CATEGORY_LABELS: Record<string, string> = {
  VENUE: "Локація", ENTERTAINMENT: "Розваги", CATERING: "Кейтеринг",
  PHOTO_VIDEO: "Фото/Відео", DECOR: "Декор",
};

function MessagesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/conversations");
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations);
    }
    setLoadingConvs(false);
  }, []);

  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true);
    const res = await fetch(`/api/conversations/${convId}/messages`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
    }
    setLoadingMsgs(false);
  }, []);

  // Open or create conversation with vendor from query param
  const openVendorConversation = useCallback(async (vid: string) => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId: vid }),
    });
    if (res.ok) {
      const data = await res.json();
      setActiveId(data.conversation.id);
      await fetchConversations();
    }
  }, [fetchConversations]);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      fetchConversations().then(() => {
        if (vendorId) openVendorConversation(vendorId);
      });
    }
  }, [status, router, vendorId, fetchConversations, openVendorConversation]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId);

    // Poll for new messages every 3 seconds
    pollRef.current = setInterval(() => fetchMessages(activeId), 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeId, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !activeId || sending) return;
    setSending(true);
    const res = await fetch(`/api/conversations/${activeId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setText("");
      await fetchMessages(activeId);
      await fetchConversations();
    }
    setSending(false);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === activeId);

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto flex h-[calc(100vh-64px)]">

        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-[var(--dark-border)] flex flex-col ${activeId ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-[var(--dark-border)]">
            <h1 className="text-white font-semibold text-lg">Повідомлення</h1>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageSquare className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
                <p className="text-[var(--text-muted)] text-sm">Поки немає повідомлень</p>
                <p className="text-[var(--text-muted)] text-xs mt-1">Напишіть виконавцю з каталогу</p>
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full text-left px-4 py-4 border-b border-[var(--dark-border)] hover:bg-white/5 transition-colors ${activeId === conv.id ? "bg-white/5 border-l-2 border-l-[var(--gold)]" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--gold)] text-sm font-bold">
                        {conv.vendor.businessName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium truncate">
                          {conv.vendor.businessName}
                        </span>
                        {conv._count.messages > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-black text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {conv._count.messages}
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-muted)] text-xs truncate mt-0.5">
                        {CATEGORY_LABELS[conv.vendor.category] ?? conv.vendor.category}
                      </p>
                      {conv.messages[0] && (
                        <p className="text-[var(--text-muted)] text-xs truncate mt-1">
                          {conv.messages[0].text}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${activeId ? "flex" : "hidden md:flex"}`}>
          {!activeId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
                <p className="text-[var(--text-muted)]">Оберіть розмову або напишіть виконавцю</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-4 py-4 border-b border-[var(--dark-border)] flex items-center gap-3">
                <button
                  onClick={() => setActiveId(null)}
                  className="md:hidden text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                  <span className="text-[var(--gold)] text-sm font-bold">
                    {activeConv?.vendor.businessName[0]}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{activeConv?.vendor.businessName}</div>
                  <div className="text-[var(--text-muted)] text-xs">
                    {activeConv ? CATEGORY_LABELS[activeConv.vendor.category] : ""}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)] text-sm">Почніть розмову</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isOwn = msg.sender.id === session?.user.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                          {!isOwn && (
                            <span className="text-[var(--text-muted)] text-xs px-1">
                              {msg.sender.name}
                            </span>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                            isOwn
                              ? "bg-[var(--gold)] text-black rounded-br-sm"
                              : "bg-[var(--dark-card)] border border-[var(--dark-border)] text-white rounded-bl-sm"
                          }`}>
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-1 px-1">
                            <span className="text-[var(--text-muted)] text-xs">
                              {new Date(msg.createdAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isOwn && msg.isRead && (
                              <CheckCheck className="w-3 h-3 text-[var(--gold)]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-[var(--dark-border)] flex gap-3">
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Напишіть повідомлення..."
                  className="flex-1 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="w-11 h-11 bg-[var(--gold)] text-black rounded-xl flex items-center justify-center hover:bg-[var(--gold-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {sending
                    ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  );
}
