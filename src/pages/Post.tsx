import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '@atlaskit/spinner';
import Avatar from '@atlaskit/avatar';
import Comment, { CommentAction, CommentAuthor, CommentTime } from '@atlaskit/comment';
import { fetcher, toReadableDate } from 'lib/utils';
import { useQuery } from 'react-query';
import { Post } from 'lib/types';

export const PostPage = () => {
  const { id = '' } = useParams();

  const fetchPost = () => fetcher<Post>(`/posts/${id}`);

  const {
    isLoading,
    isError,
    data: post,
    error
  } = useQuery<Post>('users', fetchPost, {
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const navigate = useNavigate();

  if (isError && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      {isLoading || !post ? (
        <Spinner />
      ) : (
        <>
          <pre>{JSON.stringify(post, null, 2)}</pre>
          <Comment
            avatar={<Avatar name="Scott Farquhar" />}
            author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
            type="author"
            time={<CommentTime>{toReadableDate(post.createdAt)}</CommentTime>}
            content={<p>{post.content}</p>}
            actions={[
              <CommentAction>Reply</CommentAction>,
              <CommentAction>Edit</CommentAction>,
              <CommentAction>Delete</CommentAction>
            ]}
          >
            <Comment
              avatar={<Avatar name="John Smith" />}
              author={<CommentAuthor>John Smith</CommentAuthor>}
              time={<CommentTime>Jun 3, 2022</CommentTime>}
              content={<p>Congratulations!</p>}
              actions={[<CommentAction>Reply</CommentAction>, <CommentAction>Like</CommentAction>]}
            ></Comment>
            <Comment
              avatar={<Avatar name="Sabina Vu" />}
              author={<CommentAuthor>Sabina Vu</CommentAuthor>}
              time={<CommentTime>Jun 4, 2022</CommentTime>}
              content={<p>I wonder what Atlassian will be like 20 years from now?</p>}
              actions={[<CommentAction>Reply</CommentAction>, <CommentAction>Like</CommentAction>]}
            />
          </Comment>
        </>
      )}
    </>
  );
};
