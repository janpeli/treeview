import { INode } from "./interfaces";
import TreeCursor from "./tree-cursor";
import TreeNode from "./tree-node";

interface TreeRowProps {
  node: INode;
}

function TreeRow({ node }: TreeRowProps) {
  return (
    <div>
      <TreeNode node={node} />
      <TreeCursor />
    </div>
  );
}

export default TreeRow;
