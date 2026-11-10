export type KeySoundKind = "type" | "error";
export type SoundCategory = "ordinary" | "cute" | "prank";

export type KeySoundPack = {
  id: string;
  name: string;
  category: SoundCategory;
  description: string;
  sampleAudio: Record<KeySoundKind, string>;
};

export const SOUND_CATEGORY_LABELS: Record<SoundCategory, string> = {
  ordinary: "普通",
  cute: "可爱",
  prank: "恶搞",
};

export const DEFAULT_SOUND_PACK_ID = "butter-thock";

export const SOUND_PACKS: KeySoundPack[] = [
  {
    id: "butter-thock",
    name: "黄油重键",
    category: "ordinary",
    description: "低沉厚实的润滑线性轴，带一点清脆触底。",
    sampleAudio: {
      type: "audio/essaykeys/butter-thock-type.mp3",
      error: "audio/essaykeys/butter-thock-error.mp3",
    },
  },
  {
    id: "crisp-toggle",
    name: "清脆段落",
    category: "ordinary",
    description: "利落的塑料 Snap，段落感明显、反馈紧凑。",
    sampleAudio: {
      type: "audio/essaykeys/crisp-toggle-type.mp3",
      error: "audio/essaykeys/crisp-toggle-error.mp3",
    },
  },
  {
    id: "typewriter-hammer",
    name: "复古打字机",
    category: "ordinary",
    description: "金属打字杆敲击纸面的机械咔嗒声。",
    sampleAudio: {
      type: "audio/essaykeys/typewriter-hammer-type.mp3",
      error: "audio/essaykeys/typewriter-hammer-error.mp3",
    },
  },
  {
    id: "soft-membrane",
    name: "柔软薄膜",
    category: "ordinary",
    description: "轻柔安静，适合长时间连续输入。",
    sampleAudio: {
      type: "audio/essaykeys/soft-membrane-type.mp3",
      error: "audio/essaykeys/soft-membrane-error.mp3",
    },
  },
  {
    id: "wooden-tock",
    name: "实木轻叩",
    category: "ordinary",
    description: "温暖自然的木质键帽声，克制而有质感。",
    sampleAudio: {
      type: "audio/essaykeys/wooden-tock-type.mp3",
      error: "audio/essaykeys/wooden-tock-error.mp3",
    },
  },
  {
    id: "bubble-pop",
    name: "玻璃泡泡",
    category: "cute",
    description: "圆润的小气泡按键，错误声是一对下降泡泡。",
    sampleAudio: {
      type: "audio/essaykeys/bubble-pop-type.mp3",
      error: "audio/essaykeys/bubble-pop-error.mp3",
    },
  },
  {
    id: "toy-chime",
    name: "木质风铃",
    category: "cute",
    description: "木质小按键带一点柔和铃声，轻巧不刺耳。",
    sampleAudio: {
      type: "audio/essaykeys/toy-chime-type.mp3",
      error: "audio/essaykeys/toy-chime-error.mp3",
    },
  },
  {
    id: "spring-boing",
    name: "弹簧恶作剧",
    category: "prank",
    description: "每次敲击都带一点卡通弹簧回弹。",
    sampleAudio: {
      type: "audio/essaykeys/spring-boing-type.mp3",
      error: "audio/essaykeys/spring-boing-error.mp3",
    },
  },
  {
    id: "duck-squeak",
    name: "橡皮小鸭",
    category: "prank",
    description: "短促的橡胶玩具声，不含人声。",
    sampleAudio: {
      type: "audio/essaykeys/duck-squeak-type.mp3",
      error: "audio/essaykeys/duck-squeak-error.mp3",
    },
  },
  {
    id: "edclub",
    name: "EdClub 原声",
    category: "ordinary",
    description: "保留参考站原始的敲击声和错误声。",
    sampleAudio: {
      type: "audio/edclub/typewriter.mp3",
      error: "audio/edclub/error.mp3",
    },
  },
];

export function getSoundPack(id: string): KeySoundPack {
  return (
    SOUND_PACKS.find((pack) => pack.id === id) ??
    SOUND_PACKS.find((pack) => pack.id === DEFAULT_SOUND_PACK_ID)!
  );
}
