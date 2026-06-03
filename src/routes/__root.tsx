import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page not found.</p>
        <Link to="/" className="mt-4 inline-block text-[var(--teal)] underline">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <pre className="text-sm text-gray-600 mt-2">{error.message}</pre>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tulip DocBuilder" },
      { name: "description", content: "Medical document generator for Tulip Superspeciality Hospital." },
      { property: "og:title", content: "Tulip DocBuilder" },
      { name: "twitter:title", content: "Tulip DocBuilder" },
      { property: "og:description", content: "Medical document generator for Tulip Superspeciality Hospital." },
      { name: "twitter:description", content: "Medical document generator for Tulip Superspeciality Hospital." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/UVkZVQuMbxWtn8HKtjSnqSrvUVL2/social-images/social-1780472311854-613118976_896868179536490_645543955115993624_n-removebg-preview.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/UVkZVQuMbxWtn8HKtjSnqSrvUVL2/social-images/social-1780472311854-613118976_896868179536490_645543955115993624_n-removebg-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
