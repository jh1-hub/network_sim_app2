import React, { useState, useEffect } from 'react';
import htm from 'htm';
import { Sidebar } from './components/Sidebar.js';
import { NetworkCanvas } from './components/NetworkCanvas.js';
import { Inspector } from './components/Inspector.js';
import { LectureMode } from './components/LectureMode.js'; // Import Lecture Mode
import { MISSION_SETS } from './data/missions.js'; // Import separated mission data
import { generateId, isConnected, findPath, isValidIP } from './utils.js';
import { CheckCircle, ArrowRight, AlertCircle, RefreshCw, LayoutTemplate, X, Home, Play, Network, BookOpen, HelpCircle, LogOut, Lightbulb, GraduationCap, School } from 'lucide-react';

const html = htm.bind(React.createElement);

const App = () => {
  // App State
  const [view, setView] = useState('home'); // 'home' | 'simulation' | 'lecture'
  const [mode, setMode] = useState('free'); // 'free' | 'quiz'
  
  // Simulation State
  const [devices, setDevices] = useState([]);
  const [connections, setConnections] = useState([]);
  const [packets, setPackets] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [connectionMode, setConnectionMode] = useState({
    active: false,
    sourceId: null,
  });
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // Mission State
  const [currentMissionSet, setCurrentMissionSet] = useState(null);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [missionError, setMissionError] = useState(null);
  const [missionFlags, setMissionFlags] = useState({ pingSuccess: false, encryptedSuccess: false });
  
  // UI State
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  const log = (msg) => {
    setLogs((prev) => [msg, ...prev].slice(0, 50));
  };

  // --- Actions ---

  const startFreeMode = () => {
    resetSimulationState();
    setMode('free');
    setCurrentMissionSet(null);
    setView('simulation');
    log("自由制作モードを開始しました");
  };

  const startMissionMode = (missionSet) => {
    resetSimulationState();
    setMode('quiz');
    setCurrentMissionSet(missionSet);
    setCurrentMissionIndex(0);
    setView('simulation');
    log(`コース「${missionSet.title}」を開始しました`);
  };

  const startLectureMode = () => {
      setView('lecture');
  };

  const goToHome = () => {
    if (view === 'simulation' && devices.length > 0) {
        setShowExitConfirm(true);
    } else {
        setView('home');
    }
  };
  
  const handleExitConfirm = () => {
      setShowExitConfirm(false);
      setView('home');
  };

  const resetSimulationState = () => {
    setDevices([]);
    setConnections([]);
    setPackets([]);
    setLogs([]);
    setSelectedDeviceId(null);
    setConnectionMode({ active: false, sourceId: null });
    setIsEncrypted(false);
    setShowSuccessModal(false);
    setMissionError(null);
    setShowHintModal(false);
    setShowExitConfirm(false);
    setMissionFlags({ pingSuccess: false, encryptedSuccess: false });
  };

  const currentMission = currentMissionSet ? currentMissionSet.missions[currentMissionIndex] : null;

  const checkMissionCompletion = () => {
      if (!currentMission) return;

      const state = {
          devices,
          connections,
          packets,
          selectedDeviceId,
          connectionMode,
          isEncrypted,
          logs,
          missionFlags 
      };

      if (currentMission.check(state)) {
          setShowSuccessModal(true);
          setMissionError(null);
          setShowHintModal(false);
      } else {
          setMissionError("条件を満たしていません。ヒントを確認してください。");
          setShowHintModal(true);
      }
  };

  const nextMission = () => {
      setShowSuccessModal(false);
      setMissionFlags({ pingSuccess: false, encryptedSuccess: false });
      
      if (currentMissionSet && currentMissionIndex < currentMissionSet.missions.length - 1) {
          setCurrentMissionIndex(prev => prev + 1);
      }
  };

  const addDevice = (type, x, y) => {
    const id = generateId();
    const count = devices.filter(d => d.type === type).length + 1;
    let typeLabel = 'Dev';
    switch(type) {
        case 'PC': typeLabel = 'PC'; break;
        case 'SWITCH': typeLabel = 'SW'; break;
        case 'ROUTER': typeLabel = 'Router'; break;
        case 'SERVER': typeLabel = 'Server'; break;
        case 'PRINTER': typeLabel = 'Printer'; break;
        case 'ONU': typeLabel = 'ONU'; break;
        case 'HUB': typeLabel = 'Hub'; break;
    }
    const name = `${typeLabel}-${count}`;
    
    const newDevice = {
      id,
      type,
      x,
      y,
      ip: '',
      subnet: '255.255.255.0',
      name,
    };

    setDevices((prev) => [...prev, newDevice]);
    log(`機器を追加: ${name}`);
  };

  const updateDevice = (id, updates) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const moveDevice = (id, x, y) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, x, y } : d)));
  };

  const deleteDevice = (id) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
    if (selectedDeviceId === id) setSelectedDeviceId(null);
    log(`機器を削除: ${id}`);
  };

  const deleteConnection = (connectionId) => {
    setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    log(`ケーブルを切断しました`);
  };

  const handleDeviceClick = (id) => {
    if (connectionMode.active) {
      if (!connectionMode.sourceId) {
        setConnectionMode({ ...connectionMode, sourceId: id });
        log(`接続元を選択しました。接続先をクリックしてください。`);
      } else {
        if (connectionMode.sourceId === id) {
          setConnectionMode({ active: false, sourceId: null });
          return;
        }

        if (isConnected(connections, connectionMode.sourceId, id)) {
          log(`既に接続されています。`);
          setConnectionMode({ active: false, sourceId: null });
          return;
        }

        const newConn = {
          id: generateId(),
          from: connectionMode.sourceId,
          to: id,
        };

        setConnections((prev) => [...prev, newConn]);
        setConnectionMode({ active: false, sourceId: null });
        log(`接続完了。`);
      }
    } else {
      setSelectedDeviceId(id);
    }
  };

  const startConnectionMode = () => {
    setConnectionMode({ active: true, sourceId: null });
    log(`ケーブル接続モード: 接続元の機器をクリックしてください。`);
  };

  const startPing = (fromId, toId) => {
    const fromDevice = devices.find(d => d.id === fromId);
    const toDevice = devices.find(d => d.id === toId);

    if(!fromDevice || !toDevice) return;

    if(!isValidIP(fromDevice.ip) || !isValidIP(toDevice.ip)) {
        log(`エラー: IPアドレスの設定が正しくありません。`);
        return;
    }

    const path = findPath(devices, connections, fromId, toId);

    if (!path) {
      log(`Ping失敗: 経路が見つかりません。ケーブルを確認してください。`);
      return;
    }

    log(`Ping送信: ${fromDevice.ip} -> ${toDevice.ip}`);

    const newPacket = {
      id: generateId(),
      fromId,
      toId,
      path,
      currentIndex: 0,
      progress: 0,
      type: 'PING',
      status: 'active',
    };

    setPackets((prev) => [...prev, newPacket]);
  };

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setPackets((prevPackets) => {
        const nextPackets = [];

        prevPackets.forEach((p) => {
            const speed = 2; 
            let newProgress = p.progress + speed;

            if (newProgress >= 100) {
                const nextIndex = p.currentIndex + 1;
                
                if (nextIndex >= p.path.length - 1) {
                    if (p.status === 'active') {
                        if (p.type === 'PING') {
                             const target = devices.find(d => d.id === p.toId);
                             log(`応答あり: ${target ? target.ip : 'unknown'} (bytes=32 time=10ms)`);
                             setMissionFlags(prev => {
                                 if (prev.pingSuccess) return prev;
                                 return { ...prev, pingSuccess: true };
                             });
                             if (isEncrypted) {
                                 setMissionFlags(prev => {
                                     if (prev.encryptedSuccess) return prev;
                                     return { ...prev, encryptedSuccess: true };
                                 });
                             }
                        } else if (p.type === 'KEY_EXCHANGE') {
                             setMissionFlags(prev => {
                                 if (prev.encryptedSuccess) return prev;
                                 return { ...prev, encryptedSuccess: true };
                             });
                        }
                    }
                    return; 
                } else {
                    nextPackets.push({
                        ...p,
                        currentIndex: nextIndex,
                        progress: 0
                    });
                }
            } else {
                nextPackets.push({ ...p, progress: newProgress });
            }
        });

        return nextPackets;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [devices, isEncrypted]);

  const runEncryptionDemo = () => {
     if(connections.length === 0) {
         log("接続されている機器がありません。");
         return;
     }
     setIsEncrypted(!isEncrypted);
     if(!isEncrypted) {
         log("暗号化をONにしました。ハンドシェイクを開始します...");
         const conn = connections[0];
         const p1 = {
             id: generateId(), fromId: conn.from, toId: conn.to, path: [conn.from, conn.to],
             currentIndex: 0, progress: 0, type: 'KEY_EXCHANGE', status: 'active'
         };
         setTimeout(() => {
            const p2 = {
                id: generateId(), fromId: conn.to, toId: conn.from, path: [conn.to, conn.from],
                currentIndex: 0, progress: 0, type: 'KEY_EXCHANGE', status: 'active'
            };
            setPackets(prev => [...prev, p2]);
         }, 1000);

         setPackets(prev => [...prev, p1]);
     } else {
         log("暗号化をOFFにしました。");
     }
  };

  const resetSimulation = () => {
      if(confirm('キャンバスをクリアしますか？')) {
          resetSimulationState();
          log('シミュレーションをリセットしました');
      }
  };

  // --- Views ---

  if (view === 'lecture') {
      return html`<${LectureMode} onExit=${goToHome} />`;
  }

  if (view === 'home') {
    return html`
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-white border-b border-slate-200 py-6 px-8 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg text-white">
                <${Network} size=${32} />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-slate-800 tracking-tight">NetSim Builder</h1>
               <p className="text-slate-500 text-sm">インタラクティブ・ネットワーク構築シミュレーター</p>
             </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full p-8">
          
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <${School} className="text-emerald-600" />
              学習を始める (Start Learning)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                ${/* Free Mode Card */ ''}
                <div 
                  onClick=${startFreeMode}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <${LayoutTemplate} size=${64} className="text-indigo-600" />
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">自由制作モード</h3>
                      <p className="text-slate-500 mt-1">自由に機器を配置してLANを構築・実験します。</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <${Play} size=${24} className="ml-1" />
                    </div>
                  </div>
                </div>

                ${/* Lecture Mode Card (New) */ ''}
                 <div 
                  onClick=${startLectureMode}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <${BookOpen} size=${64} className="text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">解説・知識学習</h3>
                      <p className="text-slate-500 mt-1">ネットワークの基本用語や仕組みをスライドで学びます。</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <${BookOpen} size=${24} />
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <${BookOpen} className="text-blue-600" />
              ミッションに挑戦 (Drills)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${MISSION_SETS.map(set => html`
                <div 
                  key=${set.id}
                  onClick=${() => startMissionMode(set)}
                  className="bg-white flex flex-col rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all group overflow-hidden"
                >
                  <div className="h-2 bg-blue-500 w-0 group-hover:w-full transition-all duration-500"></div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                        MISSION x ${set.missions.length}
                      </span>
                      <span className="text-yellow-500 text-sm tracking-widest font-bold">${set.level}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      ${set.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      ${set.description}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-600 group-hover:text-blue-600">
                    <span>スタート</span>
                    <${ArrowRight} size=${16} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              `)}
            </div>
          </div>

        </main>
        
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
          &copy; NetSim Builder - 情報I ネットワーク実習用
        </footer>
      </div>
    `;
  }

  // Simulation View
  return html`
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      
      ${/* Top Banner */ ''}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
             <button 
                onClick=${goToHome}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                title="ホームに戻る"
             >
                <${Home} size=${20} />
             </button>
             <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          </div>

          ${mode === 'quiz' && currentMission ? html`
              <div className="flex items-center gap-4 flex-1 ml-4 min-w-0">
                <div className="flex flex-col min-w-0">
                     <span className="text-xs font-bold text-blue-600 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                         ${currentMissionSet.title} (${currentMissionIndex + 1}/${currentMissionSet.missions.length})
                     </span>
                     <div className="flex items-center gap-2">
                         <h2 className="text-lg font-bold text-slate-800 truncate">${currentMission.title}</h2>
                         <button 
                            onClick=${() => setShowHintModal(true)}
                            className="p-1 text-slate-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                            title="ヒントを見る"
                         >
                            <${HelpCircle} size=${20} />
                         </button>
                     </div>
                </div>
                <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block"></div>
                <p className="text-sm text-slate-600 hidden lg:block flex-1 truncate">${currentMission.description}</p>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3 ml-2">
                   ${missionError && html`
                       <div className="text-xs text-red-500 font-bold animate-pulse flex items-center gap-1 bg-red-50 px-2 py-1 rounded hidden sm:flex">
                           <${AlertCircle} size=${12} />
                           確認してください
                       </div>
                   `}
                   <button 
                       onClick=${checkMissionCompletion}
                       className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-bold flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap text-sm"
                   >
                       <${CheckCircle} size=${18} />
                       <span className="hidden sm:inline">答え合わせ</span>
                       <span className="sm:hidden">判定</span>
                   </button>
              </div>
          ` : html`
              <div className="flex items-center gap-4 flex-1 ml-4">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hidden sm:block">
                      <${LayoutTemplate} size=${20} />
                  </div>
                  <div>
                      <h2 className="text-lg font-bold text-slate-800">自由制作モード</h2>
                      <p className="text-xs text-slate-500 hidden sm:block">自由に機器を配置してLANを構築できます</p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                  <button 
                      onClick=${resetSimulation}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-bold text-sm flex items-center gap-2 border border-transparent hover:border-red-100 whitespace-nowrap"
                  >
                      <${RefreshCw} size=${16} /> リセット
                  </button>
              </div>
          `}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <${Sidebar} 
            onStartConnection=${startConnectionMode} 
            connectionModeActive=${connectionMode.active}
            mode=${mode}
        />
        
        <${NetworkCanvas}
          devices=${devices}
          connections=${connections}
          packets=${packets}
          selectedDeviceId=${selectedDeviceId}
          connectionMode=${connectionMode}
          onDeviceMove=${moveDevice}
          onDeviceClick=${handleDeviceClick}
          onBackgroundClick=${() => {
              setSelectedDeviceId(null);
              setConnectionMode({ active: false, sourceId: null });
          }}
          onDropDevice=${addDevice}
          isEncrypted=${isEncrypted}
        />

        <${Inspector}
          selectedDevice=${selectedDeviceId ? devices.find(d => d.id === selectedDeviceId) || null : null}
          devices=${devices}
          connections=${connections}
          onUpdateDevice=${updateDevice}
          onDeleteDevice=${deleteDevice}
          onDeleteConnection=${deleteConnection}
          onPing=${startPing}
          isEncrypted=${isEncrypted}
          onToggleEncryption=${runEncryptionDemo}
          logs=${logs}
        />
      </div>

      ${showSuccessModal && mode === 'quiz' && html`
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform scale-100 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                  <button 
                    onClick=${() => setShowSuccessModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                  >
                      <${X} size=${24} />
                  </button>
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <${CheckCircle} size=${32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">ミッションクリア！</h3>
                  <p className="text-slate-600 mb-6">おめでとうございます。構成は完璧です。</p>
                  
                  ${/* Learning Point Section */''}
                  ${currentMission && currentMission.explanation && html`
                    <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 text-left">
                        <div className="flex items-center gap-2 mb-2 text-blue-700">
                            <${GraduationCap} size=${20} />
                            <span className="font-bold text-sm uppercase tracking-wider">学習ポイント</span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">
                            ${currentMission.explanation}
                        </p>
                    </div>
                  `}

                  <div className="flex gap-3 justify-center">
                      ${currentMissionSet && currentMissionIndex < currentMissionSet.missions.length - 1 ? html`
                          <button 
                            onClick=${nextMission}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                          >
                              次のミッションへ <${ArrowRight} size=${18} />
                          </button>
                      ` : html`
                          <div className="flex flex-col gap-2 w-full">
                              <div className="text-blue-600 font-bold text-lg mb-2">コース達成おめでとう！</div>
                              <button 
                                onClick=${goToHome}
                                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                              >
                                  ホームに戻る
                              </button>
                          </div>
                      `}
                  </div>
              </div>
          </div>
      `}

      ${/* Custom Exit Confirmation Modal */ ''}
      ${showExitConfirm && html`
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl transform scale-100 text-center relative border border-slate-200">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <${LogOut} size=${24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">ホームに戻りますか？</h3>
                  <p className="text-sm text-slate-600 mb-6">現在の作業内容（配置した機器や設定）は失われます。</p>
                  
                  <div className="flex gap-3 justify-center">
                      <button 
                          onClick=${() => setShowExitConfirm(false)}
                          className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
                      >
                          キャンセル
                      </button>
                      <button 
                          onClick=${handleExitConfirm}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                      >
                          戻る
                      </button>
                  </div>
              </div>
          </div>
      `}

      ${/* Mission Info / Hint Modal */ ''}
      ${showHintModal && currentMission && html`
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
              <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                      <h3 className="font-bold flex items-center gap-2">
                          <${HelpCircle} size=${20} />
                          ミッション詳細・ヒント
                      </h3>
                      <button onClick=${() => setShowHintModal(false)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                          <${X} size=${20} />
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto">
                      <div className="mb-6">
                          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">MISSION TITLE</div>
                          <h4 className="text-xl font-bold text-slate-800">${currentMission.title}</h4>
                      </div>
                      
                      <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">概要</div>
                          <p className="text-slate-700 leading-relaxed">${currentMission.description}</p>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <div className="flex items-center gap-2 mb-2">
                              <${Lightbulb} size=${18} className="text-amber-500" />
                              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">ヒント</span>
                          </div>
                          <p className="text-amber-800 text-sm leading-relaxed font-medium">
                              ${currentMission.hint || "ヒントはありません。説明をよく読んで挑戦してみましょう。"}
                          </p>
                      </div>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                      <button 
                          onClick=${() => setShowHintModal(false)}
                          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm"
                      >
                          閉じる
                      </button>
                  </div>
              </div>
          </div>
      `}
    </div>
  `;
};

export default App;