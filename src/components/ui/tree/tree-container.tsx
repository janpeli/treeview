import { useCallback } from "react";
import { TreeController } from "./controllers/tree-controller";
import TreeRow from "./tree-row";
import React from "react";

interface TreeContainerProps {
  tree: TreeController;
}

let focusSearchTerm = "";
let timeoutId: any = null;

function TreeContainer(props: TreeContainerProps) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      clearTimeout(timeoutId);
      focusSearchTerm += e.key;
      timeoutId = setTimeout(() => {
        focusSearchTerm = "";
      }, 600);
      const node = props.tree.visibleNodes.find((n) => {
        const name = n.data.name;
        if (typeof name === "string") {
          return name.toLowerCase().startsWith(focusSearchTerm);
        } else return false;
      });
      if (node) props.tree.addFocusedNode(node);
    },
    [props.tree]
  );

  return (
    <>
      TreeContainer
      <div role="tree" aria-label="File tree" onKeyDown={handleKeyDown}>
        {props.tree.visibleNodes.map((node) => (
          <TreeRow key={node.data.id} node={node} />
        ))}
      </div>
    </>
  );
}

export default TreeContainer;
