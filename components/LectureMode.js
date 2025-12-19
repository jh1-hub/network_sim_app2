import React, { useState, useEffect } from 'react';
import htm from 'htm';
import { ChevronRight, ChevronLeft, BookOpen, Home, CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import { LECTURE_SLIDES } from '../data/lectures.js';

const html = htm.bind(React.createElement);

export const LectureMode = ({ onExit, onComplete }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [quizState, setQuizState] = useState({
        answered: false,
        correct: false,
        selectedOption: null
    });

    const slide = LECTURE_SLIDES[currentSlideIndex];
    const isFirst = currentSlideIndex === 0;
    const isLast = currentSlideIndex === LECTURE_SLIDES.length - 1;

    // Reset quiz state when slide changes
    useEffect(() => {
        setQuizState({
            answered: false,
            correct: false, // Default to false if quiz exists
            selectedOption: null
        });
    }, [currentSlideIndex]);

    const handleOptionClick = (index) => {
        if (quizState.answered && quizState.correct) return; // Already answered correctly

        const isCorrect = index === slide.quiz.answerIndex;
        setQuizState({
            answered: true,
            correct: isCorrect,
            selectedOption: index
        });
    };

    const nextSlide = () => {
        if (!isLast) setCurrentSlideIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (!isFirst) setCurrentSlideIndex(prev => prev - 1);
    };

    // Determine if we can proceed
    // Proceed if: No quiz OR (Quiz exists AND Answered Correctly)
    const canProceed = !slide.quiz || (quizState.answered && quizState.correct);

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
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[500px] animate-in fade-in zoom-in-95 duration-300 mb-8">
                    
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
                    <div className="p-6 md:p-10 text-base md:text-lg leading-relaxed text-slate-700">
                        ${slide.content}
                    </div>

                    ${/* Interactive Quiz Section */ ''}
                    ${slide.quiz && html`
                        <div className="px-6 md:px-10 pb-8">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <${HelpCircle} size=${18} /> 理解度チェック
                                </h3>
                                <p className="font-bold text-slate-800 mb-4 text-lg">Q. ${slide.quiz.question}</p>
                                
                                <div className="grid grid-cols-1 gap-3 mb-4">
                                    ${slide.quiz.options.map((option, idx) => {
                                        let btnClass = "p-4 rounded-lg border-2 text-left font-bold transition-all ";
                                        if (quizState.answered && quizState.selectedOption === idx) {
                                            if (idx === slide.quiz.answerIndex) {
                                                btnClass += "bg-green-100 border-green-500 text-green-800";
                                            } else {
                                                btnClass += "bg-red-100 border-red-500 text-red-800";
                                            }
                                        } else if (quizState.answered && idx === slide.quiz.answerIndex) {
                                            // Reveal correct answer if wrong one was picked
                                            btnClass += "bg-green-50 border-green-200 text-green-600";
                                        } else {
                                            btnClass += "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700";
                                        }
                                        
                                        return html`
                                            <button 
                                                key=${idx}
                                                onClick=${() => handleOptionClick(idx)}
                                                disabled=${quizState.answered && quizState.correct}
                                                className=${btnClass}
                                            >
                                                ${option}
                                            </button>
                                        `;
                                    })}
                                </div>

                                ${/* Feedback Message */ ''}
                                ${quizState.answered && html`
                                    <div className=${`p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${quizState.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        <div className="mt-1">
                                            ${quizState.correct ? html`<${CheckCircle} size=${20} />` : html`<${XCircle} size=${20} />`}
                                        </div>
                                        <div>
                                            <div className="font-bold mb-1">${quizState.correct ? "正解！" : "残念..."}</div>
                                            <div className="text-sm leading-relaxed">${quizState.correct ? slide.quiz.explanation : "もう一度考えてみましょう。"}</div>
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    `}

                    ${/* Progress Bar */ ''}
                    <div className="h-1 bg-slate-100 w-full mt-auto">
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
                            <div className="relative group">
                                <button 
                                    onClick=${nextSlide}
                                    disabled=${!canProceed}
                                    className=${`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95
                                        ${canProceed 
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200' 
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    次へ <${ChevronRight} size=${20} />
                                </button>
                                ${!canProceed && html`
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        クイズに正解して進みましょう
                                    </div>
                                `}
                            </div>
                        ` : html`
                            <button 
                                onClick=${onComplete}
                                disabled=${!canProceed}
                                className=${`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 animate-pulse
                                     ${canProceed 
                                        ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-green-200' 
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed animate-none'
                                    }
                                `}
                            >
                                次の実習へ進む <${CheckCircle} size=${20} />
                            </button>
                        `}
                    </div>
                </div>
            </main>
        </div>
    `;
};