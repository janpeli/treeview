import { useCallback } from "react";
import { TreeController } from "./controllers/tree-controller";
import TreeRow from "./tree-row";
import React from "react";

interface TreeContainerProps {
  tree: TreeController;
}

let focusSearchTerm = "";
let timeoutId: number | undefined = undefined;

function TreeContainer(props: TreeContainerProps) {
  // to find quickly a node by typing starting leters
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
      <div
        role="tree"
        aria-label="File tree"
        onKeyDown={handleKeyDown}
        className="relative font-mono text-sm"
      >
        {props.tree.visibleNodes.map((node) => (
          <TreeRow key={node.data.id} node={node} />
        ))}
      </div>
    </>
  );
}

export default TreeContainer;
