"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ISSUE_BY_ID, GET_ISSUES } from "@/graphql/queries";
import { UPDATE_ISSUE, ADD_COMMENT, DELETE_ISSUE } from "@/graphql/mutations";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  Badge,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  platform: string;
  status: string;
  severity: string;
  assignee?: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

interface IssueDetailPageProps {
  params: {
    id: string;
  };
}

export default function IssueDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>(); // no await; client hook

  const { loading, error, data } = useQuery<{ issue: Issue }>(GET_ISSUE_BY_ID, {
    variables: { id },
    skip: !id,
  });
  const [updateIssue] = useMutation(UPDATE_ISSUE);
  const [addComment] = useMutation(ADD_COMMENT);
  const [deleteIssue] = useMutation(DELETE_ISSUE);

  const [editMode, setEditMode] = useState(false);
  const [editedIssue, setEditedIssue] = useState<Partial<Issue>>({});
  const [newCommentText, setNewCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("Guest"); // Mock author

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

  const issue = data?.issue;

  if (!issue) {
    return <Text>Issue not found.</Text>;
  }

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEditedIssue({ ...editedIssue, [e.target.name]: e.target.value });
  };

  const handleUpdateIssue = async () => {
    try {
      await updateIssue({
        variables: {
          input: {
            id: issue.id,
            ...editedIssue,
          },
        },
      });
      setEditMode(false);
      setEditedIssue({});
      router.refresh(); // Refresh data after update
    } catch (err) {
      console.error("Error updating issue:", err);
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addComment({
        variables: {
          input: {
            issueId: issue.id,
            text: newCommentText,
            author: commentAuthor,
          },
        },
      });
      setNewCommentText("");
      router.refresh(); // Refresh data after adding comment
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteIssue = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await deleteIssue({
          variables: { id: issue.id },
          refetchQueries: [{ query: GET_ISSUES }], // Refetch GET_ISSUES after deleting an issue
        });
        router.push("/"); // Redirect to dashboard after deletion
        router.refresh(); // Refresh data on dashboard
      } catch (err) {
        console.error("Error deleting issue:", err);
      }
    }
  };

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
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl">
          Issue: {issue.title}
        </Heading>
        <Flex>
          <Button onClick={() => setEditMode(!editMode)} mr={4}>
            {editMode ? "Cancel Edit" : "Edit Issue"}
          </Button>
          <Button colorScheme="red" onClick={handleDeleteIssue}>
            Delete Issue
          </Button>
        </Flex>
      </Flex>

      {editMode ? (
        <Stack spacing={4} mb={6}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={editedIssue.title ?? issue.title}
              onChange={handleEditChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={editedIssue.description ?? issue.description}
              onChange={handleEditChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Platform</FormLabel>
            <Select
              name="platform"
              value={editedIssue.platform ?? issue.platform}
              onChange={handleEditChange}
            >
              <option value="DISNEY_PLUS">Disney+</option>
              <option value="ESPN_PLUS">ESPN+</option>
              <option value="HULU">Hulu</option>
              <option value="STAR_PLUS">Star+</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={editedIssue.status ?? issue.status}
              onChange={handleEditChange}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Severity</FormLabel>
            <Select
              name="severity"
              value={editedIssue.severity ?? issue.severity}
              onChange={handleEditChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Assignee</FormLabel>
            <Input
              name="assignee"
              value={editedIssue.assignee ?? issue.assignee ?? ""}
              onChange={handleEditChange}
            />
          </FormControl>
          <Button colorScheme="blue" onClick={handleUpdateIssue}>
            Save Changes
          </Button>
        </Stack>
      ) : (
        <Stack spacing={3} mb={6}>
          <Text>
            <Text as="span" fontWeight="bold">
              Description:
            </Text>{" "}
            {issue.description}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">
              Platform:
            </Text>{" "}
            <Badge colorScheme="blue">{issue.platform}</Badge>
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">
              Status:
            </Text>{" "}
            <Badge colorScheme={getStatusColor(issue.status)}>
              {issue.status}
            </Badge>
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">
              Severity:
            </Text>{" "}
            <Badge colorScheme={getSeverityColor(issue.severity)}>
              {issue.severity}
            </Badge>
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">
              Assignee:
            </Text>{" "}
            {issue.assignee ? (
              <Badge colorScheme="purple">{issue.assignee}</Badge>
            ) : (
              "Unassigned"
            )}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">
              Created At:
            </Text>{" "}
            {new Date(issue.createdAt).toLocaleString()}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">
              Last Updated:
            </Text>{" "}
            {new Date(issue.updatedAt).toLocaleString()}
          </Text>
        </Stack>
      )}

      <Box mt={8}>
        <Heading as="h2" size="lg" mb={4}>
          Comments
        </Heading>
        <Stack spacing={4} mb={6}>
          {issue.comments.length === 0 ? (
            <Text>No comments yet.</Text>
          ) : (
            issue.comments.map((comment: Comment) => (
              <Box
                key={comment.id}
                p={3}
                shadow="sm"
                borderWidth="1px"
                borderRadius="md"
              >
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">{comment.author}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Text>
                </Flex>
                <Text mt={1}>{comment.text}</Text>
              </Box>
            ))
          )}
        </Stack>

        <Box as="form" onSubmit={handleAddComment}>
          <FormControl mb={4}>
            <FormLabel>Add a Comment</FormLabel>
            <Textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write your comment here..."
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Add Comment
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
