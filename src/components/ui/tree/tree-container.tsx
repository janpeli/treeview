import { TreeController } from "./controllers/tree-controller";
import TreeRow from "./tree-row";

interface TreeContainerProps {
  tree: TreeController;
}

function TreeContainer(props: TreeContainerProps) {
  return (
    <>
      TreeContainer
      <div>
        {props.tree.visibleNodes.map((node) => (
          <TreeRow key={node.data.id} node={node} />
        ))}
      </div>
    </>
  );
}

export default TreeContainer;
