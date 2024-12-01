//import TreeView from "./components/ui/claudeTree/claudetree";
import { testData } from "./components/ui/tree/test-data/test-data";
import Tree from "./components/ui/tree/tree";

function App() {
  return (
    <div className=" size-full bg-slate-900 text-slate-300">
      <Tree data={testData}></Tree>
      {/*<TreeView />*/}
    </div>
  );
}

export default App;
