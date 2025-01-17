## Quick Start

```bash
# Install dependencies
yarn install

# Start project
yarn start
```

## Description

- 주메뉴는 User, Post로 구성되어 있습니다.
- [User 페이지](https://osci-frontend-task.vercel.app/users)에서는 이름을 선택하면 할일 목록 화면으로 이동합니다.

## Used Atlassian Design Components

- DynamicTable
  - 테이블 양식 및 페이징을 쉽게 표현
  - defaultPage 속성을 사용하여 페이징 연동
- Form, Field, Textfield
  - [User 수정](https://osci-frontend-task.vercel.app/users/1) 등 다양한 폼에 사용하여 폼 구성과 검증을 쉽게 처리
- useFormState
  - pristine prop을 이용하여 User 정보를 수정하지 않고 반복적으로 서버 요청하는 것을 방지
- DatePicker
  - [Post 페이지](https://osci-frontend-task.vercel.app/posts)에서 날짜를 통한 필터링 기능을 쉽게 처리
  - minDate, maxDate 속성을 사용하여 시작일과 종료일의 오입력 방지
- 그 외 Button, Stack, Flex, Heading, EmptyState, Comment 등의 디자인 컴포넌트를 사용했습니다.

## Issues

프로젝트는 정상적으로 빌드가 되나 다음의 에러가 발생합니다.

```bash
Failed to parse source map from '/Users/sky/Desktop/osci-frontend-task/node_modules/@atlaskit/analytics-next-stable-react-context/src/context.ts' file: Error: ENOENT: no such file or directory, open '/Users/sky/Desktop/osci-frontend-task/node_modules/@atlaskit/analytics-next-stable-react-context/src/context.ts'
```

[레퍼런스](https://community.developer.atlassian.com/t/error-when-i-use-atlaskit-editor-core-with-forge-custom-ui/62091/9)를 참고하여 해결을 시도해 보았으나 해결되지 않았습니다. 솔직히 고백합니다.
