"use client";
import SearchInput from "@/components/searchInput";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import "../app/globals.css";

export default function Home() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SearchInput />
    </QueryClientProvider>
  );
}
