"use client";

import { Box, Heading } from "@chakra-ui/react";
import { IssueForm } from "@/components/IssueForm";

export default function CreateIssuePage() {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Create New Issue
      </Heading>
      <IssueForm />
    </Box>
  );
}
