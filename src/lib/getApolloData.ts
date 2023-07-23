import { gql } from "@apollo/client";
import { client } from "~/graphql/client";

export const getApolloData = <T>({
  id,
  typeName,
  attributes,
}: {
  id: string;
  typeName: string;
  attributes: string;
}) => {
  return client.current?.readFragment({
    id: `${typeName}:${id}`,
    fragment: gql`
          fragment Fragment on ${typeName} {
            ${attributes}
          }
        `,
  }) as T | undefined;
};
