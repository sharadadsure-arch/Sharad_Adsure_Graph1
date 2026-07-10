import { motion } from 'motion/react';
import { Network, GitPullRequest, GitCommit, Trees, Award, HelpCircle } from 'lucide-react';

export default function Introduction() {
  const cards = [
    {
      title: "What is a Graph?",
      icon: <Network className="w-5 h-5 text-blue-600" />,
      description: "A mathematical structure G = (V, E) consisting of a set of vertices (V) connected by a set of edges (E). Graphs model network relations in the real world.",
      example: "Vertices = {A, B, C}, Edges = {A-B, B-C}"
    },
    {
      title: "Weighted Graph",
      icon: <Award className="w-5 h-5 text-purple-600" />,
      description: "A graph in which a numerical label (weight) is assigned to each edge. Weights represent costs, distances, travel times, or capacities.",
      example: "A-B (cost: 5), B-C (cost: 2)"
    },
    {
      title: "Connected Graph",
      icon: <GitCommit className="w-5 h-5 text-blue-600" />,
      description: "An undirected graph where there is a path between every pair of vertices. No vertex is isolated; the entire structure is reachable.",
      example: "No unreachable sub-islands of nodes"
    },
    {
      title: "What is a Tree?",
      icon: <Trees className="w-5 h-5 text-blue-600" />,
      description: "A connected, undirected graph that has no cycles. Any tree with V vertices must have exactly V - 1 edges.",
      example: "Acyclic & connected: only one path between any 2 nodes"
    },
    {
      title: "Spanning Tree",
      icon: <GitPullRequest className="w-5 h-5 text-purple-600" />,
      description: "A subgraph of G that is a tree and spans (includes) all the vertices of G. A single graph can have many different spanning trees.",
      example: "Connects all V nodes using V - 1 edges"
    },
    {
      title: "Minimum Spanning Tree (MST)",
      icon: <HelpCircle className="w-5 h-5 text-purple-600" />,
      description: "A spanning tree of a weighted, connected undirected graph whose sum of edge weights is minimized among all possible spanning trees.",
      example: "The cheapest way to connect all vertices together"
    }
  ];

  const examples = [
    { name: "Road Networks", desc: "Connecting cities with minimal paving cost while ensuring full connectivity." },
    { name: "Internet Routing", desc: "Setting up local network hubs with minimum fiber optic cabling length." },
    { name: "Electrical Grids", desc: "Connecting power substations to the generator source with minimal high-voltage lines." },
    { name: "Water Pipelines", desc: "Laying fresh water supply pipelines to connect all villages with minimal pipe length." },
    { name: "Computer Network Design", desc: "Spanning Tree Protocol (STP) in ethernet bridges to prevent broadcast storms." },
    { name: "Cable TV Cabling", desc: "Distributing signals to multiple residential regions with minimal coaxial cabling." }
  ];

  return (
    <div id="intro-section" className="space-y-12">
      {/* Introduction Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-black text-slate-800 uppercase tracking-wider font-sans"
        >
          Graph & MST Foundations
        </motion.h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Before diving into the laboratory visualizers, review the foundational definitions and concepts in Graph Theory that underlie Prim's and Kruskal's algorithms.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)" }}
            className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-350 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-slate-50 border border-slate-150 rounded w-fit">
                {card.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{card.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{card.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-400">
              <span className="font-bold text-slate-600">EXAMPLE:</span> {card.example}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Applications Overview */}
      <div className="bg-slate-900 text-white rounded-lg p-8 lg:p-10 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">REAL-WORLD RELEVANCE</span>
          <h3 className="text-xl font-bold tracking-tight uppercase">THE POWER OF MINIMUM SPANNING TREES</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Minimum Spanning Trees are vital in system engineering to design optimal connection networks with zero redundant cycles and absolute minimal cabling or paving costs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 relative z-10">
          {examples.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              className="p-4 bg-slate-950/50 border border-slate-800 hover:border-slate-700 rounded transition-all duration-200"
            >
              <h4 className="text-slate-100 font-bold text-xs uppercase tracking-wide mb-1">{item.name}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
