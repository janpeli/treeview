//import TreeView from "./components/ui/claudeTree/claudetree";
import TreeView from "./components/ui/claudeTree/claudetree";
//import { testData } from "./components/ui/tree/test-data/test-data";
import folderStructureData from "./components/ui/tree/test-data/test-generator";
import Tree from "./components/ui/tree/tree";

function App() {
  return (
    <div className=" size-full bg-slate-900 text-slate-300 grid grid-cols-2">
      <Tree data={folderStructureData}></Tree>
      <TreeView />
    </div>
  );
}

export default App;
