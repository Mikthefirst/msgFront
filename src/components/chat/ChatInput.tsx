//ChatInput2.tsx
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
import CodePopup from "./pop_ups/CodePopup";


const ChatInput: React.FC = observer(() => {
  const { chatStore } = useStore();
  const [message, setMessage] = useState("");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>(MessageType.text);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [statusFields, setStatusFields] = useState<Record<string, string>>({});
  const [fileMessage, setFileMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeConversationId, sendMessage, sendStatus, sendFile } = chatStore;

  const handleSendMessage = () => {
    if (
      (!message.trim() && !selectedFile && messageType !== "status") ||
      !activeConversationId
    ) {
      return;
    }

    // === TEXT ===
    if (messageType === MessageType.text) {
      sendMessage(activeConversationId, message.trim(), MessageType.text);
    }

    // === CODE ===
    else if (messageType === MessageType.code) {
      const codeFormatted = `\`\`\`${codeLanguage}\n${message.trim()}\n\`\`\``;
      sendMessage(activeConversationId, codeFormatted, MessageType.code);
    }

    // === STATUS ===
    else if (messageType === MessageType.status) {
      sendStatus(activeConversationId, statusFields); // отправляем сырой объект
    }

    // === IMAGE / FILE ===
    else if (
      (messageType === MessageType.file || messageType === MessageType.image) &&
      selectedFile
    ) {
      const displayName = fileMessage || selectedFile.name;
      sendFile(activeConversationId, selectedFile, displayName, messageType);
    }

    // === RESET ===
    setMessage("");
    setSelectedFile(null);
    setMessageType(MessageType.text);
    setStatusFields({});
    setFileMessage("");
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
    <div className="relative">
      {/* Code Snippet Popup */}
      {messageType === "code" && (
        <CodePopup
          code={message}
          language={codeLanguage}
          onChange={setMessage}
          onLanguageChange={setCodeLanguage}
          onClose={() => {
            setMessageType(MessageType.text);
            setMessage("");
          }}
        />
      )}
      {/* Status Update Popup */}
      {messageType === "status" && (
        <StatusPopup
          statusData={statusFields}
          onChange={(field, val) =>
            setStatusFields((prev) => ({ ...prev, [field]: val }))
          }
          onClose={() => {
            setMessageType(MessageType.text);
            setStatusFields({});
          }}
        />
      )}

      {/* File/Image Popup */}
      {(messageType === "file" || messageType === "image") && selectedFile && (
        <FilePopup
          file={selectedFile}
          message={fileMessage}
          onChange={setFileMessage}
          onClose={() => {
            setSelectedFile(null);
            setMessageType(MessageType.text);
          }}
        />
      )}

      {/* Main Input UI */}
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
              <div className="absolute bottom-[150%] left-0 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-80">
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
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={
                messageType === "status"
                  ? "Enter your status in pop up update..."
                  : messageType === "code"
                  ? "Enter your code..."
                  : "Type a message..."
              }
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={
                messageType === "file" ||
                messageType === "image" ||
                messageType === "status" ||
                messageType === "code"
              }
            />
          </div>

          <button
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={
              !message.trim() && !selectedFile && messageType !== "status"
            }
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
    </div>
  );
});

export default ChatInput;
