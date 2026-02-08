import { gql } from "@apollo/client";

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $taskId: ID!
    $title: String
    $description: String
    $assigneeEmail: String
    $status: String
  ) {
    updateTask(
      taskId: $taskId
      title: $title
      description: $description
      assigneeEmail: $assigneeEmail
      status: $status
    ) {
      task {
        id
        title
        description
        assigneeEmail
        status
        createdAt
      }
    }
  }
`;

export type UpdateTaskVars = {
  taskId: string;
  title?: string;
  description?: string;
  assigneeEmail?: string;
  status?: string;
};

export type UpdateTaskResult = {
  updateTask: {
    __typename?: string;
    task: {
      __typename?: string;
      id: string;
      title?: string | null;
      description?: string | null;
      assigneeEmail?: string | null;
      status: string;
      updatedAt?: string;
    };
  };
};