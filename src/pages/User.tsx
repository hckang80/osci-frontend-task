import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { InlineEditableTextfield } from '@atlaskit/inline-edit';

export const User = () => {
  const { id = '' } = useParams();
  const placeholderLabel = 'Initial description value';
  const [editValue, setEditValue] = useState('Default description value');

  const validate = (value: string) => {
    if (value.length <= 6) {
      return 'Please enter a description longer than 6 characters';
    }
    return undefined;
  };

  return (
    <>
      <div>{`User ID: ${id}`}</div>
      <InlineEditableTextfield
        defaultValue={editValue}
        label="Description"
        editButtonLabel={editValue || placeholderLabel}
        onConfirm={(value) => setEditValue(value)}
        placeholder={placeholderLabel}
        validate={validate}
      />
    </>
  );
};
