"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

// Terminal log line definition
interface LogLine {
  text: string;
  type: "input" | "system" | "success" | "error" | "info" | "header";
}

interface OntologyNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "root" | "domain" | "concept";
  description: string;
}

interface OntologyLink {
  source: string;
  target: string;
  label: string;
}

const ontologyNodes: OntologyNode[] = [
  { id: "kai", label: "Kai Nadezkin", x: 400, y: 220, type: "root", description: "Systems Researcher & Automation Engineer. Focused on the intersection of cloud native architectures, declarative configurations, quantum computing, and bioinformatics." },
  { id: "declarative", label: "Declarative Systems", x: 180, y: 150, type: "domain", description: "Designing idempotent configurations and configuration-as-code automation workflows." },
  { id: "cloud", label: "Cloud Native", x: 620, y: 150, type: "domain", description: "Architecting resilient, container-orchestrated cluster fabrics and custom lifecycle operators." },
  { id: "semantic", label: "Semantic Networks", x: 400, y: 350, type: "domain", description: "Leveraging semantic vectors, cognitive graph indices, and AI for software artifact dependency trace-reconstructions." },
  { id: "science", label: "Computational Science", x: 400, y: 85, type: "domain", description: "Applying computational methods to model physical phenomena, gene sequences, and complex simulations." },
  { id: "iac", label: "IaC Playbooks", x: 80, y: 80, type: "concept", description: "Idempotent playbook setups to automate distributed cluster configurations." },
  { id: "operators", label: "Kubernetes Operators", x: 720, y: 80, type: "concept", description: "Custom controllers managing containerized application workloads dynamically." },
  { id: "graphrag", label: "GraphRAG Engines", x: 240, y: 390, type: "concept", description: "Graph-based Retrieval-Augmented Generation parsing text matrices into linked graph nodes." },
  { id: "traceability", label: "Trace Link Recovery", x: 560, y: 390, type: "concept", description: "Automatically mapping links and dependencies between requirement files and software codebases." },
  { id: "agents", label: "Agent Orchestration", x: 250, y: 260, type: "concept", description: "Orchestrating autonomous AI agents for complex multi-step workflow automation, bridging declarative loops with semantic understanding." },
  { id: "quantum", label: "Quantum Computing", x: 550, y: 260, type: "concept", description: "Exploring quantum algorithm design, circuit simulation, simulating physical systems, and actively participating in open-source quantum software communities." },
  { id: "bioinformatics", label: "Bioinformatics", x: 300, y: 60, type: "concept", description: "Using computational methods, sequence alignment algorithms, and structural biology tools to analyze complex biological systems." },
  { id: "bioalgorithms", label: "Biological Algorithms", x: 500, y: 60, type: "concept", description: "Developing algorithmic models inspired by biological processes, such as genetic algorithms, evolutionary computing, and cellular automata." }
];

const ontologyLinks: OntologyLink[] = [
  { source: "kai", target: "declarative", label: "specializesIn" },
  { source: "kai", target: "cloud", label: "orchestrates" },
  { source: "kai", target: "semantic", label: "researches" },
  { source: "kai", target: "science", label: "researches" },
  { source: "kai", target: "quantum", label: "participatesIn" },
  { source: "declarative", target: "iac", label: "specifies" },
  { source: "cloud", target: "operators", label: "deploys" },
  { source: "semantic", target: "graphrag", label: "applies" },
  { source: "semantic", target: "traceability", label: "executes" },
  { source: "kai", target: "agents", label: "orchestrates" },
  { source: "declarative", target: "agents", label: "bridges" },
  { source: "semantic", target: "agents", label: "powers" },
  { source: "science", target: "bioinformatics", label: "appliesTo" },
  { source: "science", target: "bioalgorithms", label: "models" },
  { source: "quantum", target: "bioalgorithms", label: "accelerates" },
  { source: "bioinformatics", target: "bioalgorithms", label: "intersects" }
];

export default function Home() {
  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<LogLine[]>([
    { text: "SYSTEM PORTFOLIO NODE [v2.6.0] ONLINE", type: "header" },
    { text: "INITIALIZING ORBITAL INTERNET PROTOCOL...", type: "system" },
    { text: "ESTABLISHING SHIELDED SATELLITE LINK TO HOST...", type: "system" },
    { text: "SECURE END-TO-END SYSTEM ENCRYPTED", type: "success" },
    { text: "WELCOME TO THE ACTIVE RADAR OF KAI NADEZKIN.", type: "info" },
    { text: "Enter 'help' to review directory of diagnostic directives.", type: "info" },
  ]);
  const [inputValue, setInputValue] = useState("");
  
  // Ontology graph state
  const [nodes, setNodes] = useState<OntologyNode[]>(ontologyNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("kai");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [graphFilter, setGraphFilter] = useState<'all' | 'root' | 'domain' | 'concept'>('all');
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const hoveredNode = hoveredNodeId ? nodes.find(n => n.id === hoveredNodeId) : null;

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    setSelectedNodeId(nodeId);
    setDraggedNodeId(nodeId);
    triggerWidgetCommand(`lookup ${nodeId}`, false);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * 450;
    const boundedX = Math.max(25, Math.min(775, x));
    const boundedY = Math.max(25, Math.min(425, y));
    setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.round(boundedX), y: Math.round(boundedY) } : n));
  };

  const handleTouchStart = (nodeId: string, e: React.TouchEvent) => {
    setSelectedNodeId(nodeId);
    setDraggedNodeId(nodeId);
    triggerWidgetCommand(`lookup ${nodeId}`, false);
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedNodeId || !svgRef.current || e.touches.length === 0) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 800;
    const y = ((touch.clientY - rect.top) / rect.height) * 450;
    const boundedX = Math.max(25, Math.min(775, x));
    const boundedY = Math.max(25, Math.min(425, y));
    setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.round(boundedX), y: Math.round(boundedY) } : n));
  };

  const handleMouseUpOrLeave = () => {
    setDraggedNodeId(null);
  };

  const resetLayout = () => {
    setNodes(ontologyNodes);
  };

  
  // Real-time HUD stats
  const [timeString, setTimeString] = useState("");
  const [uptime, setUptime] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memUsage, setMemUsage] = useState(42);

  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Time & System simulation loops
  useEffect(() => {
    // Current Local Clock (Europe/Berlin representation or browser local)
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString("en-GB", { hour12: false }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Live Uptime counter
    const startTime = Date.now();
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // CPU/Memory fluctuations
    const statsInterval = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(5, Math.min(prev + delta, 95));
      });
      setMemUsage((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1 to +1
        return Math.max(38, Math.min(prev + delta, 46));
      });
    }, 3000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(uptimeInterval);
      clearInterval(statsInterval);
    };
  }, []);

  // Scroll terminal on update (only scrolls the internal container, preventing page jumps)
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const focusTerminal = () => {
    terminalInputRef.current?.focus();
  };

  // Uptime formatter
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Command Parser
  const runCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const newLines: LogLine[] = [...terminalHistory, { text: `guest@nadezkin.de:~$ ${trimmed}`, type: "input" }];
    
    const args = trimmed.split(" ");
    const command = args[0].toLowerCase();
    const subArg = args.slice(1).join(" ").trim().toLowerCase();

    switch (command) {
      case "help":
        newLines.push(
          { text: "DIRECTORY OF AVAILABLE DIRECTIVES:", type: "header" },
          { text: "  about     - Output Kai's mission, background, and research nodes", type: "info" },
          { text: "  skills    - Print summary of active engineering research fields", type: "info" },
          { text: "  simulate  - Run GraphRAG semantic traceability link recovery engine", type: "info" },
          { text: "  thesis    - Display academic abstract for Kai's Master's research", type: "info" },
          { text: "  lookup    - Display ontology record for a graph node (e.g. lookup graphrag)", type: "info" },
          { text: "  contact   - Print active connection links and nodes", type: "info" },
          { text: "  clear     - Wipe console buffer stream", type: "info" }
        );
        break;

      case "about":
        newLines.push(
          { text: "USER LOG: KAI NADEZKIN", type: "header" },
          { text: "Role: Systems Researcher & Automation Engineer", type: "success" },
          { text: "Location Status: Redacted // Encrypted", type: "info" },
          { text: "Mission: Diving into the intersection of Cloud Native Infrastructure, AI-assisted Process Automation, and Scalable Enterprise Solutions.", type: "info" },
          { text: "Core Philosophy: Build scalable, modern, and customer-oriented IT solutions that eliminate friction and drive enterprise efficiency.", type: "info" }
        );
        break;

      case "skills":
        newLines.push(
          { text: "SYSTEM PARADIGMS & ACTIVE RESEARCH FIELDS", type: "header" },
          { text: "• DECLARATIVE CONFIGURATION & INFRASTRUCTURE AS CODE (IaC)", type: "success" },
          { text: "• CONTAINER ORCHESTRATION & RESILIENT DISTRIBUTED FABRICS", type: "info" },
          { text: "• COGNITIVE AUTOMATION & AGENTIC AI WORKFLOWS (GraphRAG & LLM Orchestration)", type: "info" },
          { text: "• APPLICATION LIFECYCLE ARCHITECTURE & ASSET TRACEABILITY", type: "success" },
          { text: "• SECURE LINUX ENTERPRISE ENVIRONMENT ENGINEERING", type: "info" }
        );
        break;

      case "simulate":
        newLines.push(
          { text: "GraphRAG SEMANTIC LINK ENGINE ACTIVATED", type: "header" },
          { text: "[1/3] SCANNING ENGINEERING ARTIFACTS...", type: "system" },
          { text: "  - Loaded 142 requirement specifications", type: "info" },
          { text: "[2/3] COMPUTING COMMUNITY VECTOR RELATIONSHIPS...", type: "system" },
          { text: "  - Traversing entity graph mappings...", type: "info" },
          { text: "[3/3] EXECUTING TRACE LINK ALIGNMENT...", type: "system" },
          { text: "✓ TRACEABILITY COGNITIVE GRAPH ALIGNED SUCCESSFULLY.", type: "success" }
        );
        break;

      case "thesis":
        newLines.push(
          { text: "ACADEMIC MEMO: MASTER'S THESIS RESEARCH", type: "header" },
          { text: "Focus: Trace Link Recovery in Software Projects using GraphRAG.", type: "success" },
          { text: "Abstract: Leveraged Graph-based Retrieval-Augmented Generation (GraphRAG) and semantic knowledge graphs to recover traceability links across heterogeneous software engineering artifacts, automating dependency mappings.", type: "info" }
        );
        break;

      case "contact":
        newLines.push(
          { text: "SECURE COM CHANNELS", type: "header" },
          { text: "  Email:    kai@nadezkin.de (mailto:kai@nadezkin.de)", type: "info" },
          { text: "  GitHub:   https://github.com/Nadzin", type: "info" },
          { text: "  LinkedIn: https://www.linkedin.com/in/kai-nadezkin-870b8425a/", type: "info" }
        );
        break;

      case "lookup":
        if (!subArg) {
          newLines.push(
            { text: "DIRECTIVE LOOKUP REJECTED", type: "error" },
            { text: "Usage: lookup [node_id]. Example: lookup graphrag", type: "info" },
            { text: "Valid nodes: kai, declarative, cloud, semantic, science, iac, operators, graphrag, traceability, agents, quantum, bioinformatics, bioalgorithms", type: "info" }
          );
        } else {
          const foundNode = ontologyNodes.find(n => n.id === subArg || n.label.toLowerCase() === subArg);
          if (foundNode) {
            newLines.push(
              { text: `ONTOLOGY RELATIONSHIP MAP: ${foundNode.label.toUpperCase()}`, type: "header" },
              { text: `Node Type:   ${foundNode.type.toUpperCase()}`, type: "success" },
              { text: `Definition:  ${foundNode.description}`, type: "info" }
            );
          } else {
            newLines.push(
              { text: `ERROR: Ontology node '${subArg}' not indexed.`, type: "error" },
              { text: "Type 'help' for directory parameters.", type: "info" }
            );
          }
        }
        break;

      case "clear":
        setTerminalHistory([]);
        setInputValue("");
        return;

      default:
        newLines.push({
          text: `Command not recognized: '${trimmed}'. Type 'help' to audit system directives.`,
          type: "error",
        });
        break;
    }

    setTerminalHistory(newLines);
    setInputValue("");
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    runCommand(inputValue);
  };

  // Direct widget interaction
  const triggerWidgetCommand = (cmd: string, shouldFocus = true) => {
    runCommand(cmd);
    if (shouldFocus) {
      focusTerminal();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] font-sans text-zinc-300 selection:bg-cyan-500/20 selection:text-cyan-300 overflow-hidden cyber-grid">
      {/* CRT Overlay Effects */}
      <div className="scanlines" />
      <div className="scanline-bar" />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-6">
        
        {/* TOP STATUS BAR HUD */}
        <header className="flex flex-col gap-4 border border-cyan-500/20 bg-[#090d16]/75 backdrop-blur-md px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.05)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                KAI NADEZKIN <span className="text-xs px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-950/40 font-mono">NODE.ACTIVE</span>
              </h1>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">SYS.LOC // ENCRYPTED NODE</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono text-zinc-400 sm:grid-cols-4 md:text-right">
            <div>
              <span className="text-zinc-600">TIME.UTC:</span> <span className="text-cyan-400">{timeString || "00:00:00"}</span>
            </div>
            <div>
              <span className="text-zinc-600">SYS.UPTIME:</span> <span className="text-cyan-400">{formatUptime(uptime)}</span>
            </div>
            <div>
              <span className="text-zinc-600">CPU.LOAD:</span> <span className="text-emerald-400">{cpuUsage}%</span>
            </div>
            <div>
              <span className="text-zinc-600">MEM.USAGE:</span> <span className="text-violet-400">{memUsage}%</span>
            </div>
          </div>
        </header>

        {/* PORTRAIT PROFILE CARD & TERMINAL ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Portrait Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="cyber-card-cyan rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">
              {/* Corner Sci-Fi Decors */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/40" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/40" />
              
              {/* Radar Circle Abstract Orbital HUD Wrapper */}
              <div className="relative w-36 h-36 mb-4 rounded-full p-1 border border-cyan-500/30 flex items-center justify-center bg-cyan-950/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border border-cyan-400/20 animate-[spin_20s_linear_infinite_reverse]" />
                <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/10 animate-[ping_4s_ease-in-out_infinite]" />
                <div className="w-28 h-28 rounded-full overflow-hidden relative border border-cyan-500/30 flex items-center justify-center bg-[#070b13]">
                  {/* Glowing custom orbital core */}
                  <svg className="w-16 h-16 text-cyan-400 animate-[spin_10s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="3" fill="currentColor" className="animate-pulse" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={0.5} strokeDasharray="4 4" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={0.5} />
                  </svg>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white tracking-wide uppercase">Kai Nadezkin</h2>
              <p className="text-xs font-mono text-cyan-400 mt-1">Systems Researcher & Automation Engineer</p>
              
              <hr className="w-full my-4 border-cyan-500/15" />
              
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                "Optimizing architectures. Automating workflows. Bridging the gap between complex engineering and human-centric business solutions."
              </p>

              <div className="w-full grid grid-cols-2 gap-2 mt-5 font-mono text-left">
                <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-500/10 text-xs">
                  <div className="text-[10px] text-zinc-500">SECTOR</div>
                  <div className="text-cyan-400 font-semibold mt-0.5">Automation</div>
                </div>
                <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-500/10 text-xs">
                  <div className="text-[10px] text-zinc-500">ACADEMICS</div>
                  <div className="text-cyan-400 font-semibold mt-0.5">M.Sc. Student</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="cyber-card-cyan rounded-xl p-4 flex flex-col gap-2 relative">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest px-1">Interactive Diagnostic Console</h3>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button 
                  onClick={() => triggerWidgetCommand("about")}
                  className="flex items-center justify-between text-left px-3 py-2 rounded bg-cyan-950/35 border border-cyan-500/15 text-xs text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition duration-200 font-mono"
                >
                  <span>&gt; SYS.ABOUT</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-cyan-900/40 rounded text-cyan-400">RUN</span>
                </button>
                <button 
                  onClick={() => triggerWidgetCommand("skills")}
                  className="flex items-center justify-between text-left px-3 py-2 rounded bg-cyan-950/35 border border-cyan-500/15 text-xs text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition duration-200 font-mono"
                >
                  <span>&gt; SYS.SKILLS</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-cyan-900/40 rounded text-cyan-400">RUN</span>
                </button>
                <button 
                  onClick={() => triggerWidgetCommand("simulate")}
                  className="flex items-center justify-between text-left px-3 py-2 rounded bg-cyan-950/35 border border-cyan-500/15 text-xs text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition duration-200 font-mono"
                >
                  <span>&gt; SYS.SIMULATE</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-cyan-900/40 rounded text-cyan-400">RUN</span>
                </button>
                <button 
                  onClick={() => triggerWidgetCommand("thesis")}
                  className="flex items-center justify-between text-left px-3 py-2 rounded bg-cyan-950/35 border border-cyan-500/15 text-xs text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition duration-200 font-mono"
                >
                  <span>&gt; SYS.THESIS</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-cyan-900/40 rounded text-cyan-400">RUN</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Terminal Panel */}
          <div className="lg:col-span-8">
            <div 
              onClick={focusTerminal}
              className="w-full h-full min-h-[360px] lg:min-h-[460px] bg-[#050811]/90 border border-cyan-500/25 rounded-xl flex flex-col overflow-hidden font-mono text-xs shadow-[0_0_25px_rgba(6,182,212,0.08)] cursor-text"
            >
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#090d16] border-b border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[10px] text-zinc-500 ml-2 font-mono flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    CONSOLE@NADEZKIN.DE
                  </span>
                </div>
                <div className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">
                  SECURE_SHELL v2.4
                </div>
              </div>

              {/* Terminal Logs */}
              <div 
                ref={terminalScrollRef}
                className="flex-1 p-4 overflow-y-auto space-y-2 max-h-[380px] lg:max-h-[420px]"
              >
                {terminalHistory.map((line, idx) => {
                  let colorClass = "text-zinc-300";
                  if (line.type === "input") colorClass = "text-white font-semibold";
                  else if (line.type === "system") colorClass = "text-cyan-500/80";
                  else if (line.type === "success") colorClass = "text-emerald-400 font-medium";
                  else if (line.type === "error") colorClass = "text-red-400";
                  else if (line.type === "info") colorClass = "text-cyan-400";
                  else if (line.type === "header") colorClass = "text-cyan-400 font-extrabold uppercase border-b border-cyan-500/10 pb-1 flex justify-between";

                  return (
                    <div key={idx} className={`${colorClass} leading-relaxed break-words whitespace-pre-wrap`}>
                      {line.text}
                    </div>
                  );
                })}
              </div>

              {/* Terminal Command Input Form */}
              <form onSubmit={handleFormSubmit} className="p-3 bg-[#070b13] border-t border-cyan-500/15 flex items-center gap-2">
                <span className="text-cyan-400 font-semibold shrink-0">guest@nadezkin.de:~$</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter directive (e.g. 'help', 'skills', 'thesis')..."
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-zinc-700 focus:ring-0 focus:border-none p-0 text-xs selection:bg-cyan-500/40"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </form>
            </div>
          </div>
        </section>

        {/* CORE PILLARS GRID */}
        <section className="mt-4">
          <div className="flex items-center gap-2 mb-4 font-mono">
            <div className="w-1.5 h-4 bg-cyan-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">SYSTEM PILLARS // MISSION MATRIX</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Automator Card */}
            <div className="cyber-card-cyan rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">THE AUTOMATOR</h4>
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/10">SYS.IACOPS</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Specialized in <strong>Infrastructure as Code (IaC)</strong> and <strong>AI-assisted process automation</strong>. Building robust frameworks that speed up deployments, eradicate human errors, and scale seamlessly.
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>MODULE // STATUS</span>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider">Active</span>
              </div>
              <div className="w-full bg-cyan-950/40 h-1 rounded overflow-hidden border border-cyan-500/10">
                <div className="bg-cyan-500 h-full w-[95%] animate-[pulse_1.5s_infinite]" />
              </div>
            </div>

            {/* Cloud Native Architect Card */}
            <div className="cyber-card-violet rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-all" />
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded bg-violet-950/40 border border-violet-500/20 text-violet-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors">CLOUD NATIVE ARCHITECT</h4>
                  <span className="text-[9px] font-mono text-violet-400 bg-violet-950/40 px-1.5 py-0.5 rounded border border-violet-500/10">SYS.CONTAINER</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Navigating complex enterprise cloudscapes. Expert in <strong>Container Orchestration & Cloud Architectures</strong> (OpenShift, AWS), guaranteeing extreme availability, container isolation, and resiliency.
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>MODULE // STATUS</span>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider">Active</span>
              </div>
              <div className="w-full bg-violet-950/40 h-1 rounded overflow-hidden border border-violet-500/10">
                <div className="bg-violet-500 h-full w-[88%]" />
              </div>
            </div>

            {/* Technical Translator Card */}
            <div className="cyber-card-emerald rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">TECHNICAL TRANSLATOR</h4>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/10">SYS.PEER.COOP</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bridging complex research with practical engineering. Translating abstract systems research into robust technical blueprints, driving team enablement, and system scalability.
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>MODULE // STATUS</span>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider">Active</span>
              </div>
              <div className="w-full bg-emerald-950/40 h-1 rounded overflow-hidden border border-emerald-500/10">
                <div className="bg-emerald-500 h-full w-[90%]" />
              </div>
            </div>

          </div>
        </section>

        {/* ONTOLOGY NODE GRAPH // SEMANTIC MAP */}
        <section className="mt-2">
          <div className="flex items-center gap-2 mb-4 font-mono">
            <div className="w-1.5 h-4 bg-cyan-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">ONTOLOGY NODE GRAPH // INTERESTS & ALIGNMENT</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - SVG Node Graph Canvas */}
            <div className="lg:col-span-8 cyber-card-cyan rounded-xl p-5 relative overflow-hidden bg-[#050811]/70 min-h-[300px]">
              {/* Sci-Fi Decors */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/20" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/20" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/20" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/20" />
              
              {/* Graph Category Filters & Reset Layout */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 font-mono text-xs relative z-20">
                <div className="flex flex-wrap gap-2">
                  <span className="text-zinc-500 uppercase tracking-widest self-center mr-1">Filter Matrix:</span>
                  {(["all", "root", "domain", "concept"] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setGraphFilter(filter)}
                      className={`px-2 py-1 rounded border uppercase transition-all duration-200 cursor-pointer ${
                        graphFilter === filter
                          ? "border-cyan-500 bg-cyan-950/40 text-cyan-400 font-bold"
                          : "border-cyan-500/10 bg-transparent text-zinc-500 hover:text-zinc-300 hover:border-cyan-500/30"
                      }`}
                    >
                      {filter === "all" ? "All" : filter + "s"}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={resetLayout}
                  className="px-2 py-1 rounded border border-red-500/25 bg-red-950/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition duration-200 uppercase font-bold cursor-pointer"
                >
                  Reset Layout
                </button>
              </div>

              <div className="w-full aspect-[800/450] relative">
                <svg
                  ref={svgRef}
                  viewBox="0 0 800 450"
                  className="w-full h-full text-cyan-500/20 select-none touch-none"
                  fill="none"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUpOrLeave}
                >
                  <defs>
                    <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="rgba(6, 182, 212, 0.08)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#graph-grid)" />
                  
                  {/* Link lines */}
                  {ontologyLinks.map((link, idx) => {
                    const src = nodes.find(n => n.id === link.source);
                    const tgt = nodes.find(n => n.id === link.target);
                    
                    if (!src || !tgt) return null;
                    
                    const isSelected = selectedNodeId === src.id || selectedNodeId === tgt.id;
                    const isHovered = hoveredNodeId && (hoveredNodeId === src.id || hoveredNodeId === tgt.id);
                    const isFlowing = isHovered || (isSelected && !hoveredNodeId);
                    
                    // check filtering active states
                    const isSrcActive = graphFilter === "all" || src.type === graphFilter;
                    const isTgtActive = graphFilter === "all" || tgt.type === graphFilter;
                    const isLinkActive = isSrcActive && isTgtActive;
                    const linkOpacityClass = isLinkActive ? "opacity-100" : "opacity-10 pointer-events-none";
                    
                    return (
                      <g key={idx} className={`transition-opacity duration-300 ${linkOpacityClass}`}>
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          className={`transition-all duration-300 ${
                            isHovered 
                              ? "stroke-cyan-400 stroke-[1.8px] drop-shadow-[0_0_4px_rgba(6,182,212,0.6)]" 
                              : isSelected
                                ? "stroke-cyan-500/80 stroke-[1.2px]"
                                : "stroke-cyan-500/15 stroke-[0.8px]"
                          }`}
                        />
                        <text
                          x={(src.x + tgt.x) / 2}
                          y={(src.y + tgt.y) / 2 - 6}
                          textAnchor="middle"
                          className={`font-mono text-[8px] transition-all duration-300 pointer-events-none ${
                            isHovered || isSelected ? "fill-cyan-400/90 font-bold" : "fill-transparent"
                          }`}
                        >
                          {link.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Nodes circles & text */}
                  {nodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isSpecialNode = node.id === "agents" || node.id === "quantum";
                    
                    const isNodeActive = graphFilter === "all" || node.type === graphFilter;
                    const opacityClass = isNodeActive ? "opacity-100" : "opacity-20 hover:opacity-50 transition-opacity duration-300";
                    
                    let ringColor = "stroke-cyan-500/20";
                    if (node.type === "root") {
                      ringColor = isHovered || isSelected ? "stroke-cyan-400 stroke-2" : "stroke-cyan-500/60 stroke-[1.5px]";
                    } else if (node.type === "domain") {
                      ringColor = isHovered || isSelected ? "stroke-violet-400 stroke-[1.5px]" : "stroke-violet-500/40 stroke-[1px]";
                    } else {
                      // Concept nodes
                      if (node.id === "agents") {
                        ringColor = isHovered || isSelected ? "stroke-violet-400 stroke-2" : "stroke-violet-500/45 stroke-[1px]";
                      } else if (node.id === "quantum") {
                        ringColor = isHovered || isSelected ? "stroke-cyan-400 stroke-2" : "stroke-cyan-500/45 stroke-[1px]";
                      } else {
                        ringColor = isHovered || isSelected ? "stroke-emerald-400 stroke-[1.5px]" : "stroke-emerald-500/40 stroke-[1px]";
                      }
                    }

                    return (
                      <g
                        key={node.id}
                        className={`cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${opacityClass}`}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onMouseDown={(e) => handleMouseDown(node.id, e)}
                        onTouchStart={(e) => handleTouchStart(node.id, e)}
                      >
                        {/* Outer static ring specifically for special nodes */}
                        {isSpecialNode && isNodeActive && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={20}
                            className={`fill-none stroke-[1px] opacity-40 ${
                              node.id === "agents" ? "stroke-violet-400" : "stroke-cyan-400"
                            }`}
                          />
                        )}

                        {(isHovered || isSelected) && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.type === "root" ? 28 : 22}
                            className={`fill-none opacity-25 stroke-[1px] ${
                              node.type === "root" ? "stroke-cyan-400" : node.type === "domain" ? "stroke-violet-400" : "stroke-emerald-400"
                            }`}
                          />
                        )}
                        
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.type === "root" ? 22 : 16}
                          className={`fill-[#050811] transition-all duration-300 ${ringColor} ${
                            isHovered || isSelected ? "fill-[#0a1424]" : ""
                          }`}
                        />
                        
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.type === "root" ? 4 : 3}
                          className={`${
                            node.type === "root" 
                              ? "fill-cyan-400" 
                              : node.type === "domain" 
                                ? "fill-violet-400" 
                                : node.id === "agents"
                                  ? "fill-violet-400"
                                  : node.id === "quantum"
                                    ? "fill-cyan-400"
                                    : "fill-emerald-400"
                          }`}
                        />
                        
                        <text
                          x={node.x}
                          y={node.y + (node.type === "root" ? 38 : 30)}
                          textAnchor="middle"
                          className={`font-mono text-[9px] select-none transition-all duration-300 ${
                            isHovered || isSelected 
                              ? "fill-white font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
                              : "fill-zinc-500"
                          }`}
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Right Column - Node Detail HUD panel */}
            <div className="lg:col-span-4 flex flex-col justify-between cyber-card-cyan rounded-xl p-5 bg-[#050811]/90 relative">
              {/* Sci-Fi Decors */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/20" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/20" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/20" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/20" />
              
              <div>
                <div className="flex items-center gap-2 mb-4 font-mono">
                  <div className="w-1.5 h-4 bg-cyan-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Node Details HUD</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded border border-cyan-500/10 bg-cyan-950/25">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">NODE_IDENTIFIER</div>
                    <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5 uppercase tracking-wide">
                      {selectedNode.label}
                    </div>
                  </div>

                  <div className="p-3.5 rounded border border-cyan-500/10 bg-cyan-950/15">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">SEMANTIC_TYPE</div>
                    <div className="text-xs font-mono text-white mt-0.5 capitalize">
                      {selectedNode.type} Node
                    </div>
                  </div>

                  <div className="p-3.5 rounded border border-cyan-500/10 bg-cyan-950/15">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">SEMANTIC_SCOPE</div>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed font-sans">
                      {selectedNode.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-cyan-500/10 pt-4 flex flex-col gap-2 font-mono text-xs">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>METADATA_STREAM</span>
                  <span className="text-cyan-400 font-bold">ACTIVE</span>
                </div>
                <button 
                  onClick={() => triggerWidgetCommand(`lookup ${selectedNode.id}`)}
                  className="w-full py-2 rounded border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold tracking-wider transition duration-200"
                >
                  &gt; Query terminal diagnostic stream
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TECH STACK ARMORY & ACADEMIC BLUEPRINT */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          
          {/* Tech Stack Armory */}
          <div className="cyber-card-cyan rounded-xl p-5 relative">
            <div className="flex items-center gap-2 mb-4 font-mono">
              <div className="w-1.5 h-4 bg-cyan-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">ARMORY DIAGNOSTICS // CAPABILITY LOG</h3>
            </div>

            <div className="space-y-4">
              
              {/* Item 1 */}
              <div 
                onClick={() => triggerWidgetCommand("skills")}
                className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:bg-cyan-950/20 hover:border-cyan-500/25 transition duration-200 cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">DECLARATIVE CONFIGURATION & IAC</span>
                  <span className="font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded text-[10px]">CORE FOCUS</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Automating scalable configurations and bare-metal/cloud deployments using declarative code-driven models (e.g. Ansible).
                </p>
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => triggerWidgetCommand("skills")}
                className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:bg-cyan-950/20 hover:border-cyan-500/25 transition duration-200 cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">DISTRIBUTED INFRASTRUCTURE & CONTAINERS</span>
                  <span className="font-mono text-green-400 bg-green-950/50 px-2 py-0.5 rounded text-[10px]">KUBERNETES FABRICS</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Orchestrating resilient, high-availability clusters and isolated cloud native container workloads (e.g. OpenShift, AWS).
                </p>
              </div>

              {/* Item 3 */}
              <div 
                onClick={() => triggerWidgetCommand("skills")}
                className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:bg-cyan-950/20 hover:border-cyan-500/25 transition duration-200 cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">COGNITIVE AUTOMATION & AGENTIC AI</span>
                  <span className="font-mono text-violet-400 bg-violet-950/50 px-2 py-0.5 rounded text-[10px]">ACTIVE RESEARCH</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Designing LLM-driven orchestration systems, semantic link networks, and advanced retrieval architectures (GraphRAG).
                </p>
              </div>

              {/* Item 4 */}
              <div 
                onClick={() => triggerWidgetCommand("skills")}
                className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:bg-cyan-950/20 hover:border-cyan-500/25 transition duration-200 cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">UNIX/LINUX OPERATING SYSTEMS</span>
                  <span className="font-mono text-green-400 bg-green-950/50 px-2 py-0.5 rounded text-[10px]">SYSTEMS ENGINEERING</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Deploying secure, hardened enterprise environments and policy-driven system configurations (e.g. RHEL).
                </p>
              </div>

              {/* Item 5 */}
              <div 
                onClick={() => triggerWidgetCommand("skills")}
                className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:bg-cyan-950/20 hover:border-cyan-500/25 transition duration-200 cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">APPLICATION LIFECYCLE ARCHITECTURE</span>
                  <span className="font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded text-[10px]">TRACEABILITY SYSTEMS</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Structuring complex lifecycle assets, data link schemas, and custom operators to align engineering reference workflows.
                </p>
              </div>

            </div>
          </div>

          {/* Academic Blueprint */}
          <div className="cyber-card-cyan rounded-xl p-5 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 font-mono">
                <div className="w-1.5 h-4 bg-cyan-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">ACADEMIC FOUNDATIONS // BLUEPRINT</h3>
              </div>

              <div className="space-y-6">
                
                {/* Degree 1 */}
                <div className="relative pl-6 border-l border-cyan-500/30">
                  <div className="absolute left-[-4.5px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <h4 className="text-xs font-bold text-white">M. SC. PROFESSIONAL SOFTWARE ENGINEERING</h4>
                    <span className="text-[10px] font-mono text-cyan-400">OCT 2024 - PRESENT</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">Knowledge Foundation Reutlingen University</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Advanced software architectures, system design paradigms, and emerging enterprise cloud technologies.
                  </p>
                  
                  {/* Research Focus / Master's thesis highlight */}
                  <div 
                    onClick={() => triggerWidgetCommand("thesis")}
                    className="mt-2.5 p-3 rounded border border-cyan-500/20 bg-cyan-950/30 hover:bg-cyan-950/50 hover:border-cyan-500/40 transition duration-200 cursor-pointer text-xs"
                  >
                    <div className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-1">Thesis Research Log</div>
                    <div className="text-white font-medium text-xs">Trace Link Recovery in Software Projects using GraphRAG.</div>
                    <div className="text-[10px] text-zinc-500 mt-1">&gt; Click to execute abstract read-stream</div>
                  </div>
                </div>

                {/* Degree 2 */}
                <div className="relative pl-6 border-l border-cyan-500/30">
                  <div className="absolute left-[-4.5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-600" />
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <h4 className="text-xs font-bold text-white">B. SC. WIRTSCHAFTSINFORMATIK</h4>
                    <span className="text-[10px] font-mono text-zinc-500">OCT 2021 - SEP 2024</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">DHBW Villingen-Schwenningen</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Foundational engineering bridging core computer science with strategic business management principles.
                  </p>
                </div>

              </div>
            </div>
            
            <div className="mt-6 border-t border-cyan-500/10 pt-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>ACADEMIC_SYS.STATUS</span>
              <span className="text-cyan-400 uppercase tracking-widest font-semibold text-[10px]">In Progress</span>
            </div>
          </div>
        </section>

        {/* GRAPH RAG ENGINE CONSOLE & SOCIAL CONNECT GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          
          {/* GraphRAG Semantic Engine HUD */}
          <div className="cyber-card-cyan rounded-xl p-5 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 font-mono">
                <div className="w-1.5 h-4 bg-cyan-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">GraphRAG Engine Console // Simulator</h3>
              </div>

              <div className="p-4 rounded border border-cyan-500/15 bg-cyan-950/10 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">ENGINE.STATUS:</span>
                  <span className="text-emerald-400 animate-pulse font-semibold">STANDBY</span>
                </div>
                
                {/* Semantic network visual animation placeholder */}
                <div className="h-28 w-full bg-[#050811] rounded border border-cyan-500/10 relative overflow-hidden flex items-center justify-center select-none">
                  {/* Concentric spin rings */}
                  <div className="absolute w-24 h-24 rounded-full border border-dashed border-cyan-500/20 animate-[spin_30s_linear_infinite]" />
                  <div className="absolute w-16 h-16 rounded-full border border-dotted border-cyan-500/30 animate-[spin_15s_linear_infinite_reverse]" />
                  
                  {/* Connecting points */}
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 top-1/4 left-1/4 animate-ping" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-500 top-1/3 right-1/4" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-violet-500 bottom-1/4 left-1/3" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 bottom-1/3 right-1/3" />
                  
                  {/* SVG Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full text-cyan-500/20" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="25" y1="25" x2="75" y2="33" stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 2" />
                    <line x1="25" y1="25" x2="33" y2="75" stroke="currentColor" strokeWidth={0.5} />
                    <line x1="75" y1="33" x2="66" y2="66" stroke="currentColor" strokeWidth={0.5} />
                    <line x1="33" y1="75" x2="66" y2="66" stroke="currentColor" strokeWidth={0.5} strokeDasharray="1 1" />
                  </svg>
                  
                  <span className="text-[10px] font-mono text-cyan-400 bg-zinc-950/80 px-2 py-1 rounded border border-cyan-500/20 z-10">
                    TRACE_LINK_MAPPER_v1.0
                  </span>
                </div>
                
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Run a cognitive GraphRAG parser check. Reconstructs traceability networks across heterogeneous software requirement specifications.
                </p>
              </div>
            </div>

            <button 
              onClick={() => triggerWidgetCommand("simulate")}
              className="mt-4 w-full py-2.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition duration-300 flex items-center justify-center gap-2 uppercase tracking-wider font-bold"
            >
              <span>&gt; Initialize Recovery Simulation</span>
            </button>
          </div>

          {/* Social Connect Module */}
          <div className="cyber-card-cyan rounded-xl p-5 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 font-mono">
                <div className="w-1.5 h-4 bg-cyan-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Secure Communication Link Module</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email */}
                <a 
                  href="mailto:kai@nadezkin.de" 
                  className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition duration-200 flex flex-col gap-1"
                >
                  <span className="text-[10px] font-mono text-zinc-500">DIRECT MAIL</span>
                  <span className="text-xs font-bold text-white truncate">kai@nadezkin.de</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/kai-nadezkin-870b8425a/" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition duration-200 flex flex-col gap-1"
                >
                  <span className="text-[10px] font-mono text-zinc-500">NETWORKING</span>
                  <span className="text-xs font-bold text-white">LinkedIn Profile</span>
                </a>

                {/* GitHub */}
                <a 
                  href="https://github.com/Nadzin" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition duration-200 flex flex-col gap-1"
                >
                  <span className="text-[10px] font-mono text-zinc-500">OPEN SOURCE</span>
                  <span className="text-xs font-bold text-white">GitHub / Nadzin</span>
                </a>

                {/* Blog */}
                <a 
                  href="/blog" 
                  className="p-3 rounded border border-cyan-500/10 bg-cyan-950/10 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition duration-200 flex flex-col gap-1"
                >
                  <span className="text-[10px] font-mono text-zinc-500">RELOGS & MUSINGS</span>
                  <span className="text-xs font-bold text-white">Read Blog</span>
                </a>
              </div>
            </div>

            <div className="mt-4 border-t border-cyan-500/10 pt-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>COM_SYS.PORT</span>
              <span className="text-cyan-400 font-semibold uppercase text-[10px]">Active</span>
            </div>
          </div>

        </section>

        {/* HUD FOOTER */}
        <footer className="mt-8 border-t border-cyan-500/10 pt-6 pb-12 text-center text-xs font-mono text-zinc-600">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span>SYS.LOC // REDACTED</span>
            <span className="text-cyan-500/60 font-semibold animate-pulse">DESIGNED TO AUTOMATE</span>
          </div>
          <p className="mt-4 text-[10px] text-zinc-700 uppercase">
            Orbital System Portfolio v2.6.0 // Secure Terminal Node Connection
          </p>
        </footer>

      </div>
    </div>
  );
}
