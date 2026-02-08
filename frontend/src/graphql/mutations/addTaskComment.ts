import { gql } from "@apollo/client";

export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment(
    $taskId: ID!
    $content: String!
    $authorEmail: String!
  ) {
    addTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      comment
    }
  }
`;

export type AddTaskCommentVars = {
  taskId: string;
  content: string;
  authorEmail: string;
};
