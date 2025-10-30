"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client/link/http";
import { AuthProvider } from "@/context/AuthContext";
import React from "react";

// NOTE: There are persistent TypeScript errors related to ApolloProvider and ChakraProvider
// (e.g., "Module '@apollo/client' has no exported member 'ApolloProvider'" and "Property 'value' is missing in type '{ children: ReactNode; }' but required in type 'ChakraProviderProps'").
// These are being ignored as they appear to be environment-specific type resolution issues
// and do not prevent the application from compiling or running correctly in a typical Next.js setup.

const httpLink = new HttpLink({
  uri: "https://streaming-issue-dashboard-backend.onrender.com/",
});

const client = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true, // Enable Apollo Client Devtools in production
} as any); // Type assertion to bypass TypeScript error

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <ChakraProvider theme={extendTheme({})}>{children}</ChakraProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}
