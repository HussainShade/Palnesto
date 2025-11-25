"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function SlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  
  const slug = params?.slug as string;
  const domain = searchParams?.get("domain");
  const port = searchParams?.get("port");

  useEffect(() => {
    if (domain && slug) {
      // Clean domain - remove any protocol or trailing slashes
      let cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
      
      // Check if domain is an IP address (contains only numbers and dots)
      const isIPAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(cleanDomain);
      
      // Use provided port, or default to 3000 for IP addresses only
      // Regular domains (like vercel.app) will have no port
      const finalPort = port || (isIPAddress ? "3000" : "");
      const portSuffix = finalPort ? `:${finalPort}` : "";
      
      // Countdown before redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect to domain.com/subdomain format with port
            window.location.href = `https://${cleanDomain}${portSuffix}/${slug}`;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [domain, slug, port]);

  const cleanDomain = domain ? domain.replace(/^https?:\/\//, "").replace(/\/+$/, "") : null;
  const isIPAddress = cleanDomain ? /^\d{1,3}(\.\d{1,3}){3}$/.test(cleanDomain) : false;
  const finalPort = port || (isIPAddress ? "3000" : "");
  const portSuffix = finalPort ? `:${finalPort}` : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 w-full max-w-md px-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-4">
            You've entered to this {slug}
          </h1>
          {cleanDomain && slug ? (
            <div className="space-y-4">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Redirecting to <span className="font-medium text-zinc-900 dark:text-zinc-100">https://{cleanDomain}{portSuffix}/{slug}</span>
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
              </p>
            </div>
          ) : (
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {!slug ? "Invalid slug" : "No domain provided"}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

