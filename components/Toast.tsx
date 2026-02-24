"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`
        fixed bottom-24 left-1/2 -translate-x-1/2 z-50
        bg-[#1f1f1f] border border-[#2a2a2a] text-[#f0f0f0]
        px-5 py-3 rounded-xl text-sm font-mono
        transition-all duration-200
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      {message}
    </div>
  );
}
