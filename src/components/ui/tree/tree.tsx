import { TreeController } from "./controllers/tree-controller";
import { IData } from "./interfaces";
import TreeContainer from "./tree-container";

interface ITreeProps {
  data: IData;
}

function Tree(props: ITreeProps) {
  const tree = new TreeController(props.data);
  console.log(tree);
  return (
    <div>
      Tree conponent
      <TreeContainer tree={tree}></TreeContainer>
    </div>
  );
}

export default Tree;
