import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthRedirect>
        <Component {...pageProps} />
      </AuthRedirect>
    </SessionProvider>
  );
}

// ✅ Wrapper that redirects based on role
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      const currentPath = router.pathname;

      if (role === "ADMIN" && currentPath !== "/admin") {
        router.push("/admin");
      } else if (role === "EMPLOYEE" && currentPath !== "/employee") {
        router.push("/employee");
      } else if (!role && currentPath !== "/unauthorized") {
        router.push("/unauthorized");
      }
    }
  }, [session, status, router]);

  return <>{children}</>;
}
