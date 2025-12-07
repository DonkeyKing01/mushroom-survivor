import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Atom, BookOpen, MessageSquare, ShoppingBasket, Search, Skull, AlertTriangle, Utensils, Zap, HeartPulse, X, Map as MapIcon, Crosshair, Sparkles, Loader, Globe, Radar, Gamepad2, Trophy, RotateCcw } from 'lucide-react';

// --- CSS Keyframes for Advanced Animations ---
const styles = `
  @keyframes glitch-anim-1 {
    0% { clip: rect(30px, 9999px, 10px, 0); transform: skew(0.65deg); }
    20% { clip: rect(10px, 9999px, 80px, 0); transform: skew(-0.8deg); }
    40% { clip: rect(50px, 9999px, 20px, 0); transform: skew(0.2deg); }
    60% { clip: rect(20px, 9999px, 60px, 0); transform: skew(-0.1deg); }
    80% { clip: rect(70px, 9999px, 40px, 0); transform: skew(0.45deg); }
    100% { clip: rect(60px, 9999px, 30px, 0); transform: skew(-0.3deg); }
  }
  @keyframes glitch-anim-2 {
    0% { clip: rect(60px, 9999px, 20px, 0); transform: skew(-0.5deg); }
    20% { clip: rect(30px, 9999px, 10px, 0); transform: skew(0.2deg); }
    40% { clip: rect(80px, 9999px, 60px, 0); transform: skew(-0.6deg); }
    60% { clip: rect(10px, 9999px, 40px, 0); transform: skew(0.3deg); }
    80% { clip: rect(40px, 9999px, 90px, 0); transform: skew(-0.2deg); }
    100% { clip: rect(20px, 9999px, 50px, 0); transform: skew(0.1deg); }
  }
  @keyframes chew {
    0% { transform: scaleY(1); }
    25% { transform: scaleY(0.85) scaleX(1.05); }
    50% { transform: scaleY(1); }
    75% { transform: scaleY(0.85) scaleX(1.05); }
    100% { transform: scaleY(1); }
  }
  @keyframes float-ascend {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    50% { transform: translateY(-20px) rotate(5deg); opacity: 0.8; }
    100% { transform: translateY(0) rotate(0deg); opacity: 1; }
  }
  @keyframes soul-out {
    0% { transform: translateY(0) scale(1); opacity: 0.5; }
    100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  .animate-glitch-anim-1 { animation: glitch-anim-1 2.5s infinite linear alternate-reverse; }
  .animate-glitch-anim-2 { animation: glitch-anim-2 3s infinite linear alternate-reverse; }
  .animate-chew { animation: chew 0.3s linear infinite; }
  .animate-float { animation: float-ascend 3s ease-in-out infinite; }
  .animate-soul { animation: soul-out 2s ease-out infinite; }
  .animate-scan { animation: scanline 4s linear infinite; }
`;

// --- Mock Data: 扩充后的菌子数据库 ---
const MUSHROOM_DB = [
  {
    id: 1,
    name: '见手青 (Lanmaoa asiatica)',
    location: 'central', // Central Sector (Kunming)
    category: 'hallucinogenic', 
    catLabel: '见小人',
    glitchColor: 'purple',
    description: '切开变蓝，炒不熟就带你去见小人。云南人的老朋友。',
    effect: '视物变形，看见七彩小人跳舞。',
    risk: 45
  },
  {
    id: 2,
    name: '毒蝇伞 (Amanita muscaria)',
    location: 'north', // North Sector (Shangri-La)
    category: 'hallucinogenic',
    catLabel: '见小人',
    glitchColor: 'red',
    description: '红伞伞，白杆杆。看着像马里奥吃的，吃完你就进马里奥世界了。',
    effect: '严重致幻，甚至昏迷。',
    risk: 65
  },
  {
    id: 3,
    name: '松茸 (Tricholoma matsutake)',
    location: 'north',
    category: 'safe',
    catLabel: '安全干饭',
    glitchColor: 'green',
    description: '高端食材，只需要最朴素的烹饪方式。唯一的问题是贵。',
    effect: '钱包受损，味蕾极度舒适。',
    risk: 0
  },
  {
    id: 4,
    name: '致命鹅膏 (Amanita exitialis)',
    location: 'south', // South Sector
    category: 'lethal',
    catLabel: '全村吃席',
    glitchColor: 'white',
    description: '纯白无瑕，人畜无害的样子。一口下去，肝脏溶解。',
    effect: '不可逆的肝脏损伤，死亡率极高。',
    risk: 100
  },
  {
    id: 5,
    name: '鸡油菌 (Cantharellus cibarius)',
    location: 'west', // West Sector (Dali)
    category: 'safe',
    catLabel: '安全干饭',
    glitchColor: 'yellow',
    description: '色泽金黄，有杏仁香气。安全又好吃的入门级菌子。',
    effect: '心情愉悦，食欲大增。',
    risk: 0
  },
  {
    id: 6,
    name: '大青褶伞 (Chlorophyllum molybdites)',
    location: 'central',
    category: 'deadly',
    catLabel: '躺板板',
    glitchColor: 'orange',
    description: '路边草坪最常见的野菇。不要被它的平平无奇欺骗，它主要负责让你上吐下泻。',
    effect: '剧烈肠胃炎，脱水。',
    risk: 80
  },
  {
    id: 7,
    name: '干巴菌 (Thelephora ganbajun)',
    location: 'central',
    category: 'safe',
    catLabel: '安全干饭',
    glitchColor: 'black',
    description: '看着像干牛粪，吃着像牛肉干。洗它能洗到你怀疑人生，但味道值了。',
    effect: '米饭杀手，极度鲜香。',
    risk: 0
  },
  {
    id: 8,
    name: '红菇 (Russula vinosa)',
    location: 'south',
    category: 'safe',
    catLabel: '安全干饭',
    glitchColor: 'red',
    description: '煮汤直接变红墨水，但这可是好东西。补血养颜，广东人最爱。',
    effect: '汤鲜味美。',
    risk: 5
  },
  {
    id: 9,
    name: '亚稀褶红菇 (Russula subnigricans)',
    location: 'south',
    category: 'lethal',
    catLabel: '全村吃席',
    glitchColor: 'white',
    description: '也就是传说中的“火炭菌”。吃完这顿，这辈子都不用吃饭了。横纹肌溶解警告。',
    effect: '呼吸衰竭，全身疼痛。',
    risk: 95
  },
  {
    id: 10,
    name: '奶浆菌 (Lactarius volemus)',
    location: 'west',
    category: 'safe',
    catLabel: '安全干饭',
    glitchColor: 'orange',
    description: '弄断会有白色乳汁流出来。这是为数不多可以生吃的菌子，但建议还是煮熟。',
    effect: '口感脆嫩。',
    risk: 10
  }
];

// --- Map Zones Config ---
const MAP_ZONES = [
  { 
    id: 'north', 
    name: '高寒极地 (North)', 
    sub: '迪庆 / 丽江',
    risk: 'LOW', 
    path: 'M 100,20 L 150,10 L 180,30 L 160,80 L 100,70 Z', 
    center: { x: 130, y: 50 },
    color: 'text-green-600'
  },
  { 
    id: 'west', 
    name: '苍山洱海 (West)', 
    sub: '大理 / 保山',
    risk: 'LOW', 
    path: 'M 40,60 L 100,70 L 110,130 L 50,140 L 20,100 Z',
    center: { x: 70, y: 100 },
    color: 'text-cyan-600'
  },
  { 
    id: 'central', 
    name: '中心城区 (Central)', 
    sub: '昆明 / 玉溪 / 楚雄',
    risk: 'MED', 
    path: 'M 110,130 L 160,80 L 220,90 L 210,160 L 140,170 Z',
    center: { x: 165, y: 125 },
    color: 'text-yellow-600'
  },
  { 
    id: 'east', 
    name: '石林迷宫 (East)', 
    sub: '曲靖 / 文山',
    risk: 'HIGH', 
    path: 'M 220,90 L 280,80 L 290,160 L 240,190 L 210,160 Z',
    center: { x: 245, y: 120 },
    color: 'text-orange-600'
  },
  { 
    id: 'south', 
    name: '热带雨林 (South)', 
    sub: '西双版纳 / 普洱',
    risk: 'EXTREME', 
    path: 'M 140,170 L 210,160 L 240,190 L 200,250 L 120,230 L 110,180 Z',
    center: { x: 170, y: 200 },
    color: 'text-red-600'
  },
];

// --- Gemini API Helper ---
const callGemini = async (prompt, systemInstruction) => {
  // 修改这里：从环境变量读取 API Key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
  
  if (!apiKey) {
    console.error("Gemini API Key is missing! Please check your .env file.");
    // 可以在这里处理缺失 Key 的情况，目前仅打印错误
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );
    if (!response.ok) throw new Error("Connection Failed");
    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

// --- Helper Components ---
const GlitchText = ({ text, color = 'black', className = '' }) => {
  const colorMap = {
    purple: 'text-purple-600 before:text-blue-500 after:text-red-500',
    red: 'text-red-600 before:text-orange-500 after:text-pink-500',
    green: 'text-green-600 before:text-lime-500 after:text-teal-500',
    white: 'text-zinc-100 before:text-zinc-300 after:text-zinc-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]',
    yellow: 'text-yellow-600 before:text-orange-500 after:text-lime-500',
    orange: 'text-orange-600 before:text-red-500 after:text-yellow-500',
    black: 'text-black before:text-red-500 after:text-blue-500',
  };
  const glitchStyle = colorMap[color] || colorMap.black;
  return (
    <span className={`relative inline-block font-bold uppercase tracking-wider ${className} ${glitchStyle}`}>
      <span className="absolute top-0 left-0 -ml-[2px] mix-blend-multiply animate-glitch-anim-1" aria-hidden="true">{text}</span>
      {text}
      <span className="absolute top-0 left-0 ml-[2px] mix-blend-multiply animate-glitch-anim-2" aria-hidden="true">{text}</span>
    </span>
  );
};

// 1. The Lab
const TheLab = ({ activeMushroom, onClearMushroom }) => {
  const [status, setStatus] = useState('idle'); 
  const [log, setLog] = useState(['实验室系统就绪...请投放样本或点击交互。']);
  const [pokeCount, setPokeCount] = useState(0);

  const addLog = (msg) => setLog(prev => [`> ${msg}`, ...prev]);

  const handleFeed = () => {
    if (!activeMushroom) return;
    setStatus('eating');
    addLog(`投放样本: ${activeMushroom.name}...`);
    
    // Simulate chewing delay
    setTimeout(() => {
      switch(activeMushroom.category) {
        case 'safe':
          setStatus('happy');
          addLog(`[安全] 美味! ${activeMushroom.effect}`);
          break;
        case 'hallucinogenic':
          setStatus('trippy');
          addLog(`[警告] 视觉逻辑模块离线! ${activeMushroom.effect}`);
          break;
        case 'deadly':
          setStatus('reaction');
          addLog(`[危险] 核心组件过热! ${activeMushroom.effect}`);
          break;
        case 'lethal':
          setStatus('dead');
          addLog(`[致命] 系统崩溃! ${activeMushroom.name} 导致全村吃席。`);
          break;
        default: setStatus('idle');
      }
    }, 2000);
  };

  const handlePoke = () => {
    if (status === 'dead') {
      addLog('受试体无反应。建议重置。');
      return;
    }
    setPokeCount(c => c + 1);
    if (status === 'trippy') {
      addLog('受试体正在和空气对话，没空理你。');
      return;
    }
    if (pokeCount > 4) {
      setStatus('angry');
      addLog('警告: 受试体情绪指数上升! 别戳了!');
      setTimeout(() => setStatus('idle'), 2000);
      setPokeCount(0);
    } else {
      addLog('物理接触检测。受试体感到困惑。');
      const prevStatus = status;
      setStatus('poked');
      setTimeout(() => setStatus(prevStatus === 'poked' ? 'idle' : prevStatus), 500);
    }
  };

  const resetSubject = () => {
    setStatus('idle');
    setPokeCount(0);
    onClearMushroom();
    addLog('更换新的受试体克隆。计数器重置。');
  };

  const getEmoji = () => {
    switch(status) {
      case 'idle': return '😐';
      case 'poked': return '😣';
      case 'angry': return '😡';
      case 'eating': return '😮';
      case 'happy': return '😋';
      case 'trippy': return '😵‍💫';
      case 'reaction': return '🤢';
      case 'dead': return '💀';
      default: return '😐';
    }
  };

  const getEffectClass = () => {
    if (status === 'eating') return 'animate-chew';
    if (status === 'trippy') return 'animate-float hue-rotate-[90deg]';
    if (status === 'dead') return 'grayscale brightness-50 rotate-180 drop-shadow-[0_0_15px_red]';
    if (status === 'reaction') return 'animate-shake hue-rotate-[120deg]';
    if (status === 'poked') return 'scale-95 translate-y-2';
    if (status === 'angry') return 'animate-bounce drop-shadow-[0_0_10px_red]';
    return 'animate-float'; // idle float
  };

  return (
    <div className="flex flex-col h-full p-4 relative overflow-hidden bg-yellow-400">
      <style>{styles}</style>
      
      {/* Dynamic Backgrounds */}
      {status === 'trippy' && (
        <div className="absolute inset-0 bg-purple-500/30 z-0 pointer-events-none mix-blend-difference animate-pulse">
           <div className="absolute top-10 left-10 text-6xl animate-spin">🍄</div>
           <div className="absolute bottom-20 right-20 text-6xl animate-bounce">🌈</div>
        </div>
      )}
      
      {/* Header Info */}
      <div className="z-10 flex justify-between items-center mb-6 border-b-4 border-black pb-2">
        <h2 className="text-2xl font-black tracking-widest text-black italic transform -skew-x-12">
          <GlitchText text="LABORATORY" /> <span className="text-sm ml-2 opacity-70 not-italic">V2.1 AI_CORE</span>
        </h2>
        <div className="flex gap-2 text-xs font-bold font-mono text-black">
          <span className={`bg-yellow-300 px-1 border-2 border-black ${status === 'angry' ? 'bg-red-500 text-white' : ''}`}>
            MOOD: {status === 'idle' ? 'STABLE' : status.toUpperCase()}
          </span>
          <span className="bg-yellow-300 px-1 border-2 border-black">
            TOX: {status === 'dead' ? 'CRITICAL' : (status === 'idle' ? '0%' : 'RISING')}
          </span>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-row items-center justify-around relative z-10 gap-8">
        
        {/* The Subject Container */}
        <div className="relative group">
           {status === 'idle' && (
             <div className="absolute -top-12 -right-8 bg-white border-2 border-black p-2 text-xs font-bold rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce opacity-0 group-hover:opacity-100 transition-opacity z-30">
               戳我试试?
             </div>
           )}

           <div 
             onClick={handlePoke}
             className={`w-64 h-64 border-4 border-black bg-yellow-300 flex flex-col items-center justify-center relative transition-all duration-300 cursor-pointer overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${status === 'dead' ? 'bg-zinc-800' : 'hover:bg-yellow-200'}`}
           >
             {/* Scanlines */}
             <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>
             {status === 'trippy' && <div className="absolute text-8xl animate-soul opacity-50 blur-sm">😵‍💫</div>}
             <div className={`text-9xl transition-all duration-300 ${getEffectClass()} relative z-10 select-none`}>
               {getEmoji()}
             </div>
             <div className="absolute bottom-2 right-2 text-sm text-black font-bold font-mono bg-yellow-400 px-2 border-2 border-black transform rotate-2">
               SUBJECT-01
             </div>
           </div>
        </div>

        {/* Interaction Panel */}
        <div className="w-full max-w-sm bg-yellow-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
           <div className="absolute inset-0 bg-yellow-400 mix-blend-overlay opacity-50 pointer-events-none"></div>
           
           {activeMushroom ? (
             <>
               <div className="flex items-center gap-4 mb-6 relative z-10">
                 <div className={`w-16 h-16 border-4 border-black bg-yellow-400 flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>🍄</div>
                 <div>
                   <div className="text-sm text-black font-bold uppercase bg-yellow-400 px-1 inline-block mb-1 border-2 border-black transform -skew-x-6">当前样本</div>
                   <div className="text-2xl"><GlitchText text={activeMushroom.name} color={activeMushroom.glitchColor} /></div>
                 </div>
               </div>
               
               <div className="relative z-10">
                {status !== 'dead' && status !== 'reaction' ? (
                    <button 
                      onClick={handleFeed}
                      disabled={status === 'eating'}
                      className="w-full py-4 bg-black text-yellow-400 font-black uppercase tracking-widest border-4 border-black hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,0,1)] hover:translate-x-1 hover:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <GlitchText text={status === 'eating' ? "咀嚼中..." : "投喂 (FEED)"} color="yellow" />
                    </button>
                ) : (
                    <button 
                      onClick={resetSubject}
                      className="w-full py-4 bg-red-600 text-black font-black uppercase tracking-widest border-4 border-black hover:bg-red-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 active:shadow-none"
                    >
                      <GlitchText text="重置实验 (RESET)" color="black" />
                    </button>
                )}
               </div>
             </>
           ) : (
             <div className="text-center text-black font-bold italic relative z-10 py-8">
               <p className="text-xl">样本槽为空。</p>
               <p className="text-sm mt-4 bg-black text-yellow-400 inline-block px-2 py-1 border-2 border-yellow-400 transform skew-x-6">
                 请前往 [热力图] 寻找样本
               </p>
             </div>
           )}
        </div>
      </div>

      {/* Logs */}
      <div className="h-32 mt-6 bg-black border-4 border-yellow-500 p-3 font-mono text-sm overflow-y-auto text-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10">
        {log.map((line, idx) => (
          <div key={idx} className="mb-1 before:content-['>'] before:mr-2 before:text-red-500 border-l-2 border-transparent hover:border-yellow-500 pl-2">{line}</div>
        ))}
      </div>
    </div>
  );
};

// 2. Map System (UPDATED: Tactical Vector Map)
const MapSystem = ({ onSelectZone }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);

  const getZoneMushrooms = (zoneId) => {
    return MUSHROOM_DB.filter(m => m.location === zoneId);
  };

  return (
    <div className="flex flex-col h-full bg-yellow-400 relative overflow-hidden">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none"></div>
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-1/4 animate-scan pointer-events-none z-20"></div>

      <div className="p-4 border-b-4 border-black bg-yellow-500 z-10 shadow-[0_4px_0_0_rgba(0,0,0,1)] flex justify-between items-center">
        <h2 className="text-2xl font-black text-black italic transform -skew-x-6 flex items-center gap-2">
          <MapIcon size={24} strokeWidth={3} />
          <GlitchText text="战术卫星地图 (SAT_VIEW)" />
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono font-bold">
           <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
           LIVE_FEED: YUNNAN
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-6 relative z-10 h-[500px]">
        
        {/* Vector Map Display */}
        <div className="flex-1 bg-zinc-900 border-4 border-black p-4 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group">
           
           {/* SVG Map */}
           <svg viewBox="0 0 320 280" className="w-full h-full drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]">
             <defs>
               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,0,0.1)" strokeWidth="0.5"/>
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
             
             {/* Map Paths */}
             {MAP_ZONES.map(zone => (
               <g key={zone.id} 
                  onClick={() => setSelectedZone(zone)}
                  onMouseEnter={() => setHoveredZone(zone)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="cursor-pointer transition-all duration-300"
               >
                 <path 
                   d={zone.path} 
                   className={`stroke-[1.5px] transition-all duration-300 ${
                     selectedZone?.id === zone.id 
                       ? 'fill-yellow-400 stroke-yellow-200 brightness-110' 
                       : hoveredZone?.id === zone.id 
                         ? 'fill-zinc-700 stroke-yellow-400' 
                         : 'fill-black stroke-zinc-600 hover:fill-zinc-800'
                   }`}
                 />
                 
                 {/* Zone Label Markers */}
                 <foreignObject x={zone.center.x - 20} y={zone.center.y - 10} width="40" height="20">
                    <div className={`text-[6px] font-mono text-center leading-none p-[1px] border ${
                       selectedZone?.id === zone.id ? 'bg-black text-yellow-400 border-black' : 'bg-black/50 text-white/70 border-white/30'
                    }`}>
                      {zone.id.toUpperCase()}
                    </div>
                 </foreignObject>
               </g>
             ))}
           </svg>

           {/* Decor Elements */}
           <div className="absolute top-2 left-2 text-xs font-mono font-bold text-cyan-500">
             COORDS: {hoveredZone ? `${hoveredZone.center.x * 34}.${hoveredZone.center.y * 12}` : 'SEARCHING...'}
           </div>
           <Crosshair className="absolute bottom-4 right-4 text-cyan-500 opacity-50" size={32} />
        </div>

        {/* Intelligence Panel */}
        <div className="w-1/3 bg-yellow-300 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-all">
          {selectedZone ? (
            <>
              <div className="border-b-4 border-black pb-4 mb-4">
                <div className="text-[10px] font-bold bg-black text-white px-1 inline-block mb-1">SECTOR DATA</div>
                <h3 className="text-xl font-black uppercase leading-none mb-1">{selectedZone.name}</h3>
                <div className="text-xs font-bold text-zinc-600">{selectedZone.sub}</div>
                
                <div className="flex items-center justify-between mt-3 bg-white/50 border-2 border-black p-1">
                   <span className="text-xs font-bold px-1">THREAT LEVEL</span>
                   <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-2 h-4 border border-black ${
                          (selectedZone.risk === 'LOW' && i<=1) || (selectedZone.risk === 'MED' && i<=3) || (selectedZone.risk === 'HIGH' && i<=4) || (selectedZone.risk === 'EXTREME') 
                          ? (selectedZone.risk === 'EXTREME' ? 'bg-red-600' : 'bg-black') 
                          : 'bg-transparent'
                        }`}></div>
                      ))}
                   </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                 <p className="text-xs font-bold text-black/60 mb-1 flex items-center gap-1"><Radar size={12}/> DETECTED SPECIMENS:</p>
                 {getZoneMushrooms(selectedZone.id).length > 0 ? (
                    getZoneMushrooms(selectedZone.id).map(m => (
                      <div key={m.id} className="bg-white border-2 border-black p-2 hover:bg-black hover:text-yellow-400 group cursor-help transition-colors flex justify-between items-center">
                          <span className="font-bold text-sm truncate">{m.name.split(' ')[0]}</span>
                          <span className={`text-[10px] px-1 border border-black font-bold ${
                            m.category === 'safe' ? 'text-green-600 group-hover:text-green-400' : 'text-red-600 group-hover:text-red-400'
                          }`}>{m.catLabel}</span>
                      </div>
                    ))
                 ) : (
                   <div className="text-center italic text-sm py-8 border-2 border-dashed border-black/50 text-black/50 bg-black/5">
                     该区域暂无数据回传
                   </div>
                 )}
              </div>
              
              <button 
                onClick={() => onSelectZone(selectedZone.id)}
                className="mt-4 w-full bg-black text-yellow-400 font-bold py-3 border-4 border-transparent hover:border-yellow-400 hover:bg-zinc-800 transition-all uppercase text-sm flex justify-center items-center gap-2 group"
              >
                <span>调取档案</span>
                <Globe size={14} className="group-hover:animate-spin" />
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-black/50 space-y-4">
              <div className="w-20 h-20 border-4 border-dashed border-black/30 rounded-full flex items-center justify-center animate-pulse">
                 <Globe size={40} className="opacity-50" />
              </div>
              <div className="text-center">
                <p className="font-black text-lg">AWAITING INPUT</p>
                <p className="text-xs font-mono mt-1">请点击左侧地图区块<br/>锁定侦查范围</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// 3. Archives
const Archives = ({ onTestPoison, favorites, toggleFavorite, initialFilterZone }) => {
  const [filter, setFilter] = useState('all');
  const [recipeModal, setRecipeModal] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  
  const handleGenerateRecipe = async (mushroom) => {
    setLoadingRecipe(true);
    setRecipeModal({ mushroom, content: null });
    
    const systemInstruction = `You are a "Dark Cuisine Chef" in a cyberpunk world. Your task is to generate a recipe for the mushroom provided. 
    1. If the mushroom is poisonous (deadly/hallucinogenic), write a "Last Meal" style recipe. It should sound dangerously delicious but imply death or madness.
    2. If the mushroom is safe, write a delicious recipe but describe it in a gross/industrial/scientific way (e.g. "dissecting the fibers", "thermal treatment").
    3. Keep it under 60 words.
    4. Use Chinese language.
    5. Output JSON: { "title": "Recipe Name", "content": "Instructions" }`;

    const result = await callGemini(`Create a recipe for ${mushroom.name} (${mushroom.category})`, systemInstruction);
    
    setLoadingRecipe(false);
    if (result) {
      setRecipeModal({ mushroom, content: result });
    } else {
      setRecipeModal(null);
      alert("厨房网络连接中断...");
    }
  };

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'safe', label: '安全干饭' },
    { id: 'hallucinogenic', label: '见小人' },
    { id: 'lethal', label: '全村吃席' },
  ];

  const filteredMushrooms = filter === 'all' 
    ? MUSHROOM_DB 
    : MUSHROOM_DB.filter(m => m.category === filter || (filter === 'lethal' && (m.category === 'lethal' || m.category === 'deadly')));

  return (
    <div className="flex flex-col h-full bg-yellow-400 relative">
      {/* Recipe Modal Overlay */}
      {recipeModal && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in">
          <div className="bg-yellow-300 border-4 border-black p-6 max-w-lg w-full shadow-[10px_10px_0px_0px_rgba(255,0,0,1)] relative transform rotate-1">
             <button onClick={()=>setRecipeModal(null)} className="absolute top-2 right-2 p-2 hover:bg-red-500 hover:text-white transition-colors border-2 border-black"><X/></button>
             
             {loadingRecipe ? (
               <div className="flex flex-col items-center py-10">
                 <Loader size={40} className="animate-spin mb-4 text-black"/>
                 <p className="font-mono font-bold animate-pulse">正在链接黑暗厨房数据库...</p>
               </div>
             ) : (
               <>
                 <div className="bg-black text-yellow-400 inline-block px-2 font-bold mb-2 transform -skew-x-12 border-2 border-yellow-400">DARK KITCHEN v1.0</div>
                 <h3 className="text-2xl font-black mb-4 border-b-4 border-black pb-2">{recipeModal.content.title}</h3>
                 <p className="font-medium text-lg leading-relaxed mb-6 font-mono">{recipeModal.content.content}</p>
                 <div className="flex justify-between items-center bg-white/50 p-2 border-2 border-black border-dashed">
                    <span className="text-xs font-bold text-red-600">⚠ 警告: 本食谱概不负责</span>
                    <span className="text-xs font-mono">CHEF_AI_GEMINI</span>
                 </div>
               </>
             )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b-4 border-black bg-yellow-500 sticky top-0 z-20 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black text-black mb-4 italic transform -skew-x-6"><GlitchText text="档案馆 (ARCHIVES)" /></h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 text-sm font-bold whitespace-nowrap border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 ${
                filter === cat.id 
                  ? 'bg-black text-yellow-400' 
                  : 'bg-yellow-300 text-black hover:bg-yellow-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {filteredMushrooms.map(mushroom => (
          <div key={mushroom.id} className="bg-yellow-300 p-4 border-4 border-black relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className={`absolute top-0 right-0 px-3 py-2 text-sm font-black text-black bg-yellow-500 border-l-4 border-b-4 border-black transform rotate-2`}>
              {mushroom.catLabel}
            </div>
            
            <div className="flex justify-between items-start mb-3 pr-24">
              <div>
                <h3 className="text-xl font-black text-black"><GlitchText text={mushroom.name} color={mushroom.glitchColor} /></h3>
                <div className="flex gap-2 mt-1">
                   {mushroom.location && (
                     <span className="text-xs font-mono font-bold border border-black px-1 bg-white">
                       LOC: {MAP_ZONES.find(z => z.id === mushroom.location)?.name.split(' ')[0]}
                     </span>
                   )}
                </div>
              </div>
              <button 
                onClick={() => toggleFavorite(mushroom)}
                className={`p-2 border-4 border-black bg-yellow-400 hover:bg-yellow-200 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${favorites.some(f => f.id === mushroom.id) ? 'text-red-500' : 'text-black'}`}
              >
                <HeartPulse size={20} strokeWidth={3} />
              </button>
            </div>

            <p className="text-base text-black mb-4 leading-relaxed font-medium border-l-4 border-black pl-4 py-2 bg-yellow-400/50">{mushroom.description}</p>
            
            <div className="flex justify-between items-center mt-4 pt-3 border-t-4 border-black">
               <div className="flex items-center gap-2 text-sm text-black font-bold bg-yellow-500 px-2 py-1 border-2 border-black">
                  <AlertTriangle size={16} strokeWidth={3} />
                  <span>危险系数: <span className={mushroom.risk > 50 ? 'text-red-600' : 'text-green-700'}>{mushroom.risk}%</span></span>
               </div>
               
               <div className="flex gap-2">
                 <button 
                   onClick={() => handleGenerateRecipe(mushroom)}
                   className="flex items-center gap-2 bg-purple-600 text-white text-sm font-black px-3 py-2 border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1"
                 >
                   <Sparkles size={16} strokeWidth={3} />
                   <span>黑暗食谱</span>
                 </button>

                 <button 
                   onClick={() => onTestPoison(mushroom)}
                   className="flex items-center gap-2 bg-black text-yellow-400 text-sm font-black px-4 py-2 border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1"
                 >
                   <Utensils size={16} strokeWidth={3} />
                   <span>去试毒</span>
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. AI Agent
const Toxicologist = ({ onReferToLab }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: '我是鉴毒师 V3.0 (Gemini驱动)。不管你看见了什么小人，先描述一下你吃了什么。' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const systemPrompt = `
      Roleplay: You are a cyberpunk AI Toxicologist in the game "Mushroom Survivor". 
      Personality: Sarcastic, dark humor, helpful but mean.
      Task: Analyze the user's description of a mushroom.
      Context DB: ${JSON.stringify(MUSHROOM_DB.map(m => ({id: m.id, name: m.name, desc: m.description, color: m.glitchColor})))}
      
      Response Format: JSON.
      Schema: { "message": "Your sarcastic response text (in Chinese)", "suggestedId": number | null }
      
      Instructions:
      1. If user description matches a mushroom in DB, set "suggestedId" to its ID.
      2. If vague, make fun of them and give general advice.
      3. Keep "message" short (under 50 words).
    `;

    const result = await callGemini(userMsg.text, systemPrompt);
    
    setIsTyping(false);
    
    if (result) {
      const suggestion = result.suggestedId ? MUSHROOM_DB.find(m => m.id === result.suggestedId) : null;
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'ai', text: result.message, suggestion }]);
    }
    else {
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'ai', text: "系统连接不稳定...但我猜你可能要挂了。" }]);
    }
  };

  return (
     <div className="flex flex-col h-full bg-yellow-400">
      <div className="p-4 border-b-4 border-black bg-yellow-500 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black text-black flex items-center gap-3 italic transform -skew-x-6">
          <Zap size={24} className="text-black fill-yellow-400" strokeWidth={3} />
          <GlitchText text="AI 鉴毒热线 (ONLINE)" />
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-4 text-sm font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${msg.sender === 'user' ? 'bg-black text-yellow-400 transform skew-x-2' : 'bg-yellow-300 text-black transform -skew-x-2'}`}>{msg.text}</div>
            {msg.suggestion && (
              <div className="mt-4 w-[85%] bg-yellow-200 border-4 border-black p-4 flex gap-4 items-center cursor-pointer hover:bg-yellow-100 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -skew-x-2 animate-in fade-in slide-in-from-bottom-2" onClick={() => onReferToLab(msg.suggestion)}>
                <div className="text-4xl">✨🍄</div>
                <div className="flex-1">
                   <div className="text-xs font-bold bg-purple-600 text-white inline-block px-1 mb-1">AI MATCHED</div>
                   <div className="text-xl font-black">{msg.suggestion.name}</div>
                   <div className="text-xs">去试毒 &gt;</div>
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-black text-sm ml-4 font-bold animate-pulse">
            <Sparkles size={16} /> 正在分析毒素样本...
          </div>
        )}
      </div>
      <div className="p-6 bg-yellow-500 border-t-4 border-black flex gap-4 shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
        <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} className="flex-1 bg-yellow-300 border-4 border-black px-4 py-3 font-bold focus:outline-none shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]" placeholder="输入特征..." />
        <button onClick={handleSend} className="bg-black text-yellow-400 p-3 border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"><Search size={24} strokeWidth={3}/></button>
      </div>
     </div>
  );
};

// 5. Mini Game: Mushroom Royale
const MushroomRoyale = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
  const [playerX, setPlayerX] = useState(50); // percentage
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const [hallucinating, setHallucinating] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [particles, setParticles] = useState([]);
  const keys = useRef({});
  
  const gameLoopRef = useRef();
  
  // Game Constants
  // Was 0.5 * gameSpeed -> Now 0.25 * gameSpeed (Even Slower)
  const FALL_SPEED = 0.25 * gameSpeed; 
  
  useEffect(() => {
    const handleDown = (e) => keys.current[e.code] = true;
    const handleUp = (e) => keys.current[e.code] = false;
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
        window.removeEventListener('keydown', handleDown);
        window.removeEventListener('keyup', handleUp);
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setPlayerX(50);
    setItems([]);
    setParticles([]);
    setScore(0);
    setHp(100);
    setHallucinating(false);
    setGameSpeed(1);
  };
  
  const movePlayer = (direction) => {
    // Tap movement: Slower increments
    const dir = hallucinating ? -direction : direction;
    setPlayerX(prev => Math.max(0, Math.min(90, prev + dir * 5)));
  };
  
  const spawnExplosion = (x, y, type) => {
    const colorClass = type === 'safe' ? 'bg-green-400' : type === 'hallucinogenic' ? 'bg-purple-500' : 'bg-red-500';
    const newParticles = Array.from({length: 8}).map(() => ({
        id: Math.random(),
        x, y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 1, // Slight upward bias
        life: 1.0,
        color: colorClass
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const tick = () => {
      // 1. Handle Keyboard Movement (Smooth & Slower)
      if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
         const dir = hallucinating ? 1 : -1;
         // Was 1.5 -> Now 0.8
         setPlayerX(x => Math.max(0, Math.min(90, x + dir * 0.8)));
      }
      if (keys.current['ArrowRight'] || keys.current['KeyD']) {
         const dir = hallucinating ? -1 : 1;
         // Was 1.5 -> Now 0.8
         setPlayerX(x => Math.max(0, Math.min(90, x + dir * 0.8)));
      }

      // 2. Update Particles
      setParticles(prev => prev.map(p => ({
          ...p, 
          x: p.x + p.vx, 
          y: p.y + p.vy, 
          life: p.life - 0.05
      })).filter(p => p.life > 0));

      setItems(prevItems => {
        // Move items down
        const movedItems = prevItems.map(item => ({...item, y: item.y + FALL_SPEED}));
        
        // Check collisions & removal
        return movedItems.reduce((acc, item) => {
          // Check collision with player (bottom of screen)
          if (item.y > 85 && item.y < 95 && Math.abs(item.x - playerX) < 10) {
            handleCollision(item);
            spawnExplosion(item.x, item.y, item.type);
            return acc; // Remove item
          }
          // Remove if off screen (hit floor)
          if (item.y > 100) {
             spawnExplosion(item.x, 100, item.type); // Floor explosion
             return acc;
          }
          
          acc.push(item);
          return acc;
        }, []);
      });
      
      // Speed up game over time
      if (Math.random() < 0.002) setGameSpeed(s => Math.min(s + 0.1, 4));
      
      gameLoopRef.current = requestAnimationFrame(tick);
    };
    
    gameLoopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState, playerX, gameSpeed, hallucinating]);
  
  // Spawn Loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const spawner = setInterval(() => {
      const types = ['safe', 'safe', 'hallucinogenic', 'deadly', 'lethal'];
      const type = types[Math.floor(Math.random() * types.length)];
      setItems(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 90,
        y: -10,
        type
      }]);
    }, 400 / gameSpeed); 
    
    return () => clearInterval(spawner);
  }, [gameState, gameSpeed]);
  
  const handleCollision = (item) => {
    if (item.type === 'safe') {
      setScore(s => s + 10);
      setHp(h => Math.min(100, h + 5));
    } else if (item.type === 'hallucinogenic') {
      setHallucinating(true);
      setHp(h => h - 15);
      setTimeout(() => setHallucinating(false), 3000); // 3s chaos
    } else if (item.type === 'deadly') {
      setHp(h => h - 30);
    } else if (item.type === 'lethal') {
      setHp(0);
    }
  };
  
  useEffect(() => {
    if (hp <= 0 && gameState === 'playing') {
      setGameState('gameover');
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, [hp, gameState]);
  
  return (
    <div className={`flex flex-col h-full bg-zinc-900 relative overflow-hidden font-mono ${hallucinating ? 'hue-rotate-180 invert' : ''}`}>
       {/* Retro Grid BG */}
       <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_2px),linear-gradient(90deg,transparent_2px,#000_2px)] bg-[length:40px_40px] opacity-20 pointer-events-none"></div>
       <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-green-900/20"></div>

       {/* Top UI */}
       <div className="absolute top-0 w-full p-4 flex justify-between z-20 text-green-400 font-bold text-xl border-b-4 border-green-800 bg-black/80">
          <div className="flex gap-2 items-center"><Trophy size={20}/> {score}</div>
          <div className="flex gap-2 items-center"><HeartPulse size={20} className={hp < 30 ? 'animate-ping text-red-500' : 'text-green-500'}/> {hp}%</div>
       </div>

       {/* Game Area */}
       {gameState === 'playing' && (
         <div className="flex-1 relative mt-16 overflow-hidden">
            {/* Player */}
            <div 
              className="absolute bottom-4 text-4xl transition-all duration-100"
              style={{ left: `${playerX}%` }}
            >
              😐
            </div>
            
            {/* Falling Items */}
            {items.map(item => (
              <div 
                key={item.id}
                className="absolute text-2xl"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                {item.type === 'safe' ? '🍄' : item.type === 'hallucinogenic' ? '🌀' : '💀'}
              </div>
            ))}

            {/* Particles */}
            {particles.map(p => (
              <div 
                 key={p.id}
                 className={`absolute w-2 h-2 ${p.color} rounded-sm`}
                 style={{ 
                   left: `${p.x}%`, 
                   top: `${p.y}%`, 
                   opacity: p.life 
                 }}
              />
            ))}
            
            {hallucinating && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-purple-500 animate-pulse whitespace-nowrap">
                SYSTEM ERROR
              </div>
            )}
         </div>
       )}
       
       {/* Menu / Game Over Screens */}
       {gameState !== 'playing' && (
         <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-4xl font-black text-green-500 mb-4 tracking-widest glitch-text">
              {gameState === 'menu' ? 'MUSHROOM ROYALE' : 'GAME OVER'}
            </h2>
            
            {gameState === 'gameover' && (
              <div className="mb-8">
                 <p className="text-white text-xl mb-2">FINAL SCORE: {score}</p>
                 <p className="text-red-500 text-sm">CAUSE OF DEATH: POISONING</p>
              </div>
            )}
            
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-black text-xl uppercase border-4 border-green-800 shadow-[4px_4px_0px_0px_rgba(0,100,0,1)] active:translate-y-1 active:shadow-none"
            >
              {gameState === 'menu' ? 'START GAME' : 'TRY AGAIN'}
            </button>
            
            <div className="mt-8 text-xs text-green-700/60 max-w-xs">
              INSTRUCTIONS: <br/>
              Use Arrow Keys / WASD to move. <br/>
              🍄 = GOOD (+10) <br/>
              🌀 = CONFUSION (Bad) <br/>
              💀 = DEATH
            </div>
         </div>
       )}

       {/* Controls */}
       <div className="h-32 bg-black border-t-4 border-green-800 flex gap-2 p-2 z-20">
         <button 
           className="flex-1 bg-zinc-800 border-4 border-zinc-700 active:bg-zinc-700 flex items-center justify-center"
           onMouseDown={() => movePlayer(-1)}
           onTouchStart={() => movePlayer(-1)}
         >
           <span className="text-4xl text-green-500">◀</span>
         </button>
         <button 
           className="flex-1 bg-zinc-800 border-4 border-zinc-700 active:bg-zinc-700 flex items-center justify-center"
           onMouseDown={() => movePlayer(1)}
           onTouchStart={() => movePlayer(1)}
         >
           <span className="text-4xl text-green-500">▶</span>
         </button>
       </div>
    </div>
  );
};

const Basket = ({ favorites, onTestPoison, toggleFavorite }) => (
    <div className="flex flex-col h-full bg-yellow-400">
      <div className="p-4 border-b-4 border-black bg-yellow-500 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black text-black flex items-center gap-3 italic transform -skew-x-6">
          <ShoppingBasket size={24} className="text-black fill-pink-500" strokeWidth={3} />
          <GlitchText text="保命背篓" />
        </h2>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
         {favorites.length === 0 ? <div className="text-center font-bold opacity-60 mt-20">背篓为空</div> : favorites.map(m => (
            <div key={m.id} className="bg-yellow-300 p-4 border-4 border-black flex justify-between items-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
               <div><div className="text-xl font-black">{m.name}</div><div className="text-xs font-mono">{m.catLabel}</div></div>
               <div className="flex gap-2">
                 <button onClick={()=>onTestPoison(m)} className="p-2 bg-black text-yellow-400 border-2 border-transparent hover:border-yellow-400"><Utensils size={16}/></button>
                 <button onClick={()=>toggleFavorite(m)} className="p-2 bg-red-600 text-black border-2 border-black"><X size={16}/></button>
               </div>
            </div>
         ))}
      </div>
    </div>
);

// --- Main App Component ---
export default function MushroomSurvivor() {
  const [activeTab, setActiveTab] = useState('lab');
  const [activeMushroom, setActiveMushroom] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [mapFilter, setMapFilter] = useState(null);

  const handleTestPoison = (mushroom) => {
    setActiveMushroom(mushroom);
    setActiveTab('lab');
  };

  const handleMapSelect = (zoneId) => {
    // Navigate to archives but ideally filtered. For now just switch tab.
    setMapFilter(zoneId);
    // Note: In a full app, we would auto-filter archives, but here we keep the map interaction focused.
    // setActiveTab('archives'); 
  };

  const toggleFavorite = (mushroom) => {
    if (favorites.some(f => f.id === mushroom.id)) {
      setFavorites(favorites.filter(f => f.id !== mushroom.id));
    } else {
      setFavorites([...favorites, mushroom]);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'lab': return <TheLab activeMushroom={activeMushroom} onClearMushroom={() => setActiveMushroom(null)} />;
      case 'map': return <MapSystem onSelectZone={handleMapSelect} />;
      case 'archives': return <Archives onTestPoison={handleTestPoison} favorites={favorites} toggleFavorite={toggleFavorite} initialFilterZone={mapFilter} />;
      case 'agent': return <Toxicologist onReferToLab={handleTestPoison} />;
      case 'basket': return <Basket favorites={favorites} onTestPoison={handleTestPoison} toggleFavorite={toggleFavorite} />;
      case 'game': return <MushroomRoyale />;
      default: return <TheLab />;
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-black font-sans selection:bg-black selection:text-yellow-400 flex justify-center items-center p-8">
      <div className="w-full max-w-5xl h-[700px] bg-yellow-400 border-4 border-black flex flex-col relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Top Bar */}
        <div className="h-8 bg-yellow-500 flex justify-between items-center px-4 text-xs text-black font-bold border-b-4 border-black select-none">
           <span className="italic transform -skew-x-12"><GlitchText text="MUSHROOM_OS_V2.5_ROYALE" /></span>
           <div className="flex gap-2">
             <div className="w-3 h-3 bg-black border-2 border-yellow-400"></div>
             <div className="w-3 h-3 bg-red-500 animate-pulse border-2 border-black"></div>
           </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>

        {/* Navigation */}
        <div className="h-20 bg-yellow-500 border-t-4 border-black flex justify-around items-center px-4 z-30 shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
          {['lab', 'map', 'archives', 'game', 'agent', 'basket'].map(tab => {
            const icons = { lab: Atom, map: MapIcon, archives: BookOpen, game: Gamepad2, agent: MessageSquare, basket: ShoppingBasket };
            const labels = { lab: '实验室', map: '卫星图', archives: '档案馆', game: '大逃杀', agent: '鉴毒师', basket: '背篓' };
            const Icon = icons[tab];
            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center gap-1 p-2 md:p-3 border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 ${
                  activeTab === tab ? 'bg-black text-yellow-400 font-black transform -skew-x-6' : 'bg-yellow-300 text-black hover:bg-yellow-200'
                }`}
              >
                <Icon size={20} strokeWidth={3} />
                <span className="text-[10px] md:text-xs uppercase tracking-wider font-bold">{labels[tab]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}