import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Data Visualization App</h1>

      {!session ? (
        <>
          <p>Not logged in</p>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user?.name}</p>
          <p>Role: {session.user?.role}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </main>
  );
}
