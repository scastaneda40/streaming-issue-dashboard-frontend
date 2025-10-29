import { gql } from "@apollo/client";

export const CREATE_ISSUE = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      id
      title
      description
      platform
      status
      severity
      assignee
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ISSUE = gql`
  mutation UpdateIssue($input: UpdateIssueInput!) {
    updateIssue(input: $input) {
      id
      title
      description
      platform
      status
      severity
      assignee
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      id
      comments {
        id
        text
        createdAt
        author
      }
      updatedAt
    }
  }
`;

export const DELETE_ISSUE = gql`
  mutation DeleteIssue($id: ID!) {
    deleteIssue(id: $id)
  }
`;
