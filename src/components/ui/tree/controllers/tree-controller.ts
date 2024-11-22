import { IData, INode, ITree } from "../interfaces";

export class TreeController implements ITree {
  data: IData;
  visibleNodes: INode[];
  rootNode: INode;
  levels: number;

  constructor(data: IData) {
    this.data = data;
    this.rootNode = this.createRootNode(this.data);
    this.levels = this.calculateLevels();
    this.visibleNodes = [];
    this.calculateVisibleNodes();
  }

  private createRootNode(data: IData): INode {
    const rootnode: INode = this.convertDataToNodes(data, null, -1);

    return rootnode;
  }

  private convertDataToNodes(
    data: IData,
    parent: INode | null,
    parentLevel: number
  ): INode {
    const result: INode = {
      level: parentLevel + 1,
      data: data,
      isOpen: true,
      parent: parent,
    };
    if (data.children) {
      result.children = data.children.map((value) =>
        this.convertDataToNodes(value, result, result.level)
      );
    }

    return result;
  }

  private traverseTree(node: INode, callback: (node: INode) => void) {
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
      }
    });
  }
}
