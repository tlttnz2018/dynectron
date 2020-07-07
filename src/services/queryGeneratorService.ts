import _ from 'lodash';
import { KeySchema } from './extractIndex';
import { Condition } from '../components/Condition';

export type TableSchemaSpecification = {
  keys: KeySchema[];
};

export type Query = {
  KeyConditionExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, string>;
  FilterExpression?: string;
};

export function queryGenerator(
  conditions: Condition[],
  tableSchema: TableSchemaSpecification
): Query | string {
  const primaryKeys = _.uniq(
    tableSchema.keys.map((key) => {
      return key.hash;
    })
  );

  const possibleGeneratedConditions = tableSchema.keys.map((tableKey) => {
    const generatedConditions = conditions.reduce<Array<Array<string>>>(
      (result, cond) => {
        if (!cond.name || !cond.operator || !cond.value) {
          return result;
        }

        let conditionGenerated = ';';
        if (cond.operator === 'begins_with' || cond.operator === 'contains') {
          conditionGenerated = `${cond.operator}(#${cond.name}, :${cond.name})`;
        } else {
          conditionGenerated = `#${cond.name} ${cond.operator} :${cond.name}`;
        }

        if (tableKey.hash === cond.name || tableKey.range === cond.name) {
          result[0].push(conditionGenerated);
        } else {
          result[1].push(conditionGenerated);
        }
        return result;
      },
      [[], []]
    );

    return {
      name: tableKey.name,
      conditions: generatedConditions,
    };
  });

  const generatedConditions = _.last(
    _.sortBy(possibleGeneratedConditions, [
      function iteratee(conds) {
        return conds.conditions[0].length; // by maximum match of key
      },
      function iteratee(conds) {
        return conds.name;
      },
    ])
  ) || {
    name: undefined,
    conditions: [[], []],
  };

  const keyGeneratedExpressions = generatedConditions.conditions[0];
  if (_.isEmpty(keyGeneratedExpressions)) {
    return 'Please specify at least a primary key';
  }

  const keyConditionExpression = `${keyGeneratedExpressions[0]}${
    keyGeneratedExpressions.length > 1
      ? ` and ${keyGeneratedExpressions[1]}`
      : ''
  }`;

  const filterGeneratedExpressions = generatedConditions.conditions[1];
  const filterConditionExpression = filterGeneratedExpressions.join(' and ');
  const expressionAttributeName: Record<string, string> = {};
  const expressionAttributeValues: Record<string, string> = {};
  const primaryKeysSpecified: string[] = [];
  conditions.forEach((cond) => {
    if (!cond.name) {
      return;
    }

    if (
      cond.name &&
      primaryKeys.includes(cond.name) &&
      cond.operator &&
      cond.value // FIXME: What if value is 0 ?
    ) {
      primaryKeysSpecified.push(cond.name);
    }
    expressionAttributeName[`#${cond.name}`] = `${cond.name}`;
    expressionAttributeValues[`:${cond.name}`] = `${cond.value}`;
  });

  if (_.isEmpty(primaryKeysSpecified)) {
    return 'Please specify at least a primary key';
  }
  return {
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeNames: expressionAttributeName,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(!_.isEmpty(filterConditionExpression)
      ? { FilterExpression: filterConditionExpression }
      : {}),
    ...(generatedConditions.name
      ? { IndexName: generatedConditions.name }
      : {}),
  };
}
