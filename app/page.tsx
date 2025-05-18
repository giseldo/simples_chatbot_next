"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Loader2, Send, User } from "lucide-react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat()
  const [isInputEmpty, setIsInputEmpty] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e)
    setIsInputEmpty(e.target.value.trim() === "")
  }

  // Simple token count approximation
  const getTokenCount = (text: string) => {
    return Math.ceil(text.split(/\s+/).length * 1.3) // Rough approximation of tokens
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">AI Chatbot</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <p>How can I help you today?</p>
                <p className="text-sm mt-1">Ask me anything!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {message.role === "user" ? (
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    ) : (
                      <Avatar className="bg-muted">
                        <div className="text-primary font-semibold">AI</div>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === "assistant" && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Tokens: ~{getTokenCount(message.content)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {status === "streaming" && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="bg-muted flex-shrink-0 mt-1">
                  <div className="text-primary font-semibold">AI</div>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={status === "streaming"}
            />
            <Button type="submit" disabled={isInputEmpty || status === "streaming"}>
              {status === "streaming" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

