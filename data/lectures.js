import React from 'react';
import htm from 'htm';
import { 
    Network, Globe, Smartphone, Server, Box, Router, Split, Map, 
    List, MessageSquare, Layers, ShieldCheck, Wifi, Scissors, 
    ArrowRight, Home, Mail, CheckSquare, Cloud, Laptop, FileText, XCircle
} from 'lucide-react';

const html = htm.bind(React.createElement);

export const LECTURE_SLIDES = [
    {
        id: 1,
        title: "ネットワークの構成",
        icon: html`<${Network} size=${40} className="text-blue-600" />`,
        content: html`
            <div className="space-y-6">
                
                ${/* Graphical Diagram */ ''}
                <div className="flex flex-col items-center py-4">
                    <div className="relative z-10 bg-blue-100 p-4 rounded-full text-blue-600 shadow-sm">
                        <${Globe} size=${48} />
                        <span className="absolute top-full left-1/2 -translate-x-1/2 text-xs font-bold text-blue-800 mt-1 whitespace-nowrap">インターネット</span>
                    </div>
                    <div className="h-12 border-l-2 border-dashed border-slate-300"></div>
                    <div className="relative w-full max-w-sm bg-slate-50 border-2 border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-full flex items-center gap-1">
                            <${Home} size=${12} /> 家や学校 (LAN)
                        </div>
                        <div className="flex justify-around items-end text-slate-600">
                            <div className="flex flex-col items-center gap-1">
                                <${Laptop} size=${32} />
                                <span className="text-[10px]">PC</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <${Smartphone} size=${28} />
                                <span className="text-[10px]">スマホ</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <${Wifi} size=${24} />
                                <span className="text-[10px]">Wi-Fi</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-lg text-blue-800 mb-1 flex items-center gap-2">
                        <${Network} size=${20} /> LAN (Local Area Network)
                    </h3>
                    <p className="text-slate-700 text-sm">
                        図の下側のように、学校や会社、家庭内などの<strong>限られた範囲</strong>のネットワーク。
                    </p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-lg text-indigo-800 mb-1 flex items-center gap-2">
                        <${Globe} size=${20} /> WAN (Wide Area Network)
                    </h3>
                    <p className="text-slate-700 text-sm">
                        LANどうしを<strong>広い範囲</strong>で結んだネットワーク。インターネットも巨大なWANの一つと言えます。
                    </p>
                </div>
            </div>
        `,
        quiz: {
            question: "学校や会社など、限られた範囲のネットワークを何と呼びますか？",
            options: ["WAN", "LAN", "ISP"],
            answerIndex: 1,
            explanation: "正解！LAN (Local Area Network) は、図の家や学校の中のように、限定された範囲のネットワークです。"
        }
    },
    {
        id: 2,
        title: "接続に必要なハードウェア",
        icon: html`<${Box} size=${40} className="text-orange-600" />`,
        content: html`
            <div className="space-y-6">
                
                ${/* Hardware Connection Flow Diagram */ ''}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto">
                    <div className="text-xs font-bold text-slate-400 mb-2 text-center uppercase tracking-widest">Connection Flow</div>
                    <div className="flex items-center justify-center min-w-[300px] gap-2">
                        <div className="flex flex-col items-center gap-1 min-w-[50px]">
                            <${Cloud} className="text-blue-400" size=${24} />
                            <span className="text-[10px] text-slate-500 font-bold">WAN</span>
                        </div>
                        <${ArrowRight} size=${16} className="text-slate-300" />
                        
                        <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-slate-200 shadow-sm min-w-[60px]">
                            <${Box} className="text-slate-600" size=${24} />
                            <span className="text-[10px] font-bold">ONU</span>
                        </div>
                        <${ArrowRight} size=${16} className="text-slate-300" />

                        <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-orange-200 shadow-sm min-w-[60px]">
                            <${Router} className="text-orange-600" size=${24} />
                            <span className="text-[10px] font-bold text-orange-700">Router</span>
                        </div>
                        <${ArrowRight} size=${16} className="text-slate-300" />

                        <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-green-200 shadow-sm min-w-[60px]">
                            <${Split} className="text-green-600" size=${24} />
                            <span className="text-[10px] font-bold text-green-700">Switch</span>
                        </div>
                        
                        <div className="h-px w-4 bg-slate-300"></div>
                        <${Laptop} size=${20} className="text-slate-500" />
                    </div>
                </div>

                <div className="grid gap-3">
                    <div className="flex gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <div className="p-2 bg-slate-100 rounded h-fit"><${Box} size=${20} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">ONU (光回線終端装置)</h3>
                            <p className="text-xs text-slate-600 mt-1">光信号 ↔ 電気信号 の翻訳機。</p>
                        </div>
                    </div>

                    <div className="flex gap-3 bg-white p-3 rounded-lg border border-orange-100 shadow-sm">
                        <div className="p-2 bg-orange-100 rounded h-fit text-orange-600"><${Router} size=${20} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">ルータ (Router)</h3>
                            <p className="text-xs text-slate-600 mt-1">異なるネットワークをつなぐ関所。道案内役。</p>
                        </div>
                    </div>

                    <div className="flex gap-3 bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                        <div className="p-2 bg-green-100 rounded h-fit text-green-600"><${Split} size=${20} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">スイッチ (Hub/Switch)</h3>
                            <p className="text-xs text-slate-600 mt-1">LAN内のコンセントを増やすタコ足配線役。</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
        quiz: {
            question: "異なるネットワークを接続し、データの最適な経路を決める機器はどれ？",
            options: ["ONU", "スイッチ", "ルーター"],
            answerIndex: 2,
            explanation: "正解！図の真ん中にある「ルーター」が、外（WAN）と中（LAN）をつなぐ役割を果たします。"
        }
    },
    {
        id: 3,
        title: "通信方式の移り変わり",
        icon: html`<${Scissors} size=${40} className="text-red-600" />`,
        content: html`
            <div className="space-y-6">
                
                ${/* Visual Comparison */ ''}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 opacity-60 flex flex-col items-center">
                        <div className="text-xs font-bold mb-2 bg-slate-200 px-2 py-1 rounded">昔：回線交換</div>
                        <div className="flex items-center justify-between w-full my-2 px-2">
                            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                            <div className="h-1 flex-1 bg-slate-600 mx-1 relative">
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px]">占有中</span>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                        </div>
                        <p className="text-[10px] text-center text-slate-500">
                            1本の電話線を2人で独占。<br/>他の人は使えない。
                        </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200 flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">現在の主流</div>
                        <div className="text-xs font-bold mb-2 text-red-700 bg-red-100 px-2 py-1 rounded">パケット交換</div>
                        
                        <div className="flex items-center justify-between w-full my-2 px-2">
                            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                            <div className="flex-1 mx-1 flex gap-1 justify-center items-center h-4 bg-slate-200 rounded-full px-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                                <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                        </div>
                        <p className="text-[10px] text-center text-slate-600 leading-tight">
                            データを<strong className="text-red-600">パケット</strong>に分割。<br/>
                            みんなで回線を共有！
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                        <${Scissors} size=${20} /> パケット交換方式のメリット
                    </h3>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        <li>回線を占有しないため、<strong>利用効率が高い</strong>。</li>
                        <li>これにより、インターネットの<strong>常時接続</strong>や定額制が可能になった。</li>
                        <li>データが壊れても、そのパケットだけ送り直せば良い。</li>
                    </ul>
                </div>
            </div>
        `,
        quiz: {
            question: "データを小さく分割して送信し、回線の利用効率を高めた現在の通信方式は？",
            options: ["回線交換方式", "パケット交換方式", "伝言ゲーム方式"],
            answerIndex: 1,
            explanation: "その通り！「パケット交換方式」の図のように、データを細切れにすることで、一本の回線をみんなで譲り合って効率よく使えます。"
        }
    },
    {
        id: 4,
        title: "ルーティングとIPアドレス",
        icon: html`<${Map} size=${40} className="text-green-600" />`,
        content: html`
            <div className="space-y-6">
                
                ${/* IP Address Visual */ ''}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-100 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 w-full max-w-xs relative">
                        <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm transform rotate-12">
                            IP Address
                        </div>
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                            <${Mail} size=${24} className="text-blue-500" />
                            <span className="text-xs text-slate-500 font-bold uppercase">Destination Info</span>
                        </div>
                        <div className="font-mono text-xl font-bold text-slate-700 text-center tracking-wider">
                            192.168.1.1
                        </div>
                        <div className="text-[10px] text-center text-slate-400 mt-1">
                            ( 0〜255 の数字 × 4つ )
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                     <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                            <${Map} size=${18} className="text-green-600" /> ルーティング (Routing)
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            ルーターが地図（ルーティングテーブル）を見て、パケットを最適な経路へ送り出す仕組みです。
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                            <${List} size=${18} className="text-blue-600" /> IPアドレス
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            インターネット上の<strong>住所</strong>です。世界中で重複しないように管理されています（グローバルIPの場合）。
                        </p>
                    </div>
                </div>
            </div>
        `,
        quiz: {
            question: "インターネット上の「住所」の役割を持つ番号はどれですか？",
            options: ["郵便番号", "電話番号", "IPアドレス"],
            answerIndex: 2,
            explanation: "正解です。図のカードのように、IPアドレス（例：192.168.1.1）を宛先としてデータが届けられます。"
        }
    },
    {
        id: 5,
        title: "プロトコル (Protocol)",
        icon: html`<${MessageSquare} size=${40} className="text-indigo-600" />`,
        content: html`
            <div className="space-y-6">
                
                ${/* Protocol Analogy Visual */ ''}
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col items-center text-center">
                     <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                            <div className="text-2xl">🗣️ 🇯🇵</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-1">日本語</div>
                        </div>
                        <div className="text-slate-400 font-bold text-xl">≠</div>
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                            <div className="text-2xl">🇺🇸 🗣️</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-1">English</div>
                        </div>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full text-xs font-bold text-red-500 shadow-sm mb-4">
                        <${XCircle} size=${12} className="inline mr-1"/>
                        会話が成立しない！
                    </div>

                    <div className="w-full h-px bg-indigo-200 mb-4"></div>

                    <div className="flex items-center justify-center gap-2 text-indigo-800 font-bold">
                        <${FileText} size=${20} />
                        <span>共通のルール（規約）が必要</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">
                        プロトコルの役割
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                        メーカーやOSが違うコンピュータ同士でも、<strong>「プロトコル（通信規約）」</strong>という共通の約束事を守ることで、正しくデータをやり取りできます。
                    </p>
                </div>
            </div>
        `,
        quiz: {
            question: "通信を成立させるための「約束事」や「規約」を何と呼びますか？",
            options: ["プロトコル", "アルゴリズム", "プログラム"],
            answerIndex: 0,
            explanation: "正解！プロトコル（Protocol）は、言語のルールのようなもので、これが合うことで初めて通信が成立します。"
        }
    },
    {
        id: 6,
        title: "TCP/IP",
        icon: html`<${Layers} size=${40} className="text-teal-600" />`,
        content: html`
            <div className="space-y-6">
                <p className="text-slate-700 font-medium text-sm">
                    インターネットの標準プロトコルセット<strong>「TCP/IP」</strong>は、役割ごとに階層（レイヤー）に分かれています。
                </p>

                ${/* TCP/IP Stack Visual */ ''}
                <div className="flex flex-col gap-2 max-w-sm mx-auto">
                    
                    ${/* TCP Layer */ ''}
                    <div className="flex items-stretch bg-white rounded-lg border-2 border-teal-100 overflow-hidden shadow-sm">
                        <div className="bg-teal-100 w-16 flex items-center justify-center flex-col p-2 text-teal-800">
                            <${CheckSquare} size=${24} />
                            <span className="text-xs font-bold mt-1">TCP</span>
                        </div>
                        <div className="p-3 flex-1">
                            <h4 className="font-bold text-teal-900 text-sm">正確に届ける</h4>
                            <p className="text-xs text-slate-600 mt-1">
                                データの漏れや順序の間違いをチェックし、信頼性を保証する。
                            </p>
                        </div>
                    </div>

                    ${/* Down Arrow */ ''}
                    <div className="flex justify-center -my-1 z-10">
                        <div className="bg-slate-200 p-1 rounded-full"><${ArrowRight} size=${12} className="rotate-90 text-slate-500" /></div>
                    </div>

                    ${/* IP Layer */ ''}
                    <div className="flex items-stretch bg-white rounded-lg border-2 border-blue-100 overflow-hidden shadow-sm">
                        <div className="bg-blue-100 w-16 flex items-center justify-center flex-col p-2 text-blue-800">
                            <${Map} size=${24} />
                            <span className="text-xs font-bold mt-1">IP</span>
                        </div>
                        <div className="p-3 flex-1">
                            <h4 className="font-bold text-blue-900 text-sm">宛先へ届ける</h4>
                            <p className="text-xs text-slate-600 mt-1">
                                IPアドレスを使って、最適な経路で相手までパケットを運ぶ。
                            </p>
                        </div>
                    </div>

                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 border border-slate-200 text-center">
                    この2つを中心に4つの階層で構成されるため、「TCP/IP」と呼ばれます。
                </div>
            </div>
        `,
        quiz: {
            question: "データの漏れや間違いがないか確認し、正確性を保証するプロトコルは？",
            options: ["IP", "TCP", "HTTP"],
            answerIndex: 1,
            explanation: "正解です！図の上側にある「TCP」が品質管理（チェック）を行い、「IP」が配送を担当するという分担になっています。"
        }
    }
];