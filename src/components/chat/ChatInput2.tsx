import React, { useState, useRef } from "react";
import {
  Paperclip,
  Send,
  Plus,
  X,
  Code,
  Image,
  FileText,
  MessageSquare,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/StoreContext";
import { MessageType } from "../../types";

import StatusPopup from "./pop_ups/StatusPopup";
import FilePopup from "./pop_ups/FilePopup";


const ChatInput: React.FC = observer(() => {
  const { chatStore } = useStore();
  const [message, setMessage] = useState("");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>(MessageType.text);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeConversationId, sendMessage } = chatStore;


  const [statusFields, setStatusFields] = useState<Record<string, string>>({});
  const [fileMessage, setFileMessage] = useState("");


  const handleSendMessage = () => {
    if ((!message.trim() && !selectedFile) || !activeConversationId) return;

    let finalMessage = message;

    if (messageType === "status") {
      finalMessage = `Status Update:\n${Object.entries(statusFields)
        .map(([title, text]) => `${title}: ${text}`)
        .join("\n")}`;
    } else if (messageType === "file" || messageType === "image") {
      finalMessage = fileMessage || selectedFile?.name || "File uploaded";
    }
    

    sendMessage(activeConversationId, finalMessage, messageType);
    setMessage("");
    setSelectedFile(null);
    setMessageType(MessageType.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (type: "file" | "image") => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "*/*";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessageType(
        file.type.startsWith("image/") ? MessageType.image : MessageType.file
      );
    }
  };

  if (!activeConversationId) return null;

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {selectedFile && (
        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {selectedFile.name}
          </span>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {messageType === "code" && (
        <div className="mb-2">
          <select
            value={codeLanguage}
            onChange={(e) => setCodeLanguage(e.target.value)}
            className="text-sm p-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c#">C#</option>
            <option value="lisp">LISP</option>
            <option value="rust">rust</option>
            <option value="ruby">ruby</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            aria-label="Add content type"
          >
            <Plus className="h-5 w-5" />
          </button>

          {showTypeMenu && (
            <div className="absolute bottom-full mb-2 left-0 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-60">
              <div className="p-2">
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => {
                    setMessageType(MessageType.text);
                    setShowTypeMenu(false);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>Text</span>
                </button>
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => {
                    handleFileSelect("file");
                    setShowTypeMenu(false);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>File</span>
                </button>
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => {
                    handleFileSelect("image");
                    setShowTypeMenu(false);
                  }}
                >
                  <Image className="h-4 w-4 mr-2" />
                  <span>Image</span>
                </button>
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => {
                    setMessageType(MessageType.code);
                    setShowTypeMenu(false);
                  }}
                >
                  <Code className="h-4 w-4 mr-2" />
                  <span>Code Snippet</span>
                </button>
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => {
                    setMessageType(MessageType.status);
                    setShowTypeMenu(false);
                  }}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  <span>Status Update</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 mx-2">
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder={
              messageType === "status"
                ? "Enter your status update..."
                : messageType === "code"
                ? "Enter your code..."
                : "Type a message..."
            }
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendMessage}
          disabled={!message.trim() && !selectedFile}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
});

export default ChatInput;
