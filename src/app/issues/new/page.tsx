"use client";

import React, { Suspense } from "react";
import { Box, Heading, Spinner, Center } from "@chakra-ui/react";

const LazyIssueForm = React.lazy(() =>
  import("@/components/IssueForm").then((module) => ({
    default: module.IssueForm,
  }))
);

export default function CreateIssuePage() {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Create New Issue
      </Heading>
      <Suspense
        fallback={
          <Center h="200px">
            <Spinner size="xl" />
          </Center>
        }
      >
        <LazyIssueForm />
      </Suspense>
    </Box>
  );
}
