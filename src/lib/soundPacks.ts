export type KeySoundKind = "type" | "error";
export type SoundCategory = "ordinary" | "cute" | "prank";

export type SoundTone = {
  wave: OscillatorType;
  startFrequency: number;
  endFrequency: number;
  duration: number;
  volume: number;
  attack: number;
  delay?: number;
};

export type SoundNoise = {
  volume: number;
  delay?: number;
};

export type SoundRecipe = {
  noises: SoundNoise[];
  tones: SoundTone[];
};

export type KeySoundPack = {
  id: string;
  name: string;
  category: SoundCategory;
  description: string;
  sounds: Record<KeySoundKind, SoundRecipe>;
  sampleAudio?: Record<KeySoundKind, string>;
};

export const SOUND_CATEGORY_LABELS: Record<SoundCategory, string> = {
  ordinary: "普通",
  cute: "可爱",
  prank: "恶搞",
};

export const DEFAULT_SOUND_PACK_ID = "typewriter";

export const SOUND_PACKS: KeySoundPack[] = [
  {
    id: "typewriter",
    name: "经典打字机",
    category: "ordinary",
    description: "参考站的机械敲击感，清脆、短促，适合长时间练习。",
    sounds: {
      type: {
        noises: [
          { volume: 0.025 },
          { volume: 0.36, delay: 0.018 },
        ],
        tones: [
          {
            wave: "triangle",
            startFrequency: 6_650,
            endFrequency: 5_200,
            duration: 0.026,
            volume: 0.02,
            attack: 0.001,
            delay: 0.015,
          },
          {
            wave: "sine",
            startFrequency: 4_850,
            endFrequency: 2_350,
            duration: 0.052,
            volume: 0.034,
            attack: 0.0015,
            delay: 0.018,
          },
          {
            wave: "sine",
            startFrequency: 2_688,
            endFrequency: 2_400,
            duration: 0.026,
            volume: 0.012,
            attack: 0.001,
            delay: 0.009,
          },
          {
            wave: "triangle",
            startFrequency: 2_300,
            endFrequency: 950,
            duration: 0.12,
            volume: 0.011,
            attack: 0.002,
            delay: 0.03,
          },
          {
            wave: "sine",
            startFrequency: 944,
            endFrequency: 900,
            duration: 0.2,
            volume: 0.005,
            attack: 0.004,
            delay: 0.04,
          },
          {
            wave: "triangle",
            startFrequency: 544,
            endFrequency: 470,
            duration: 0.23,
            volume: 0.003,
            attack: 0.004,
            delay: 0.045,
          },
        ],
      },
      error: {
        noises: [{ volume: 0.01 }],
        tones: [
          {
            wave: "sine",
            startFrequency: 786,
            endFrequency: 782,
            duration: 0.25,
            volume: 0.038,
            attack: 0.008,
          },
          {
            wave: "triangle",
            startFrequency: 792,
            endFrequency: 788,
            duration: 0.205,
            volume: 0.009,
            attack: 0.012,
          },
          {
            wave: "sine",
            startFrequency: 98,
            endFrequency: 92,
            duration: 0.07,
            volume: 0.006,
            attack: 0.003,
          },
        ],
      },
    },
  },
  {
    id: "mechanical",
    name: "机械键盘",
    category: "ordinary",
    description: "清脆段落感明显，敲击后带一点金属回弹。",
    sounds: {
      type: {
        noises: [
          { volume: 0.08 },
          { volume: 0.3, delay: 0.006 },
        ],
        tones: [
          {
            wave: "triangle",
            startFrequency: 4_300,
            endFrequency: 1_800,
            duration: 0.025,
            volume: 0.03,
            attack: 0.001,
            delay: 0.007,
          },
          {
            wave: "triangle",
            startFrequency: 1_800,
            endFrequency: 700,
            duration: 0.045,
            volume: 0.022,
            attack: 0.0015,
            delay: 0.012,
          },
          {
            wave: "sine",
            startFrequency: 160,
            endFrequency: 100,
            duration: 0.04,
            volume: 0.012,
            attack: 0.002,
            delay: 0.01,
          },
        ],
      },
      error: {
        noises: [{ volume: 0.18 }],
        tones: [
          {
            wave: "triangle",
            startFrequency: 240,
            endFrequency: 180,
            duration: 0.12,
            volume: 0.04,
            attack: 0.003,
          },
          {
            wave: "triangle",
            startFrequency: 190,
            endFrequency: 140,
            duration: 0.1,
            volume: 0.025,
            attack: 0.003,
            delay: 0.085,
          },
        ],
      },
    },
  },
  {
    id: "edclub",
    name: "EdClub 原声",
    category: "ordinary",
    description: "直接使用参考站的原始敲击声和错误声，打字与删字完全一致。",
    sounds: {
      type: { noises: [], tones: [] },
      error: { noises: [], tones: [] },
    },
    sampleAudio: {
      type: "audio/edclub/typewriter.mp3",
      error: "audio/edclub/error.mp3",
    },
  },
  {
    id: "membrane",
    name: "薄膜键盘",
    category: "ordinary",
    description: "轻柔、低音量，适合安静环境中的连续输入。",
    sounds: {
      type: {
        noises: [{ volume: 0.16 }],
        tones: [
          {
            wave: "sine",
            startFrequency: 1_100,
            endFrequency: 700,
            duration: 0.045,
            volume: 0.024,
            attack: 0.002,
          },
          {
            wave: "triangle",
            startFrequency: 450,
            endFrequency: 250,
            duration: 0.05,
            volume: 0.014,
            attack: 0.003,
          },
        ],
      },
      error: {
        noises: [{ volume: 0.025 }],
        tones: [
          {
            wave: "sine",
            startFrequency: 330,
            endFrequency: 250,
            duration: 0.18,
            volume: 0.035,
            attack: 0.008,
          },
        ],
      },
    },
  },
  {
    id: "terminal",
    name: "复古终端",
    category: "ordinary",
    description: "老式电脑的电子短鸣，节奏轻快而有年代感。",
    sounds: {
      type: {
        noises: [{ volume: 0.06 }],
        tones: [
          {
            wave: "triangle",
            startFrequency: 1_700,
            endFrequency: 1_450,
            duration: 0.022,
            volume: 0.027,
            attack: 0.001,
          },
          {
            wave: "sine",
            startFrequency: 850,
            endFrequency: 720,
            duration: 0.045,
            volume: 0.012,
            attack: 0.002,
            delay: 0.01,
          },
        ],
      },
      error: {
        noises: [{ volume: 0.02 }],
        tones: [
          {
            wave: "square",
            startFrequency: 230,
            endFrequency: 185,
            duration: 0.16,
            volume: 0.023,
            attack: 0.004,
          },
          {
            wave: "triangle",
            startFrequency: 260,
            endFrequency: 210,
            duration: 0.13,
            volume: 0.014,
            attack: 0.005,
            delay: 0.12,
          },
        ],
      },
    },
  },
  {
    id: "glass",
    name: "玻璃键帽",
    category: "ordinary",
    description: "最明亮的一套，敲击像轻碰玻璃，错误声也更透亮。",
    sounds: {
      type: {
        noises: [{ volume: 0.08 }],
        tones: [
          {
            wave: "sine",
            startFrequency: 2_500,
            endFrequency: 2_100,
            duration: 0.09,
            volume: 0.032,
            attack: 0.002,
          },
          {
            wave: "sine",
            startFrequency: 4_200,
            endFrequency: 3_600,
            duration: 0.05,
            volume: 0.014,
            attack: 0.001,
          },
        ],
      },
      error: {
        noises: [{ volume: 0.02 }],
        tones: [
          {
            wave: "sine",
            startFrequency: 1_200,
            endFrequency: 700,
            duration: 0.16,
            volume: 0.03,
            attack: 0.004,
          },
          {
            wave: "sine",
            startFrequency: 900,
            endFrequency: 520,
            duration: 0.13,
            volume: 0.014,
            attack: 0.005,
            delay: 0.1,
          },
        ],
      },
    },
  },
  {
    id: "wood",
    name: "实木键盘",
    category: "ordinary",
    description: "温润的低频木质感，声音克制，不抢注意力。",
    sounds: {
      type: {
        noises: [{ volume: 0.14 }],
        tones: [
          {
            wave: "triangle",
            startFrequency: 700,
            endFrequency: 300,
            duration: 0.08,
            volume: 0.037,
            attack: 0.002,
          },
          {
            wave: "sine",
            startFrequency: 160,
            endFrequency: 90,
            duration: 0.04,
            volume: 0.016,
            attack: 0.002,
          },
        ],
      },
      error: {
        noises: [{ volume: 0.03 }],
        tones: [
          {
            wave: "triangle",
            startFrequency: 300,
            endFrequency: 180,
            duration: 0.12,
            volume: 0.032,
            attack: 0.004,
          },
        ],
      },
    },
  },
  {
    id: "deep",
    name: "沉稳重键",
    category: "ordinary",
    description: "低频更厚、更有重量感，适合喜欢沉稳节奏的人。",
    sounds: {
      type: {
        noises: [{ volume: 0.28, delay: 0.005 }],
        tones: [
          {
            wave: "triangle",
            startFrequency: 1_200,
            endFrequency: 400,
            duration: 0.05,
            volume: 0.035,
            attack: 0.0015,
          },
          {
            wave: "sine",
            startFrequency: 90,
            endFrequency: 65,
            duration: 0.09,
            volume: 0.034,
            attack: 0.003,
          },
        ],
      },
      error: {
        noises: [{ volume: 0.08 }],
        tones: [
          {
            wave: "sine",
            startFrequency: 150,
            endFrequency: 105,
            duration: 0.22,
            volume: 0.045,
            attack: 0.006,
          },
          {
            wave: "triangle",
            startFrequency: 210,
            endFrequency: 160,
            duration: 0.14,
            volume: 0.018,
            attack: 0.004,
            delay: 0.08,
          },
        ],
      },
    },
  },
  {
    id: "bubble",
    name: "泡泡按键",
    category: "cute",
    description: "向上弹起的小泡泡，错误时变成两声软软的下降音。",
    sounds: {
      type: {
        noises: [{ volume: 0.09 }],
        tones: [
          {
            wave: "sine",
            startFrequency: 180,
            endFrequency: 620,
            duration: 0.08,
            volume: 0.035,
            attack: 0.004,
          },
        ],
      },
      error: {
        noises: [],
        tones: [
          {
            wave: "sine",
            startFrequency: 700,
            endFrequency: 350,
            duration: 0.12,
            volume: 0.03,
            attack: 0.006,
          },
          {
            wave: "sine",
            startFrequency: 520,
            endFrequency: 220,
            duration: 0.13,
            volume: 0.022,
            attack: 0.005,
            delay: 0.09,
          },
        ],
      },
    },
  },
  {
    id: "bell",
    name: "小铃铛",
    category: "cute",
    description: "轻盈的双层铃音，打字像在敲一串很小的风铃。",
    sounds: {
      type: {
        noises: [],
        tones: [
          {
            wave: "sine",
            startFrequency: 1_760,
            endFrequency: 1_700,
            duration: 0.13,
            volume: 0.025,
            attack: 0.003,
          },
          {
            wave: "sine",
            startFrequency: 3_520,
            endFrequency: 3_400,
            duration: 0.07,
            volume: 0.01,
            attack: 0.002,
          },
        ],
      },
      error: {
        noises: [],
        tones: [
          {
            wave: "sine",
            startFrequency: 880,
            endFrequency: 660,
            duration: 0.15,
            volume: 0.028,
            attack: 0.005,
          },
          {
            wave: "sine",
            startFrequency: 660,
            endFrequency: 440,
            duration: 0.16,
            volume: 0.022,
            attack: 0.005,
            delay: 0.1,
          },
        ],
      },
    },
  },
  {
    id: "spring",
    name: "弹簧恶作剧",
    category: "prank",
    description: "每敲一下都像弹簧抖了一下，打错时还会再弹回来。",
    sounds: {
      type: {
        noises: [],
        tones: [
          {
            wave: "sine",
            startFrequency: 220,
            endFrequency: 520,
            duration: 0.09,
            volume: 0.032,
            attack: 0.002,
          },
          {
            wave: "triangle",
            startFrequency: 520,
            endFrequency: 260,
            duration: 0.1,
            volume: 0.022,
            attack: 0.002,
            delay: 0.075,
          },
        ],
      },
      error: {
        noises: [],
        tones: [
          {
            wave: "sine",
            startFrequency: 360,
            endFrequency: 140,
            duration: 0.24,
            volume: 0.038,
            attack: 0.004,
          },
          {
            wave: "triangle",
            startFrequency: 620,
            endFrequency: 210,
            duration: 0.19,
            volume: 0.024,
            attack: 0.004,
            delay: 0.04,
          },
        ],
      },
    },
  },
  {
    id: "duck",
    name: "滑稽小鸭",
    category: "prank",
    description: "低低的鸭子式按键声，打错时有夸张的两声回应。",
    sounds: {
      type: {
        noises: [{ volume: 0.05 }],
        tones: [
          {
            wave: "triangle",
            startFrequency: 430,
            endFrequency: 280,
            duration: 0.08,
            volume: 0.034,
            attack: 0.003,
          },
          {
            wave: "square",
            startFrequency: 330,
            endFrequency: 240,
            duration: 0.055,
            volume: 0.01,
            attack: 0.003,
            delay: 0.055,
          },
        ],
      },
      error: {
        noises: [{ volume: 0.035 }],
        tones: [
          {
            wave: "triangle",
            startFrequency: 700,
            endFrequency: 300,
            duration: 0.19,
            volume: 0.036,
            attack: 0.005,
          },
          {
            wave: "square",
            startFrequency: 500,
            endFrequency: 200,
            duration: 0.17,
            volume: 0.014,
            attack: 0.005,
            delay: 0.12,
          },
        ],
      },
    },
  },
];

export function getSoundPack(id: string): KeySoundPack {
  return (
    SOUND_PACKS.find((pack) => pack.id === id) ??
    SOUND_PACKS.find((pack) => pack.id === DEFAULT_SOUND_PACK_ID)!
  );
}
