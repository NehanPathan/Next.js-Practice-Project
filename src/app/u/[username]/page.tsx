"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/model/User";

const UserMessagePage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);

  // ✅ Fetch existing messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages?username=${username}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch AI-generated suggestions
  const fetchSuggestions = async () => {
    try {
      setSuggestLoading(true);
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
      });

      const text = await response.text();
      const suggestions = text
        .split("||")
        .map((s) => s.trim())
        .filter(Boolean);

      setSuggestedMessages(suggestions);
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
      toast.error("Failed to load AI suggestions.");
    } finally {
      setSuggestLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchSuggestions();
  }, [username]);

  // ✅ Send message (manual or suggested)
  const handleSendMessage = async (content?: string) => {
    const messageToSend = content || newMessage;
    if (!messageToSend.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/messages", {
        recipientUsername: username,
        content: messageToSend,
      });
      if (response.data.success) {
        toast.success("Message sent!");
        setNewMessage("");
        fetchMessages();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Send Anonymous Message to @{username}
      </h1>

      {/* Input for custom message */}
      <div className="flex space-x-2">
        <Input
          placeholder="What's something you'd like to share?"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={() => handleSendMessage()} disabled={loading}>
          {loading ? "Sending..." : "Send It"}
        </Button>
      </div>

      {/* AI Suggested messages */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Suggested Messages</h2>
        {suggestLoading ? (
          <p className="text-sm text-gray-500">Loading AI suggestions...</p>
        ) : suggestedMessages.length > 0 ? (
          <div className="flex flex-col space-y-2">
            {suggestedMessages.map((msg, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => handleSendMessage(msg)}
              >
                {msg}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No suggestions yet. Try refreshing.
          </p>
        )}
      </div>

      {/* Messages received by user */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Messages</h2>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="p-3 bg-gray-100 rounded-md shadow-sm">
                <p>{msg.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessagePage;
