import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { runQuery } from './utils';

export default async function queryTable({
  name,
  query,
}: {
  name: string;
  query?: Record<string, string>;
}) {
  const service = new AWS.DynamoDB({
    ...(process.env.DYNAMODB_ENDPOINT && {
      endpoint: process.env.DYNAMODB_ENDPOINT,
    }),
  });
  const client = new AWS.DynamoDB.DocumentClient({
    service,
  });

  const params: DocumentClient.QueryInput = {
    TableName: name,
  };

  const items = await runQuery(client, { ...params, ...query });
  return items;
}
