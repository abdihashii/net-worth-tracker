import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refetch on window focus only in production for better UX
      refetchOnWindowFocus: process.env.NODE_ENV === "production",

      // Don't refetch on mount by default to reduce unnecessary requests
      refetchOnMount: false,

      // Refetch on reconnect to ensure fresh data after connection loss
      refetchOnReconnect: true,

      // Smart retry logic - retry network errors but not client errors
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error) {
          const message = error.message;
          if (message.includes("4") && message.includes("status")) {
            return false;
          }
          // Retry network errors up to 3 times
          if (message.includes("Network") || message.includes("fetch")) {
            return failureCount < 3;
          }
        }
        return false;
      },

      // Financial data should be relatively fresh
      staleTime: 1000 * 60 * 2, // 2 minutes

      // Keep data in cache longer for better performance
      gcTime: 1000 * 60 * 30, // 30 minutes

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Mutations should retry on network errors
      retry: 1,
      retryDelay: 1000,
    },
  },
});
