import { testData } from "./components/ui/tree/test-data/test-data";
import Tree from "./components/ui/tree/tree";

function App() {
  return (
    <div className=" size-full bg-slate-400">
      <Tree data={testData}></Tree>
    </div>
  );
}

export default App;
