import React from 'react';
import { motion } from 'framer-motion';
import { EmojiMood } from '../types';
import { SPRING_TRANSITION } from '../constants';

interface EmojiCharacterProps {
  mood: EmojiMood;
}

export const EmojiCharacter: React.FC<EmojiCharacterProps> = ({ mood }) => {
  // Family variants for coordinated movement
  const familyContainer = {
    idle: { y: 0, rotate: 0, scale: 1 },
    happy: { y: -5, rotate: 0, scale: 1 },
    shy: { y: 15, rotate: -2, scale: 0.95 }, // Shrink back and tilt away slightly for privacy
    excited: { y: -10, rotate: 0, scale: 1.05 },
    confused: { y: 0, rotate: 0, scale: 1 }
  };

  const eyeState = mood === EmojiMood.SHY ? "closed" : "open";
  const mouthState = mood;

  // Hand variants for Privacy (Shy) mode
  const handCoverEyes = {
    rest: { y: 200, opacity: 0 },
    cover: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative w-80 h-64 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 300 200"
        className="w-full h-full drop-shadow-2xl"
        initial="idle"
        animate={mood}
        variants={familyContainer}
        transition={SPRING_TRANSITION}
      >
        {/* --- FATHER (Left) --- */}
        <g transform="translate(20, 40)">
          {/* Body */}
          <path d="M 10 70 Q 40 60 70 70 L 70 140 L 10 140 Z" fill="#60A5FA" />
          {/* Neck */}
          <rect x="30" y="50" width="20" height="20" fill="#FCA5A5" />
          {/* Head */}
          <circle cx="40" cy="35" r="30" fill="#FCA5A5" />
          {/* Hair */}
          <path d="M 10 30 Q 40 -10 70 30" fill="none" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
          {/* Glasses */}
          <g transform="translate(0, 5)">
             <circle cx="28" cy="30" r="8" fill="white" stroke="#1E293B" strokeWidth="2" />
             <circle cx="52" cy="30" r="8" fill="white" stroke="#1E293B" strokeWidth="2" />
             <line x1="36" y1="30" x2="44" y2="30" stroke="#1E293B" strokeWidth="2" />
          </g>
          {/* Mustache */}
          <path d="M 25 50 Q 40 40 55 50" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          {/* Eyes */}
          {eyeState === "open" ? (
             <g>
                <circle cx="28" cy="35" r="2" fill="#1E293B" />
                <circle cx="52" cy="35" r="2" fill="#1E293B" />
             </g>
          ) : (
             // Closed eyes (simple lines)
             <g>
                <path d="M 24 38 L 32 38" stroke="#1E293B" strokeWidth="2" />
                <path d="M 48 38 L 56 38" stroke="#1E293B" strokeWidth="2" />
             </g>
          )}
          {/* Mouth */}
          <motion.path 
            stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none"
            animate={mouthState}
            variants={{
                idle: { d: "M 30 55 Q 40 60 50 55" },
                happy: { d: "M 30 55 Q 40 65 50 55" },
                excited: { d: "M 30 55 Q 40 70 50 55" },
                confused: { d: "M 30 60 Q 40 55 50 60" }, // Frown
                shy: { d: "M 35 58 Q 40 58 45 58" }
            }}
          />
           {/* Hands (Father) - Covering eyes when shy */}
           <motion.g 
            initial="rest"
            animate={mood === EmojiMood.SHY ? "cover" : "rest"}
            variants={handCoverEyes}
            transition={SPRING_TRANSITION}
           >
               <circle cx="28" cy="35" r="12" fill="#FCA5A5" stroke="#E2E8F0" />
               <circle cx="52" cy="35" r="12" fill="#FCA5A5" stroke="#E2E8F0" />
           </motion.g>
           
           {/* Hands (Father) - Clapping when Excited */}
            <motion.g 
             initial={{ opacity: 0 }}
             animate={{ opacity: mood === EmojiMood.EXCITED ? 1 : 0, y: mood === EmojiMood.EXCITED ? -10 : 0 }}
            >
                <circle cx="20" cy="100" r="10" fill="#FCA5A5" />
                <circle cx="60" cy="100" r="10" fill="#FCA5A5" />
            </motion.g>
        </g>

        {/* --- MOTHER (Right) --- */}
        <g transform="translate(180, 45)">
          {/* Sari Body */}
          <path d="M 10 70 Q 40 60 70 70 L 80 140 L 0 140 Z" fill="#F472B6" />
          <path d="M 10 70 L 70 140" stroke="#BE185D" strokeWidth="2" opacity="0.5"/>
          {/* Neck */}
          <rect x="30" y="50" width="20" height="20" fill="#FDBA74" />
          {/* Head */}
          <circle cx="40" cy="35" r="28" fill="#FDBA74" />
          {/* Hair Bun */}
          <circle cx="70" cy="25" r="15" fill="#1E293B" />
          <path d="M 15 20 Q 40 -5 65 20" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          {/* Bindi */}
          <circle cx="40" cy="22" r="3" fill="#DC2626" />
          {/* Eyes */}
          {eyeState === "open" ? (
             <g>
                <circle cx="28" cy="35" r="2" fill="#1E293B" />
                <circle cx="52" cy="35" r="2" fill="#1E293B" />
             </g>
          ) : (
             <g>
                <path d="M 24 38 L 32 38" stroke="#1E293B" strokeWidth="2" />
                <path d="M 48 38 L 56 38" stroke="#1E293B" strokeWidth="2" />
             </g>
          )}
          {/* Mouth */}
          <motion.path 
            stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none"
            animate={mouthState}
            variants={{
                idle: { d: "M 30 50 Q 40 55 50 50" },
                happy: { d: "M 30 50 Q 40 60 50 50" },
                excited: { d: "M 30 50 Q 40 65 50 50" },
                confused: { d: "M 30 55 Q 40 50 50 55" },
                shy: { d: "M 35 53 Q 40 53 45 53" }
            }}
          />
          {/* Hands (Mother) - Covering eyes when shy */}
           <motion.g 
            initial="rest"
            animate={mood === EmojiMood.SHY ? "cover" : "rest"}
            variants={handCoverEyes}
            transition={SPRING_TRANSITION}
           >
               <circle cx="28" cy="35" r="12" fill="#FDBA74" stroke="#FFE4E6" />
               <circle cx="52" cy="35" r="12" fill="#FDBA74" stroke="#FFE4E6" />
           </motion.g>

           {/* Hands (Mother) - Clapping when Excited */}
            <motion.g 
             initial={{ opacity: 0 }}
             animate={{ opacity: mood === EmojiMood.EXCITED ? 1 : 0, y: mood === EmojiMood.EXCITED ? -10 : 0 }}
            >
                <circle cx="20" cy="90" r="10" fill="#FDBA74" />
                <circle cx="60" cy="90" r="10" fill="#FDBA74" />
            </motion.g>
        </g>

        {/* --- CHILD (Center/Bottom) --- */}
        <g transform="translate(100, 90)">
          {/* Body */}
          <rect x="25" y="40" width="50" height="50" rx="10" fill="#FACC15" />
          {/* Head */}
          <circle cx="50" cy="25" r="22" fill="#FDE047" />
          {/* Hair */}
          <path d="M 30 15 Q 50 0 70 15" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
          {/* Eyes */}
          {eyeState === "open" ? (
             <g>
                <circle cx="42" cy="25" r="2.5" fill="#1E293B" />
                <circle cx="58" cy="25" r="2.5" fill="#1E293B" />
             </g>
          ) : (
             <g>
                <path d="M 38 28 L 46 28" stroke="#1E293B" strokeWidth="2" />
                <path d="M 54 28 L 62 28" stroke="#1E293B" strokeWidth="2" />
             </g>
          )}
          {/* Mouth */}
          <motion.path 
            stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none"
            animate={mouthState}
            variants={{
                idle: { d: "M 42 35 Q 50 38 58 35" },
                happy: { d: "M 42 35 Q 50 45 58 35" },
                excited: { d: "M 42 35 Q 50 50 58 35" },
                confused: { d: "M 45 38 Q 50 35 55 38" }, // Small frown
                shy: { d: "M 48 38 Q 50 38 52 38" }
            }}
          />
           {/* Hands (Child) - Covering eyes when shy */}
           <motion.g 
            initial="rest"
            animate={mood === EmojiMood.SHY ? "cover" : "rest"}
            variants={{
                rest: { y: 100, opacity: 0 },
                cover: { y: -5, opacity: 1, scale: 0.8 }
            }}
            transition={SPRING_TRANSITION}
           >
               <circle cx="42" cy="25" r="14" fill="#FDE047" stroke="#FEF08A" />
               <circle cx="58" cy="25" r="14" fill="#FDE047" stroke="#FEF08A" />
           </motion.g>
           
           {/* Hands (Child) - Excited */}
           <motion.g
            initial={{ opacity: 0 }}
             animate={{ opacity: mood === EmojiMood.EXCITED ? 1 : 0, y: mood === EmojiMood.EXCITED ? -15 : 0 }}
           >
              <circle cx="20" cy="50" r="8" fill="#FDE047" /> 
              <circle cx="80" cy="50" r="8" fill="#FDE047" /> 
           </motion.g>
        </g>
      </motion.svg>
    </div>
  );
};