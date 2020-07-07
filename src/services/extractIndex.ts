import _ from 'lodash';

export type KeySchema = {
  name?: string; // Index name. Empty in case it's for the table
  hash: string; // Primary key
  range: string; // Sort key
};

export function extractIndex(
  TableIndexes: {
    IndexName: string;
    IndexStatus: string;
    KeySchema: {
      AttributeName: string;
      KeyType: string;
    }[];
  }[]
): KeySchema[] {
  return (
    TableIndexes &&
    (TableIndexes.map((globalIdx): KeySchema | null => {
      if (globalIdx.IndexStatus && globalIdx.IndexStatus === 'ACTIVE') {
        return globalIdx.KeySchema.reduce(
          (
            keys: KeySchema,
            obj: { AttributeName: string; KeyType: string }
          ) => {
            keys.name = globalIdx.IndexName;
            if (obj.KeyType === 'HASH') {
              keys.hash = obj.AttributeName;
            }
            if (obj.KeyType === 'RANGE') {
              keys.range = obj.AttributeName;
            }

            return keys;
          },
          {} as KeySchema
        );
      }

      return null;
    }).filter((index: KeySchema | null) => !_.isEmpty(index)) as KeySchema[])
  );
}
