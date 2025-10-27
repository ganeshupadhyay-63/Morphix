import React, { useState } from "react";
import Markdown from "react-markdown";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";

const CreationsItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <article
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer transition hover:shadow-sm hover:bg-gray-50"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-medium">{item.prompt}</h2>
          <p className="text-gray-500 text-xs">
            {item.type} •{" "}
            {new Date(item.created_at).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full text-xs">
            {item.type}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {item.type === "image" ? (
          <img
            src={item.content}
            alt="Generated creation"
            className="w-full max-w-md rounded-md border mt-3"
          />
        ) : (
          <div className="mt-3 max-h-64 overflow-y-auto text-sm text-slate-700 relative">
            {/* Copy button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                handleCopy();
              }}
              className="absolute top-0 right-0 flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
            >
              <Copy className="w-3 h-3" />
              {copied ? "Copied!" : "Copy"}
            </button>

            <div className="reset-tw prose prose-sm pr-14"> 
             
              <Markdown>{item.content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default CreationsItem;
