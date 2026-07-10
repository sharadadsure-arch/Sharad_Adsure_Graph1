export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

export interface PrimStep {
  visited: string[];
  mstEdges: string[];
  candidateEdges: { edgeId: string; weight: number }[];
  minEdgeId: string | null;
  currentNodeId: string | null;
  priorityQueue: { edgeLabel: string; weight: number }[];
  parent: Record<string, string | null>;
  totalCost: number;
  explanation: string;
  reason: string;
  pseudoLine: number;
  stepNumber: number;
}

export interface KruskalStep {
  mstEdges: string[];
  rejectedEdges: string[];
  currentEdgeId: string | null;
  sortedEdgesState: { edgeId: string; status: 'pending' | 'selected' | 'rejected' | 'current' }[];
  parent: Record<string, string>;
  rank: Record<string, number>;
  disjointSets: string[][];
  cycleDetected: boolean;
  totalCost: number;
  explanation: string;
  reason: string;
  pseudoLine: number;
  stepNumber: number;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeProblem {
  id: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  problem: string;
  input: string;
  expectedOutput: string;
  hint: string;
  solution: string;
}

export interface VivaQuestion {
  id: number;
  question: string;
  answer: string;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface StudentExercisesData {
  fillBlanks: { id: number; question: string; answer: string; displayAnswer?: boolean }[];
  trueFalse: { id: number; statement: string; isTrue: boolean; explanation: string }[];
  matchFollowing: MatchPair[];
}
