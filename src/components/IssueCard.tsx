"use client";

import { Box, Heading, Text, Badge, Flex, Spacer } from "@chakra-ui/react";
import Link from "next/link";

interface IssueCardProps {
  id: string;
  title: string;
  platform: string;
  status: string;
  severity: string;
  assignee?: string | null;
}

export function IssueCard({
  id,
  title,
  platform,
  status,
  severity,
  assignee,
}: IssueCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "red";
      case "IN_PROGRESS":
        return "orange";
      case "RESOLVED":
        return "green";
      case "CLOSED":
        return "gray";
      default:
        return "gray";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "green";
      case "MEDIUM":
        return "yellow";
      case "HIGH":
        return "orange";
      case "CRITICAL":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Link href={`/issues/${id}`} passHref>
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <Flex align="center">
          <Heading fontSize="xl">{title}</Heading>
          <Spacer />
          <Badge colorScheme={getStatusColor(status)}>{status}</Badge>
        </Flex>
        <Text mt={2}>
          Platform: <Badge colorScheme="blue">{platform}</Badge>
        </Text>
        <Text mt={2}>
          Severity:{" "}
          <Badge colorScheme={getSeverityColor(severity)}>{severity}</Badge>
        </Text>
        {assignee && (
          <Text mt={2}>
            Assignee: <Badge colorScheme="purple">{assignee}</Badge>
          </Text>
        )}
      </Box>
    </Link>
  );
}
