"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const interfaces_1 = require("./interfaces");
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
let issues = [
    {
        id: "1",
        title: "Video Playback Issue on Disney+",
        description: "Users are reporting buffering and playback errors on Disney+.",
        platform: interfaces_1.Platform.DISNEY_PLUS,
        status: interfaces_1.Status.OPEN,
        severity: interfaces_1.Severity.HIGH,
        assignee: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
    },
    {
        id: "2",
        title: "Login Failure on ESPN+",
        description: "Some users are unable to log in to ESPN+ with valid credentials.",
        platform: interfaces_1.Platform.ESPN_PLUS,
        status: interfaces_1.Status.IN_PROGRESS,
        severity: interfaces_1.Severity.CRITICAL,
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
        platform: interfaces_1.Platform.HULU,
        status: interfaces_1.Status.RESOLVED,
        severity: interfaces_1.Severity.MEDIUM,
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
        issues: (parent, { platform, status, severity, assignee, }) => {
            let filteredIssues = issues;
            if (platform) {
                filteredIssues = filteredIssues.filter((issue) => issue.platform === platform);
            }
            if (status) {
                filteredIssues = filteredIssues.filter((issue) => issue.status === status);
            }
            if (severity) {
                filteredIssues = filteredIssues.filter((issue) => issue.severity === severity);
            }
            if (assignee) {
                filteredIssues = filteredIssues.filter((issue) => issue.assignee &&
                    issue.assignee.toLowerCase().includes(assignee.toLowerCase()));
            }
            return filteredIssues;
        },
        issue: (parent, { id }) => issues.find((issue) => issue.id === id),
    },
    Mutation: {
        createIssue: (parent, { input, }) => {
            const newIssue = Object.assign(Object.assign({ id: String(issues.length + 1) }, input), { status: interfaces_1.Status.OPEN, assignee: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), comments: [] });
            issues.push(newIssue);
            return newIssue;
        },
        updateIssue: (parent, { input }) => {
            const { id } = input, rest = __rest(input, ["id"]);
            const issueIndex = issues.findIndex((issue) => issue.id === id);
            if (issueIndex === -1) {
                throw new Error(`Issue with ID ${id} not found.`);
            }
            issues[issueIndex] = Object.assign(Object.assign(Object.assign({}, issues[issueIndex]), rest), { updatedAt: new Date().toISOString() });
            return issues[issueIndex];
        },
        addComment: (parent, { input }) => {
            const { issueId, text, author } = input;
            const issueIndex = issues.findIndex((issue) => issue.id === issueId);
            if (issueIndex === -1) {
                throw new Error(`Issue with ID ${issueId} not found.`);
            }
            const newComment = {
                id: String(issues[issueIndex].comments.length + 1),
                text,
                author,
                createdAt: new Date().toISOString(),
            };
            issues[issueIndex].comments.push(newComment);
            issues[issueIndex].updatedAt = new Date().toISOString();
            return issues[issueIndex];
        },
        deleteIssue: (parent, { id }) => {
            const initialLength = issues.length;
            issues = issues.filter((issue) => issue.id !== id);
            return issues.length < initialLength;
        },
    },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to startStandaloneServer creates an Express app and mounts
// your Apollo Server instance as middleware.
// Learn more about what `startStandaloneServer` options you can pass:
// https://www.apollographql.com/docs/apollo-server/api/standalone/setup#startstandaloneserver
(0, standalone_1.startStandaloneServer)(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
