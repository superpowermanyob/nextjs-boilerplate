import type { Locale } from "@/lib/i18n/locales";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
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
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
};

export type DictionaryKey = keyof Dictionary;

const en: Dictionary = {
  meta: {
    title: "Focus RPG | Stats · Rankings",
    description: "Search Focus RPG player stats and browse live ranking boards.",
    userTitle: "{nickname} | Focus RPG Stats",
    userDescription: "Detailed stats, gear, and titles for {nickname}.",
  },
  common: {
    search: "Search",
    searching: "Searching...",
    rank: "Rank",
    nickname: "Nickname",
    level: "Level",
    highestFloor: "Best Floor",
    focusTime: "Focus Time",
    combatPower: "Combat Power",
    guild: "Guild",
    members: "Members",
    floorUnit: "F",
    enhance: "Enh.",
    slots: "Slots",
    playerProfile: "Player Profile",
  },
  home: {
    badge: "Focus RPG",
    title: "Stats · Rankings",
    subtitle: "Search player stats or browse live ranking boards.",
    searchPlaceholder: "Enter player nickname",
    searchLabel: "Player nickname",
    rankingBoard: "Ranking Board",
    top100: "Top 100",
    top50Guilds: "Top 50 Guilds",
  },
  tabs: {
    highestFloor: "Tower Best Floor",
    weeklyFocus: "Weekly Focus",
    combatPower: "Combat Power",
    guild: "Guild Hall of Fame",
    metricHighestFloor: "Best Floor",
    metricFocusTime: "Focus Time",
    metricCombatPower: "Combat Power",
    metricGuild: "Guild",
  },
  ranking: {
    loading: "Loading ranking data...",
    empty: "No ranking data available.",
    floor: "Floor",
    focus: "Focus",
    power: "Power",
    avatarPlaceholder: "Character thumbnail placeholder",
  },
  guild: {
    loading: "Loading guild rankings...",
    empty: "No guild ranking data available.",
    guildName: "Guild",
    totalPower: "Total Power",
    avgFloor: "Avg. Best Floor",
    topMember: "Top Climber",
  },
  user: {
    backToRanking: "Back to Rankings",
    honorTitle: "Honor Title",
    equippedTitle: "Equipped",
    noTitle: "No Title",
    equipment: "Equipped Gear",
    prefix: "Prefix",
    subOption: "Sub Stats",
    noSubOption: "No sub stats",
    historyTitle: "Floor History",
    historyDescription: "Seasonal best-floor trend charts will appear here.",
    skillTitle: "Skill Tree",
    skillDescription: "Stat upgrades and skill branches will appear here.",
    guildPrefix: "Guild",
  },
  equipment: {
    weapon: "Weapon",
    armor: "Armor",
    accessory: "Accessory",
    unequipped: "Empty",
  },
  rarity: {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  },
  stats: {
    atk: "ATK",
    def: "DEF",
    hp: "HP",
    spd: "SPD",
    luk: "LUK",
    focusMulti: "Focus Multi",
    generic: "Stat",
    subOption: "Sub stat",
  },
  focus: {
    hoursMinutes: "{hours}h {minutes}m",
    hoursOnly: "{hours}h",
    minutes: "{minutes}m",
  },
  errors: {
    nicknameRequired: "Please enter a nickname.",
    profileNotFound: "Nickname not found.",
    network: "Network error occurred.",
    rankingFailed: "Failed to load rankings.",
    searchFailed: "Search failed.",
    searchNetwork: "Network error. Please try again later.",
  },
  community: {
    title: "Community",
    close: "Close widget",
    open: "Community",
    discord: "💬 Official Discord",
    bugReport: "🐛 Report a Bug",
  },
  notFound: {
    title: "Player not found",
    description: "This nickname does not exist or the profile is private.",
    backHome: "Back to Home",
  },
};

const ko: Dictionary = {
  meta: {
    title: "Focus RPG | 전적 · 랭킹",
    description: "Focus RPG 플레이어 전적 검색 및 랭킹 보드",
    userTitle: "{nickname} | Focus RPG 전적",
    userDescription: "{nickname} 플레이어의 상세 전적, 장비, 칭호 정보",
  },
  common: {
    search: "검색",
    searching: "검색 중...",
    rank: "순위",
    nickname: "닉네임",
    level: "레벨",
    highestFloor: "최고층",
    focusTime: "집중 시간",
    combatPower: "전투력",
    guild: "길드",
    members: "길드원",
    floorUnit: "F",
    enhance: "강화",
    slots: "슬롯",
    playerProfile: "플레이어 프로필",
  },
  home: {
    badge: "Focus RPG",
    title: "전적 · 랭킹",
    subtitle: "닉네임으로 전적을 검색하거나, 실시간 랭킹 보드를 확인하세요.",
    searchPlaceholder: "플레이어 닉네임을 입력하세요",
    searchLabel: "플레이어 닉네임",
    rankingBoard: "랭킹 보드",
    top100: "Top 100",
    top50Guilds: "Top 50 길드",
  },
  tabs: {
    highestFloor: "탑 최고층 랭킹",
    weeklyFocus: "주간 집중 랭킹",
    combatPower: "종합 전투력 랭킹",
    guild: "길드 명예의 전당",
    metricHighestFloor: "최고층",
    metricFocusTime: "집중 시간",
    metricCombatPower: "전투력",
    metricGuild: "길드",
  },
  ranking: {
    loading: "랭킹 데이터를 불러오는 중...",
    empty: "표시할 랭킹 데이터가 없습니다.",
    floor: "층수",
    focus: "집중",
    power: "전투력",
    avatarPlaceholder: "캐릭터 썸네일 Placeholder",
  },
  guild: {
    loading: "길드 랭킹을 불러오는 중...",
    empty: "표시할 길드 랭킹 데이터가 없습니다.",
    guildName: "길드명",
    totalPower: "합산 전투력",
    avgFloor: "평균 최고층",
    topMember: "최고 층 유저",
  },
  user: {
    backToRanking: "랭킹으로 돌아가기",
    honorTitle: "명예 칭호",
    equippedTitle: "장착 중",
    noTitle: "칭호 없음",
    equipment: "장착 장비",
    prefix: "접두사",
    subOption: "부옵션",
    noSubOption: "부옵션 없음",
    historyTitle: "층수 히스토리",
    historyDescription: "향후 시즌별 최고층 추이 그래프가 이 영역에 표시됩니다.",
    skillTitle: "스킬 트리",
    skillDescription: "향후 스탯 업그레이드 및 스킬 분기 정보가 이 영역에 표시됩니다.",
    guildPrefix: "길드",
  },
  equipment: {
    weapon: "무기",
    armor: "방어구",
    accessory: "장신구",
    unequipped: "미장착",
  },
  rarity: {
    common: "일반",
    rare: "레어",
    epic: "에픽",
    legendary: "전설",
  },
  stats: {
    atk: "공격력",
    def: "방어력",
    hp: "체력",
    spd: "속도",
    luk: "운",
    focusMulti: "집중 배율",
    generic: "스탯",
    subOption: "부옵션",
  },
  focus: {
    hoursMinutes: "{hours}시간 {minutes}분",
    hoursOnly: "{hours}시간",
    minutes: "{minutes}분",
  },
  errors: {
    nicknameRequired: "닉네임을 입력해 주세요.",
    profileNotFound: "존재하지 않는 닉네임입니다.",
    network: "네트워크 오류가 발생했습니다.",
    rankingFailed: "랭킹을 불러오지 못했습니다.",
    searchFailed: "검색 중 오류가 발생했습니다.",
    searchNetwork: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  },
  community: {
    title: "커뮤니티",
    close: "위젯 닫기",
    open: "커뮤니티",
    discord: "💬 공식 디스코드 바로가기",
    bugReport: "🐛 개발자에게 버그 제보하기",
  },
  notFound: {
    title: "플레이어를 찾을 수 없습니다",
    description: "존재하지 않는 닉네임이거나 비공개 프로필입니다.",
    backHome: "메인으로 돌아가기",
  },
};

const ja: Dictionary = {
  meta: {
    title: "Focus RPG | 戦績 · ランキング",
    description: "Focus RPG のプレイヤー戦績検索とランキングボード",
    userTitle: "{nickname} | Focus RPG 戦績",
    userDescription: "{nickname} の詳細戦績、装備、称号情報",
  },
  common: {
    search: "検索",
    searching: "検索中...",
    rank: "順位",
    nickname: "ニックネーム",
    level: "レベル",
    highestFloor: "最高階",
    focusTime: "集中時間",
    combatPower: "戦闘力",
    guild: "ギルド",
    members: "メンバー",
    floorUnit: "F",
    enhance: "強化",
    slots: "スロット",
    playerProfile: "プレイヤープロフィール",
  },
  home: {
    badge: "Focus RPG",
    title: "戦績 · ランキング",
    subtitle: "ニックネームで戦績を検索するか、リアルタイムランキングを確認してください。",
    searchPlaceholder: "プレイヤーのニックネームを入力",
    searchLabel: "プレイヤーニックネーム",
    rankingBoard: "ランキングボード",
    top100: "Top 100",
    top50Guilds: "Top 50 ギルド",
  },
  tabs: {
    highestFloor: "タワー最高階ランキング",
    weeklyFocus: "週間集中ランキング",
    combatPower: "総合戦闘力ランキング",
    guild: "ギルド名誉の殿堂",
    metricHighestFloor: "最高階",
    metricFocusTime: "集中時間",
    metricCombatPower: "戦闘力",
    metricGuild: "ギルド",
  },
  ranking: {
    loading: "ランキングデータを読み込み中...",
    empty: "表示するランキングデータがありません。",
    floor: "階数",
    focus: "集中",
    power: "戦闘力",
    avatarPlaceholder: "キャラクターサムネイルプレースホルダー",
  },
  guild: {
    loading: "ギルドランキングを読み込み中...",
    empty: "表示するギルドランキングがありません。",
    guildName: "ギルド名",
    totalPower: "合計戦闘力",
    avgFloor: "平均最高階",
    topMember: "最高階プレイヤー",
  },
  user: {
    backToRanking: "ランキングに戻る",
    honorTitle: "名誉称号",
    equippedTitle: "装備中",
    noTitle: "称号なし",
    equipment: "装備中のギア",
    prefix: "接頭辞",
    subOption: "サブオプション",
    noSubOption: "サブオプションなし",
    historyTitle: "階数ヒストリー",
    historyDescription: "今後、シーズン別最高階の推移グラフがここに表示されます。",
    skillTitle: "スキルツリー",
    skillDescription: "今後、ステータス強化とスキル分岐情報がここに表示されます。",
    guildPrefix: "ギルド",
  },
  equipment: {
    weapon: "武器",
    armor: "防具",
    accessory: "装飾品",
    unequipped: "未装備",
  },
  rarity: {
    common: "コモン",
    rare: "レア",
    epic: "エピック",
    legendary: "レジェンド",
  },
  stats: {
    atk: "攻撃力",
    def: "防御力",
    hp: "HP",
    spd: "速度",
    luk: "運",
    focusMulti: "集中倍率",
    generic: "ステータス",
    subOption: "サブオプション",
  },
  focus: {
    hoursMinutes: "{hours}時間{minutes}分",
    hoursOnly: "{hours}時間",
    minutes: "{minutes}分",
  },
  errors: {
    nicknameRequired: "ニックネームを入力してください。",
    profileNotFound: "存在しないニックネームです。",
    network: "ネットワークエラーが発生しました。",
    rankingFailed: "ランキングを読み込めませんでした。",
    searchFailed: "検索中にエラーが発生しました。",
    searchNetwork: "ネットワークエラーです。しばらくしてから再試行してください。",
  },
  community: {
    title: "コミュニティ",
    close: "ウィジェットを閉じる",
    open: "コミュニティ",
    discord: "💬 公式Discordへ",
    bugReport: "🐛 バグを報告する",
  },
  notFound: {
    title: "プレイヤーが見つかりません",
    description: "存在しないニックネームか、非公開プロフィールです。",
    backHome: "ホームに戻る",
  },
};

const vi: Dictionary = {
  meta: {
    title: "Focus RPG | Thành tích · Xếp hạng",
    description: "Tra cứu thành tích người chơi Focus RPG và bảng xếp hạng trực tiếp.",
    userTitle: "{nickname} | Thành tích Focus RPG",
    userDescription: "Thành tích chi tiết, trang bị và danh hiệu của {nickname}.",
  },
  common: {
    search: "Tìm kiếm",
    searching: "Đang tìm...",
    rank: "Hạng",
    nickname: "Biệt danh",
    level: "Cấp",
    highestFloor: "Tầng cao nhất",
    focusTime: "Thời gian tập trung",
    combatPower: "Lực chiến",
    guild: "Bang hội",
    members: "Thành viên",
    floorUnit: "F",
    enhance: "Cường hóa",
    slots: "Ô trang bị",
    playerProfile: "Hồ sơ người chơi",
  },
  home: {
    badge: "Focus RPG",
    title: "Thành tích · Xếp hạng",
    subtitle: "Tìm thành tích theo biệt danh hoặc xem bảng xếp hạng trực tiếp.",
    searchPlaceholder: "Nhập biệt danh người chơi",
    searchLabel: "Biệt danh người chơi",
    rankingBoard: "Bảng xếp hạng",
    top100: "Top 100",
    top50Guilds: "Top 50 bang hội",
  },
  tabs: {
    highestFloor: "Xếp hạng tầng cao nhất",
    weeklyFocus: "Xếp hạng tập trung tuần",
    combatPower: "Xếp hạng lực chiến",
    guild: "Điện danh vọng bang hội",
    metricHighestFloor: "Tầng cao nhất",
    metricFocusTime: "Thời gian tập trung",
    metricCombatPower: "Lực chiến",
    metricGuild: "Bang hội",
  },
  ranking: {
    loading: "Đang tải dữ liệu xếp hạng...",
    empty: "Không có dữ liệu xếp hạng.",
    floor: "Tầng",
    focus: "Tập trung",
    power: "Lực chiến",
    avatarPlaceholder: "Ảnh đại diện nhân vật",
  },
  guild: {
    loading: "Đang tải xếp hạng bang hội...",
    empty: "Không có dữ liệu xếp hạng bang hội.",
    guildName: "Tên bang",
    totalPower: "Tổng lực chiến",
    avgFloor: "TB tầng cao nhất",
    topMember: "Người leo cao nhất",
  },
  user: {
    backToRanking: "Quay lại xếp hạng",
    honorTitle: "Danh hiệu danh dự",
    equippedTitle: "Đang trang bị",
    noTitle: "Không có danh hiệu",
    equipment: "Trang bị đang mặc",
    prefix: "Tiền tố",
    subOption: "Thuộc tính phụ",
    noSubOption: "Không có thuộc tính phụ",
    historyTitle: "Lịch sử tầng",
    historyDescription: "Biểu đồ xu hướng tầng cao nhất theo mùa sẽ hiển thị tại đây.",
    skillTitle: "Cây kỹ năng",
    skillDescription: "Thông tin nâng cấp chỉ số và nhánh kỹ năng sẽ hiển thị tại đây.",
    guildPrefix: "Bang hội",
  },
  equipment: {
    weapon: "Vũ khí",
    armor: "Giáp",
    accessory: "Phụ kiện",
    unequipped: "Chưa trang bị",
  },
  rarity: {
    common: "Thường",
    rare: "Hiếm",
    epic: "Sử thi",
    legendary: "Huyền thoại",
  },
  stats: {
    atk: "Tấn công",
    def: "Phòng thủ",
    hp: "Máu",
    spd: "Tốc độ",
    luk: "May mắn",
    focusMulti: "Hệ số tập trung",
    generic: "Chỉ số",
    subOption: "Thuộc tính phụ",
  },
  focus: {
    hoursMinutes: "{hours} giờ {minutes} phút",
    hoursOnly: "{hours} giờ",
    minutes: "{minutes} phút",
  },
  errors: {
    nicknameRequired: "Vui lòng nhập biệt danh.",
    profileNotFound: "Biệt danh không tồn tại.",
    network: "Đã xảy ra lỗi mạng.",
    rankingFailed: "Không thể tải xếp hạng.",
    searchFailed: "Tìm kiếm thất bại.",
    searchNetwork: "Lỗi mạng. Vui lòng thử lại sau.",
  },
  community: {
    title: "Cộng đồng",
    close: "Đóng widget",
    open: "Cộng đồng",
    discord: "💬 Discord chính thức",
    bugReport: "🐛 Báo lỗi cho nhà phát triển",
  },
  notFound: {
    title: "Không tìm thấy người chơi",
    description: "Biệt danh không tồn tại hoặc hồ sơ đang riêng tư.",
    backHome: "Về trang chủ",
  },
};

const id: Dictionary = {
  meta: {
    title: "Focus RPG | Statistik · Peringkat",
    description: "Cari statistik pemain Focus RPG dan lihat papan peringkat langsung.",
    userTitle: "{nickname} | Statistik Focus RPG",
    userDescription: "Statistik detail, gear, dan gelar untuk {nickname}.",
  },
  common: {
    search: "Cari",
    searching: "Mencari...",
    rank: "Peringkat",
    nickname: "Nickname",
    level: "Level",
    highestFloor: "Lantai Tertinggi",
    focusTime: "Waktu Fokus",
    combatPower: "Kekuatan Tempur",
    guild: "Guild",
    members: "Anggota",
    floorUnit: "F",
    enhance: "Enh.",
    slots: "Slot",
    playerProfile: "Profil Pemain",
  },
  home: {
    badge: "Focus RPG",
    title: "Statistik · Peringkat",
    subtitle: "Cari statistik pemain atau lihat papan peringkat langsung.",
    searchPlaceholder: "Masukkan nickname pemain",
    searchLabel: "Nickname pemain",
    rankingBoard: "Papan Peringkat",
    top100: "Top 100",
    top50Guilds: "Top 50 Guild",
  },
  tabs: {
    highestFloor: "Peringkat Lantai Tertinggi",
    weeklyFocus: "Peringkat Fokus Mingguan",
    combatPower: "Peringkat Kekuatan Tempur",
    guild: "Balai Kehormatan Guild",
    metricHighestFloor: "Lantai Tertinggi",
    metricFocusTime: "Waktu Fokus",
    metricCombatPower: "Kekuatan Tempur",
    metricGuild: "Guild",
  },
  ranking: {
    loading: "Memuat data peringkat...",
    empty: "Tidak ada data peringkat.",
    floor: "Lantai",
    focus: "Fokus",
    power: "Kekuatan",
    avatarPlaceholder: "Placeholder thumbnail karakter",
  },
  guild: {
    loading: "Memuat peringkat guild...",
    empty: "Tidak ada data peringkat guild.",
    guildName: "Nama Guild",
    totalPower: "Total Kekuatan",
    avgFloor: "Rata-rata Lantai",
    topMember: "Pendaki Teratas",
  },
  user: {
    backToRanking: "Kembali ke Peringkat",
    honorTitle: "Gelar Kehormatan",
    equippedTitle: "Dipakai",
    noTitle: "Tanpa Gelar",
    equipment: "Gear Terpasang",
    prefix: "Awalan",
    subOption: "Sub Stat",
    noSubOption: "Tidak ada sub stat",
    historyTitle: "Riwayat Lantai",
    historyDescription: "Grafik tren lantai tertinggi per musim akan ditampilkan di sini.",
    skillTitle: "Pohon Skill",
    skillDescription: "Info upgrade stat dan cabang skill akan ditampilkan di sini.",
    guildPrefix: "Guild",
  },
  equipment: {
    weapon: "Senjata",
    armor: "Armor",
    accessory: "Aksesori",
    unequipped: "Kosong",
  },
  rarity: {
    common: "Biasa",
    rare: "Langka",
    epic: "Epik",
    legendary: "Legendaris",
  },
  stats: {
    atk: "Serangan",
    def: "Pertahanan",
    hp: "HP",
    spd: "Kecepatan",
    luk: "Keberuntungan",
    focusMulti: "Pengali Fokus",
    generic: "Stat",
    subOption: "Sub stat",
  },
  focus: {
    hoursMinutes: "{hours} jam {minutes} menit",
    hoursOnly: "{hours} jam",
    minutes: "{minutes} menit",
  },
  errors: {
    nicknameRequired: "Silakan masukkan nickname.",
    profileNotFound: "Nickname tidak ditemukan.",
    network: "Terjadi kesalahan jaringan.",
    rankingFailed: "Gagal memuat peringkat.",
    searchFailed: "Pencarian gagal.",
    searchNetwork: "Kesalahan jaringan. Coba lagi nanti.",
  },
  community: {
    title: "Komunitas",
    close: "Tutup widget",
    open: "Komunitas",
    discord: "💬 Discord Resmi",
    bugReport: "🐛 Laporkan Bug",
  },
  notFound: {
    title: "Pemain tidak ditemukan",
    description: "Nickname tidak ada atau profil bersifat privat.",
    backHome: "Kembali ke Beranda",
  },
};

const zhCN: Dictionary = {
  meta: {
    title: "Focus RPG | 战绩 · 排行榜",
    description: "搜索 Focus RPG 玩家战绩并查看实时排行榜。",
    userTitle: "{nickname} | Focus RPG 战绩",
    userDescription: "{nickname} 的详细战绩、装备与称号信息。",
  },
  common: {
    search: "搜索",
    searching: "搜索中...",
    rank: "排名",
    nickname: "昵称",
    level: "等级",
    highestFloor: "最高层",
    focusTime: "专注时间",
    combatPower: "战斗力",
    guild: "公会",
    members: "成员",
    floorUnit: "F",
    enhance: "强化",
    slots: "槽位",
    playerProfile: "玩家资料",
  },
  home: {
    badge: "Focus RPG",
    title: "战绩 · 排行榜",
    subtitle: "搜索玩家昵称或查看实时排行榜。",
    searchPlaceholder: "请输入玩家昵称",
    searchLabel: "玩家昵称",
    rankingBoard: "排行榜",
    top100: "前 100 名",
    top50Guilds: "前 50 公会",
  },
  tabs: {
    highestFloor: "塔最高层排行",
    weeklyFocus: "每周专注排行",
    combatPower: "综合战斗力排行",
    guild: "公会荣誉殿堂",
    metricHighestFloor: "最高层",
    metricFocusTime: "专注时间",
    metricCombatPower: "战斗力",
    metricGuild: "公会",
  },
  ranking: {
    loading: "正在加载排行数据...",
    empty: "暂无排行数据。",
    floor: "层数",
    focus: "专注",
    power: "战斗力",
    avatarPlaceholder: "角色缩略图占位",
  },
  guild: {
    loading: "正在加载公会排行...",
    empty: "暂无公会排行数据。",
    guildName: "公会名",
    totalPower: "总战斗力",
    avgFloor: "平均最高层",
    topMember: "最高层玩家",
  },
  user: {
    backToRanking: "返回排行榜",
    honorTitle: "荣誉称号",
    equippedTitle: "已装备",
    noTitle: "无称号",
    equipment: "已装备物品",
    prefix: "前缀",
    subOption: "副属性",
    noSubOption: "无副属性",
    historyTitle: "层数历史",
    historyDescription: "未来将在此显示各赛季最高层趋势图。",
    skillTitle: "技能树",
    skillDescription: "未来将在此显示属性升级与技能分支信息。",
    guildPrefix: "公会",
  },
  equipment: {
    weapon: "武器",
    armor: "防具",
    accessory: "饰品",
    unequipped: "未装备",
  },
  rarity: {
    common: "普通",
    rare: "稀有",
    epic: "史诗",
    legendary: "传说",
  },
  stats: {
    atk: "攻击力",
    def: "防御力",
    hp: "生命值",
    spd: "速度",
    luk: "幸运",
    focusMulti: "专注倍率",
    generic: "属性",
    subOption: "副属性",
  },
  focus: {
    hoursMinutes: "{hours}小时{minutes}分",
    hoursOnly: "{hours}小时",
    minutes: "{minutes}分",
  },
  errors: {
    nicknameRequired: "请输入昵称。",
    profileNotFound: "昵称不存在。",
    network: "发生网络错误。",
    rankingFailed: "无法加载排行榜。",
    searchFailed: "搜索失败。",
    searchNetwork: "网络错误，请稍后重试。",
  },
  community: {
    title: "社区",
    close: "关闭小部件",
    open: "社区",
    discord: "💬 官方 Discord",
    bugReport: "🐛 向开发者报告 Bug",
  },
  notFound: {
    title: "未找到玩家",
    description: "昵称不存在或资料未公开。",
    backHome: "返回首页",
  },
};

const zhTW: Dictionary = {
  meta: {
    title: "Focus RPG | 戰績 · 排行榜",
    description: "搜尋 Focus RPG 玩家戰績並查看即時排行榜。",
    userTitle: "{nickname} | Focus RPG 戰績",
    userDescription: "{nickname} 的詳細戰績、裝備與稱號資訊。",
  },
  common: {
    search: "搜尋",
    searching: "搜尋中...",
    rank: "排名",
    nickname: "暱稱",
    level: "等級",
    highestFloor: "最高層",
    focusTime: "專注時間",
    combatPower: "戰鬥力",
    guild: "公會",
    members: "成員",
    floorUnit: "F",
    enhance: "強化",
    slots: "欄位",
    playerProfile: "玩家資料",
  },
  home: {
    badge: "Focus RPG",
    title: "戰績 · 排行榜",
    subtitle: "搜尋玩家暱稱或查看即時排行榜。",
    searchPlaceholder: "請輸入玩家暱稱",
    searchLabel: "玩家暱稱",
    rankingBoard: "排行榜",
    top100: "前 100 名",
    top50Guilds: "前 50 公會",
  },
  tabs: {
    highestFloor: "塔最高層排行",
    weeklyFocus: "每週專注排行",
    combatPower: "綜合戰鬥力排行",
    guild: "公會榮譽殿堂",
    metricHighestFloor: "最高層",
    metricFocusTime: "專注時間",
    metricCombatPower: "戰鬥力",
    metricGuild: "公會",
  },
  ranking: {
    loading: "正在載入排行資料...",
    empty: "暫無排行資料。",
    floor: "層數",
    focus: "專注",
    power: "戰鬥力",
    avatarPlaceholder: "角色縮圖占位",
  },
  guild: {
    loading: "正在載入公會排行...",
    empty: "暫無公會排行資料。",
    guildName: "公會名",
    totalPower: "總戰鬥力",
    avgFloor: "平均最高層",
    topMember: "最高層玩家",
  },
  user: {
    backToRanking: "返回排行榜",
    honorTitle: "榮譽稱號",
    equippedTitle: "已裝備",
    noTitle: "無稱號",
    equipment: "已裝備物品",
    prefix: "前綴",
    subOption: "副屬性",
    noSubOption: "無副屬性",
    historyTitle: "層數紀錄",
    historyDescription: "未來將在此顯示各賽季最高層趨勢圖。",
    skillTitle: "技能樹",
    skillDescription: "未來將在此顯示屬性升級與技能分支資訊。",
    guildPrefix: "公會",
  },
  equipment: {
    weapon: "武器",
    armor: "防具",
    accessory: "飾品",
    unequipped: "未裝備",
  },
  rarity: {
    common: "普通",
    rare: "稀有",
    epic: "史詩",
    legendary: "傳說",
  },
  stats: {
    atk: "攻擊力",
    def: "防禦力",
    hp: "生命值",
    spd: "速度",
    luk: "幸運",
    focusMulti: "專注倍率",
    generic: "屬性",
    subOption: "副屬性",
  },
  focus: {
    hoursMinutes: "{hours}小時{minutes}分",
    hoursOnly: "{hours}小時",
    minutes: "{minutes}分",
  },
  errors: {
    nicknameRequired: "請輸入暱稱。",
    profileNotFound: "暱稱不存在。",
    network: "發生網路錯誤。",
    rankingFailed: "無法載入排行榜。",
    searchFailed: "搜尋失敗。",
    searchNetwork: "網路錯誤，請稍後再試。",
  },
  community: {
    title: "社群",
    close: "關閉小工具",
    open: "社群",
    discord: "💬 官方 Discord",
    bugReport: "🐛 向開發者回報 Bug",
  },
  notFound: {
    title: "找不到玩家",
    description: "暱稱不存在或資料未公開。",
    backHome: "返回首頁",
  },
};

const ru: Dictionary = {
  meta: {
    title: "Focus RPG | Статистика · Рейтинг",
    description: "Поиск статистики игроков Focus RPG и таблицы рейтингов в реальном времени.",
    userTitle: "{nickname} | Статистика Focus RPG",
    userDescription: "Подробная статистика, экипировка и титулы игрока {nickname}.",
  },
  common: {
    search: "Поиск",
    searching: "Поиск...",
    rank: "Место",
    nickname: "Ник",
    level: "Уровень",
    highestFloor: "Лучший этаж",
    focusTime: "Время фокуса",
    combatPower: "Боевая сила",
    guild: "Гильдия",
    members: "Участники",
    floorUnit: "F",
    enhance: "Улуч.",
    slots: "Слоты",
    playerProfile: "Профиль игрока",
  },
  home: {
    badge: "Focus RPG",
    title: "Статистика · Рейтинг",
    subtitle: "Ищите статистику по нику или смотрите рейтинг в реальном времени.",
    searchPlaceholder: "Введите ник игрока",
    searchLabel: "Ник игрока",
    rankingBoard: "Таблица рейтинга",
    top100: "Топ 100",
    top50Guilds: "Топ 50 гильдий",
  },
  tabs: {
    highestFloor: "Рейтинг лучшего этажа",
    weeklyFocus: "Недельный фокус",
    combatPower: "Боевая сила",
    guild: "Зал славы гильдий",
    metricHighestFloor: "Лучший этаж",
    metricFocusTime: "Время фокуса",
    metricCombatPower: "Боевая сила",
    metricGuild: "Гильдия",
  },
  ranking: {
    loading: "Загрузка рейтинга...",
    empty: "Нет данных рейтинга.",
    floor: "Этаж",
    focus: "Фокус",
    power: "Сила",
    avatarPlaceholder: "Заглушка аватара персонажа",
  },
  guild: {
    loading: "Загрузка рейтинга гильдий...",
    empty: "Нет данных рейтинга гильдий.",
    guildName: "Гильдия",
    totalPower: "Суммарная сила",
    avgFloor: "Средний этаж",
    topMember: "Лучший игрок",
  },
  user: {
    backToRanking: "Назад к рейтингу",
    honorTitle: "Почётный титул",
    equippedTitle: "Надето",
    noTitle: "Без титула",
    equipment: "Экипировка",
    prefix: "Префикс",
    subOption: "Доп. статы",
    noSubOption: "Нет доп. статов",
    historyTitle: "История этажей",
    historyDescription: "Здесь появится график лучших этажей по сезонам.",
    skillTitle: "Дерево навыков",
    skillDescription: "Здесь появится информация об улучшениях и ветках навыков.",
    guildPrefix: "Гильдия",
  },
  equipment: {
    weapon: "Оружие",
    armor: "Броня",
    accessory: "Аксессуар",
    unequipped: "Пусто",
  },
  rarity: {
    common: "Обычный",
    rare: "Редкий",
    epic: "Эпический",
    legendary: "Легендарный",
  },
  stats: {
    atk: "Атака",
    def: "Защита",
    hp: "HP",
    spd: "Скорость",
    luk: "Удача",
    focusMulti: "Множитель фокуса",
    generic: "Стата",
    subOption: "Доп. стат",
  },
  focus: {
    hoursMinutes: "{hours} ч {minutes} мин",
    hoursOnly: "{hours} ч",
    minutes: "{minutes} мин",
  },
  errors: {
    nicknameRequired: "Введите ник.",
    profileNotFound: "Ник не найден.",
    network: "Ошибка сети.",
    rankingFailed: "Не удалось загрузить рейтинг.",
    searchFailed: "Ошибка поиска.",
    searchNetwork: "Ошибка сети. Попробуйте позже.",
  },
  community: {
    title: "Сообщество",
    close: "Закрыть виджет",
    open: "Сообщество",
    discord: "💬 Официальный Discord",
    bugReport: "🐛 Сообщить об ошибке",
  },
  notFound: {
    title: "Игрок не найден",
    description: "Ник не существует или профиль скрыт.",
    backHome: "На главную",
  },
};

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  ko,
  ja,
  vi,
  id,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ru,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  );
}
