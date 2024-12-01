import { IData, ITree } from "../interfaces";
import { NodeController } from "./node-controller";

export class TreeController implements ITree {
  data: IData;
  visibleNodes: NodeController[];
  rootNode: NodeController;
  levels: number;
  private setRenders?: React.Dispatch<React.SetStateAction<number>>;
  renders: number;

  selectedNodes: Set<NodeController> = new Set<NodeController>();
  draggedNodes: Set<NodeController> = new Set<NodeController>();
  focusedNode?: NodeController;

  multiselectAnchorNode?: NodeController | null;
  multiselectNodes?: NodeController[] | null;

  isEditing: boolean = false;

  constructor(
    data: IData,
    renders: number,
    setRenders: React.Dispatch<React.SetStateAction<number>>
  ) {
    this.data = data;
    this.rootNode = this.createRootNode(this.data);
    this.levels = this.calculateLevels();
    this.visibleNodes = [];
    this.calculateVisibleNodes();
    this.setRenders = setRenders;
    this.renders = renders;
  }

  private createRootNode(data: IData): NodeController {
    const rootnode: NodeController = this.convertDataToNodes(data, null, -1);

    return rootnode;
  }

  private convertDataToNodes(
    data: IData,
    parent: NodeController | null,
    parentLevel: number
  ): NodeController {
    const result = new NodeController(data, parent, this, parentLevel + 1);
    /*
      level : parentLevel + 1,
      data :  data,
      parent : parent,
      tree : this, 
    */
    if (data.children) {
      result.children = data.children.map((value) =>
        this.convertDataToNodes(value, result, result.level)
      );
    }

    return result;
  }

  private traverseTree(
    node: NodeController,
    callback: (node: NodeController) => void
  ) {
    // Process current node
    callback(node);

    // Process children
    if (node.children) {
      node.children.forEach((child) => this.traverseTree(child, callback));
    }
  }

  private calculateLevels(): number {
    let maxLevel: number = 0;
    this.traverseTree(this.rootNode, (node) => {
      maxLevel = Math.max(maxLevel, node.level);
    });
    return maxLevel;
  }

  private calculateVisibleNodes() {
    this.visibleNodes = [];
    this.traverseTree(this.rootNode, (node) => {
      if ((node.parent && node.parent.isOpen) || node.parent === null) {
        this.visibleNodes.push(node);
      } else {
        node.isOpen = false;
      }
    });
  }

  private render() {
    if (this.setRenders) {
      this.setRenders(++this.renders);
    }
  }
  public update() {
    this.calculateVisibleNodes();
    this.render();
  }

  clearSelectedNodes() {
    if (this.selectedNodes.size > 0) {
      for (const node of this.selectedNodes) {
        node.isSelected = false;
        node.update();
      }
      this.selectedNodes.clear();
    }
  }

  addSelectedNodes(node: NodeController | NodeController[]) {
    if (Array.isArray(node) === false) {
      if (this.selectedNodes.has(node)) return;
      node.isSelected = true;
      this.selectedNodes.add(node);
      node.update();
    } else {
      for (const n of node) {
        if (this.selectedNodes.has(n)) continue;
        n.isSelected = true;
        this.selectedNodes.add(n);
        n.update();
      }
    }
  }

  removeSelectedNodes(node: NodeController | NodeController[]) {
    if (Array.isArray(node) === false) {
      if (!this.selectedNodes.has(node)) return;
      node.isSelected = false;
      this.selectedNodes.delete(node);
      node.update();
    } else {
      for (const n of node) {
        if (!this.selectedNodes.has(n)) return;
        n.isSelected = false;
        this.selectedNodes.delete(n);
        n.update();
      }
    }
  }

  toggleSelectedNode(node: NodeController) {
    if (this.selectedNodes.has(node)) {
      this.removeSelectedNodes(node);
      /*node.isSelected = false;
      this.selectedNodes.delete(node);
      node.update();*/
    } else {
      this.addSelectedNodes(node);
      /*node.isSelected = true;
      this.selectedNodes.add(node);
      node.update();*/
    }
  }

  addFocusedNode(node: NodeController) {
    if (this.focusedNode === node) return;
    if (this.focusedNode) {
      this.focusedNode.isFocused = false;
      this.focusedNode.update();
    }
    this.focusedNode = node;
    this.focusedNode.isFocused = true;
    this.focusedNode.update();
  }

  focusNext() {
    if (this.focusedNode && this.visibleNodes) {
      const currnetIndex = this.visibleNodes.findIndex(
        (n) => n.data.id === this.focusedNode?.data.id
      );
      if (currnetIndex < this.visibleNodes.length - 1)
        this.addFocusedNode(this.visibleNodes[currnetIndex + 1]);
    }
    return;
  }

  focusPrevious() {
    if (this.focusedNode && this.visibleNodes) {
      const currnetIndex = this.visibleNodes.findIndex(
        (n) => n.data.id === this.focusedNode?.data.id
      );
      if (currnetIndex - 1 >= 0)
        this.addFocusedNode(this.visibleNodes[currnetIndex - 1]);
    }
  }

  createLeaf() {
    console.log(`Create leaf`);
  }

  toggleNodeOpen(node: NodeController) {
    if (node.data.isLeaf) return;
    node.isOpen = !node.isOpen;
    node.update();
    node.tree.update();
  }

  expandNode(node: NodeController) {
    if (node.data.isLeaf || node.isOpen) return;
    node.isOpen = true;
    node.update();
    node.tree.update();
  }

  expandNodeChildren(node: NodeController) {
    if (node.children) {
      for (const child of node.children) {
        this.expandNode(child);
      }
    }
  }
}
