import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';
import Avatar from '@atlaskit/avatar';
import Comment, { CommentAction, CommentAuthor, CommentTime } from '@atlaskit/comment';
import { fetcher, toReadableDate } from 'lib/utils';
import { useQueries } from 'react-query';
import { Post, User } from 'lib/types';
import Heading from '@atlaskit/heading';
import { t } from 'i18next';

type CommentType = Omit<Post, 'title'>;

export const PostPage = () => {
  const { id = '' } = useParams();

  const result = useQueries([
    {
      queryKey: ['post'],
      queryFn: () => fetcher<Post>(`/posts/${id}`)
    },
    {
      queryKey: ['users'],
      queryFn: () => fetcher<User[]>(`/users`)
    },
    {
      queryKey: ['comments'],
      queryFn: () => fetcher<CommentType[]>(`/comments/post/${id}`)
    }
  ]);

  const [isLoadingFinished, setIsLoadingFinished] = useState(false);

  useEffect(() => {
    const isLoadingFinished = result.every((result) => !result.isLoading);
    setIsLoadingFinished(isLoadingFinished);
  }, [result]);

  const [{ data: post }, { data: users = [] }, { data: comments = [] }] = result;

  const getUser = (id: number) => users.find((user) => user.id === id);
  const getUserName = (id: number) => getUser(id)?.name;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    hour12: false
  };

  return (
    <Stack space="space.300">
      <Heading size="large">{t('label.post')}</Heading>

      {!isLoadingFinished || !post || !users ? (
        <Spinner />
      ) : (
        <>
          <Heading size="small">{`${t('label.title')}: ${post.title}`} </Heading>

          <Comment
            avatar={<Avatar name={getUserName(post.userId)} />}
            author={<CommentAuthor>{getUserName(post.userId)}</CommentAuthor>}
            type="author"
            time={<CommentTime>{toReadableDate(post.createdAt, options)}</CommentTime>}
            content={<p>{post.content}</p>}
            actions={[<CommentAction>Edit</CommentAction>, <CommentAction>Delete</CommentAction>]}
          >
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                avatar={<Avatar name={getUserName(comment.userId)} />}
                author={<CommentAuthor>{getUserName(comment.userId)}</CommentAuthor>}
                time={<CommentTime>{toReadableDate(comment.createdAt, options)}</CommentTime>}
                content={<p>{comment.content}</p>}
                actions={[
                  <CommentAction>Edit</CommentAction>,
                  <CommentAction>Delete</CommentAction>
                ]}
              />
            ))}
          </Comment>
        </>
      )}
    </Stack>
  );
};
