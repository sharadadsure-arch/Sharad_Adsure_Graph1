import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vertex, Edge } from './types';
import Introduction from './components/Introduction';
import Comparison from './components/Comparison';
import MSTVisualizer from './components/MSTVisualizer';
import CodeSection from './components/CodeSection';
import PracticeAndQuiz from './components/PracticeAndQuiz';
import ApplicationsAndViva from './components/ApplicationsAndViva';
import { Network, HelpCircle, BookOpen, Layers, Code, Zap, Sun, Moon, Maximize, Minimize, Compass, ChevronRight, Play } from 'lucide-react';

export default function App() {
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  // Load custom/initial sample vertices on startup
  const onGraphChange = (updatedVertices: Vertex[], updatedEdges: Edge[]) => {
    setVertices(updatedVertices);
    setEdges(updatedEdges);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`${id}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50/50 text-slate-800"
    }`}>
      
      {/* 1. DARK NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Lab Branding */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded flex items-center justify-center">
                <Network className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <span className="block text-[9px] font-black tracking-widest text-blue-400 uppercase">DATA STRUCTURES LAB</span>
                <span className="text-xs font-black tracking-widest uppercase text-white font-sans">MST VIRTUAL LAB</span>
              </div>
            </div>

            {/* Quick Scroll Links */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { id: 'intro', label: 'Graph Basics', icon: <Compass className="w-3.5 h-3.5" /> },
                { id: 'simulator', label: 'Simulator Screen', icon: <Play className="w-3.5 h-3.5 text-emerald-400" /> },
                { id: 'comparison', label: 'Compare Algos', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'practice', label: 'Problems & Quiz', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'code', label: 'Implementation Code', icon: <Code className="w-3.5 h-3.5" /> },
                { id: 'viva', label: 'Applications & Viva', icon: <HelpCircle className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeSection === tab.id 
                      ? "bg-slate-800 text-blue-400" 
                      : "text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mode & Action Controls */}
            <div className="flex items-center gap-3">
              {/* Dark mode */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 transition-colors cursor-pointer border border-slate-800"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 transition-colors cursor-pointer border border-slate-800"
                title={isFullscreen ? "Exit Fullscreen Visualizer" : "Maximize Board Space"}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* FULLSCREEN VISUALIZER OVERLAY COMPONENT */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col p-6 space-y-4 text-white overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold font-display">Maximize Simulation Deck</h3>
              </div>
              <button 
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
              >
                Close Fullscreen
              </button>
            </div>
            
            <div className="flex-1">
              <MSTVisualizer 
                vertices={vertices} 
                edges={edges} 
                onGraphChange={onGraphChange} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION */}
      {!isFullscreen && (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white py-16 lg:py-24 shadow-inner">
          {/* Animated Background particle connections */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full">
              <line x1="10%" y1="20%" x2="30%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30%" y1="50%" x2="50%" y2="30%" stroke="white" strokeWidth="1" />
              <line x1="50%" y1="30%" x2="70%" y2="70%" stroke="white" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="70%" y1="70%" x2="90%" y2="20%" stroke="white" strokeWidth="1.5" />
              <circle cx="10%" cy="20%" r="4" fill="white" />
              <circle cx="30%" cy="50%" r="5" fill="#3b82f6" />
              <circle cx="50%" cy="30%" r="6" fill="#8b5cf6" />
              <circle cx="70%" cy="70%" r="5" fill="#10b981" />
              <circle cx="90%" cy="20%" r="4" fill="white" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column Text details */}
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold tracking-wider text-blue-300 uppercase rounded">
                  <Zap className="w-3 h-3 text-blue-400" /> Virtual Lab Platform
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-sans leading-tight">
                  Interactive Minimum <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Spanning Tree</span> Solver
                </h1>

                <p className="text-slate-300 text-sm max-w-xl leading-relaxed mx-auto lg:mx-0">
                  Step-by-step interactive algorithm solver explaining Prim's vertex growth and Kruskal's disjoint union edge sorting logic. Build graphs, edit weights, analyze Disjoint Set changes, and test your skills.
                </p>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <button
                    onClick={() => scrollToSection('simulator')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                  >
                    Start Learning <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollToSection('intro')}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-750 font-bold rounded text-xs uppercase tracking-wider transition-colors border border-slate-700 cursor-pointer"
                  >
                    Explore Algorithms
                  </button>
                </div>
              </div>

              {/* Right Column illustration */}
              <div className="flex justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded p-6 shadow-2xl relative w-full max-w-md overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
                  
                  {/* Decorative graph wireframe */}
                  <div className="p-4 border-b border-white/10 flex justify-between items-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <span>LAB MONITORING SYSTEM</span>
                    <span className="px-1.5 py-0.5 bg-blue-500/25 text-blue-300 rounded text-[9px]">ACTIVE</span>
                  </div>

                  <div className="py-12 flex flex-col items-center space-y-6">
                    {/* Visual Node Cluster */}
                    <div className="relative w-48 h-28 flex items-center justify-center">
                      <div className="absolute top-0 left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">A</div>
                      <div className="absolute bottom-0 left-0 w-10 h-10 bg-white text-slate-650 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border border-slate-200">B</div>
                      <div className="absolute top-2 right-4 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">C</div>
                      <div className="absolute bottom-2 right-0 w-10 h-10 bg-white text-slate-650 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border border-slate-200">D</div>
                      
                      {/* Connection lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line x1="30" y1="20" x2="160" y2="25" stroke="#475569" strokeWidth="2" />
                        <line x1="20" y1="20" x2="20" y2="90" stroke="#3b82f6" strokeWidth="4" />
                        <line x1="20" y1="90" x2="170" y2="95" stroke="#3b82f6" strokeWidth="4" />
                        <line x1="160" y1="25" x2="170" y2="95" stroke="#8b5cf6" strokeWidth="3" />
                      </svg>
                    </div>

                    <div className="text-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">REAL-TIME CYCLE PREVENTION</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Automatic loops validation using Disjoint Set Union checks.</p>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. CORE LAB CONTENT SECTIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* GRAPH BASICS INTRODUCTION */}
        <section id="intro-section" className="scroll-mt-20">
          <Introduction />
        </section>

        {/* ACTIVE VISUALIZER & EDITOR */}
        <section id="simulator-section" className="scroll-mt-20">
          <div className="space-y-3 mb-8 text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">CORE LAB COMPONENT</span>
            <h2 className="text-2xl font-black uppercase tracking-wider text-slate-800 font-sans mt-1">
              Interactive Algorithm Simulator
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Design custom network topologies in the canvas editor, adjust edge weights, or load classic sample presets to simulate Prim's and Kruskal's procedures.
            </p>
          </div>

          <MSTVisualizer
            vertices={vertices}
            edges={edges}
            onGraphChange={onGraphChange}
          />
        </section>

        {/* COMPARISON CHART PANEL */}
        <section id="comparison-section" className="scroll-mt-20">
          <Comparison />
        </section>

        {/* PROBLEMS, QUIZ & EXERCISES */}
        <section id="practice-section" className="scroll-mt-20">
          <PracticeAndQuiz />
        </section>

        {/* CODE SECTION COLLAPSIBLE CARDS */}
        <section id="code-section" className="scroll-mt-20">
          <CodeSection />
        </section>

        {/* APPLICATIONS & LAB VIVA QUESTIONS */}
        <section id="viva-section" className="scroll-mt-20">
          <ApplicationsAndViva />
        </section>

      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-800 pb-8 mb-8">
            
            {/* Dept info */}
            <div className="space-y-2 text-center md:text-left">
              <span className="text-white font-extrabold text-sm block tracking-tight font-display">Department of Computer Engineering</span>
              <p className="text-slate-500">Curriculum Virtual Laboratory Management System &bull; Active Learning Platform</p>
            </div>

            {/* Title portal */}
            <div className="text-center space-y-1">
              <span className="px-3 py-1 bg-slate-800 rounded-full font-mono text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Data Structures Laboratory</span>
              <span className="block font-bold text-slate-300">Minimum Spanning Tree Portal</span>
            </div>

            {/* Design credits */}
            <div className="text-center md:text-right space-y-1">
              <p className="text-slate-500">Made with high performance HTML5, CSS3, React & TypeScript</p>
              <p className="text-slate-500">&copy; {new Date().getFullYear()} Laboratory Interactive Systems. All rights reserved.</p>
            </div>

          </div>

          <div className="text-center text-slate-600 text-[10px] uppercase font-mono tracking-widest">
            Acyclic Connecting Graphs &bull; Prim &bull; Kruskal &bull; Boruvka &bull; Disjoint Set Union
          </div>
        </div>
      </footer>

    </div>
  );
}
