import { ApolloError } from "@apollo/client";
import { useEffect, useState } from "react";
import { mergeWith, camelCase } from "lodash";

export const useErrorMessages = (error?: ApolloError) => {
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (error && error instanceof ApolloError) {
      setErrorMessages(buildErrorMessages(error));
    } else {
      setErrorMessages({});
    }
    return () => setErrorMessages({});
  }, [error]);

  return { errorMessages };
};

const customizer = (objValue: any, srcValue: any) => {
  if (Array.isArray(objValue)) return objValue.concat(srcValue);
  return undefined;
};

export const buildErrorMessages = (
  error: ApolloError
): Record<string, string> => {
  const labels = error.graphQLErrors.map((err) => {
    let path: string;

    if (err.extensions?.path) {
      path = camelCase(err.extensions?.path as string);
    } else {
      path = "_";
    }

    const label: Record<string, string> = {};
    label[path] = err.message;
    return label;
  });

  return labels.reduce((labelSum, label) =>
    mergeWith(labelSum, label, customizer)
  );
};
