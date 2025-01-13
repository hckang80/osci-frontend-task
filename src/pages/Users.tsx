// import React from 'react';
import React, { useEffect } from 'react';

// export const Users = () => {
//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_BASE_URL}/users`)
//       .then((response) => response.json())
//       .then((data) => console.log(data));
//   }, []);

//   return <>사용자 목록</>;
// };

import DynamicTable from '@atlaskit/dynamic-table';
import { head, rows } from './content/sample-data';

export const Users = () => {
  return (
    <DynamicTable
      caption="List of US Presidents"
      head={head}
      rows={rows}
      rowsPerPage={5}
      defaultPage={1}
      isFixedSize
      defaultSortKey="term"
      defaultSortOrder="ASC"
      onSort={() => console.log('onSort')}
      onSetPage={() => console.log('onSetPage')}
    />
  );
};
