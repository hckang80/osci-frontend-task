## Quick Start

```bash
# Install dependencies
yarn install

# Start project
yarn start
```

## Description

- 주메뉴는 User, Post로 구성되어 있습니다.
- User 페이지에서는 이름을 선택하면 할일 목록 화면으로 이동합니다.

## Used Atlassian Design Components

- Form, Field, Textfield
  - User 수정 등의 폼에 사용하여 폼 구성과 검증을 쉽게 처리
- useFormState
  - pristine prop을 이용하여 User 정보를 수정하지 않고 반복적으로 서버 요청하는 것을 방지
- DatePicker
  - Post 페이지에서 날짜를 통한 필터링 기능을 쉽게 처리
  - minDate, maxDate 속성을 사용하여 시작일과 종료일의 오입력 방지
- 그 외 Button, Stack, Flex, Heading, EmptyState, Comment 등의 디자인 컴포넌트를 사용했습니다.
