"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { GET_ISSUES } from "@/graphql/queries";
import { IssueCard } from "@/components/IssueCard";
import { IssueFilters } from "@/components/IssueFilters";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import { Button, Flex } from "@chakra-ui/react"; // Import Button and Flex
import Link from "next/link"; // Import Link for navigation

interface Issue {
  id: string;
  title: string;
  platform: string;
  status: string;
  severity: string;
  assignee?: string | null;
}

export default function HomePage() {
  const [filters, setFilters] = useState({
    platform: "",
    status: "",
    severity: "",
    assignee: "",
  });

  const { loading, error, data } = useQuery<{ issues: Issue[] }>(GET_ISSUES, {
    variables: {
      platform: filters.platform || undefined,
      status: filters.status || undefined,
      severity: filters.severity || undefined,
      assignee: filters.assignee || undefined,
    },
  });

  const handleFilterChange = (newFilters: {
    platform: string;
    status: string;
    severity: string;
    assignee: string;
  }) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return <Text color="red.500">Error: {error.message}</Text>;
  }

  const issues: Issue[] = data?.issues || [];

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl">
          Issue Dashboard
        </Heading>
        <Link href="/issues/new" passHref legacyBehavior>
          <Button colorScheme="blue">Create New Issue</Button>
        </Link>
      </Flex>
      <IssueFilters onFilterChange={handleFilterChange} />
      {issues.length === 0 ? (
        <Text>No issues found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {issues.map((issue: Issue) => (
            <IssueCard key={issue.id} {...issue} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
