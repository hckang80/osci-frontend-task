import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Spinner from '@atlaskit/spinner';
import { fetcher } from 'lib/utils';
import { useQuery } from 'react-query';
import { t } from 'i18next';
import { User } from 'lib/types';

export const UserPage = () => {
  const { id = '' } = useParams();

  const [user, setUser] = useState<User | null>(null);

  const fetchUser = () => fetcher<User>(`/users/${id}`);

  const { isLoading, isError, data, error } = useQuery<User>('users', fetchUser, {
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (error) => {
      if (!(error instanceof Error)) return;
      console.log(error.message);
    }
  });

  if ((isError || !data) && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  const handleSubmit = async (formState: Omit<User, 'id'>) => {
    const data = await fetcher<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formState)
    });
    console.log({ data });
  };

  return (
    <>
      {!user ? (
        <Spinner />
      ) : (
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps}>
              <Field name="name" label={t('label.name')} defaultValue={user.name} isRequired>
                {({ fieldProps }) => <Textfield {...fieldProps} />}
              </Field>
              <Field name="email" label={t('label.email')} defaultValue={user.email} isRequired>
                {({ fieldProps }) => <Textfield {...fieldProps} />}
              </Field>
              <FormFooter>
                <ButtonGroup>
                  <Button appearance="subtle">Cancel</Button>
                  <Button type="submit" appearance="primary" isLoading={false}>
                    Edit
                  </Button>
                </ButtonGroup>
              </FormFooter>
            </form>
          )}
        </Form>
      )}
    </>
  );
};
