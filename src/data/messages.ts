export const messages = {
  remembrance: [
    "别难过，想ta的时候就去看天上的月亮，因为ta也在看。",
    "风会替你传话，月光会替你珍藏所有思念。",
    "ta没有离开，只是化作星光，岁岁年年陪着你。",
    "山海相隔，思念相通，你们永远共赴同一片星河。",
  ],
  reconciliation: [
    "未说出口的千言万语，时光都替你好好收纳。",
    "山水一程，不负遇见，遗憾也是另一种圆满。",
    "有些告别无声，但所有温柔都真实存在过。",
    "不必执念，好好告别，就是最好的结局。",
  ],
  selfHealing: [
    "辛苦了，与过去和解，往后温柔待己。",
    "所有委屈与不甘，在此刻尽数释怀。",
    "你不必完美，认真生活的你，已经足够耀眼。",
    "和旧的遗憾挥手，奔赴新的温柔人间。",
  ],
  general: [
    "心事有归处，温柔有回响。",
    "时光不语，收纳你所有情绪。",
    "慢慢治愈，慢慢放下，慢慢重逢。",
    "所有念念不忘，皆为温柔念想。",
  ],
};

export const getMessageByCategory = (category: string): string => {
  switch (category) {
    case "至亲家人":
    case "其他故人":
      return messages.remembrance[Math.floor(Math.random() * messages.remembrance.length)];
    case "昔日挚友":
    case "遗憾恋人":
      return messages.reconciliation[Math.floor(Math.random() * messages.reconciliation.length)];
    case "过去的自己":
      return messages.selfHealing[Math.floor(Math.random() * messages.selfHealing.length)];
    default:
      return messages.general[Math.floor(Math.random() * messages.general.length)];
  }
};

export const getRandomMessage = (): string => {
  const allMessages = [
    ...messages.remembrance,
    ...messages.reconciliation,
    ...messages.selfHealing,
    ...messages.general,
  ];
  return allMessages[Math.floor(Math.random() * allMessages.length)];
};

export const categories = [
  { value: "至亲家人", label: "至亲家人" },
  { value: "昔日挚友", label: "昔日挚友" },
  { value: "遗憾恋人", label: "遗憾恋人" },
  { value: "过去的自己", label: "过去的自己" },
  { value: "其他故人", label: "其他故人" },
];
