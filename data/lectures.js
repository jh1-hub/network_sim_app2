import React from 'react';
import htm from 'htm';
import { Network, Globe, Smartphone, Server, Box, Router, Split, Map, List, MessageSquare, Layers, ShieldCheck, Wifi, Scissors } from 'lucide-react';

const html = htm.bind(React.createElement);

export const LECTURE_SLIDES = [
    {
        id: 1,
        title: "ネットワークの構成",
        icon: html`<${Network} size=${40} className="text-blue-600" />`,
        content: html`
            <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-lg text-blue-800 mb-2 flex items-center gap-2">
                        <${Network} size=${20} /> LAN (Local Area Network)
                    </h3>
                    <p className="text-slate-700">
                        学校や会社、家庭内など、<strong>限られた範囲</strong>のネットワークのことです。<br/>
                        有線LAN（イーサネットなど）や無線LAN（Wi-Fi）で機器をつなぎます。
                    </p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-lg text-indigo-800 mb-2 flex items-center gap-2">
                        <${Globe} size=${20} /> WAN (Wide Area Network)
                    </h3>
                    <p className="text-slate-700">
                        LANどうしを<strong>広い範囲</strong>で結んだネットワークです。<br/>
                        携帯電話回線（モバイル通信）などもWANの一種に含まれます。
                    </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">インターネットとISP</h3>
                    <p className="text-slate-600 mb-2">
                        世界中のLANやWANが接続され、世界規模に発展したネットワークが<strong>インターネット</strong>です。
                    </p>
                    <p className="text-slate-600 text-sm">
                        ※ 私たちがインターネットに接続する際は、<strong>ISP (インターネットサービスプロバイダ)</strong> という接続代行業者と契約します。
                    </p>
                </div>
            </div>
        `
    },
    {
        id: 2,
        title: "接続に必要なハードウェア",
        icon: html`<${Box} size=${40} className="text-orange-600" />`,
        content: html`
            <div className="grid gap-4">
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                        <${Box} size=${24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">ONU (光回線終端装置)</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            光ファイバーの「光信号」と、LAN内の「電気信号」を相互に変換する装置です。家の外から来た光回線はまずここにつながります。
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                        <${Router} size=${24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">ルータ (Router)</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            ネットワークどうし（例：家のLANと外のインターネット）を接続するための機器です。データの最適な経路を選びます。
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                        <${Split} size=${24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">集線装置 (ハブやスイッチ)</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            LANにつながれた複数の機器（PCやプリンタ）を相互に接続するための装置です。タコ足配線のようにポートを増やします。
                        </p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 3,
        title: "通信方式の移り変わり",
        icon: html`<${Scissors} size=${40} className="text-red-600" />`,
        content: html`
            <div className="space-y-6">
                <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 opacity-80">
                    <h3 className="font-bold text-gray-700 mb-2">これまでの方式：回線交換方式</h3>
                    <p className="text-sm text-gray-600 mb-2">電話回線などで利用されていた方式。</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                        <li>通信する2者が回線を<strong>占有</strong>する。</li>
                        <li>通信は安定するが、他の人がその回線を使えず、効率が悪い。</li>
                    </ul>
                </div>

                <div className="flex justify-center text-slate-400">
                    <span className="text-2xl">⬇ 進化</span>
                </div>

                <div className="bg-red-50 p-5 rounded-xl border border-red-200">
                    <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                        <${Scissors} size=${20} /> パケット交換方式
                    </h3>
                    <p className="text-sm text-slate-700 mb-3">
                        データを「<strong>パケット</strong>」という小さな単位に分割して送る方式。
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-red-100 text-sm text-slate-600">
                        <strong className="text-red-600">メリット：</strong><br/>
                        異なる宛先のパケットを同じ回線に混ぜて流すことができるため、回線の利用効率が劇的に高くなりました。<br/>
                        これにより、インターネットの常時接続が可能になりました。
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 4,
        title: "ルーティングとIPアドレス",
        icon: html`<${Map} size=${40} className="text-green-600" />`,
        content: html`
            <div className="space-y-6">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                        <${Map} className="text-green-600" /> ルーティング (Routing)
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        パケット転送用の通信経路の中から、<strong>最適な経路を選択する仕組み</strong>のことです。<br/>
                        ルータの中にある「ルーティングテーブル（経路情報の地図）」に従って決定されます。
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                        <${List} className="text-blue-600" /> IPアドレス
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        インターネット上のコンピュータに割り当てられた<strong>固有の番号（住所）</strong>です。
                    </p>
                    <div className="bg-slate-100 p-3 rounded font-mono text-center text-slate-700 border border-slate-300">
                        192.168.1.1
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        ※ 一般的に、0～255の数字4つで表記されます（32ビット）。
                    </p>
                </div>
            </div>
        `
    },
    {
        id: 5,
        title: "プロトコル (Protocol)",
        icon: html`<${MessageSquare} size=${40} className="text-indigo-600" />`,
        content: html`
            <div className="space-y-6">
                <div className="text-center p-4">
                    <p className="text-lg font-bold text-slate-700 mb-2">「想定している言語が異なると、<br/>コミュニケーションは成立しません」</p>
                    <div className="flex justify-center gap-8 text-4xl my-4">
                        <span>🗣️ 🇯🇵</span>
                        <span className="text-slate-300">⚡❓</span>
                        <span>🇺🇸 🗣️</span>
                    </div>
                </div>

                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-800 mb-2">プロトコルとは？</h3>
                    <p className="text-slate-700 mb-2">
                        ネットワークにおける<strong>「通信規約（約束事）」</strong>です。
                    </p>
                    <p className="text-sm text-slate-600">
                        データの形式や送る手順をあらかじめ決めておくことで、異なるメーカーの機器同士でも通信ができるようになります。
                    </p>
                </div>
            </div>
        `
    },
    {
        id: 6,
        title: "TCP/IP",
        icon: html`<${Layers} size=${40} className="text-teal-600" />`,
        content: html`
            <div className="space-y-6">
                <p className="text-slate-700 font-medium">
                    インターネットで標準的に用いられているプロトコルの集まりを<strong>TCP/IP</strong>と呼びます。
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex justify-between">
                            IP プロトコル
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">宛先へ届ける</span>
                        </h3>
                        <p className="text-sm text-slate-600 mt-2">
                            <strong>IPアドレス</strong>を用いて<strong>ルーティング</strong>を行い、パケットを相手まで届ける役割。
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border-l-4 border-teal-500 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex justify-between">
                            TCP プロトコル
                            <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">正確に届ける</span>
                        </h3>
                        <p className="text-sm text-slate-600 mt-2">
                            データの漏れや順序の間違いがないか確認し、<strong>データの正確性を保証する</strong>役割。
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 border border-slate-200">
                    <p>
                        インターネットでは通信機能を4つの階層に分けて管理しており、中心となるこの2つのプロトコルから「TCP/IP」と呼ばれています。
                    </p>
                </div>
            </div>
        `
    }
];
