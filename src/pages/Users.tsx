import React, { useEffect } from 'react';

export const Users = () => {
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/users`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  return <>사용자 목록</>;
};
