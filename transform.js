/**
 * AST에서 defaultProps 할당문 검색
 */
function findDefaultPropsAssignments(root, j) {
    return root.find(j.ExpressionStatement, {
        expression: {
            type: "AssignmentExpression",
            left: {
                type: "MemberExpression",
                property: { name: "defaultProps" },
            },
        },
    });
}

/**
 * 구조분해된 params에서 기본값 추가/교체하며 실제 수정이 발생했는지 여부 반환
 */
function transformDefaultsInObjectPattern(objPattern, defaultPropsObj, j) {
    let modified = false;

    defaultPropsObj.properties.forEach((prop) => {
        const keyName = prop.key.name || prop.key.value;
        if (!keyName) return;

        const index = objPattern.properties.findIndex((p) => {
            if (
                p.type === "AssignmentPattern" &&
                p.left.type === "Identifier"
            ) {
                return p.left.name === keyName;
            }
            if (p.type === "Property" && p.key.type === "Identifier") {
                return p.key.name === keyName;
            }
            return false;
        });

        if (index >= 0) {
            const existing = objPattern.properties[index];
            if (existing.type === "Property") {
                objPattern.properties[index] = j.assignmentPattern(
                    j.identifier(keyName),
                    prop.value
                );
                modified = true;
            }
        } else {
            objPattern.properties.push(
                j.assignmentPattern(j.identifier(keyName), prop.value)
            );
            modified = true;
        }
    });

    return modified;
}

/**
 * Arrow Function + 구조분해 된 params가 있는 컴포넌트를 찾아 변환을 적용
 */
function transformComponentDefaults(root, j, componentName, defaultPropsObj) {
    const compDecl = root.find(j.VariableDeclarator, {
        id: { name: componentName },
        init: { type: "ArrowFunctionExpression" },
    });

    let modified = false;

    compDecl.forEach((compPath) => {
        const arrowFunc = compPath.value.init;
        if (
            arrowFunc.params.length > 0 &&
            arrowFunc.params[0].type === "ObjectPattern"
        ) {
            const objPattern = arrowFunc.params[0];
            const changed = transformDefaultsInObjectPattern(
                objPattern,
                defaultPropsObj,
                j
            );
            if (changed) {
                modified = true;
            }
        }
    });

    return modified;
}

/**
 * defaultProps 할당 제거 및 컴포넌트 내부로 기본값 이동
 */
function transformDefaultProps(root, j) {
    let wasModified = false;

    const defaultPropsAssignments = findDefaultPropsAssignments(root, j);
    defaultPropsAssignments.forEach((path) => {
        const assignment = path.value.expression;
        const componentName = assignment.left.object.name;
        const defaultPropsObj = assignment.right;

        if (defaultPropsObj.type !== "ObjectExpression") return;

        const changed = transformComponentDefaults(
            root,
            j,
            componentName,
            defaultPropsObj
        );

        if (changed) {
            j(path).remove();
            console.log(`[MODIFIED] ${componentName}`);
            wasModified = true;
        }
    });

    return wasModified;
}

/**
 * 컴포넌트 변환
 */
function transformer(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    console.log(`[FILE] Processing ${file.path}`);
    transformDefaultProps(root, j);

    return root.toSource({
        quote: "double",
        trailingComma: false,
        tabWidth: 4,
        wrapColumn: 80,
        lineTerminator: "\n",
        reuseWhitespace: false,
    });
}

module.exports = transformer;
