"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    let cleanInput = input.trim();
    
    // Remove protocol if present (http://, https://)
    cleanInput = cleanInput.replace(/^https?:\/\//, "");
    
    // Remove trailing slashes
    cleanInput = cleanInput.replace(/\/+$/, "");
    
    // Extract port number if present (e.g., :3000)
    let port = "";
    const portMatch = cleanInput.match(/:(\d+)$/);
    if (portMatch) {
      port = portMatch[1];
      cleanInput = cleanInput.replace(/:\d+$/, "");
    }
    
    // Parse subdomain.domain.com format
    const parts = cleanInput.split(".");
    
    if (parts.length >= 2) {
      // Extract subdomain (first part) and full domain (keep subdomain in domain)
      const subdomain = parts[0];
      const fullDomain = cleanInput; // Keep the full domain including subdomain
      
      // Validate that we have both subdomain and domain
      if (subdomain && fullDomain) {
        // Build query params - pass the full domain (with subdomain)
        const params = new URLSearchParams({ domain: fullDomain });
        if (port) {
          params.set("port", port);
        }
        
        // Open slug route in a new tab
        const slugUrl = `/${subdomain}?${params.toString()}`;
        window.open(slugUrl, "_blank");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 text-center">
            Domain Redirect
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400 text-center">
            Enter a subdomain.domain.com format to redirect
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="subdomain.domain.com"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
            />
            <button
              type="submit"
              className="w-full h-12 rounded-full bg-foreground text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium"
            >
              Redirect
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
