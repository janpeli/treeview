import React, {
  useState,
  useRef,
  createContext,
  useContext,
  useCallback,
} from "react";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";

const TreeContext = createContext({
  selectedNodes: new Set(),
  setSelectedNodes: () => {},
  draggedNode: null,
  setDraggedNode: () => {},
  focusedNode: null,
  setFocusedNode: () => {},
  expandedNodes: new Set(),
  setExpandedNodes: () => {},
});

const useTree = () => useContext(TreeContext);

const defaultData = [
  {
    id: "1",
    name: "src",
    children: [
      {
        id: "2",
        name: "components",
        children: [
          { id: "3", name: "TreeView.jsx" },
          { id: "4", name: "index.js" },
        ],
      },
      { id: "5", name: "App.js" },
    ],
  },
  {
    id: "6",
    name: "public",
    children: [{ id: "7", name: "index.html" }],
  },
];

// Utility function to flatten tree for keyboard navigation
const flattenTree = (nodes, parent = null) => {
  let flat = [];
  nodes.forEach((node) => {
    flat.push({ ...node, parent });
    if (node.children?.length) {
      flat = flat.concat(flattenTree(node.children, node.id));
    }
  });
  return flat;
};

const TreeNode = ({ node, level = 0, onToggle, flatNodes, index }) => {
  const {
    selectedNodes,
    setSelectedNodes,
    draggedNode,
    setDraggedNode,
    focusedNode,
    setFocusedNode,
    expandedNodes,
    setExpandedNodes,
  } = useTree();

  const nodeRef = useRef(null);

  if (!node) return null;

  const isSelected = selectedNodes.has(node.id);
  const isDragging = draggedNode === node.id;
  const isFocused = focusedNode === node.id;
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const handleExpand = useCallback(() => {
    const newExpanded = new Set(expandedNodes);
    if (!newExpanded.has(node.id)) {
      newExpanded.add(node.id);
    }
    setExpandedNodes(newExpanded);
  }, [expandedNodes, node.id, setExpandedNodes]);

  const handleCollapse = useCallback(() => {
    const newExpanded = new Set(expandedNodes);
    newExpanded.delete(node.id);
    setExpandedNodes(newExpanded);
  }, [expandedNodes, node.id, setExpandedNodes]);

  const handleKeyDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const currentIndex = flatNodes.findIndex((n) => n.id === node.id);

    switch (e.key) {
      case "ArrowDown": {
        const nextNode = flatNodes[currentIndex + 1];
        if (nextNode) {
          setFocusedNode(nextNode.id);
        }
        break;
      }
      case "ArrowUp": {
        const prevNode = flatNodes[currentIndex - 1];
        if (prevNode) {
          setFocusedNode(prevNode.id);
        }
        break;
      }
      case "ArrowRight": {
        if (hasChildren) {
          if (!isExpanded) {
            handleExpand();
          } else {
            // Move to first child
            const nextNode = flatNodes[currentIndex + 1];
            if (nextNode) {
              setFocusedNode(nextNode.id);
            }
          }
        }
        break;
      }
      case "ArrowLeft": {
        if (hasChildren && isExpanded) {
          handleCollapse();
        } else if (node.parent) {
          // Move to parent
          const parentNode = flatNodes.find((n) => n.id === node.parent);
          if (parentNode) {
            setFocusedNode(parentNode.id);
          }
        }
        break;
      }
      case "Enter":
      case " ": {
        if (e.ctrlKey || e.metaKey) {
          const newSelected = new Set(selectedNodes);
          if (newSelected.has(node.id)) {
            newSelected.delete(node.id);
          } else {
            newSelected.add(node.id);
          }
          setSelectedNodes(newSelected);
        } else {
          setSelectedNodes(new Set([node.id]));
        }
        break;
      }
      case "*": {
        // Expand all siblings
        const siblings = flatNodes.filter((n) => n.parent === node.parent);
        const newExpanded = new Set(expandedNodes);
        siblings.forEach((sibling) => {
          if (sibling.children?.length) {
            newExpanded.add(sibling.id);
          }
        });
        setExpandedNodes(newExpanded);
        break;
      }
      case "Home": {
        // Move to first node
        setFocusedNode(flatNodes[0].id);
        break;
      }
      case "End": {
        // Move to last visible node
        setFocusedNode(flatNodes[flatNodes.length - 1].id);
        break;
      }
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      const newSelected = new Set(selectedNodes);
      if (newSelected.has(node.id)) {
        newSelected.delete(node.id);
      } else {
        newSelected.add(node.id);
      }
      setSelectedNodes(newSelected);
    } else {
      setSelectedNodes(new Set([node.id]));
    }
    setFocusedNode(node.id);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isExpanded) {
      handleCollapse();
    } else {
      handleExpand();
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    setDraggedNode(node.id);
    e.dataTransfer.setData("text/plain", node.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedNodeId = e.dataTransfer.getData("text/plain");
    console.log(`Dropped node ${droppedNodeId} onto ${node.id}`);
    setDraggedNode(null);
  };

  React.useEffect(() => {
    if (isFocused && nodeRef.current) {
      nodeRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div
      ref={nodeRef}
      className={`
        select-none outline-none
        ${isSelected ? "bg-blue-100 dark:bg-blue-800" : ""}
        ${isDragging ? "opacity-50" : ""}
        ${isFocused ? "ring-2 ring-blue-400" : ""}
      `}
      style={{ paddingLeft: `${level * 20}px` }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={level + 1}
      tabIndex={isFocused ? 0 : -1}
    >
      <div className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="w-4 h-4 flex items-center justify-center focus:outline-none"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        {hasChildren ? (
          <Folder className="w-4 h-4 mx-1" />
        ) : (
          <File className="w-4 h-4 mx-1" />
        )}
        <span className="ml-1">{node.name}</span>
      </div>
      {isExpanded && hasChildren && (
        <div role="group">
          {node.children.map((child, childIndex) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              flatNodes={flatNodes}
              index={childIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ data = defaultData }) => {
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [draggedNode, setDraggedNode] = useState(null);
  const [focusedNode, setFocusedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const flatNodes = React.useMemo(() => flattenTree(data), [data]);

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="p-4 text-gray-500">No items to display</div>;
  }

  return (
    <TreeContext.Provider
      value={{
        selectedNodes,
        setSelectedNodes,
        draggedNode,
        setDraggedNode,
        focusedNode,
        setFocusedNode,
        expandedNodes,
        setExpandedNodes,
      }}
    >
      <div
        role="tree"
        aria-label="File tree"
        className="font-mono text-sm border rounded-lg p-2 w-64"
      >
        {data.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            flatNodes={flatNodes}
            index={index}
          />
        ))}
      </div>
    </TreeContext.Provider>
  );
};

export default TreeView;
