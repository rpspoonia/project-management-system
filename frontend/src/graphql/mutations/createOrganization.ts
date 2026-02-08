import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $name: String!
    $contactEmail: String!
  ) {
    createOrganization(
      name: $name
      contactEmail: $contactEmail
    ) {
      organization {
        id
        name
        slug
        contactEmail
      }
    }
  }
`;