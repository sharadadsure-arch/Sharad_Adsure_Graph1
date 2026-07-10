import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MCQS, PRACTICE_PROBLEMS, EXERCISES } from '../data';
import { HelpCircle, ChevronRight, CheckCircle2, XCircle, RotateCcw, Award, Lightbulb, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { MCQQuestion } from '../types';

export default function PracticeAndQuiz() {
  // Quiz states
  const [randomizedQuestions, setRandomizedQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setFinished] = useState(false);

  // Practice states
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});

  // Fill in blanks states
  const [blankAnswers, setBlankAnswers] = useState<Record<number, string>>({});
  const [blankChecked, setBlankChecked] = useState<Record<number, boolean>>({});

  // True/False states
  const [selectedTF, setSelectedTF] = useState<Record<number, boolean | null>>({});
  const [tfSubmitted, setTfSubmitted] = useState<Record<number, boolean>>({});

  // Match following states
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchMessage, setMatchMessage] = useState<string | null>(null);

  // Shuffle quiz questions on mount or reset
  const initQuiz = () => {
    const shuffled = [...MCQS].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setFinished(false);
  };

  useEffect(() => {
    initQuiz();
  }, []);

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const submitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === randomizedQuestions[currentQuestionIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex + 1 < randomizedQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  // Match the following click logic
  const handleLeftClick = (id: string) => {
    if (matchedPairs[id]) {
      // already matched, clear it
      const updated = { ...matchedPairs };
      delete updated[id];
      setMatchedPairs(updated);
      return;
    }
    setSelectedLeft(id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (rightText: string) => {
    // Check if rightText is already matched
    const isAlreadyMatched = Object.values(matchedPairs).includes(rightText);
    if (isAlreadyMatched) {
      // Find left and delete
      const updated = { ...matchedPairs };
      const leftKey = Object.keys(updated).find(key => updated[key] === rightText);
      if (leftKey) delete updated[leftKey];
      setMatchedPairs(updated);
      return;
    }

    setSelectedRight(rightText);
    if (selectedLeft) {
      checkMatch(selectedLeft, rightText);
    }
  };

  const checkMatch = (leftId: string, rightText: string) => {
    const pair = EXERCISES.matchFollowing.find(p => p.id === leftId);
    if (pair && pair.right === rightText) {
      setMatchedPairs(prev => ({ ...prev, [leftId]: rightText }));
      setMatchMessage("✓ Correct Match!");
    } else {
      setMatchMessage("✗ Incorrect Match, try again.");
    }
    setSelectedLeft(null);
    setSelectedRight(null);
    setTimeout(() => setMatchMessage(null), 2000);
  };

  const resetMatch = () => {
    setMatchedPairs({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchMessage(null);
  };

  return (
    <div id="practice-quiz-panel" className="space-y-16">
      {/* 1. INTERACTIVE QUIZ */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 lg:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-slate-100 font-mono text-[100px] leading-none select-none font-black opacity-5 pointer-events-none">
          QUIZ
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase font-mono">Module 4 Evaluation</span>
              <h3 className="text-xl font-black uppercase tracking-wider text-slate-800">Minimum Spanning Tree MCQ Quiz</h3>
            </div>
            {!quizFinished && randomizedQuestions.length > 0 && (
              <div className="px-3 py-1 bg-white border border-slate-250 rounded font-mono text-xs text-slate-500 shadow-sm">
                Question <span className="font-bold text-slate-850">{currentQuestionIndex + 1}</span> of <span className="font-bold text-slate-850">{randomizedQuestions.length}</span>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!quizFinished && randomizedQuestions.length > 0 ? (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Question Box */}
                <h4 className="text-base font-bold text-slate-850 leading-relaxed">
                  {randomizedQuestions[currentQuestionIndex].question}
                </h4>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-2.5">
                  {randomizedQuestions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === randomizedQuestions[currentQuestionIndex].correctIndex;
                    
                    let cardBg = "bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50/50";
                    let textStyle = "text-slate-750";

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        cardBg = "bg-emerald-50 border-emerald-300 text-emerald-800";
                        textStyle = "text-emerald-900 font-bold";
                      } else if (isSelected) {
                        cardBg = "bg-rose-50 border-rose-300 text-rose-800";
                        textStyle = "text-rose-900 font-bold";
                      } else {
                        cardBg = "bg-white border-slate-100 opacity-60";
                      }
                    } else if (isSelected) {
                      cardBg = "bg-blue-50 border-blue-400";
                      textStyle = "text-blue-900 font-bold";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-4 rounded border text-xs transition-all duration-200 flex items-start gap-4 cursor-pointer ${cardBg}`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5 ${
                          isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 text-slate-400 bg-slate-50"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <div className={`flex-1 ${textStyle}`}>{option}</div>
                        {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                        {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation and Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <div className="flex-1">
                    {isAnswerSubmitted && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-600 leading-relaxed"
                      >
                        <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1 text-[11px] text-blue-600 uppercase tracking-wider">
                          <AlertCircle className="w-3.5 h-3.5" /> Explanation
                        </span>
                        {randomizedQuestions[currentQuestionIndex].explanation}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end shrink-0">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={submitAnswer}
                        disabled={selectedOption === null}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-55 disabled:cursor-not-allowed text-white font-bold rounded text-xs transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
                      >
                        {currentQuestionIndex + 1 === randomizedQuestions.length ? "Finish Quiz" : "Next Question"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              // Quiz Finished Screen
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 max-w-md mx-auto"
              >
                <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center mx-auto text-blue-600 shadow-sm">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-slate-855">Quiz Completed!</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    You've answered all questions. Here is your final diagnostic report card.
                  </p>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded flex justify-around items-center divide-x divide-slate-150 shadow-sm">
                  <div className="text-center flex-1">
                    <span className="block text-3xl font-extrabold text-slate-800">{score} / {randomizedQuestions.length}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest font-bold">Score</span>
                  </div>
                  <div className="text-center flex-1">
                    <span className="block text-3xl font-extrabold text-blue-600">
                      {randomizedQuestions.length > 0 ? Math.round((score / randomizedQuestions.length) * 100) : 0}%
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest font-bold">Percentage</span>
                  </div>
                </div>

                <button
                  onClick={initQuiz}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs flex items-center gap-2 mx-auto transition-colors shadow-md cursor-pointer uppercase tracking-wider"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart Quiz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. PRACTICE PROBLEMS */}
      <div className="space-y-8">
        <div className="space-y-2 text-center lg:text-left">
          <h3 className="text-2xl font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 justify-center lg:justify-start">
            <BookOpen className="w-5 h-5 text-purple-500" />
            LAB ASSIGNMENT PROBLEMS
          </h3>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            Test your understanding with structured, exam-level lab problems categorized by difficulty level.
          </p>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded border border-slate-200 w-fit mx-auto lg:mx-0">
          {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedDifficulty === diff ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Problems Render */}
        <div className="grid grid-cols-1 gap-6">
          {PRACTICE_PROBLEMS.filter(p => p.difficulty === selectedDifficulty).map(problem => (
            <motion.div
              key={problem.id}
              layout
              className="bg-white border border-slate-200 rounded p-6 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h4 className="text-base font-bold text-slate-850 uppercase tracking-wide">{problem.title}</h4>
                <span className={`px-2.5 py-1 text-[9px] font-mono tracking-widest font-bold uppercase rounded ${
                  problem.difficulty === 'Easy' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                  problem.difficulty === 'Medium' ? "bg-amber-50 text-amber-700 border border-amber-100" :
                  "bg-rose-50 text-rose-700 border border-rose-100"
                }`}>
                  {problem.difficulty}
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-150 rounded text-xs text-slate-600 font-medium whitespace-pre-line leading-relaxed select-text">
                  {problem.problem}
                </div>
                <div className="bg-slate-50/50 p-3 rounded border border-slate-150">
                  <span className="block text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">Input / Parameters</span>
                  <p className="text-xs font-mono text-slate-600 mt-1 select-text">{problem.input}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setShowHint(prev => ({ ...prev, [problem.id]: !prev[problem.id] }))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-250 text-slate-700 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 uppercase tracking-wider"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  {showHint[problem.id] ? "Hide Hint" : "Reveal Hint"}
                </button>
                <button
                  onClick={() => setShowSolution(prev => ({ ...prev, [problem.id]: !prev[problem.id] }))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer border border-slate-850 uppercase tracking-wider"
                >
                  {showSolution[problem.id] ? "Hide Solution" : "Verify Solution"}
                </button>
              </div>

              {/* Hint Content */}
              <AnimatePresence>
                {showHint[problem.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-amber-50/40 border border-amber-100 rounded overflow-hidden"
                  >
                    <span className="block text-xs font-bold text-amber-800 mb-1 uppercase tracking-wider">Clue/Hint</span>
                    <p className="text-xs text-amber-900/85 leading-relaxed">{problem.hint}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Solution Content */}
              <AnimatePresence>
                {showSolution[problem.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-blue-50/40 border border-blue-100 rounded space-y-2 overflow-hidden"
                  >
                    <span className="block text-xs font-bold text-blue-800 uppercase tracking-wider">Ideal Verification Steps & Correct Output</span>
                    <div className="text-xs text-blue-900/85 leading-relaxed whitespace-pre-line select-text">
                      <div className="p-3 bg-white/70 border border-blue-100 rounded mb-2 font-mono text-[11px]">
                        <strong>Expected Output:</strong><br />
                        {problem.expectedOutput}
                      </div>
                      <strong>Detailed Proof:</strong><br />
                      {problem.solution}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. STUDENT EXERCISES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 border-t border-slate-200">
        
        {/* Fill in Blanks */}
        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-sm" />
            EXERCISE 1: FILL IN THE BLANKS
          </h4>
          
          <div className="space-y-4">
            {EXERCISES.fillBlanks.map((item) => {
              const inputVal = blankAnswers[item.id] || '';
              const isChecked = blankChecked[item.id];
              const isCorrect = inputVal.trim().toLowerCase() === item.answer.toLowerCase();

              return (
                <div key={item.id} className="bg-slate-50 border border-slate-200 p-4 rounded space-y-3">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    <strong>Q{item.id}.</strong> {item.question}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type answer here..."
                      value={inputVal}
                      onChange={(e) => {
                        setBlankAnswers(prev => ({ ...prev, [item.id]: e.target.value }));
                        setBlankChecked(prev => ({ ...prev, [item.id]: false }));
                      }}
                      className="px-3 py-1.5 text-xs border border-slate-200 bg-white rounded focus:ring-1 focus:ring-blue-500 focus:outline-none flex-1 font-mono placeholder-slate-450 text-slate-800"
                    />
                    <button
                      onClick={() => setBlankChecked(prev => ({ ...prev, [item.id]: true }))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold cursor-pointer uppercase tracking-wider"
                    >
                      Check
                    </button>
                  </div>
                  {isChecked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-xs flex items-center gap-1.5 font-bold ${
                        isCorrect ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isCorrect ? (
                        <>✓ Correct! "{item.answer}" fits perfectly.</>
                      ) : (
                        <>✗ Try again. Hint: check spelling, symbols, or casing.</>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Match the following & True/False */}
        <div className="space-y-8">
          {/* True / False */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-sm" />
              EXERCISE 2: TRUE OR FALSE
            </h4>

            <div className="space-y-4">
              {EXERCISES.trueFalse.map((tf) => {
                const answer = selectedTF[tf.id];
                const submitted = tfSubmitted[tf.id];
                const isCorrect = answer === tf.isTrue;

                return (
                  <div key={tf.id} className="bg-slate-50 border border-slate-200 p-4 rounded space-y-3">
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      <strong>Statement:</strong> "{tf.statement}"
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTF(prev => ({ ...prev, [tf.id]: true }));
                          setTfSubmitted(prev => ({ ...prev, [tf.id]: true }));
                        }}
                        className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          answer === true
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        True
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTF(prev => ({ ...prev, [tf.id]: false }));
                          setTfSubmitted(prev => ({ ...prev, [tf.id]: true }));
                        }}
                        className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          answer === false
                            ? "bg-rose-600 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        False
                      </button>
                    </div>

                    {submitted && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-650 leading-relaxed"
                      >
                        <span className={`font-bold block mb-1 text-[11px] uppercase tracking-wider ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                          {isCorrect ? "✓ Correct Answer!" : "✗ Incorrect Answer."}
                        </span>
                        {tf.explanation}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Match the Following Click Matcher */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-sm" />
                EXERCISE 3: MATCH THE FOLLOWING
              </h4>
              <button
                onClick={resetMatch}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 bg-white"
                title="Reset matches"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Click a key on the left, then select its matching definition on the right to link them together!
            </p>

            <div className="p-5 border border-slate-200 rounded bg-slate-50/50 space-y-4 relative">
              {matchMessage && (
                <div className={`absolute top-2 right-2 px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                  matchMessage.startsWith("✓") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}>
                  {matchMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Left Side (Keys) */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase text-center">Concepts</span>
                  {EXERCISES.matchFollowing.map((pair) => {
                    const isMatched = !!matchedPairs[pair.id];
                    const isSelected = selectedLeft === pair.id;

                    return (
                      <button
                        key={pair.id}
                        onClick={() => handleLeftClick(pair.id)}
                        className={`w-full p-3 rounded border text-xs text-left font-bold transition-all cursor-pointer ${
                          isMatched
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                            : isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50"
                        }`}
                      >
                        {pair.left}
                      </button>
                    );
                  })}
                </div>

                {/* Right Side (Definitions Shuffled) */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase text-center">Definitions</span>
                  {[...EXERCISES.matchFollowing]
                    .sort((a, b) => a.right.localeCompare(b.right)) // Sort static right values alphabetically
                    .map((pair, index) => {
                      const associatedLeftKey = Object.keys(matchedPairs).find(key => matchedPairs[key] === pair.right);
                      const isMatched = !!associatedLeftKey;
                      const isSelected = selectedRight === pair.right;

                      return (
                        <button
                          key={index}
                          onClick={() => handleRightClick(pair.right)}
                          className={`w-full p-3 rounded border text-xs text-left transition-all cursor-pointer ${
                            isMatched
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                              : isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          {pair.right}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Match Counter */}
              <div className="pt-3 border-t border-slate-200 text-center text-xs font-bold text-slate-600">
                MATCHED PAIRS: <span className="font-bold text-emerald-600">{Object.keys(matchedPairs).length}</span> / {EXERCISES.matchFollowing.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
