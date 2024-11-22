import { INode } from "./interfaces";

interface TreeNodeProps {
  node: INode;
}

function TreeNode({ node }: TreeNodeProps) {
  return <div>{node.data.name}</div>;
}

export default TreeNode;
