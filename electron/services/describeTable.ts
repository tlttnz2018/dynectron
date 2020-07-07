import AWS from 'aws-sdk';

export default async function describeTable({ name }: { name: string }) {
  const service = new AWS.DynamoDB({
    ...(process.env.DYNAMODB_ENDPOINT && {
      endpoint: process.env.DYNAMODB_ENDPOINT,
    }),
  });

  const items = await service
    .describeTable({
      TableName: name,
    })
    .promise();
  return items.Table;
}
