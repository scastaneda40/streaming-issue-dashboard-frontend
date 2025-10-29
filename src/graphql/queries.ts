import { gql } from "@apollo/client";

export const GET_ISSUES = gql`
  query GetIssues(
    $platform: Platform
    $status: Status
    $severity: Severity
    $assignee: String
  ) {
    issues(
      platform: $platform
      status: $status
      severity: $severity
      assignee: $assignee
    ) {
      id
      title
      platform
      status
      severity
      assignee
      createdAt
      updatedAt
    }
  }
`;

export const GET_ISSUE_BY_ID = gql`
  query GetIssueById($id: ID!) {
    issue(id: $id) {
      id
      title
      description
      platform
      status
      severity
      assignee
      createdAt
      updatedAt
      comments {
        id
        text
        createdAt
        author
      }
    }
  }
`;
