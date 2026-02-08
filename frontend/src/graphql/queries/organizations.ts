import { gql } from "@apollo/client";

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
    }
  }
`;
