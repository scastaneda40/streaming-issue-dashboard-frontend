import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Issue, Comment, Platform, Status, Severity } from "./interfaces";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  enum Platform {
    DISNEY_PLUS
    ESPN_PLUS
    HULU
    STAR_PLUS
  }

  enum Status {
    OPEN
    IN_PROGRESS
    RESOLVED
    CLOSED
  }

  enum Severity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  type Comment {
    id: ID!
    text: String!
    createdAt: String!
    author: String!
  }

  type Issue {
    id: ID!
    title: String!
    description: String!
    platform: Platform!
    status: Status!
    severity: Severity!
    assignee: String
    createdAt: String!
    updatedAt: String!
    comments: [Comment]
  }

  type Query {
    issues(
      platform: Platform
      status: Status
      severity: Severity
      assignee: String
    ): [Issue]
    issue(id: ID!): Issue
  }

  input CreateIssueInput {
    title: String!
    description: String!
    platform: Platform!
    severity: Severity!
  }

  input UpdateIssueInput {
    id: ID!
    title: String
    description: String
    platform: Platform
    status: Status
    severity: Severity
    assignee: String
  }

  input AddCommentInput {
    issueId: ID!
    text: String!
    author: String!
  }

  type Mutation {
    createIssue(input: CreateIssueInput!): Issue
    updateIssue(input: UpdateIssueInput!): Issue
    addComment(input: AddCommentInput!): Issue
    deleteIssue(id: ID!): Boolean
  }
`;

let issues: Issue[] = [
  {
    id: "1",
    title: "Video Playback Issue on Disney+",
    description:
      "Users are reporting buffering and playback errors on Disney+.",
    platform: Platform.DISNEY_PLUS,
    status: Status.OPEN,
    severity: Severity.HIGH,
    assignee: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  },
  {
    id: "2",
    title: "Login Failure on ESPN+",
    description:
      "Some users are unable to log in to ESPN+ with valid credentials.",
    platform: Platform.ESPN_PLUS,
    status: Status.IN_PROGRESS,
    severity: Severity.CRITICAL,
    assignee: "Alice",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [
      {
        id: "c1",
        text: "Investigating potential authentication service issues.",
        createdAt: new Date().toISOString(),
        author: "Alice",
      },
    ],
  },
  {
    id: "3",
    title: "Subtitle Sync Issue on Hulu",
    description: "Subtitles are out of sync on various shows on Hulu.",
    platform: Platform.HULU,
    status: Status.RESOLVED,
    severity: Severity.MEDIUM,
    assignee: "Bob",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [
      {
        id: "c2",
        text: "Deployed a fix for subtitle synchronization.",
        createdAt: new Date().toISOString(),
        author: "Bob",
      },
    ],
  },
];

const resolvers = {
  Query: {
    issues: (
      parent: any,
      {
        platform,
        status,
        severity,
        assignee,
      }: {
        platform?: Platform;
        status?: Status;
        severity?: Severity;
        assignee?: string;
      }
    ): Issue[] => {
      let filteredIssues = issues;
      if (platform) {
        filteredIssues = filteredIssues.filter(
          (issue) => issue.platform === platform
        );
      }
      if (status) {
        filteredIssues = filteredIssues.filter(
          (issue) => issue.status === status
        );
      }
      if (severity) {
        filteredIssues = filteredIssues.filter(
          (issue) => issue.severity === severity
        );
      }
      if (assignee) {
        filteredIssues = filteredIssues.filter(
          (issue) =>
            issue.assignee &&
            issue.assignee.toLowerCase().includes(assignee.toLowerCase())
        );
      }
      return filteredIssues;
    },
    issue: (parent: any, { id }: { id: string }): Issue | undefined =>
      issues.find((issue) => issue.id === id),
  },
  Mutation: {
    createIssue: (
      parent: any,
      {
        input,
      }: {
        input: Omit<
          Issue,
          "id" | "status" | "assignee" | "createdAt" | "updatedAt" | "comments"
        >;
      }
    ): Issue => {
      const newIssue: Issue = {
        id: String(issues.length + 1),
        ...input,
        status: Status.OPEN,
        assignee: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
      };
      issues.push(newIssue);
      return newIssue;
    },
    updateIssue: (
      parent: any,
      { input }: { input: Partial<Issue> & { id: string } }
    ): Issue => {
      const { id, ...rest } = input;
      const issueIndex = issues.findIndex((issue) => issue.id === id);
      if (issueIndex === -1) {
        throw new Error(`Issue with ID ${id} not found.`);
      }
      issues[issueIndex] = {
        ...issues[issueIndex],
        ...rest,
        updatedAt: new Date().toISOString(),
      };
      return issues[issueIndex];
    },
    addComment: (
      parent: any,
      { input }: { input: { issueId: string; text: string; author: string } }
    ): Issue => {
      const { issueId, text, author } = input;
      const issueIndex = issues.findIndex((issue) => issue.id === issueId);
      if (issueIndex === -1) {
        throw new Error(`Issue with ID ${issueId} not found.`);
      }
      const newComment: Comment = {
        id: String(issues[issueIndex].comments.length + 1),
        text,
        author,
        createdAt: new Date().toISOString(),
      };
      issues[issueIndex].comments.push(newComment);
      issues[issueIndex].updatedAt = new Date().toISOString();
      return issues[issueIndex];
    },
    deleteIssue: (parent: any, { id }: { id: string }): boolean => {
      const initialLength = issues.length;
      issues = issues.filter((issue) => issue.id !== id);
      return issues.length < initialLength;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to startStandaloneServer creates an Express app and mounts
// your Apollo Server instance as middleware.
// Learn more about what `startStandaloneServer` options you can pass:
// https://www.apollographql.com/docs/apollo-server/api/standalone/setup#startstandaloneserver
startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) || 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
