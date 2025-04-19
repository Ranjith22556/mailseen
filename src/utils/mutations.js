import { gql } from '@apollo/client';

export const ADD_EMAIL = gql`
  mutation AddEmail($email: String!, $description: String!, $name: String!) {
    insert_emails(objects: {
      email: $email,
      description: $description,
      name: $name
    }) {
      affected_rows
    }
  }
`;
