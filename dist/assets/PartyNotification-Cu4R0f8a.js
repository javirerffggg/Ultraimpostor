import{r as o,j as e}from"./index-D6CZuHAI.js";import{B as l}from"./beer-BT0JssYu.js";import"./createLucideIcon-5AgJlP7S.js";const x=({prompt:s,theme:c})=>{if(o.useEffect(()=>{if(!s)return;window.speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(s);t.lang="es-ES",t.rate=1.1;const r=window.speechSynthesis.getVoices().find(n=>n.lang.includes("es-ES")||n.lang.includes("es"));r&&(t.voice=r),window.speechSynthesis.speak(t)},[s]),!s)return null;const a="#00ffff",i="#ff00ff";return e.jsxs("div",{className:"w-full max-w-sm relative group my-4 z-50",children:[e.jsxs("div",{className:"relative animate-glitch-enter",children:[e.jsxs("div",{className:"p-4 border-l-4 relative overflow-hidden backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,255,0.3)]",style:{borderLeftColor:i,backgroundColor:"rgba(20, 0, 40, 0.85)",borderTopRightRadius:"1rem",borderBottomRightRadius:"1rem"},children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"animate-pulse",children:e.jsx(l,{size:18,color:a})}),e.jsx("span",{style:{color:i},className:"text-[10px] font-black uppercase tracking-[0.2em] animate-pulse",children:"PARTY MODE"})]}),e.jsx("div",{className:"h-1 w-20 bg-gray-800 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 animate-shrink-width"})})]}),e.jsx("p",{style:{color:a,textShadow:"2px 0 #ff00ff"},className:"text-sm font-bold leading-snug glitch-text","data-text":s,children:s})]}),e.jsx("div",{className:"absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"}),e.jsx("div",{className:"absolute -bottom-1 -left-1 w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce"})]}),e.jsx("style",{children:`
                .animate-shrink-width {
                    animation: shrink 8s linear forwards;
                }

                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }

                .animate-glitch-enter {
                    animation: glitch-anim 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }

                @keyframes glitch-anim {
                    0% { transform: translate(0); opacity: 0; }
                    20% { transform: translate(-2px, 2px); opacity: 1; }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); opacity: 1; }
                }

                .glitch-text {
                    position: relative;
                }
                
                /* Subtle constant glitch jitter */
                .glitch-text:hover {
                    animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
                }
                
                @keyframes glitch-skew {
                    0% { transform: skew(0deg); }
                    20% { transform: skew(-2deg); }
                    40% { transform: skew(2deg); }
                    60% { transform: skew(-1deg); }
                    80% { transform: skew(1deg); }
                    100% { transform: skew(0deg); }
                }
            `})]})};export{x as PartyNotification};
