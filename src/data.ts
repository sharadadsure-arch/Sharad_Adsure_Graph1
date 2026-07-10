import { MCQQuestion, PracticeProblem, VivaQuestion, StudentExercisesData } from './types';

export const PRIM_PSEUDO_CODE = [
  "Prim's Algorithm (Adjacency Matrix / Min-Heap):",
  "1. Initialize key values of all vertices to infinity and parent to NULL.",
  "2. Set key of the starting vertex to 0.",
  "3. Push all vertices to Priority Queue (PQ).",
  "4. While PQ is not empty:",
  "    a. Extract vertex u with minimum key value from PQ.",
  "    b. Mark u as visited (add to MST).",
  "    c. For each adjacent vertex v of u:",
  "        If v is in PQ and weight(u, v) < key[v]:",
  "            Update key[v] = weight(u, v) and parent[v] = u."
];

export const KRUSKAL_PSEUDO_CODE = [
  "Kruskal's Algorithm (Sorting + Disjoint Set Union):",
  "1. Create a forest F where each vertex is a separate tree.",
  "2. Sort all the edges in non-decreasing order of their weight.",
  "3. For each edge (u, v) in the sorted list:",
  "    a. Find the representative (parent) of u and v using Find().",
  "    b. If find(u) != find(v) (they belong to different components):",
  "        Add edge (u, v) to the MST.",
  "        Union the sets of u and v using Union().",
  "    c. Else, reject the edge (u, v) as it forms a cycle.",
  "4. Terminate when there are (V - 1) edges in the MST."
];

export const MCQS: MCQQuestion[] = [
  {
    id: 1,
    question: "Which of the following is true for a Minimum Spanning Tree (MST) of a connected, weighted graph?",
    options: [
      "It contains all vertices and has the minimum possible total edge weight without cycles.",
      "It contains the minimum number of vertices and minimum possible total weight.",
      "It is always unique, even if edge weights are not distinct.",
      "It is a disconnected subgraph with minimum edge weights."
    ],
    correctIndex: 0,
    explanation: "An MST of a connected, weighted graph is a subset of the edges that connects all the vertices together, without any cycles, and with the minimum possible total edge weight."
  },
  {
    id: 2,
    question: "What is the time complexity of Prim's Algorithm when implemented using a binary heap and adjacency list?",
    options: [
      "O(V²)",
      "O(E log V)",
      "O(E log E)",
      "O(V log V)"
    ],
    correctIndex: 1,
    explanation: "Using an adjacency list and a binary heap (priority queue), Prim's algorithm runs in O(E log V) time, where E is the number of edges and V is the number of vertices."
  },
  {
    id: 3,
    question: "Kruskal's algorithm works by sorting all edges first. What is its typical time complexity?",
    options: [
      "O(V²)",
      "O(V log E)",
      "O(E log E) or O(E log V)",
      "O(V + E)"
    ],
    correctIndex: 2,
    explanation: "Sorting the edges takes O(E log E) time. Since E <= V², log E is O(log V), making the complexity O(E log E) or O(E log V)."
  },
  {
    id: 4,
    question: "Which data structure is essential for implementing Kruskal's algorithm efficiently to detect cycles?",
    options: [
      "Stack",
      "Queue",
      "Disjoint Set (Union-Find)",
      "Binary Search Tree"
    ],
    correctIndex: 2,
    explanation: "The Disjoint Set Union (DSU) data structure is used in Kruskal's algorithm to perform cycle detection and component union efficiently in nearly constant amortized time."
  },
  {
    id: 5,
    question: "What is the relation between the number of vertices (V) and edges (E) in any Spanning Tree?",
    options: [
      "E = V",
      "E = V - 1",
      "E = V + 1",
      "E = 2V - 1"
    ],
    correctIndex: 1,
    explanation: "A spanning tree of a graph with V vertices always has exactly V - 1 edges. Any more edges would introduce a cycle; any fewer would leave the graph disconnected."
  },
  {
    id: 6,
    question: "In Prim's algorithm, we start with a single vertex and grow the tree. How does Kruskal's algorithm differ?",
    options: [
      "Kruskal's starts with all vertices as separate trees and greedily joins components.",
      "Kruskal's only works on directed graphs.",
      "Kruskal's searches the graph using Depth First Search.",
      "Kruskal's does not guarantee a minimum spanning tree."
    ],
    correctIndex: 0,
    explanation: "Kruskal's algorithm starts with a forest of V single-vertex trees and repeatedly adds the shortest edge that connects two distinct trees, combining them into a single tree."
  },
  {
    id: 7,
    question: "If a graph has distinct edge weights, which of the following is true about its MST?",
    options: [
      "The MST is always unique.",
      "The MST might not exist.",
      "There can be multiple MSTs with the same weight.",
      "Prim's and Kruskal's will find different MSTs."
    ],
    correctIndex: 0,
    explanation: "If all edge weights in a connected weighted graph are distinct, then the graph has a unique minimum spanning tree."
  },
  {
    id: 8,
    question: "If we decrease the weight of an edge that is NOT in the current MST, what happens to the MST?",
    options: [
      "The MST never changes.",
      "The MST will definitely change.",
      "The MST may change if the new weight is smaller than the maximum weight edge in the cycle it creates.",
      "The graph becomes disconnected."
    ],
    correctIndex: 2,
    explanation: "Adding the decreased edge to the current MST creates a unique cycle. If the decreased edge's weight is smaller than some edge in that cycle, we can replace that edge with the decreased one, changing the MST."
  },
  {
    id: 9,
    question: "Which of the following is NOT a real-world application of Minimum Spanning Trees?",
    options: [
      "Designing telecommunication networks with minimum cabling.",
      "Finding the shortest path between a specific source and destination in a maze.",
      "Connecting regional electrical grids with minimum wiring costs.",
      "Clustering algorithms in machine learning (e.g., Single-Linkage Hierarchical Clustering)."
    ],
    correctIndex: 1,
    explanation: "Finding the single-pair shortest path in a maze is typically solved by Dijkstra's or A* algorithm. MST is about connecting all points at the minimum total cost, not finding the shortest path between two specific points."
  },
  {
    id: 10,
    question: "What is the maximum number of edges in a simple undirected graph with V vertices?",
    options: [
      "V",
      "V(V - 1) / 2",
      "V²",
      "2^V"
    ],
    correctIndex: 1,
    explanation: "A complete undirected graph with V vertices has V(V - 1) / 2 edges."
  },
  {
    id: 11,
    question: "What happens if Kruskal's algorithm encounters an edge where both endpoints are already in the same disjoint set component?",
    options: [
      "It adds the edge and splits the component.",
      "It rejects the edge because adding it would create a cycle.",
      "It halts execution because the graph is not connected.",
      "It swaps the edge with a previously added edge."
    ],
    correctIndex: 1,
    explanation: "If both endpoints are in the same component, they are already connected. Adding another edge between them would create a cycle, so Kruskal's algorithm rejects it."
  },
  {
    id: 12,
    question: "Which algorithm is generally preferred for dense graphs (where E is close to V²)?",
    options: [
      "Kruskal's algorithm, because it sorts edges.",
      "Prim's algorithm with an Adjacency Matrix (O(V²)), since it doesn't suffer from log E overhead.",
      "Dijkstra's algorithm, because it's faster.",
      "Bellman-Ford algorithm."
    ],
    correctIndex: 1,
    explanation: "For dense graphs, E is O(V²). Prim's algorithm using an adjacency matrix runs in O(V²) which is highly efficient since we avoid the O(E log V) heap overhead of Prim or Kruskal."
  },
  {
    id: 13,
    question: "Can an MST contain a negative-weight edge?",
    options: [
      "No, MST algorithms only work for positive weights.",
      "Yes, as long as the graph does not contain negative weight cycles.",
      "Yes, MST algorithms work perfectly fine with negative edge weights as long as there are no negative-weight cycles (which aren't an issue for MST anyway).",
      "Only if we add a constant factor to make all weights positive first."
    ],
    correctIndex: 2,
    explanation: "Prim's and Kruskal's algorithms work perfectly with negative edge weights. Unlike shortest path algorithms (like Dijkstra), negative weights do not cause any issues for finding an MST because we are not accumulating path lengths."
  },
  {
    id: 14,
    question: "In the context of Disjoint Set Union (DSU) used in Kruskal's, what do 'path compression' and 'union by rank' achieve?",
    options: [
      "They reduce the worst-case space complexity to O(1).",
      "They keep the tree heights shallow, optimizing Find and Union operations to nearly O(1) amortized time.",
      "They sort the edges in linear time.",
      "They automatically eliminate all cycles before sorting."
    ],
    correctIndex: 1,
    explanation: "Union by rank keeps trees balanced, and path compression flattens the structure during find queries, yielding an amortized time of O(alpha(V)) per operation, which is virtually constant."
  },
  {
    id: 15,
    question: "If we double the weight of every edge in a graph, what happens to the Minimum Spanning Tree?",
    options: [
      "The MST structure remains the same, but the total weight doubles.",
      "The MST structure changes completely.",
      "We cannot find an MST anymore.",
      "The number of edges in the MST doubles."
    ],
    correctIndex: 0,
    explanation: "Doubling every weight preserves the relative ordering of the edges. Therefore, the set of edges that form the MST will remain identical, but the total sum of their weights will double."
  }
];

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 1,
    difficulty: 'Easy',
    title: "Minimum Wiring for a Server Room",
    problem: "You are given 4 servers labeled A, B, C, and D. You need to connect all of them with network cables of minimum total length. The available links and their lengths (in meters) are:\n- A-B: 5m\n- A-C: 8m\n- B-C: 2m\n- B-D: 6m\n- C-D: 4m\n\nFind the edges that will be included in the Minimum Spanning Tree and the total minimum cabling length.",
    input: "Vertices: {A, B, C, D}\nEdges with weights: A-B(5), A-C(8), B-C(2), B-D(6), C-D(4)",
    expectedOutput: "MST Edges: B-C (2), C-D (4), A-B (5)\nTotal Minimum cabling length: 11 meters.",
    hint: "Start by sorting the edges: B-C (2), C-D (4), A-B (5), B-D (6), A-C (8). Apply Kruskal's algorithm step-by-step and verify cycle conditions.",
    solution: "1. Sort edges: B-C(2), C-D(4), A-B(5), B-D(6), A-C(8).\n2. Select B-C (weight 2). No cycle. MST = {B-C}.\n3. Select C-D (weight 4). No cycle. MST = {B-C, C-D}.\n4. Select A-B (weight 5). No cycle. MST = {B-C, C-D, A-B}.\n5. We have 3 edges for 4 vertices. The spanning tree is complete.\n6. Total cost: 2 + 4 + 5 = 11m."
  },
  {
    id: 2,
    difficulty: 'Medium',
    title: "Water Pipeline Network Design",
    problem: "A municipal agency wants to lay down drinking water pipes to connect 5 villages: V1, V2, V3, V4, and V5. The cost of connecting pairs of villages (in lakhs of rupees) is represented as an adjacency matrix:\n   V1  V2  V3  V4  V5\nV1  -   4   3   -   -\nV2  4   -   1   2   -\nV3  3   1   -   4   2\nV4  -   2   4   -   5\nV5  -   -   2   5   -\n\nDetermine the pipeline design that connects all villages with minimum cost.",
    input: "Adjacency matrix of weights (hyphen '-' represents no direct link).",
    expectedOutput: "MST Edges: V2-V3 (1), V2-V4 (2), V3-V5 (2), V1-V3 (3)\nTotal Minimum Cost: 8 lakhs.",
    hint: "Try starting Prim's algorithm from V1. Select the smallest edge connected to visited vertices at each iteration.",
    solution: "Using Prim's starting from V1:\n1. Visited = {V1}. Outgoing edges: V1-V2(4), V1-V3(3). Minimum edge is V1-V3 (3).\n2. Visited = {V1, V3}. Outgoing: V1-V2(4), V3-V2(1), V3-V4(4), V3-V5(2). Min is V3-V2 (1).\n3. Visited = {V1, V3, V2}. Outgoing edges: V2-V4(2), V3-V5(2). Select V2-V4 (2).\n4. Visited = {V1, V3, V2, V4}. Outgoing: V3-V5(2). Select V3-V5 (2).\n5. All vertices visited. MST = {V1-V3 (3), V3-V2 (1), V2-V4 (2), V3-V5 (2)}.\n6. Total weight = 3 + 1 + 2 + 2 = 8 lakhs."
  },
  {
    id: 3,
    difficulty: 'Hard',
    title: "The Cable TV Loop Problem",
    problem: "A cable provider is setting up a TV network across 6 hubs (A to F). However, there is a catch: high voltage transmission lines run between A-D and C-F, making those links highly volatile and only eligible if absolutely necessary. Weights are:\nA-B: 4, A-F: 2, B-C: 15, B-D: 8, C-D: 3, C-E: 5, D-E: 10, E-F: 7.\n\nCalculate the MST of this graph and identify if the high-voltage lines are bypassed or included.",
    input: "Vertices: {A, B, C, D, E, F}\nEdges: A-B(4), A-F(2), B-C(15), B-D(8), C-D(3), C-E(5), D-E(10), E-F(7)",
    expectedOutput: "MST Edges: A-F (2), C-D (3), A-B (4), C-E (5), E-F (7)\nTotal cabling cost: 21. High voltage lines are naturally bypassed.",
    hint: "Sort all available edges. Apply Kruskal's algorithm. Check if E-F (7) is selected over B-D (8) or D-E (10).",
    solution: "1. Sorted Edges: A-F (2), C-D (3), A-B (4), C-E (5), E-F (7), B-D (8), D-E (10), B-C (15).\n2. Select A-F (2). MST = {A-F}.\n3. Select C-D (3). MST = {A-F, C-D}.\n4. Select A-B (4). MST = {A-F, C-D, A-B}.\n5. Select C-E (5). MST = {A-F, C-D, A-B, C-E}.\n6. Select E-F (7). Connects {E,F} which are currently in different components (F is in {A,B,F}, E is in {C,D,E}). No cycle is formed. MST = {A-F, C-D, A-B, C-E, E-F}.\n7. Remaining sorted edges are evaluated and rejected as they would create cycles (e.g. B-D connects {A,B,F} and {C,D,E}, but they are already joined by E-F).\n8. All 6 vertices connected with 5 edges. Total cost = 2 + 3 + 4 + 5 + 7 = 21."
  }
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    question: "What is a Spanning Tree of a graph?",
    answer: "A Spanning Tree is a subset of an undirected connected graph that contains all the vertices of the graph, connected together with the minimum possible number of edges (exactly V - 1 edges), and does not contain any cycles."
  },
  {
    id: 2,
    question: "What makes a Spanning Tree a 'Minimum' Spanning Tree?",
    answer: "Among all possible spanning trees of a weighted, connected graph, the one that has the minimum sum of edge weights is called the Minimum Spanning Tree (MST)."
  },
  {
    id: 3,
    question: "How does Prim's algorithm choose the next edge to add?",
    answer: "Prim's algorithm is a vertex-growing greedy algorithm. It starts with a single seed vertex and, at each step, looks at all edges connecting the current tree (visited vertices) to any unvisited vertices. It greedily chooses the edge with the absolute minimum weight among these candidates."
  },
  {
    id: 4,
    question: "How does Kruskal's algorithm choose the next edge to add?",
    answer: "Kruskal's algorithm is an edge-growing greedy algorithm. It sorts all edges in the entire graph by weight. It then evaluates edges one by one from smallest to largest and adds an edge to the MST if and only if it does not form a cycle with the already selected edges."
  },
  {
    id: 5,
    question: "Can an MST have cycles? Explain why.",
    answer: "No, by definition, an MST is a tree. A tree is a connected acyclic graph. If there were a cycle, we could remove one edge from the cycle, keep the graph connected, and reduce the total weight, which violates the 'minimum weight' property of the spanning tree."
  },
  {
    id: 6,
    question: "What is the cut property in MSTs?",
    answer: "The cut property states that for any cut of a graph (a partition of vertices into two sets), the minimum-weight edge that crosses the cut must be part of the Minimum Spanning Tree of the graph."
  },
  {
    id: 7,
    question: "How is cycle detection performed in Kruskal's algorithm efficiently?",
    answer: "Cycle detection is done using the Disjoint-Set Union (DSU) data structure. For each edge (u, v), we perform a 'Find' operation on both vertices. If Find(u) == Find(v), they are in the same component, meaning a path already exists between them and adding the edge would form a cycle. If they are different, we add the edge and perform 'Union(u, v)'."
  },
  {
    id: 8,
    question: "What is the time complexity of Kruskal's algorithm, and what is the bottleneck?",
    answer: "The time complexity is O(E log E) or O(E log V). The main bottleneck is sorting the E edges of the graph, which takes O(E log E) time. The subsequent Union-Find operations take O(E * alpha(V)) time, which is much faster."
  },
  {
    id: 9,
    question: "What is the time complexity of Prim's algorithm using a simple adjacency matrix?",
    answer: "The time complexity is O(V²). At each step, we search through an array of size V to find the minimum-key vertex, which takes O(V) time, repeated V times, resulting in O(V²) time."
  },
  {
    id: 10,
    question: "Under what conditions is Prim's O(V²) algorithm preferred over Prim's O(E log V) heap-based algorithm?",
    answer: "Prim's O(V²) algorithm is preferred for dense graphs where the number of edges E is very large (close to V²). In dense graphs, O(E log V) becomes O(V² log V), which is slower than O(V²)."
  },
  {
    id: 11,
    question: "Can we find an MST for a disconnected graph? What do we get instead?",
    answer: "No, we cannot find a single spanning tree for a disconnected graph because there is no way to connect all vertices. Instead, we can find a Minimum Spanning Forest, which is a collection of MSTs, one for each connected component."
  },
  {
    id: 12,
    question: "What is the maximum number of edges in an MST of a graph with V vertices?",
    answer: "The number of edges in any MST (or spanning tree) is always exactly V - 1."
  },
  {
    id: 13,
    question: "Is the shortest path tree (e.g., from Dijkstra's) the same as the MST?",
    answer: "No, they are generally different. Dijkstra's shortest path tree minimizes the distance from a single source to all other vertices. An MST minimizes the total weight required to connect all vertices together. For example, a single highly weighted edge might be avoided in an MST but used in Dijkstra's if it represents the only quick route from the source."
  },
  {
    id: 14,
    question: "What is the space complexity of Prim's and Kruskal's algorithms?",
    answer: "Both algorithms have a space complexity of O(V + E) to store the graph. In addition, Prim's needs O(V) auxiliary space for key values, parent array, and priority queue. Kruskal's needs O(V) space for parent/rank arrays in DSU and O(E) space to store the sorted edge list."
  },
  {
    id: 15,
    question: "What is Union by Rank in Disjoint Set Union?",
    answer: "Union by Rank is a optimization technique in DSU. It always attaches the smaller depth tree under the root of the larger depth tree during a Union operation. This prevents the tree from becoming skewed and keeps the maximum tree depth to O(log V)."
  },
  {
    id: 16,
    question: "What is Path Compression in Disjoint Set Union?",
    answer: "Path Compression is an optimization during the 'Find' operation in DSU. It makes every node visited on the path to the root point directly to the root. This flattens the tree structure and speeds up future queries significantly."
  },
  {
    id: 17,
    question: "Can an MST contain a cycle if the graph has multiple edges of the same weight?",
    answer: "No, an MST can never contain a cycle regardless of edge weights. If a cycle exists, it is not a tree."
  },
  {
    id: 18,
    question: "What is Boruvka's algorithm?",
    answer: "Boruvka's is the oldest MST algorithm (1926). It works by adding the cheapest edge out of every connected component simultaneously, which reduces the number of components by at least half in each step, executing in O(E log V) time."
  },
  {
    id: 19,
    question: "If we square all edge weights in a positive-weighted graph, does the MST change?",
    answer: "No, squaring positive numbers preserves their monotonic relative order (if A < B, then A² < B²). Thus, the greedy choices of Prim's and Kruskal's will be identical, and the MST structure will remain unchanged."
  },
  {
    id: 20,
    question: "What is a real-world application of MST in computer networking?",
    answer: "An excellent example is the Spanning Tree Protocol (STP) used in network bridges and switches. STP disables redundant paths in local area networks to prevent broadcast loops, essentially establishing an active spanning tree for packet routing."
  }
];

export const EXERCISES: StudentExercisesData = {
  fillBlanks: [
    { id: 1, question: "A Spanning Tree of a connected graph with V vertices has exactly _______ edges.", answer: "V-1" },
    { id: 2, question: "Kruskal's algorithm uses the _______ data structure to detect cycles efficiently.", answer: "Disjoint Set" },
    { id: 3, question: "Prim's algorithm starts growing the MST from a single _______.", answer: "vertex" },
    { id: 4, question: "The bottleneck operation in Kruskal's algorithm is _______ the edges.", answer: "sorting" },
    { id: 5, question: "If all edge weights in a graph are distinct, the graph has a _______ Minimum Spanning Tree.", answer: "unique" }
  ],
  trueFalse: [
    {
      id: 1,
      statement: "Prim's algorithm can run faster than Kruskal's algorithm for dense graphs.",
      isTrue: true,
      explanation: "True. Prim's algorithm with an adjacency matrix runs in O(V²), which is faster than Kruskal's O(E log E) when E approaches V²."
    },
    {
      id: 2,
      statement: "An MST can only be found for graphs that contain negative edge weights.",
      isTrue: false,
      explanation: "False. MST algorithms work on any connected weighted graph, regardless of whether weights are positive, negative, or zero."
    },
    {
      id: 3,
      statement: "Adding a constant value 'c' to all edge weights in a graph can change its MST.",
      isTrue: false,
      explanation: "False. Adding a constant preserves the relative order of edge weights, so the MST structure remains identical."
    },
    {
      id: 4,
      statement: "A graph can have more than one Minimum Spanning Tree if there are duplicate edge weights.",
      isTrue: true,
      explanation: "True. Duplicate weights can lead to alternative edge selections that have the same minimum total cost, yielding multiple valid MSTs."
    },
    {
      id: 5,
      statement: "Union-Find with path compression alone (without union by rank) runs in O(V) time.",
      isTrue: false,
      explanation: "False. Path compression alone provides excellent amortized speedups (O(log V) on average), and combined with union-by-rank it achieves O(alpha(V)) complexity."
    }
  ],
  matchFollowing: [
    { id: "1", left: "Prim's Algorithm", right: "Vertex-centric greedy approach" },
    { id: "2", left: "Kruskal's Algorithm", right: "Edge-centric sorting approach" },
    { id: "3", left: "Disjoint Set (DSU)", right: "Cycle detection in Kruskal's" },
    { id: "4", left: "Priority Queue (Min-Heap)", right: "Extracting minimum key in Prim's" },
    { id: "5", left: "Spanning Tree Protocol (STP)", right: "Broadcasting loop prevention in networks" }
  ]
};

export const CODE_TEMPLATES = {
  C: `#include <stdio.h>
#include <stdbool.h>

#define V 5
#define INF 999999

// Prim's Algorithm using Adjacency Matrix
void primMST(int graph[V][V]) {
    int parent[V]; // Array to store constructed MST
    int key[V];    // Key values used to pick minimum weight edge in cut
    bool mstSet[V]; // To represent set of vertices included in MST

    // Initialize all keys as INFINITE, mstSet[] as false
    for (int i = 0; i < V; i++) {
        key[i] = INF;
        mstSet[i] = false;
    }

    // Always include first vertex in MST
    key[0] = 0;
    parent[0] = -1; // First node is always root of MST

    // The MST will have V vertices
    for (int count = 0; count < V - 1; count++) {
        // Pick the minimum key vertex from the set of vertices not yet included in MST
        int min = INF, u;
        for (int v = 0; v < V; v++) {
            if (mstSet[v] == false && key[v] < min) {
                min = key[v];
                u = v;
            }
        }

        // Add the picked vertex to the MST Set
        mstSet[u] = true;

        // Update key value and parent index of the adjacent vertices of the picked vertex.
        for (int v = 0; v < V; v++) {
            if (graph[u][v] && mstSet[v] == false && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }

    // Print the constructed MST
    printf("Edge \\tWeight\\n");
    for (int i = 1; i < V; i++) {
        printf("%d - %d \\t%d \\n", parent[i], i, graph[i][parent[i]]);
    }
}`,
  CPP: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// DSU Structure for Kruskal's
struct Edge {
    int u, v, weight;
    bool operator<(Edge const& other) const {
        return weight < other.weight;
    }
};

struct DSU {
    vector<int> parent, rank;
    DSU(int n) {
        parent.resize(n);
        rank.assign(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }
    void unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i != root_j) {
            if (rank[root_i] < rank[root_j]) swap(root_i, root_j);
            parent[root_j] = root_i;
            if (rank[root_i] == rank[root_j]) rank[root_i]++;
        }
    }
};

void kruskalMST(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end()); // Sort edges by weight
    DSU dsu(n);
    int total_weight = 0;
    vector<Edge> mst;

    for (Edge e : edges) {
        if (dsu.find(e.u) != dsu.find(e.v)) {
            total_weight += e.weight;
            mst.push_back(e);
            dsu.unite(e.u, e.v);
        }
    }

    cout << "Kruskal's MST Edges:\\n";
    for (Edge e : mst) {
        cout << e.u << " - " << e.v << " : " << e.weight << endl;
    }
    cout << "Total Cost: " << total_weight << endl;
}`,
  Java: `import java.util.*;

public class PrimMST {
    private static final int INF = Integer.MAX_VALUE;

    static class Edge implements Comparable<Edge> {
        int target, weight;
        public Edge(int target, int weight) {
            this.target = target;
            this.weight = weight;
        }
        public int compareTo(Edge other) {
            return Integer.compare(this.weight, other.weight);
        }
    }

    public static void prim(int V, List<List<Edge>> adj) {
        boolean[] inMST = new boolean[V];
        int[] key = new int[V];
        int[] parent = new int[V];
        Arrays.fill(key, INF);
        Arrays.fill(parent, -1);

        PriorityQueue<Edge> pq = new PriorityQueue<>();
        key[0] = 0;
        pq.add(new Edge(0, 0));

        while (!pq.isEmpty()) {
            int u = pq.poll().target;

            if (inMST[u]) continue;
            inMST[u] = true;

            for (Edge neighbor : adj.get(u)) {
                int v = neighbor.target;
                int weight = neighbor.weight;

                if (!inMST[v] && key[v] > weight) {
                    key[v] = weight;
                    parent[v] = u;
                    pq.add(new Edge(v, key[v]));
                }
            }
        }

        System.out.println("Prim's MST Construction:");
        for (int i = 1; i < V; i++) {
            System.out.println(parent[i] + " - " + i + " : " + key[i]);
        }
    }
}`,
  Python: `import heapq

def prim_mst(graph, start_vertex=0):
    """
    Prim's algorithm using adjacency list representation and a Min-Heap.
    graph: dict where graph[u] = [(weight, v), ...]
    """
    mst = []
    visited = set([start_vertex])
    edges = [
        (weight, start_vertex, to_vertex)
        for weight, to_vertex in graph[start_vertex]
    ]
    heapq.heapify(edges)
    total_cost = 0

    while edges:
        weight, u, v = heapq.heappop(edges)
        if v not in visited:
            visited.add(v)
            mst.append((u, v, weight))
            total_cost += weight

            for next_weight, next_vertex in graph[v]:
                if next_vertex not in visited:
                    heapq.heappush(edges, (next_weight, v, next_vertex))

    return mst, total_cost`,
  JavaScript: `class DSU {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = Array(size).fill(0);
    }

    find(i) {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]); // Path compression
    }

    union(i, j) {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI !== rootJ) {
            if (this.rank[rootI] < this.rank[rootJ]) {
                this.parent[rootI] = rootJ;
            } else if (this.rank[rootI] > this.rank[rootJ]) {
                this.parent[rootJ] = rootI;
            } else {
                this.parent[rootJ] = rootI;
                this.rank[rootI]++;
            }
            return true; // Union successful
        }
        return false; // Already in the same set
    }
}

function kruskalMST(verticesCount, edges) {
    // Sort edges by weight in ascending order
    edges.sort((a, b) => a.weight - b.weight);

    const dsu = new DSU(verticesCount);
    const mst = [];
    let totalCost = 0;

    for (const edge of edges) {
        if (dsu.union(edge.source, edge.target)) {
            mst.push(edge);
            totalCost += edge.weight;
        }
    }

    return { mst, totalCost };
}`
};
