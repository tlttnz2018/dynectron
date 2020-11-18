// loop if empty data, but has nextCursor
// eslint-disable-next-line import/prefer-default-export
export const runQuery = async (
  dynamodb: AWS.DynamoDB.DocumentClient,
  query: AWS.DynamoDB.DocumentClient.QueryInput
) => {
  let startKey: AWS.DynamoDB.Key | undefined;
  let items;
  do {
    // eslint-disable-next-line no-await-in-loop
    items = await dynamodb
      .query({
        ...query,
        ...(startKey ? { ExclusiveStartKey: startKey } : {}),
      })
      .promise();

    startKey = items.LastEvaluatedKey;

    if (items && items.Items && items.Items.length) {
      return items;
    }
  } while (startKey);

  return items;
};
