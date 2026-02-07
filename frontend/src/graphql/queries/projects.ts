import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String!) {
    projects(organizationSlug: $organizationSlug) {
      id
      name
      taskCount
      completedTaskCount
      completionRate
    }
  }
`;