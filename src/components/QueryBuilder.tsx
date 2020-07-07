import React from 'react';
import _ from 'lodash';
import { Container } from '@material-ui/core';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import ConditionWidget, { Condition, Operator } from './Condition';
import { updateConditions as updateConditionsAction } from '../reducers/queryGenerator';
import { KeySchema } from '../services/extractIndex';
import nextId from '../services/nextId';

function QueryBuilder({
  tableName,
  conditions,
  error,
  keys,
  fields,
  mutateConditions,
}: {
  tableName: string;
  conditions: Condition[];
  error: string;
  keys: KeySchema[];
  fields: string[];
  mutateConditions: ({
    conditions,
    tableSpecification,
  }: {
    conditions: Condition[];
    tableSpecification: {
      keys: KeySchema[];
    };
  }) => void;
}) {
  const keyFields = _.uniq(
    keys.map((key) => {
      return key.hash;
    })
  );

  return (
    <Container
      maxWidth={false}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '5px 0px',
        minHeight: 60,
        maxHeight: 'calc(100vh - 250px)',
        overflow: 'scroll',
        marginTop: 5,
      }}
    >
      {tableName &&
        conditions.map((condition, index) => {
          return (
            <ConditionWidget
              // eslint-disable-next-line react/no-array-index-key
              key={`cond_widget_${condition.id}`}
              rowId={condition.id}
              condition={condition}
              keyFields={keyFields}
              fields={fields}
              primary={index === 0}
              onFieldChange={(value) => {
                let updateConditions = update(conditions, {
                  [index]: { name: { $set: value } },
                });
                if (index + 1 === conditions.length && value) {
                  // Add new
                  updateConditions = update(updateConditions, {
                    $push: [{ id: nextId(), operator: '=' as Operator }],
                  });
                }
                mutateConditions({
                  conditions: updateConditions,
                  tableSpecification: { keys },
                });
              }}
              onOperatorChange={(value) => {
                mutateConditions({
                  conditions: update(conditions, {
                    [index]: { operator: { $set: value as Operator } },
                  }),
                  tableSpecification: { keys },
                });
              }}
              onValueChange={(value) => {
                let updateConditions = update(conditions, {
                  [index]: { value: { $set: value } },
                });
                if (index + 1 === conditions.length && value) {
                  // Add new
                  updateConditions = update(updateConditions, {
                    $push: [{ id: nextId(), operator: '=' as Operator }],
                  });
                }
                mutateConditions({
                  conditions: updateConditions,
                  tableSpecification: { keys },
                });
              }}
              onRemoveRow={() => {
                mutateConditions({
                  conditions: update(conditions, { $splice: [[index, 1]] }),
                  tableSpecification: { keys },
                });
              }}
            />
          );
        })}
      {!tableName && <span>Please choose a table</span>}
      {error && <span>{error}</span>}
    </Container>
  );
}

// export default QueryBuilder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mapStateToProps = (state) => ({
  conditions: state.queryGenerator.conditions,
  error: state.queryGenerator.error,
  keys: state.table.keys,
  tableName: state.table.tableName,
  fields: state.table.fields,
});

const mapDispatchToProps = {
  mutateConditions: updateConditionsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryBuilder);
