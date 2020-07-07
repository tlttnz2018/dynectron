import AWS from 'aws-sdk';

export default async function dynamoTables() {
  const service = new AWS.DynamoDB({
    ...(process.env.DYNAMODB_ENDPOINT && {
      endpoint: process.env.DYNAMODB_ENDPOINT,
    }),
  });
  const tables = await service.listTables().promise();
  return tables.TableNames;
}
