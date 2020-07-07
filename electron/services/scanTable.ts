import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

export default async function scanTable({
  name,
  scan,
}: {
  name: string;
  scan?: Record<string, string>;
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

  const items = await client.scan({ ...params, ...scan }).promise();
  return items;
}
