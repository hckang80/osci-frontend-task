import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Spinner from '@atlaskit/spinner';
import { fetcher } from 'lib/utils';
import { useMutation, useQuery } from 'react-query';
import { t } from 'i18next';
import { User } from 'lib/types';

export const UserPage = () => {
  const { id = '' } = useParams();

  const fetchUser = () => fetcher<User>(`/users/${id}`);

  const {
    isLoading,
    isError,
    data: user,
    error
  } = useQuery<User>('users', fetchUser, {
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const updateUser = (formState: Omit<User, 'id'>) => {
    return fetcher<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formState)
    });
  };

  const updateUserMutation = useMutation(updateUser, {
    onMutate: (variable) => {
      console.log('onMutate', variable);
    },
    onError: (error, variable, context) => {
      console.error(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('success', data, variables, context);
    },
    onSettled: () => {
      console.log('end');
    }
  });

  const { isLoading: isUpdating } = updateUserMutation;

  const handleSubmit = (formState: Omit<User, 'id'>) => {
    updateUserMutation.mutate(formState);
  };

  const navigate = useNavigate();

  if (isError && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      {isLoading || !user ? (
        <Spinner />
      ) : (
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps}>
              <Field name="name" label={t('label.name')} defaultValue={user.name} isRequired>
                {({ fieldProps }) => <Textfield {...fieldProps} isReadOnly={isUpdating} />}
              </Field>
              <Field name="email" label={t('label.email')} defaultValue={user.email} isRequired>
                {({ fieldProps }) => <Textfield {...fieldProps} isReadOnly={isUpdating} />}
              </Field>
              <FormFooter>
                <ButtonGroup>
                  <Button appearance="subtle" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" appearance="primary" isLoading={isUpdating}>
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
