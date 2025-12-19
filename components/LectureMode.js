import React, { useState } from 'react';
import htm from 'htm';
import { ChevronRight, ChevronLeft, BookOpen, Home, CheckCircle } from 'lucide-react';
import { LECTURE_SLIDES } from '../data/lectures.js';

const html = htm.bind(React.createElement);

export const LectureMode = ({ onExit }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const slide = LECTURE_SLIDES[currentSlideIndex];
    const isFirst = currentSlideIndex === 0;
    const isLast = currentSlideIndex === LECTURE_SLIDES.length - 1;

    const nextSlide = () => {
        if (!isLast) setCurrentSlideIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (!isFirst) setCurrentSlideIndex(prev => prev - 1);
    };

    return html`
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans h-screen w-screen overflow-hidden">
            ${/* Header */ ''}
            <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <${BookOpen} size=${24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">情報通信ネットワーク</h1>
                        <p className="text-xs text-slate-500">基本知識レクチャー</p>
                    </div>
                </div>
                <button 
                    onClick=${onExit}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-bold text-sm"
                >
                    <${Home} size=${18} />
                    ホームに戻る
                </button>
            </header>

            ${/* Main Slide Content */ ''}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-slate-100">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[500px] animate-in fade-in zoom-in-95 duration-300">
                    
                    ${/* Slide Header */ ''}
                    <div className="bg-slate-50 border-b border-slate-100 p-6 md:p-8 flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                            ${slide.icon}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            ${slide.title}
                        </h2>
                    </div>

                    ${/* Slide Body */ ''}
                    <div className="p-6 md:p-10 flex-1 text-base md:text-lg leading-relaxed text-slate-700">
                        ${slide.content}
                    </div>

                    ${/* Progress Bar */ ''}
                    <div className="h-1 bg-slate-100 w-full">
                        <div 
                            className="h-full bg-indigo-600 transition-all duration-500"
                            style=${{ width: `${((currentSlideIndex + 1) / LECTURE_SLIDES.length) * 100}%` }}
                        ></div>
                    </div>

                    ${/* Footer Navigation */ ''}
                    <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
                        <button 
                            onClick=${prevSlide}
                            disabled=${isFirst}
                            className=${`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                                ${isFirst 
                                    ? 'text-slate-300 cursor-not-allowed' 
                                    : 'text-slate-600 hover:bg-white hover:shadow-md'
                                }
                            `}
                        >
                            <${ChevronLeft} size=${20} /> 前へ
                        </button>

                        <span className="text-sm font-bold text-slate-400">
                            ${currentSlideIndex + 1} / ${LECTURE_SLIDES.length}
                        </span>

                        ${!isLast ? html`
                            <button 
                                onClick=${nextSlide}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                            >
                                次へ <${ChevronRight} size=${20} />
                            </button>
                        ` : html`
                            <button 
                                onClick=${onExit}
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-green-200 transition-all active:scale-95 animate-pulse"
                            >
                                学習を完了する <${CheckCircle} size=${20} />
                            </button>
                        `}
                    </div>
                </div>
            </main>
        </div>
    `;
};
