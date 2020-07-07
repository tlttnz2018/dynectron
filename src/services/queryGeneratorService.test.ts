import { Condition, Operator } from '../components/Condition';
import {
  queryGenerator,
  TableSchemaSpecification,
} from './queryGeneratorService';
import nextId from './nextId';

describe('Generate JSON query based on condition', () => {
  const tableSchema: TableSchemaSpecification = {
    keys: [
      {
        // No name for table's schema
        hash: 'partitionId',
        range: 'id',
      },
      {
        name: 'LSIPersonId',
        hash: 'partitionId',
        range: 'recordType',
      },
      {
        name: 'GSIApplicationEmails',
        hash: 'applicationId',
        range: 'email',
      },
    ],
  };

  it('A simple pkey condition must generate correct KeyConditionExpression', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual({
      KeyConditionExpression: '#partitionId = :partitionId',
      ExpressionAttributeNames: {
        '#partitionId': 'partitionId',
      },
      ExpressionAttributeValues: {
        ':partitionId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
    });
  });

  it('A simple pkey and skey conditions must generate correct KeyConditionExpression', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      {
        id: nextId(),
        name: 'id',
        operator: 'begins_with',
        value: 'c42bb5ec-ae4c-4cc6-a466-6b4ef7be6050',
      },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual({
      KeyConditionExpression:
        '#partitionId = :partitionId and begins_with(#id, :id)',
      ExpressionAttributeNames: {
        '#partitionId': 'partitionId',
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':partitionId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
        ':id': 'c42bb5ec-ae4c-4cc6-a466-6b4ef7be6050',
      },
    });
  });

  it('A simple pkey and a normal filter key conditions must generate correct KeyConditionExpression', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      {
        id: nextId(),
        name: 'filterId',
        operator: 'begins_with',
        value: 'c42bb5ec-ae4c-4cc6-a466-6b4ef7be6050',
      },
    ];

    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual({
      KeyConditionExpression: '#partitionId = :partitionId',
      FilterExpression: 'begins_with(#filterId, :filterId)',
      ExpressionAttributeNames: {
        '#partitionId': 'partitionId',
        '#filterId': 'filterId',
      },
      ExpressionAttributeValues: {
        ':partitionId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
        ':filterId': 'c42bb5ec-ae4c-4cc6-a466-6b4ef7be6050',
      },
    });
  });
  it('A simple index pkey and skey conditions must generate correct KeyConditionExpression with indexName', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      {
        id: nextId(),
        name: 'recordType',
        operator: '=',
        value: 'PERSON',
      },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual({
      IndexName: 'LSIPersonId',
      KeyConditionExpression:
        '#partitionId = :partitionId and #recordType = :recordType',
      ExpressionAttributeNames: {
        '#partitionId': 'partitionId',
        '#recordType': 'recordType',
      },
      ExpressionAttributeValues: {
        ':partitionId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
        ':recordType': 'PERSON',
      },
    });
  });

  it('A complex pkeys and skeys conditions match multi index must generate correct KeyConditionExpression with indexName', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      {
        id: nextId(),
        name: 'recordType',
        operator: '=',
        value: 'PERSON',
      },
      {
        id: nextId(),
        name: 'applicationId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      {
        id: nextId(),
        name: 'email',
        operator: 'begins_with',
        value: 'someone@email.com',
      },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual({
      FilterExpression:
        '#applicationId = :applicationId and begins_with(#email, :email)',
      IndexName: 'LSIPersonId',
      KeyConditionExpression:
        '#partitionId = :partitionId and #recordType = :recordType',
      ExpressionAttributeNames: {
        '#applicationId': 'applicationId',
        '#email': 'email',
        '#partitionId': 'partitionId',
        '#recordType': 'recordType',
      },
      ExpressionAttributeValues: {
        ':applicationId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
        ':email': 'someone@email.com',
        ':partitionId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
        ':recordType': 'PERSON',
      },
    });
  });

  it('A complex pkeys, skeys and other filter keys conditions match multi index must generate correct KeyConditionExpression with indexName', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      {
        id: nextId(),
        name: 'recordType',
        operator: '=',
        value: 'PERSON',
      },
      {
        id: nextId(),
        name: 'applicationId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      {
        id: nextId(),
        name: 'email',
        operator: 'begins_with',
        value: 'someone@email.com',
      },
      {
        id: nextId(),
        name: 'personId',
        operator: 'contains',
        value: 'c1bd914f',
      },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual({
      FilterExpression:
        '#applicationId = :applicationId and begins_with(#email, :email) and contains(#personId, :personId)',
      IndexName: 'LSIPersonId',
      KeyConditionExpression:
        '#partitionId = :partitionId and #recordType = :recordType',
      ExpressionAttributeNames: {
        '#applicationId': 'applicationId',
        '#email': 'email',
        '#partitionId': 'partitionId',
        '#recordType': 'recordType',
        '#personId': 'personId',
      },
      ExpressionAttributeValues: {
        ':applicationId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
        ':email': 'someone@email.com',
        ':partitionId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
        ':recordType': 'PERSON',
        ':personId': 'c1bd914f',
      },
    });
  });

  it('Duplication fields must be overwritten', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      { id: nextId(), name: 'recordType', operator: '=', value: 'PERSON' },
      {
        id: nextId(),
        name: 'applicationId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      {
        id: nextId(),
        name: 'email',
        operator: 'begins_with',
        value: 'someone@email.com',
      },
      {
        id: nextId(),
        name: 'personId',
        operator: 'contains',
        value: 'c1bd914f',
      },
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: '83e11436-6daf-4206-ab81-16d41e07ab70',
      },
      { id: nextId(), name: 'email', operator: 'contains', value: 'someone1' },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual({
      ExpressionAttributeNames: {
        '#applicationId': 'applicationId',
        '#email': 'email',
        '#partitionId': 'partitionId',
        '#personId': 'personId',
        '#recordType': 'recordType',
      },
      ExpressionAttributeValues: {
        ':applicationId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
        ':email': 'someone1',
        ':partitionId': '83e11436-6daf-4206-ab81-16d41e07ab70',
        ':personId': 'c1bd914f',
        ':recordType': 'PERSON',
      },
      FilterExpression:
        '#applicationId = :applicationId and begins_with(#email, :email) and contains(#personId, :personId) and contains(#email, :email)',
      IndexName: 'LSIPersonId',
      KeyConditionExpression:
        '#partitionId = :partitionId and #recordType = :recordType',
    });
  });
  it('Missing primary key but have sort key must generate error', () => {
    const conditions: Condition[] = [
      { id: nextId(), name: 'recordType', operator: '=', value: 'PERSON' },
      { id: nextId(), name: 'email', operator: 'contains', value: 'someone1' },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual('Please specify at least a primary key');
  });

  it('Empty key fields must generate error', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'personId',
        operator: 'contains',
        value: 'c1bd914f',
      },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual('Please specify at least a primary key');
  });

  it('Empty conditions must generate error', () => {
    const conditions: Condition[] = [];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual('Please specify at least a primary key');
  });

  it('Empty condition must be fitered out', () => {
    const conditions: Condition[] = [
      {
        id: nextId(),
        name: 'partitionId',
        operator: '=',
        value: 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      { id: nextId(), operator: '=' as Operator },
    ];
    const result = queryGenerator(conditions, tableSchema);
    expect(result).toEqual({
      ExpressionAttributeNames: {
        '#partitionId': 'partitionId',
      },
      ExpressionAttributeValues: {
        ':partitionId': 'c1bd914f-7bae-4ff0-a4ee-c948aff1a57c',
      },
      KeyConditionExpression: '#partitionId = :partitionId',
    });
  });
});
