export type Dictionary = {
  meta: {
    title: string;
    description: string;
    siteName: string;
    userTitle: string;
    userDescription: string;
  };
  common: {
    search: string;
    searching: string;
    rank: string;
    nickname: string;
    level: string;
    highestFloor: string;
    focusTime: string;
    combatPower: string;
    guild: string;
    members: string;
    floorUnit: string;
    enhance: string;
    slots: string;
    playerProfile: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchLabel: string;
    rankingBoard: string;
    top100: string;
    top50Guilds: string;
  };
  tabs: {
    highestFloor: string;
    weeklyFocus: string;
    combatPower: string;
    guild: string;
    metricHighestFloor: string;
    metricFocusTime: string;
    metricCombatPower: string;
    metricGuild: string;
  };
  ranking: {
    loading: string;
    empty: string;
    floor: string;
    focus: string;
    power: string;
    avatarPlaceholder: string;
  };
  guild: {
    loading: string;
    empty: string;
    guildName: string;
    totalPower: string;
    avgFloor: string;
    topMember: string;
  };
  user: {
    backToRanking: string;
    honorTitle: string;
    equippedTitle: string;
    noTitle: string;
    equipment: string;
    prefix: string;
    subOption: string;
    noSubOption: string;
    historyTitle: string;
    historyDescription: string;
    skillTitle: string;
    skillDescription: string;
    guildPrefix: string;
  };
  equipment: {
    weapon: string;
    armor: string;
    accessory: string;
    unequipped: string;
  };
  rarity: {
    common: string;
    rare: string;
    epic: string;
    legendary: string;
  };
  stats: {
    atk: string;
    def: string;
    hp: string;
    spd: string;
    luk: string;
    focusMulti: string;
    generic: string;
    subOption: string;
  };
  focus: {
    hoursMinutes: string;
    hoursOnly: string;
    minutes: string;
  };
  errors: {
    nicknameRequired: string;
    profileNotFound: string;
    network: string;
    rankingFailed: string;
    searchFailed: string;
    searchNetwork: string;
  };
  community: {
    title: string;
    close: string;
    open: string;
    discord: string;
    bugReport: string;
    coupon: string;
  };
  coupon: {
    metaTitle: string;
    metaDescription: string;
    badge: string;
    title: string;
    subtitle: string;
    hint: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    codeLabel: string;
    codePlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    backHome: string;
    errors: {
      identifierRequired: string;
      couponRequired: string;
      USER_NOT_FOUND: string;
      COUPON_INVALID: string;
      COUPON_ALREADY_USED: string;
      INVALID_INPUT: string;
      SERVER_ERROR: string;
    };
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  search: {
    recentTitle: string;
    noRecent: string;
    favorite: string;
    removeFavorite: string;
    addFavorite: string;
    favoriteBannerTitle: string;
    viewProfile: string;
    clearRecent: string;
  };
  countdown: {
    label: string;
    resetIn: string;
  };
  banner: {
    patchNotes: string;
  };
  language: {
    select: string;
  };
};
