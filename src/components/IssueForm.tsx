"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useMutation } from "@apollo/client/react/hooks";
import { CREATE_ISSUE, UPDATE_ISSUE } from "@/graphql/mutations";
import { GET_ISSUES } from "@/graphql/queries";
import { useRouter } from "next/navigation";

interface IssueFormProps {
  issue?: {
    id: string;
    title: string;
    description: string;
    platform: string;
    status: string;
    severity: string;
    assignee?: string | null;
  };
  onClose?: () => void; // For modal usage
}

export function IssueForm({ issue, onClose }: IssueFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "",
    status: "OPEN", // Default status for new issues
    severity: "",
    assignee: "",
  });

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description,
        platform: issue.platform,
        status: issue.status,
        severity: issue.severity,
        assignee: issue.assignee ?? "",
      });
    }
  }, [issue]);

  const [createIssue] = useMutation(CREATE_ISSUE);
  const [updateIssue] = useMutation(UPDATE_ISSUE);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (issue) {
        // Update existing issue
        await updateIssue({
          variables: {
            input: {
              id: issue.id,
              ...formData,
            },
          },
        });
      } else {
        // Create new issue
        await createIssue({
          variables: {
            input: {
              title: formData.title,
              description: formData.description,
              platform: formData.platform,
              severity: formData.severity,
            },
          },
          refetchQueries: [{ query: GET_ISSUES }], // Refetch GET_ISSUES after creating a new issue
        });
      }
      router.push("/"); // Navigate to dashboard after submission
      router.refresh(); // Refresh data
      onClose?.(); // Close modal if used in one
    } catch (err) {
      console.error("Error submitting issue:", err);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
    >
      <Heading size="md" mb={4}>
        {issue ? "Edit Issue" : "Create New Issue"}
      </Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter issue title"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter issue description"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Platform</FormLabel>
          <Select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            placeholder="Select platform"
          >
            <option value="DISNEY_PLUS">Disney+</option>
            <option value="ESPN_PLUS">ESPN+</option>
            <option value="HULU">Hulu</option>
            <option value="STAR_PLUS">Star+</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Severity</FormLabel>
          <Select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            placeholder="Select severity"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Status</FormLabel>
          <Select name="status" value={formData.status} onChange={handleChange}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Assignee</FormLabel>
          <Input
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            placeholder="Assignee name"
          />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          {issue ? "Update Issue" : "Create Issue"}
        </Button>
      </Stack>
    </Box>
  );
}
