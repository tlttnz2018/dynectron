import React from 'react';
import { Container, NativeSelect, TextField } from '@material-ui/core';
import { HighlightOff } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import { Autocomplete } from '@material-ui/lab';
import BootstrapInput from './CustomInput';

export type Operator =
  | '='
  | '<>'
  | '>'
  | '<'
  | '>='
  | '<='
  | 'begins_with'
  | 'contains';

export type Condition = {
  id: string;
  name?: string;
  operator?: Operator;
  value?: string;
};

function ConditionWidget({
  primary,
  keyFields,
  fields,
  rowId,
  condition,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onRemoveRow,
}: {
  primary: boolean;
  keyFields: string[];
  fields: string[];
  rowId: string;
  condition: Condition;
  onFieldChange: (value: string) => void;
  onOperatorChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onRemoveRow: () => void;
}) {
  return (
    <Container
      maxWidth={false}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: '1px 0px',
        padding: 0,
      }}
    >
      {primary && (
        <Autocomplete
          id="primary-key-selector"
          options={keyFields}
          style={{ width: 207 }}
          renderInput={(params) => (
            <TextField
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...params}
              label="Primary key"
              size="small"
              variant="outlined"
            />
          )}
          onInputChange={(_event, value) => {
            onFieldChange(value || '');
          }}
        />
      )}
      {!primary && (
        <Autocomplete
          freeSolo
          id={`field_${rowId}`}
          options={fields}
          value={condition.name || ''}
          style={{ width: 207 }}
          renderInput={(params) => (
            <TextField
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...params}
              label="Field name"
              size="small"
              variant="outlined"
            />
          )}
          onInputChange={(_event, value) => {
            onFieldChange(value || '');
          }}
        />
      )}

      {primary && (
        <BootstrapInput
          name={`op_${rowId}`}
          value={condition.operator || ('=' as Operator)}
          style={{
            width: 135,
            minWidth: 120,
            marginLeft: 3,
            marginRight: 3,
          }}
          disabled
        />
      )}
      {!primary && (
        <NativeSelect
          name={`op_${rowId}`}
          style={{
            minWidth: 120,
            marginLeft: 3,
            marginRight: 3,
            textAlign: 'center',
            padding: 0,
          }}
          input={<BootstrapInput />}
          onChange={(event) => {
            onOperatorChange(event.target.value as Operator);
          }}
          value={condition.operator || ('=' as Operator)}
          variant="outlined"
        >
          <option value="=">=</option>
          <option value="<>">{'<>'}</option>
          <option value=">">{'>'}</option>
          <option value="<">{'<'}</option>
          <option value=">=">{'>='}</option>
          <option value="<=">{'<='}</option>
          <option value="begins_with">Begins With</option>
          <option value="contains">Contains</option>
        </NativeSelect>
      )}

      <BootstrapInput
        name={`value_${rowId}`}
        value={condition.value || ''}
        onChange={(event) => {
          onValueChange(event.target.value);
        }}
        placeholder="Field value"
      />

      {!primary && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onRemoveRow}
          edge="end"
        >
          <HighlightOff />
        </IconButton>
      )}
    </Container>
  );
}

export default ConditionWidget;
