import { Connection, Node } from "@/generated/prisma";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  // if no conn, return node as is (all independent)
  if (connections.length === 0) {
    return nodes;
  }

  // create edges arr for topo sort
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  // add nodes with no conns as self-edges
  const connectionNodeIds = new Set<string>();
  for (const conn of connections) {
    connectionNodeIds.add(conn.fromNodeId);
    connectionNodeIds.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectionNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // perform topo sort
  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    // remove duplicates
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw error;
  }

  //   map sorted ids back to node objects
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
