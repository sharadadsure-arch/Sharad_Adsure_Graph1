import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vertex, Edge, PrimStep, KruskalStep } from '../types';
import { PRIM_PSEUDO_CODE, KRUSKAL_PSEUDO_CODE } from '../data';
import GraphVisualizer from './GraphVisualizer';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX, FileText, FastForward, HelpCircle, Activity, LayoutGrid, Check, AlertCircle } from 'lucide-react';

interface MSTVisualizerProps {
  vertices: Vertex[];
  edges: Edge[];
  onGraphChange: (vertices: Vertex[], edges: Edge[]) => void;
}

export default function MSTVisualizer({ vertices, edges, onGraphChange }: MSTVisualizerProps) {
  const [activeTab, setActiveTab] = useState<'prim' | 'kruskal'>('prim');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simulation play state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500); // ms
  const [primStepIdx, setPrimStepIdx] = useState(0);
  const [kruskalStepIdx, setKruskalStepIdx] = useState(0);

  // Pre-computed steps
  const [primSteps, setPrimSteps] = useState<PrimStep[]>([]);
  const [kruskalSteps, setKruskalSteps] = useState<KruskalStep[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play Web Audio sounds
  const playSound = (type: 'success' | 'fail' | 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'fail') {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(147, ctx.currentTime + 0.12); // D3
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(392, ctx.currentTime); // G4
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch (e) {
      console.warn("AudioContext blocked or uninitialized:", e);
    }
  };

  // Pre-calculate PRIM STEPS
  const calculatePrimSteps = () => {
    if (vertices.length === 0) {
      setPrimSteps([]);
      return;
    }

    const steps: PrimStep[] = [];
    const startNode = vertices[0].id;
    
    // Initial structures
    const visited: string[] = [startNode];
    const mstEdges: string[] = [];
    const parent: Record<string, string | null> = {};
    vertices.forEach(v => { parent[v.id] = null; });

    let currentCost = 0;
    let stepNumber = 1;

    // Outgoing edges of startNode initially
    const initialCandidates = edges
      .filter(e => (e.source === startNode || e.target === startNode))
      .map(e => ({ edgeId: e.id, weight: e.weight }));

    // Priority queue visualizer
    const initialPQ = initialCandidates
      .map(c => {
        const edge = edges.find(e => e.id === c.edgeId)!;
        return { edgeLabel: `${edge.source}-${edge.target}`, weight: edge.weight };
      })
      .sort((a, b) => a.weight - b.weight);

    // Initial step (Step 1)
    steps.push({
      visited: [...visited],
      mstEdges: [],
      candidateEdges: [...initialCandidates],
      minEdgeId: null,
      currentNodeId: startNode,
      priorityQueue: [...initialPQ],
      parent: { ...parent },
      totalCost: 0,
      explanation: `Initialize Prim's Algorithm. Start node is selected as '${startNode}'. Connecting edges are loaded as candidates.`,
      reason: `Seed node selected. Candidates: ${initialPQ.map(p => `${p.edgeLabel}(${p.weight})`).join(', ') || 'None'}.`,
      pseudoLine: 2,
      stepNumber: stepNumber++
    });

    // Loop
    while (visited.length < vertices.length) {
      // Find all candidate edges crossing the cut
      const crossingEdges = edges.filter(edge => {
        const sourceVisited = visited.includes(edge.source);
        const targetVisited = visited.includes(edge.target);
        // Exclusively one endpoint visited
        return (sourceVisited && !targetVisited) || (!sourceVisited && sourceVisited);
      });

      // Filter down to strictly valid candidate edges (one end visited, one unvisited)
      const validCandidates = edges.filter(edge => {
        const hasSource = visited.includes(edge.source);
        const hasTarget = visited.includes(edge.target);
        return (hasSource && !hasTarget) || (!hasSource && hasTarget);
      });

      if (validCandidates.length === 0) {
        // Disconnected graph
        steps.push({
          visited: [...visited],
          mstEdges: [...mstEdges],
          candidateEdges: [],
          minEdgeId: null,
          currentNodeId: null,
          priorityQueue: [],
          parent: { ...parent },
          totalCost: currentCost,
          explanation: "Disconnected Graph Alert! No further candidate edges exist, but not all nodes are visited.",
          reason: "The graph has isolated components, so a single Minimum Spanning Tree is impossible.",
          pseudoLine: 4,
          stepNumber: stepNumber++
        });
        break;
      }

      // Sort candidates by weight
      const sortedValid = [...validCandidates].sort((a, b) => a.weight - b.weight);
      const chosenEdge = sortedValid[0];

      // Identify the unvisited endpoint of chosenEdge
      const uNode = visited.includes(chosenEdge.source) ? chosenEdge.source : chosenEdge.target;
      const vNode = visited.includes(chosenEdge.source) ? chosenEdge.target : chosenEdge.source; // vNode is unvisited

      // Candidate visual state
      const nextCandidates = validCandidates.map(e => ({ edgeId: e.id, weight: e.weight }));
      const pqState = validCandidates
        .map(e => ({ edgeLabel: `${e.source}-${e.target}`, weight: e.weight }))
        .sort((a, b) => a.weight - b.weight);

      // Save analysis step BEFORE updating variables
      steps.push({
        visited: [...visited],
        mstEdges: [...mstEdges],
        candidateEdges: [...nextCandidates],
        minEdgeId: chosenEdge.id,
        currentNodeId: uNode,
        priorityQueue: [...pqState],
        parent: { ...parent },
        totalCost: currentCost,
        explanation: `Scanning boundary cut. Smallest candidate edge connecting visited nodes to unvisited nodes is '${chosenEdge.source}-${chosenEdge.target}' with weight ${chosenEdge.weight}.`,
        reason: `Evaluated ${pqState.length} candidate edges. Edge ${chosenEdge.source}-${chosenEdge.target} is selected as the cheapest cut crossing link.`,
        pseudoLine: 5,
        stepNumber: stepNumber++
      });

      // Apply the step changes
      visited.push(vNode);
      mstEdges.push(chosenEdge.id);
      parent[vNode] = uNode;
      currentCost += chosenEdge.weight;

      const postPQState = edges
        .filter(e => {
          const sIn = visited.includes(e.source);
          const tIn = visited.includes(e.target);
          return (sIn && !tIn) || (!sIn && tIn);
        })
        .map(e => ({ edgeLabel: `${e.source}-${e.target}`, weight: e.weight }))
        .sort((a, b) => a.weight - b.weight);

      // Save addition step
      steps.push({
        visited: [...visited],
        mstEdges: [...mstEdges],
        candidateEdges: edges
          .filter(e => {
            const sIn = visited.includes(e.source);
            const tIn = visited.includes(e.target);
            return (sIn && !tIn) || (!sIn && tIn);
          })
          .map(e => ({ edgeId: e.id, weight: e.weight })),
        minEdgeId: chosenEdge.id,
        currentNodeId: vNode,
        priorityQueue: [...postPQState],
        parent: { ...parent },
        totalCost: currentCost,
        explanation: `Added vertex '${vNode}' and edge '${chosenEdge.source}-${chosenEdge.target}' to the MST. Updated total tree cost to ${currentCost}.`,
        reason: `Vertex '${vNode}' is now marked as Visited. Outgoing links from '${vNode}' are merged into the candidate set.`,
        pseudoLine: 9,
        stepNumber: stepNumber++
      });
    }

    // Complete step
    steps.push({
      visited: [...visited],
      mstEdges: [...mstEdges],
      candidateEdges: [],
      minEdgeId: null,
      currentNodeId: null,
      priorityQueue: [],
      parent: { ...parent },
      totalCost: currentCost,
      explanation: `Prim's Algorithm Complete! Successfully constructed the Minimum Spanning Tree connecting all ${vertices.length} vertices.`,
      reason: `Total MST cost: ${currentCost}. Edges selected: ${mstEdges.length}.`,
      pseudoLine: 10,
      stepNumber: stepNumber++
    });

    setPrimSteps(steps);
  };

  // Pre-calculate KRUSKAL STEPS
  const calculateKruskalSteps = () => {
    if (vertices.length === 0) {
      setKruskalSteps([]);
      return;
    }

    const steps: KruskalStep[] = [];
    const mstEdges: string[] = [];
    const rejectedEdges: string[] = [];

    // Union Find structure
    const parent: Record<string, string> = {};
    const rank: Record<string, number> = {};
    vertices.forEach(v => {
      parent[v.id] = v.id;
      rank[v.id] = 0;
    });

    // Helper Find/Union for computation
    const findRoot = (node: string): string => {
      let curr = node;
      while (parent[curr] !== curr) {
        curr = parent[curr];
      }
      return curr;
    };

    const unionSets = (u: string, v: string) => {
      const rootU = findRoot(u);
      const rootV = findRoot(v);
      if (rootU !== rootV) {
        if (rank[rootU] < rank[rootV]) {
          parent[rootU] = rootV;
        } else if (rank[rootU] > rank[rootV]) {
          parent[rootV] = rootU;
        } else {
          parent[rootV] = rootU;
          rank[rootU]++;
        }
      }
    };

    const getDisjointSetsList = (): string[][] => {
      const groups: Record<string, string[]> = {};
      vertices.forEach(v => {
        const root = findRoot(v.id);
        if (!groups[root]) groups[root] = [];
        groups[root].push(v.id);
      });
      return Object.values(groups);
    };

    // Sort edges
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    
    let currentCost = 0;
    let stepNumber = 1;

    // Initial sorted status
    const initialSortedState = sortedEdges.map(e => ({ edgeId: e.id, status: 'pending' as const }));

    // Initial step
    steps.push({
      mstEdges: [],
      rejectedEdges: [],
      currentEdgeId: null,
      sortedEdgesState: [...initialSortedState],
      parent: { ...parent },
      rank: { ...rank },
      disjointSets: getDisjointSetsList(),
      cycleDetected: false,
      totalCost: 0,
      explanation: "Initialize Kruskal's Algorithm. All edges are sorted by weight. Disjoint Set forest initialized.",
      reason: `Sorted list: ${sortedEdges.map(e => `${e.source}-${e.target}(${e.weight})`).join(', ')}.`,
      pseudoLine: 2,
      stepNumber: stepNumber++
    });

    // Loop through sorted edges
    for (let i = 0; i < sortedEdges.length; i++) {
      const edge = sortedEdges[i];
      const u = edge.source;
      const v = edge.target;

      const rootU = findRoot(u);
      const rootV = findRoot(v);
      const isCycle = rootU === rootV;

      // Update sorted status list
      const currentSortedState = sortedEdges.map((e, idx) => {
        if (mstEdges.includes(e.id)) return { edgeId: e.id, status: 'selected' as const };
        if (rejectedEdges.includes(e.id)) return { edgeId: e.id, status: 'rejected' as const };
        if (idx === i) return { edgeId: e.id, status: 'current' as const };
        return { edgeId: e.id, status: 'pending' as const };
      });

      if (!isCycle) {
        // Prepare step BEFORE union so display shows components BEFORE merge
        steps.push({
          mstEdges: [...mstEdges],
          rejectedEdges: [...rejectedEdges],
          currentEdgeId: edge.id,
          sortedEdgesState: [...currentSortedState],
          parent: { ...parent },
          rank: { ...rank },
          disjointSets: getDisjointSetsList(),
          cycleDetected: false,
          totalCost: currentCost,
          explanation: `Evaluating edge '${u}-${v}' (weight ${edge.weight}). Vertices belong to DIFFERENT components: Set(${u}) !== Set(${v}). No cycle forms!`,
          reason: `Selecting edge: Find(${u})=${rootU} and Find(${v})=${rootV}. They are disconnected; adding this edge will merge components.`,
          pseudoLine: 5,
          stepNumber: stepNumber++
        });

        // Apply union
        unionSets(u, v);
        mstEdges.push(edge.id);
        currentCost += edge.weight;

        // Visual set post union
        const postSortedState = sortedEdges.map(e => {
          if (mstEdges.includes(e.id)) return { edgeId: e.id, status: 'selected' as const };
          if (rejectedEdges.includes(e.id)) return { edgeId: e.id, status: 'rejected' as const };
          return { edgeId: e.id, status: 'pending' as const };
        });

        steps.push({
          mstEdges: [...mstEdges],
          rejectedEdges: [...rejectedEdges],
          currentEdgeId: edge.id,
          sortedEdgesState: [...postSortedState],
          parent: { ...parent },
          rank: { ...rank },
          disjointSets: getDisjointSetsList(),
          cycleDetected: false,
          totalCost: currentCost,
          explanation: `Edge '${u}-${v}' added to MST. Merged Disjoint Sets. Total MST cost is now ${currentCost}.`,
          reason: `Components joined. Union(${u}, ${v}) updated parent references. Total edges in MST: ${mstEdges.length}.`,
          pseudoLine: 7,
          stepNumber: stepNumber++
        });
      } else {
        // Cycle detected step
        steps.push({
          mstEdges: [...mstEdges],
          rejectedEdges: [...rejectedEdges],
          currentEdgeId: edge.id,
          sortedEdgesState: [...currentSortedState],
          parent: { ...parent },
          rank: { ...rank },
          disjointSets: getDisjointSetsList(),
          cycleDetected: true,
          totalCost: currentCost,
          explanation: `Evaluating edge '${u}-${v}' (weight ${edge.weight}). Vertices belong to the SAME component: Set(${u}) === Set(${v}).`,
          reason: `REJECTED: Find(${u})=${rootU} and Find(${v})=${rootV}. Adding this link creates an illegal cycle.`,
          pseudoLine: 8,
          stepNumber: stepNumber++
        });

        rejectedEdges.push(edge.id);

        const postSortedState = sortedEdges.map(e => {
          if (mstEdges.includes(e.id)) return { edgeId: e.id, status: 'selected' as const };
          if (rejectedEdges.includes(e.id)) return { edgeId: e.id, status: 'rejected' as const };
          return { edgeId: e.id, status: 'pending' as const };
        });

        steps.push({
          mstEdges: [...mstEdges],
          rejectedEdges: [...rejectedEdges],
          currentEdgeId: edge.id,
          sortedEdgesState: [...postSortedState],
          parent: { ...parent },
          rank: { ...rank },
          disjointSets: getDisjointSetsList(),
          cycleDetected: true,
          totalCost: currentCost,
          explanation: `Edge '${u}-${v}' skipped and logged as rejected cycle link.`,
          reason: `A cycle was successfully prevented. MST structures must remain acyclic.`,
          pseudoLine: 8,
          stepNumber: stepNumber++
        });
      }

      // Early break if tree is complete
      if (mstEdges.length === vertices.length - 1) {
        break;
      }
    }

    // Completion Step
    const finalSortedState = sortedEdges.map(e => {
      if (mstEdges.includes(e.id)) return { edgeId: e.id, status: 'selected' as const };
      return { edgeId: e.id, status: 'rejected' as const };
    });

    steps.push({
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      currentEdgeId: null,
      sortedEdgesState: [...finalSortedState],
      parent: { ...parent },
      rank: { ...rank },
      disjointSets: getDisjointSetsList(),
      cycleDetected: false,
      totalCost: currentCost,
      explanation: `Kruskal's Algorithm Complete! Found Minimum Spanning Tree containing ${mstEdges.length} edges.`,
      reason: `Total tree weight: ${currentCost}. Connects all reachable vertices.`,
      pseudoLine: 10,
      stepNumber: stepNumber++
    });

    setKruskalSteps(steps);
  };

  // Trigger recalculations on vertices/edges changes
  useEffect(() => {
    calculatePrimSteps();
    calculateKruskalSteps();
    setPrimStepIdx(0);
    setKruskalStepIdx(0);
    setIsPlaying(false);
  }, [vertices, edges]);

  // Handle Play interval
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (activeTab === 'prim') {
          setPrimStepIdx(prev => {
            if (prev + 1 < primSteps.length) {
              const nextVal = prev + 1;
              // Play sounds for visual actions
              const nextStep = primSteps[nextVal];
              if (nextStep.minEdgeId && nextStep.pseudoLine === 9) {
                playSound('success');
              } else {
                playSound('click');
              }
              return nextVal;
            } else {
              setIsPlaying(false);
              return prev;
            }
          });
        } else {
          setKruskalStepIdx(prev => {
            if (prev + 1 < kruskalSteps.length) {
              const nextVal = prev + 1;
              const nextStep = kruskalSteps[nextVal];
              if (nextStep.cycleDetected) {
                playSound('fail');
              } else if (nextStep.currentEdgeId && nextStep.pseudoLine === 7) {
                playSound('success');
              } else {
                playSound('click');
              }
              return nextVal;
            } else {
              setIsPlaying(false);
              return prev;
            }
          });
        }
      }, playbackSpeed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, activeTab, primSteps, kruskalSteps, playbackSpeed, soundEnabled]);

  // Keyboard Shortcuts (N = Next, P = Previous, R = Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'n') {
        // Next Step
        e.preventDefault();
        setIsPlaying(false);
        handleNextStep();
      } else if (key === 'p') {
        // Previous Step
        e.preventDefault();
        setIsPlaying(false);
        handlePrevStep();
      } else if (key === 'r') {
        // Reset
        e.preventDefault();
        setIsPlaying(false);
        handleResetSim();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, primStepIdx, kruskalStepIdx, primSteps, kruskalSteps]);

  const handleNextStep = () => {
    playSound('click');
    if (activeTab === 'prim') {
      if (primStepIdx + 1 < primSteps.length) setPrimStepIdx(prev => prev + 1);
    } else {
      if (kruskalStepIdx + 1 < kruskalSteps.length) setKruskalStepIdx(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    playSound('click');
    if (activeTab === 'prim') {
      if (primStepIdx > 0) setPrimStepIdx(prev => prev - 1);
    } else {
      if (kruskalStepIdx > 0) setKruskalStepIdx(prev => prev - 1);
    }
  };

  const handleResetSim = () => {
    playSound('click');
    setIsPlaying(false);
    if (activeTab === 'prim') {
      setPrimStepIdx(0);
    } else {
      setKruskalStepIdx(0);
    }
  };

  // Generate HTML Report print ready
  const printMstReport = () => {
    const isPrim = activeTab === 'prim';
    const finalStep = isPrim 
      ? primSteps[primSteps.length - 1] 
      : kruskalSteps[kruskalSteps.length - 1];

    if (!finalStep) return;

    const reportWindow = window.open("", "_blank");
    if (!reportWindow) {
      alert("Popup blocker prevented report. Please allow popups for this portal.");
      return;
    }

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MST Lab Diagnostic Report</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #334155; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
          h1 { color: #1e293b; margin-bottom: 5px; }
          .subtitle { color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .metric { font-size: 14px; font-weight: bold; color: #475569; }
          .val { font-size: 24px; color: #2563eb; font-weight: 800; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; }
          td { border-bottom: 1px solid #e2e8f0; padding: 12px; font-size: 13px; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .badge-prim { background: #dbeafe; color: #1e40af; }
          .badge-krus { background: #f3e8ff; color: #6b21a8; }
          .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print {
            body { margin: 0; padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="subtitle">Data Structures Laboratory Assignment</span>
          <h1>Minimum Spanning Tree Diagnostic Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>

        <div class="summary-card">
          <div class="grid">
            <div>
              <div class="metric">Algorithm Executed</div>
              <div class="val">
                <span class="badge ${isPrim ? 'badge-prim' : 'badge-krus'}">${isPrim ? "Prim's Algorithm" : "Kruskal's Algorithm"}</span>
              </div>
            </div>
            <div>
              <div class="metric">Total Minimum Cost</div>
              <div class="val">${finalStep.totalCost}</div>
            </div>
          </div>
        </div>

        <h3>Active Graph Metadata</h3>
        <p>This spanning tree connects all <strong>${vertices.length}</strong> nodes utilizing <strong>${vertices.length - 1}</strong> optimal weight links.</p>

        <h3>Final MST Edge Connections</h3>
        <table>
          <thead>
            <tr>
              <th>Edge ID</th>
              <th>Endpoints</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            ${edges
              .filter(e => finalStep.mstEdges.includes(e.id))
              .map(e => `
                <tr>
                  <td><code>${e.id}</code></td>
                  <td><strong>${e.source} ↔ ${e.target}</strong></td>
                  <td>${e.weight}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Department of Computer Engineering &bull; Laboratory Learning Systems</p>
          <button onclick="window.print()" style="margin-top: 15px; padding: 10px 20px; background: #1e293b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Print Report</button>
        </div>
      </body>
      </html>
    `;

    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
  };

  // Render variables for Active step
  const activePrimStep = primSteps[primStepIdx];
  const activeKrusStep = kruskalSteps[kruskalStepIdx];

  const currentVisited = activeTab === 'prim' && activePrimStep ? activePrimStep.visited : [];
  const currentMstEdges = activeTab === 'prim' 
    ? (activePrimStep ? activePrimStep.mstEdges : []) 
    : (activeKrusStep ? activeKrusStep.mstEdges : []);
  const currentCandidateEdges = activeTab === 'prim' && activePrimStep ? activePrimStep.candidateEdges.map(c => c.edgeId) : [];
  const currentRejectedEdges = activeTab === 'kruskal' && activeKrusStep ? activeKrusStep.rejectedEdges : [];

  const currentNodeId = activeTab === 'prim' && activePrimStep ? activePrimStep.currentNodeId : null;
  const currentEdgeId = activeTab === 'kruskal' && activeKrusStep ? activeKrusStep.currentEdgeId : null;  return (
    <div className="space-y-8">
      {/* Simulation Selector Tab Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-2 border border-slate-200 rounded-lg">
        <div className="flex bg-slate-200/80 rounded-full p-1 w-full sm:w-auto">
          <button
            onClick={() => { setActiveTab('prim'); setIsPlaying(false); }}
            className={`flex-1 sm:flex-none px-6 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'prim' 
                ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> PRIM'S ALGORITHM
          </button>
          <button
            onClick={() => { setActiveTab('kruskal'); setIsPlaying(false); }}
            className={`flex-1 sm:flex-none px-6 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'kruskal' 
                ? "bg-purple-600 text-white shadow-md shadow-purple-100" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FastForward className="w-3.5 h-3.5" /> KRUSKAL'S ALGORITHM
          </button>
        </div>

        {/* Global Toolbar */}
        <div className="flex gap-3 items-center justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
          <div className="text-slate-400 text-[10px] font-mono hidden md:block">
            SHORTCUTS: <kbd className="px-1.5 py-0.5 bg-slate-200 rounded border font-sans">N</kbd> Next &bull; <kbd className="px-1.5 py-0.5 bg-slate-200 rounded border font-sans">P</kbd> Prev
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded border transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                  : 'bg-slate-200 border-slate-350 text-slate-400'
              }`}
              title={soundEnabled ? "Disable audio responses" : "Enable sound effects"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Print Report */}
            <button
              onClick={printMstReport}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Generate laboratory PDF report"
            >
              <FileText className="w-3.5 h-3.5" /> LAB VIVA REPORT
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Visualizer Canvas (span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-500" />
              Visualizer Screen
            </h4>

            <GraphVisualizer
              vertices={vertices}
              edges={edges}
              onChange={onGraphChange}
              visitedNodes={currentVisited}
              currentNodeId={currentNodeId}
              mstEdges={currentMstEdges}
              candidateEdges={currentCandidateEdges}
              rejectedEdges={currentRejectedEdges}
              currentEdgeId={currentEdgeId}
              isSimulationActive={true}
            />
          </div>

          {/* PLAYBACK CONTROLS */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrevStep}
                disabled={activeTab === 'prim' ? primStepIdx === 0 : kruskalStepIdx === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2.5 px-4 rounded text-xs font-bold text-slate-700 disabled:opacity-50 transition-colors cursor-pointer"
                title="Previous step"
              >
                <SkipBack className="w-3.5 h-3.5" /> Prev
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-5 rounded text-xs font-bold text-white transition-colors cursor-pointer shadow-xs ${
                  isPlaying ? "bg-amber-600 hover:bg-amber-500" : "bg-slate-800 hover:bg-slate-700"
                }`}
                title={isPlaying ? "Pause simulation" : "Auto-play simulation"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={handleNextStep}
                disabled={activeTab === 'prim' ? primStepIdx + 1 >= primSteps.length : kruskalStepIdx + 1 >= kruskalSteps.length}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2.5 px-5 rounded text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer shadow-md shadow-blue-100 disabled:opacity-50"
                title="Next step"
              >
                Next <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetSim}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2.5 px-4 rounded text-xs font-bold text-slate-650 transition-colors cursor-pointer"
                title="Restart simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Playback Speed Slider */}
            <div className="flex-1 sm:flex-initial flex flex-col gap-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Animation Speed</span>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="250"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                  className="w-24 accent-blue-600 cursor-pointer"
                />
                <span className="font-mono text-[10px] text-slate-500">{(playbackSpeed / 1000).toFixed(2)}s</span>
              </div>
            </div>

            {/* Progress Step Counter Badge */}
            <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded text-blue-700 text-xs font-bold uppercase tracking-wider">
              Step {activeTab === 'prim' ? primStepIdx + 1 : kruskalStepIdx + 1} / {activeTab === 'prim' ? primSteps.length : kruskalSteps.length}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Step Explanations & Highlighting Panel (span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* EXPLANATION PANEL */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-lg p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="flex items-center gap-2 mb-3 text-purple-450">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">Step Explanation</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab === 'prim' ? primStepIdx : kruskalStepIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <h4 className="text-sm leading-relaxed text-slate-200 font-medium">
                  {activeTab === 'prim' ? activePrimStep?.explanation : activeKrusStep?.explanation}
                </h4>

                <div className="p-3 bg-slate-800 rounded border-l-2 border-purple-500 text-[11px]">
                  <span className="font-bold text-purple-300 block uppercase tracking-wider mb-1">Reasoning Analysis</span>
                  <p className="leading-relaxed text-slate-400">{activeTab === 'prim' ? activePrimStep?.reason : activeKrusStep?.reason}</p>
                </div>

                {/* Live Variables & Complexity Trackers */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 border border-slate-800 rounded bg-slate-950/40">
                    <span className="block text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">Current MST Cost</span>
                    <span className="text-lg font-extrabold text-blue-400">
                      {activeTab === 'prim' ? activePrimStep?.totalCost : activeKrusStep?.totalCost}
                    </span>
                  </div>
                  <div className="p-3 border border-slate-800 rounded bg-slate-950/40">
                    <span className="block text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">Active Complexities</span>
                    <span className="text-[11px] font-bold font-mono text-purple-300 block mt-1">
                      {activeTab === 'prim' ? "Time: O(E log V)" : "Time: O(E log E)"}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono block">Space: O(V + E)</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DYNAMIC VARIABLES (Priority Queue for Prim, Disjoint Sets for Kruskal) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            {activeTab === 'prim' ? (
              // Prim variables
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Priority Queue (Min Key)</h4>
                
                <div className="flex flex-wrap gap-1.5">
                  {activePrimStep?.priorityQueue.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all ${
                        idx === 0 
                          ? "bg-blue-50 border-blue-200 text-blue-800 font-bold scale-102 ring-1 ring-blue-300" 
                          : "bg-slate-50 border-slate-200 text-slate-600 opacity-70"
                      }`}
                    >
                      <span>{item.edgeLabel}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${idx === 0 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-250 text-slate-600'}`}>
                        {item.weight}
                      </span>
                    </div>
                  ))}
                  {(!activePrimStep || activePrimStep.priorityQueue.length === 0) && (
                    <span className="text-xs text-slate-400">PQ is empty.</span>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Pointer Array</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {vertices.map(v => {
                      const parentNode = activePrimStep?.parent[v.id];
                      return (
                        <div key={v.id} className="p-2 border border-slate-200 rounded bg-slate-50 text-center">
                          <span className="block text-[9px] text-slate-400 font-bold font-mono">{v.id}</span>
                          <span className="text-xs font-bold font-mono text-slate-750">{parentNode || '-'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Kruskal variables
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disjoint Set Components</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeKrusStep?.disjointSets.map((set, sIdx) => (
                      <div key={sIdx} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-700 font-mono">
                        {`{ ${set.join(', ')} }`}
                      </div>
                    ))}
                    {(!activeKrusStep || activeKrusStep.disjointSets.length === 0) && (
                      <span className="text-xs text-slate-400">No active disjoint sets.</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DSU Parent Pointers</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {vertices.map(v => {
                      const parentNode = activeKrusStep?.parent[v.id];
                      return (
                        <div key={v.id} className="p-2 border border-slate-200 rounded bg-slate-50 text-center">
                          <span className="block text-[9px] text-slate-400 font-bold font-mono">{v.id}</span>
                          <span className="text-xs font-bold font-mono text-slate-750">{parentNode || v.id}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PSEUDOCODE HIGHLIGHTER */}
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 border border-slate-800 shadow-md font-mono text-[11px] leading-relaxed">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-2">
              Pseudocode Line Tracker
            </h4>
            
            <div className="space-y-1 leading-relaxed">
              {(activeTab === 'prim' ? PRIM_PSEUDO_CODE : KRUSKAL_PSEUDO_CODE).map((line, idx) => {
                const isActive = activeTab === 'prim' 
                  ? activePrimStep?.pseudoLine === idx 
                  : activeKrusStep?.pseudoLine === idx;

                return (
                  <div 
                    key={idx} 
                    className={`p-1 rounded transition-all ${
                      isActive 
                        ? "bg-blue-600/20 text-blue-300 border-l-2 border-blue-500 font-bold pl-2" 
                        : "text-slate-450"
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
