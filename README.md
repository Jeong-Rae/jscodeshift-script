## default-props-transform

React 18 업그레이드 과정에서 더 이상 권장되지 않는 `defaultProps`를 제거하고,  
구조분해 파라미터에서 직접 **기본값 할당 방식**으로 자동 변환하는 jscodeshift 스크립트입니다.

---

## 변환 목적

React 17에서는 `Component.defaultProps = { ... }`를 사용해 기본값을 설정하는 것이 일반적이었지만,  
React 18부터는 [기본값을 구조분해에서 직접 설정](https://react.dev/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop)하는 방식이 권장됩니다.

> [velog: react18 마이그레이션 jshift로 처리하기](https://velog.io/@jrjr519/react18-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-jshift%EB%A1%9C-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0)
---

## 변환 예시

### Before (React 17 방식)

```jsx
import PropTypes from "prop-types";

const Foo = ({ bar }) => {
    return <div>{bar}</div>;
};

Foo.propTypes = {
    bar: PropTypes.string,
};

Foo.defaultProps = {
    bar: "bar",
};

export default Foo;
```

### After (React 18 방식)

```jsx
import PropTypes from "prop-types";

const Foo = ({ bar = "bar" }) => {
    return <div>{bar}</div>;
};

Foo.propTypes = {
    bar: PropTypes.string,
};

export default Foo;
```

---

## 실행 방법

```bash
npm install
npm run migrate -- ./target
```

> `./target` 경로에 변환할 JS/TS/React 파일들을 넣으세요.

---

## 지원 대상

-   **Arrow Function** 기반 컴포넌트만 지원
-   구조분해 파라미터(`({ bar })`)를 사용하는 경우
-   `.defaultProps = { ... }` 패턴만 처리

---

## 프로젝트 구조

```
.
├── transform.js               # jscodeshift 변환기
├── index.js                   # CLI 실행 스크립트
├── src/
│   └── __test__/              # Jest 테스트
│       ├── transform.test.js
│   └── __testfixtures__/
│       ├── default-arrow.input.js
│       └── default-arrow.output.js
```

---

## 테스트 실행

```bash
npm run test
```

테스트는 `jest` + `jscodeshift/src/testUtils` 기반으로 fixture 파일을 비교하여 동작합니다.

---

## FAQ

### Q. class / function 선언 컴포넌트도 지원하나요?

> 현재는 `const Foo = ({ ... }) => {}` 형태만 지원합니다.  
> 필요 시 로직 확장 가능합니다.
