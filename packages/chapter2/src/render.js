export function jsx(type, props, ...children) {
  return {
    type,
    props,
    children,
  };
}

// jsx를 dom으로 변환
export function createElement(node) {
  const newNodeElement = document.createElement(node.type);

  node.children.forEach((child) => {
    if (typeof child === "object") {
      newNodeElement.appendChild(createElement(child));
    } else {
      newNodeElement.innerHTML = child;
    }
  });

  // props가 있는 경우 추가한다
  if (node.props) {
    Object.keys(node.props).forEach((propName) => {
      newNodeElement.setAttribute(propName, node.props[propName]);
    });
  }
  return newNodeElement;
}

function updateAttributes(target, newProps = {}, oldProps = {}) {
  // 새로운 속성 설정 또는 업데이트
  Object.keys(newProps).forEach((name) => {
    if (newProps[name] !== oldProps[name]) {
      // Boolean 속성 처리
      if (newProps[name] === true) {
        target.setAttribute(name, "");
      } else if (newProps[name] === false) {
        target.removeAttribute(name);
      } else {
        target.setAttribute(name, newProps[name]);
      }
    }
  });

  // 더 이상 존재하지 않는 속성 제거
  Object.keys(oldProps).forEach((name) => {
    if (!(name in newProps)) {
      target.removeAttribute(name);
    }
  });
}

export function render(parent, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  if (!oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  const isNodeChanged =
    newNode.type !== oldNode.type ||
    typeof newNode !== typeof oldNode ||
    (typeof newNode === "string" && newNode !== oldNode);

  if (isNodeChanged) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  if (!isNodeChanged && newNode.type) {
    updateAttributes(
      parent.childNodes[index],
      newNode.props ?? {},
      oldNode.props ?? {}
    );

    const maxLength = Math.max(
      newNode.children.length,
      oldNode.children.length
    );
    for (let i = 0; i < maxLength; i++) {
      render(
        parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }

    // 자식 노드가 줄어든 경우 나머지 노드 제거
    while (parent.childNodes[index].childNodes.length > maxLength) {
      parent.childNodes[index].removeChild(parent.childNodes[index].lastChild);
    }
  }
}
