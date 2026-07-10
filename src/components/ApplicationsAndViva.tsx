import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VIVA_QUESTIONS } from '../data';
import { Network, Bus, Zap, Brain, Image, MapPin, PhoneCall, Bot, HelpCircle, ChevronDown } from 'lucide-react';

export default function ApplicationsAndViva() {
  const [activeViva, setActiveViva] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const applications = [
    {
      title: "Computer Networks",
      icon: <Network className="w-5 h-5 text-blue-500" />,
      description: "Spanning Tree Protocol (STP) prevents network loops in Layer 2 ethernet bridges. Additionally, MSTs guide efficient multicast routing packets across servers.",
      color: "bg-white border-slate-200"
    },
    {
      title: "Transportation & Roads",
      icon: <Bus className="w-5 h-5 text-purple-500" />,
      description: "Designing roads, highways, and rail links to connect multiple destination cities with minimum paving cost, ensuring full reachability with no extra cycles.",
      color: "bg-white border-slate-200"
    },
    {
      title: "Electrical Power Grids",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      description: "Connecting regional power substations and transformers to high-voltage generators with minimal metal transmission wire to curb infrastructure costs.",
      color: "bg-white border-slate-200"
    },
    {
      title: "Machine Learning",
      icon: <Brain className="w-5 h-5 text-emerald-500" />,
      description: "Single-Linkage Hierarchical Clustering can be mapped directly to finding the MST of a distance graph. Cutting the longest MST edges clusters the data.",
      color: "bg-white border-slate-200"
    },
    {
      title: "Image Segmentation",
      icon: <Image className="w-5 h-5 text-pink-500" />,
      description: "Pixels are represented as vertices and edge weights represent spatial gradients. Finding the MST and breaking high-contrast edges separates foreground from background.",
      color: "bg-white border-slate-200"
    },
    {
      title: "GIS & Territory Mapping",
      icon: <MapPin className="w-5 h-5 text-indigo-500" />,
      description: "Connecting points of interest, modeling river delta flow routes, and compiling maps of pipelines with minimum layout expenditure.",
      color: "bg-white border-slate-200"
    },
    {
      title: "Telecommunications",
      icon: <PhoneCall className="w-5 h-5 text-cyan-500" />,
      description: "Deploying optical fibers to connect cellular towers or phone switches across complex topographies, avoiding costly loops while serving all towers.",
      color: "bg-white border-slate-200"
    },
    {
      title: "Robotics Path Planning",
      icon: <Bot className="w-5 h-5 text-violet-500" />,
      description: "Multi-robot area exploration maps out connectivity graphs and uses spanning forests to coordinate robots, ensuring they cover the area without colliding.",
      color: "bg-white border-slate-200"
    }
  ];

  const filteredViva = VIVA_QUESTIONS.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="viva-section" className="space-y-16">
      {/* Applications Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-black text-slate-800 uppercase tracking-wider font-sans"
          >
            REAL-WORLD APPLICATIONS
          </motion.h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            MST algorithms are not just theoretical academic exercises. They power critical infrastructure, spatial calculations, and machine learning pipelines globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {applications.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`p-6 ${app.color} border rounded shadow-sm flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded w-fit shadow-2xs">
                  {app.icon}
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">{app.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{app.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Viva Questions */}
      <div className="space-y-8 pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 justify-center md:justify-start">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              LAB VIVA PREPARATION
            </h3>
            <p className="text-slate-500 text-xs">
              Prepare for your laboratory examinations and mock interviews with these curated review questions.
            </p>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-250 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-slate-800 placeholder-slate-450 shadow-2xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredViva.map((viva) => {
            const isOpen = activeViva === viva.id;
            return (
              <motion.div
                key={viva.id}
                layout
                className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveViva(isOpen ? null : viva.id)}
                  className="w-full text-left p-5 flex justify-between items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-blue-500 uppercase">Question {viva.id}</span>
                    <h4 className="text-xs font-bold text-slate-800 pr-2">{viva.question}</h4>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 mt-1 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-185 text-blue-500" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 bg-slate-50/50"
                    >
                      <div className="p-5 text-xs text-slate-650 leading-relaxed space-y-3">
                        <div className="flex gap-2">
                          <div className="w-5 h-5 bg-emerald-50 border border-emerald-250 rounded flex items-center justify-center text-emerald-600 text-[9px] font-bold font-mono shrink-0 mt-0.5">A</div>
                          <p className="select-text">{viva.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          
          {filteredViva.length === 0 && (
            <div className="col-span-2 text-center py-12 bg-slate-50 rounded border border-dashed border-slate-200 text-slate-400 text-sm">
              No questions found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
