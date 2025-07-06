// ✅ Mark as client component
"use client";

import { ReactNode, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure consistent client-side rendering
  }, []);

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {mounted ? children : null}
        </SessionProvider>
      </body>
    </html>
  );
}
