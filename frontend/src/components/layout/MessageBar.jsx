import React, { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

const defaultMessages = [
  {
    id: 1,
    text: "Welcome to Colombo International Bookfair — Stall reservations now open!",
  },
  {
    id: 2,
    text: "Max 3 stalls per business. Please verify your details before confirming.",
  },
  {
    id: 3,
    text: "QR pass will be emailed after reservation confirmation. Keep it handy for entry.",
  },
];

const MessageBar = ({ messages = defaultMessages }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 7000); // slow swap every 7s
    return () => clearInterval(t);
  }, [messages.length]);

  if (!messages?.length) return null;

  return (
    <div className="relative w-full text-white">
      <div className="absolute inset-0 -z-10 nav-animated-gradient opacity-90" />
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-md w-7 h-7 bg-white/10">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <p
              key={messages[index]?.id ?? index}
              className="text-sm font-medium text-center text-white/90 message-fade"
            >
              {messages[index]?.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
