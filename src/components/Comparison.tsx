import { motion } from 'motion/react';
import { ArrowDown, Cpu, FastForward, CheckSquare, Layers } from 'lucide-react';

export default function Comparison() {
  const compData = [
    { label: "Working Principle", prim: "Starts with a single vertex and greedily grows the tree by adding the cheapest outgoing edge.", kruskal: "Starts with a forest of V vertices and greedily connects components by selecting the absolute smallest edges." },
    { label: "Time Complexity (Standard)", prim: "O(E log V) with Min-Heap, or O(V²) with Adjacency Matrix.", kruskal: "O(E log E) or O(E log V) due to sorting all edges initially." },
    { label: "Space Complexity", prim: "O(V + E) to store the graph and O(V) auxiliary space for priorities.", kruskal: "O(V + E) for the graph, plus O(E) for sorting and O(V) for Disjoint Set." },
    { label: "Core Data Structure", prim: "Priority Queue (Min-Heap) and Adjacency List/Matrix.", kruskal: "Disjoint Set Union (DSU / Union-Find) and sorted Edge List." },
    { label: "Cycle Detection", prim: "Naturally avoided by checking if the target vertex is already visited (in MST).", kruskal: "Explicitly detected using Union-Find (Find(u) == Find(v))." },
    { label: "Graph Suitability", prim: "Highly preferred for dense graphs where E is close to V².", kruskal: "Highly preferred for sparse graphs where E is close to V." },
    { label: "Advantages", prim: "Extremely fast on dense graphs; does not require sorting all edges up front.", kruskal: "Very simple to implement; works outstandingly on sparse graphs; DSU is highly efficient." },
    { label: "Disadvantages", prim: "Can be complex to optimize with Fibonacci Heaps; slower on sparse graphs.", kruskal: "Must sort all edges first; cycle detection can be a bottleneck in dense graphs." }
  ];

  return (
    <div id="comparison-section" className="space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-black text-slate-800 uppercase tracking-wider font-sans"
        >
          ALGORITHM COMPARISON
        </motion.h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          While both algorithms find the Minimum Spanning Tree of any connected weighted graph, they operate on completely different principles (vertex-centric vs. edge-centric) and have different strengths.
        </p>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prim Card */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider flex items-center gap-3">
            <span className="p-2 bg-blue-50 text-blue-500 rounded"><Layers className="w-5 h-5" /></span>
            PRIM'S ALGORITHM (VERTEX-CENTRIC)
          </h3>
          <p className="mt-4 text-slate-500 text-sm leading-relaxed">
            Prim's is like growing a single root system. It starts from one arbitrary node and sprouts outward. It always expands the boundary to the nearest unreached node, making it ideal when the graph is tightly clustered or highly connected.
          </p>
          <div className="mt-6 p-4 bg-slate-50 border border-slate-150 rounded space-y-2">
            <h4 className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Key Highlights</h4>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Greedy approach centered on vertices.</li>
              <li>Always maintains a single connected tree during construction.</li>
              <li>Can run in <span className="font-semibold text-blue-600">O(V²)</span> without a heap, optimal for complete graphs.</li>
            </ul>
          </div>
        </motion.div>

        {/* Kruskal Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider flex items-center gap-3">
            <span className="p-2 bg-purple-50 text-purple-500 rounded"><FastForward className="w-5 h-5" /></span>
            KRUSKAL'S ALGORITHM (EDGE-CENTRIC)
          </h3>
          <p className="mt-4 text-slate-500 text-sm leading-relaxed">
            Kruskal's is like building a series of isolated bridges. It does not care about connectivity initially; it sorts all bridges by length and installs them, only throwing out a bridge if it connects islands that are already joined. Ideal for sprawling, sparse graphs.
          </p>
          <div className="mt-6 p-4 bg-slate-50 border border-slate-150 rounded space-y-2">
            <h4 className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Key Highlights</h4>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Greedy approach centered on edge sorting.</li>
              <li>Constructs a disjoint forest that joins into a tree at the final steps.</li>
              <li>Uses <span className="font-semibold text-purple-600">Disjoint Set Union (Union-Find)</span> for ultra-fast loop checks.</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Comparison Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Feature-by-Feature Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4 w-1/4">Algorithm Property</th>
                <th className="p-4 w-3/8 text-blue-600">Prim's Algorithm</th>
                <th className="p-4 w-3/8 text-purple-600">Kruskal's Algorithm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650">
              {compData.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800 uppercase tracking-wide text-[11px] bg-slate-50/20">{row.label}</td>
                  <td className="p-4 leading-relaxed">{row.prim}</td>
                  <td className="p-4 leading-relaxed">{row.kruskal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Complexity Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Animated Complexity Bars */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm space-y-8"
        >
          <div className="space-y-2">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500" />
              THEORETICAL COMPLEXITY SCALING
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The graph density determines which algorithm excels. Sparse graphs have E ≈ V, whereas dense graphs have E ≈ V².
            </p>
          </div>

          <div className="space-y-6">
            {/* Prim Matrix */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Prim's (Adjacency Matrix) - Best for Extremely Dense Graphs</span>
                <span className="font-mono text-blue-600">O(V²)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "95%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-400">Excellent performance when E is close to V² because there is zero heap lookup overhead.</p>
            </div>

            {/* Prim Heap */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Prim's (Min-Heap) - Excellent for Standard Sparse Graphs</span>
                <span className="font-mono text-emerald-600">O(E log V)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "65%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-400">Heap operations key retrieval. Runs incredibly fast when the graph is sparsely populated.</p>
            </div>

            {/* Kruskal Sorting */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Kruskal's (Sorting bottleneck) - Excellent for Sparse Graphs</span>
                <span className="font-mono text-purple-600">O(E log E)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "70%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-400">Bottlenecked entirely by sorting the edge list initially. DSU checks are nearly instantaneous.</p>
            </div>
          </div>
        </motion.div>

        {/* Algorithm Flowcharts */}
        <div className="space-y-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-slate-800 text-center lg:text-left">Procedural Workflow Flowcharts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prim Flow */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg flex flex-col items-center space-y-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Prim's Loop</span>
              
              <div className="flex flex-col items-center text-center space-y-2 text-xs text-slate-600 w-full font-mono">
                <div className="p-2 bg-white rounded border border-slate-200 w-full shadow-xs">Start: Seed Node</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-white rounded border border-slate-200 w-full shadow-xs">Add Node to Visited</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-white rounded border border-slate-200 w-full shadow-xs">Find Minimum Outgoing Edge</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-blue-50 border border-blue-200 rounded w-full shadow-xs font-bold text-blue-700">Add Edge & Target</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-white rounded border border-slate-200 w-full shadow-xs">Check: All Visited?</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-slate-800 text-white rounded w-full shadow-xs">Finish MST</div>
              </div>
            </div>

            {/* Kruskal Flow */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg flex flex-col items-center space-y-3">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider">Kruskal's Loop</span>
              
              <div className="flex flex-col items-center text-center space-y-2 text-xs text-slate-600 w-full font-mono">
                <div className="p-2 bg-white rounded border border-slate-200 w-full shadow-xs">Sort All Edges</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-white rounded border border-slate-200 w-full shadow-xs">Pick Smallest Edge</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-white rounded border border-slate-200 w-full shadow-xs">Check Cycle (DSU)</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-purple-50 border border-purple-200 rounded w-full shadow-xs font-bold text-purple-700 font-mono">Yes? Skip / No? Connect</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-white rounded border border-slate-200 w-full shadow-xs">Check: V - 1 Edges?</div>
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <div className="p-2 bg-slate-800 text-white rounded w-full shadow-xs">Finish MST</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
