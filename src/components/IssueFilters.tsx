"use client";

import {
  Box,
  Select,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, ChangeEvent } from "react";

interface IssueFiltersProps {
  onFilterChange: (filters: {
    platform: string;
    status: string;
    severity: string;
    assignee: string;
  }) => void;
}

export function IssueFilters({ onFilterChange }: IssueFiltersProps) {
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [assignee, setAssignee] = useState("");

  const handleApplyFilters = () => {
    onFilterChange({ platform, status, severity, assignee });
  };

  const handleClearFilters = () => {
    setPlatform("");
    setStatus("");
    setSeverity("");
    setAssignee("");
    onFilterChange({ platform: "", status: "", severity: "", assignee: "" });
  };

  return (
    <Box mb={6} p={4} shadow="md" borderWidth="1px" borderRadius="lg">
      <Flex wrap="wrap" gap={4} align="center">
        <Select
          placeholder="Filter by Platform"
          value={platform}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setPlatform(e.target.value)
          }
          width={{ base: "100%", md: "auto" }}
        >
          <option value="DISNEY_PLUS">Disney+</option>
          <option value="ESPN_PLUS">ESPN+</option>
          <option value="HULU">Hulu</option>
          <option value="STAR_PLUS">Star+</option>
        </Select>

        <Select
          placeholder="Filter by Status"
          value={status}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setStatus(e.target.value)
          }
          width={{ base: "100%", md: "auto" }}
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </Select>

        <Select
          placeholder="Filter by Severity"
          value={severity}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSeverity(e.target.value)
          }
          width={{ base: "100%", md: "auto" }}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </Select>

        <InputGroup width={{ base: "100%", md: "auto" }}>
          <Input
            placeholder="Filter by Assignee"
            value={assignee}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAssignee(e.target.value)
            }
          />
          <InputRightElement width="4.5rem">
            {assignee && (
              <Button h="1.75rem" size="sm" onClick={() => setAssignee("")}>
                Clear
              </Button>
            )}
          </InputRightElement>
        </InputGroup>

        <Button colorScheme="blue" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Flex>
    </Box>
  );
}
