/* ============================================================
   TWISTBOARD: phần dùng chung (header, ngôn ngữ, danh sách game, trang chủ, trang "sắp ra mắt")
   Trang nào cũng: <html data-tb-root="đường dẫn tới thư mục gốc">, nạp platform.css + platform.js trong <head>,
   rồi đặt <div id="tb-header"></div><script>TB.mountHeader(...)</script> ngay đầu <body>.
   Thêm game mới: thêm 1 mục vào GAMES (và ảnh vuông trong assets/thumbs/).
   ============================================================ */
(function () {
  "use strict";
  const ROOT = document.documentElement.dataset.tbRoot || "";
  /* Link tới trang trong site. Trên web, "games/x/" tự mở index.html; mở thẳng file trên ổ đĩa (file://) thì trình duyệt
     chỉ hiện danh sách thư mục, nên lúc đó trỏ thẳng tới index.html. */
  const ON_DISK = location.protocol === "file:";
  const link = p => { const u = ROOT + p; return ON_DISK && (u === "" || u.endsWith("/")) ? u + "index.html" : (u || "./"); };

  /* ---------- MÁY CHỦ KẾT NỐI CHO CHƠI ONLINE (PeerJS) ----------
     Hai máy ở hai mạng khác nhau thường không nối thẳng được, phải đi vòng qua máy chủ trung chuyển TURN.
     TURN công cộng của PeerJS (eu-0/us-0.turn.peerjs.com) đã chết (11/2026), nên dùng Metered Open Relay (20 GB/tháng
     miễn phí) của chủ game. Mọi game gọi `new Peer(...)` sau khi nạp PeerJS; ở đây chặn lúc PeerJS gán window.Peer và
     bọc lại để mọi Peer tự dùng danh sách ICE_SERVERS này, nên không phải sửa từng game. */
  const TURN_USER = "", TURN_PASS = "";   // tài khoản Metered (TURN Server → Credentials) — điền khi chủ game gửi
  const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.cloudflare.com:3478" },
  ].concat(TURN_USER ? [{
    urls: ["turn:global.relay.metered.ca:80", "turn:global.relay.metered.ca:80?transport=tcp",
      "turn:global.relay.metered.ca:443", "turns:global.relay.metered.ca:443?transport=tcp"],
    username: TURN_USER, credential: TURN_PASS,
  }] : []);
  (function hookPeer() {
    let Wrapped;
    try {
      Object.defineProperty(window, "Peer", {
        configurable: true,
        get() { return Wrapped; },
        set(P) {
          Wrapped = typeof P !== "function" ? P : class extends P {
            constructor(id, opt) {
              if (id && typeof id === "object") { opt = id; id = undefined; }
              opt = Object.assign({}, opt);
              opt.config = Object.assign({}, opt.config, { iceServers: (opt.config && opt.config.iceServers) || ICE_SERVERS });
              super(id, opt);
            }
          };
        },
      });
    } catch (e) {}
  })();

  /* ---------- NGÔN NGỮ (dùng chung khoá localStorage "lang" với game) ---------- */
  let LANG = "vi";
  try { const s = localStorage.getItem("lang"); LANG = s === "vi" || s === "en" ? s : ((navigator.language || "").toLowerCase().startsWith("vi") ? "vi" : "en"); }
  catch (e) { LANG = (navigator.language || "").toLowerCase().startsWith("vi") ? "vi" : "en"; }
  const listeners = [];

  const I18N = {
    vi: {
      home_title: "Twistboard · Game cờ biến thể", search_ph: "Nhập tên game...", search_btn: "Tìm", close: "Đóng", credit: "Game được làm bởi Gary Duc Nguyen",
      all_games: "Tất cả game", games_n: "{0} game", empty: "Không tìm thấy game nào khớp với “{0}”.", empty_cat: "Chưa có game nào trong mục này.",
      play: "Chơi ngay", home: "Trang chủ", soon: "Sắp ra mắt", soon_dev: "Game đang được phát triển",
      soon_desc_todo: "Mô tả luật chơi sẽ được cập nhật sớm.", back_home: "Về trang chủ", try_other: "Trong lúc chờ, thử {0}",
      footer: "Twistboard · Game được làm bởi Gary Duc Nguyen",
      cat_all: "Tất cả", cat_online: "Chơi online", cat_ai: "Đấu với máy", cat_soon: "Sắp ra mắt", cat_chess: "Cờ", cat_caro: "Cờ ca-rô", cat_puzzle: "Đố trí", cat_card: "Poker", cat_strategy: "Chiến thuật", cat_2p: "2 người",
    },
    en: {
      home_title: "Twistboard · Board games with a twist", search_ph: "Search games...", search_btn: "Search", close: "Close", credit: "Game made by Gary Duc Nguyen",
      all_games: "All games", games_n: "{0} games", empty: "No games match “{0}”.", empty_cat: "No games in this category yet.",
      play: "Play now", home: "Home", soon: "Coming soon", soon_dev: "This game is in development",
      soon_desc_todo: "The rules will be announced soon.", back_home: "Back to home", try_other: "Meanwhile, try {0}",
      footer: "Twistboard · Games made by Gary Duc Nguyen",
      cat_all: "All games", cat_online: "Online", cat_ai: "Vs AI", cat_soon: "Coming soon", cat_chess: "Chess", cat_caro: "Gomoku", cat_puzzle: "Puzzles", cat_card: "Poker", cat_strategy: "Strategy", cat_2p: "2 players",
    },
  };
  const t = (key, ...a) => String(I18N[LANG][key] ?? I18N.vi[key] ?? key).replace(/\{(\d)\}/g, (m, i) => a[i]);
  const L = obj => (obj && (obj[LANG] ?? obj.vi)) || "";   // chọn chữ theo ngôn ngữ từ {vi, en}

  /* ---------- DANH SÁCH GAME ---------- */
  const GAMES = [
    {
      id: "summoning-chess", status: "live", big: true, path: "games/summoning-chess/", thumb: "assets/thumbs/summoning-chess.svg",
      name: { vi: "Cờ Vua Triệu Hồi", en: "Summoning Chess" },
      meta: { vi: "Đấu máy · 2 người · Online", en: "Vs AI · 2 players · Online" },
      tagline: { vi: "Bắt đầu chỉ với Vua, gom tài nguyên để triệu hồi quân", en: "Start with a lone King, gather resources and summon an army" },
      tags: ["chess", "2p", "online", "ai"], aliases: ["summoning chess", "co vua trieu hoi", "chess", "co vua"],
    },
    {
      id: "original-chess", status: "live", path: "games/original-chess/", thumb: "assets/thumbs/original-chess.svg",
      name: { vi: "Cờ Vua Truyền Thống", en: "Original Chess" },
      meta: { vi: "Đấu máy · 2 người · Online", en: "Vs AI · 2 players · Online" },
      tagline: { vi: "Cờ vua luật FIDE, có đồng hồ thi đấu", en: "Classic FIDE chess with tournament clocks" },
      tags: ["chess", "2p", "online", "ai"], aliases: ["original chess", "co vua truyen thong", "co vua", "chess", "classic chess"],
    },
    {
      id: "chinese-chess", status: "live", path: "games/chinese-chess/", thumb: "assets/thumbs/chinese-chess.svg",
      name: { vi: "Cờ Tướng", en: "Chinese Chess" },
      meta: { vi: "Đấu máy · 2 người · Online", en: "Vs AI · 2 players · Online" },
      tagline: { vi: "Cờ Tướng truyền thống trên bàn 9×10", en: "Traditional xiangqi on a 9×10 board" },
      tags: ["chess", "2p", "online", "ai"], aliases: ["chinese chess", "co tuong", "xiangqi", "tuong ky", "chess"],
    },
    {
      id: "racing-kings", status: "live", path: "games/racing-kings/", thumb: "assets/thumbs/racing-kings.svg",
      name: { vi: "Đua Vua", en: "Racing Kings" },
      meta: { vi: "Đấu máy · 2 người · Online", en: "Vs AI · 2 players · Online" },
      tagline: { vi: "Đưa Vua về hàng 8 trước, cấm chiếu", en: "Race your King to the 8th rank, no checks allowed" },
      tags: ["chess", "2p", "online", "ai"], aliases: ["racing kings", "dua vua", "co vua dua vua", "chess variant", "co vua", "chess"],
    },
    {
      id: "nine-mens-morris", status: "live", path: "games/nine-mens-morris/", thumb: "assets/thumbs/nine-mens-morris.svg",
      name: { vi: "Nine Men's Morris", en: "Nine Men's Morris" },
      meta: { vi: "Đấu máy · Online", en: "Vs AI · Online" },
      tagline: { vi: "Xếp 3 quân thẳng hàng thành cối xay để ăn quân đối thủ", en: "Line up three to form a mill and take an enemy piece" },
      tags: ["chess", "online", "ai"], aliases: ["nine mens morris", "nine men's morris", "9 mens morris", "morris", "mill", "muhle", "co coi xay", "coi xay", "cuu tu ky", "9 quan", "chess"],
    },
    {
      id: "blind-gomoku", status: "live", path: "games/blind-gomoku/", thumb: "assets/thumbs/blind-gomoku.svg",
      name: { vi: "Cờ Ca-rô Mù", en: "Blind Gomoku" },
      meta: { vi: "Đấu máy · Online", en: "Vs AI · Online" },
      tagline: { vi: "Xếp 5 quân liền hàng khi mọi quân trông như nhau", en: "Get five in a row when every stone looks the same" },
      tags: ["caro", "online", "ai"], aliases: ["blind gomoku", "co caro mu", "caro mu", "gomoku", "caro", "devils gomoku", "omok"],
    },
    {
      id: "point-gomoku", status: "live", path: "games/point-gomoku/", thumb: "assets/thumbs/point-gomoku.svg",
      name: { vi: "Cờ Ca-rô Cược Điểm", en: "Point Gomoku" },
      meta: { vi: "Đấu máy · Online", en: "Vs AI · Online" },
      tagline: { vi: "Cược điểm kín để giành từng ô, rồi xếp 5 quân", en: "Bid in secret for each square, then line up five" },
      tags: ["caro", "online", "ai"], aliases: ["point gomoku", "point omok", "co caro cuoc diem", "caro cuoc diem", "dat cuoc diem", "gomoku", "caro", "omok"],
      desc: null,   // TODO: như trên
    },
    {
      id: "sliding-tictactoe", status: "live", path: "games/sliding-tictactoe/", thumb: "assets/thumbs/sliding-tictactoe.svg",
      name: { vi: "Cờ ca-rô trượt", en: "Sliding Tic Tac Toe" },
      meta: { vi: "Đấu máy · Online", en: "Vs AI · Online" },
      tagline: { vi: "Mỗi bên chỉ 3 quân, hết quân thì kéo quân cũ đi", en: "Only 3 pieces each, then slide your old ones around" },
      tags: ["caro", "online", "ai"], aliases: ["sliding tic tac toe", "co ca ro truot", "ca ro truot", "caro truot", "tic tac toe", "tictactoe", "ca ro 3x3", "caro 3x3", "co ca ro", "caro", "xo", "x o", "keo quan"],
    },
    {
      id: "ultimate-tictactoe", status: "live", path: "games/ultimate-tictactoe/", thumb: "assets/thumbs/ultimate-tictactoe.svg",
      name: { vi: "Cờ ca-rô tối thượng", en: "Ultimate Tic Tac Toe" },
      meta: { vi: "Đấu máy · Online", en: "Vs AI · Online" },
      tagline: { vi: "9 bàn ca-rô lồng nhau, nước của bạn chọn bàn cho đối thủ", en: "Nine boards in one, your move picks your opponent's board" },
      tags: ["caro", "online", "ai"], aliases: ["ultimate tic tac toe", "co ca ro toi thuong", "ca ro toi thuong", "caro toi thuong", "super tic tac toe", "meta tic tac toe", "tic tac toe", "tictactoe", "ca ro long nhau", "caro 9 ban", "co ca ro", "caro", "xo"],
    },
    {
      id: "equation-hilo", status: "live", path: "games/equation-hilo/", thumb: "assets/thumbs/equation-hilo.svg",
      name: { vi: "Poker Phép Tính", en: "Equation Hi-Lo" },
      meta: { vi: "Đấu máy · Online 2-5 người", en: "Vs AI · Online 2-5 players" },
      tagline: { vi: "Ghép phép tính sát 1 hoặc 20, cược như poker", en: "Build an equation close to 1 or 20, bet like poker" },
      tags: ["card", "online", "ai"], aliases: ["equation hi-lo", "equation hilo", "poker phep tinh", "math poker", "poker toan", "poker", "phep tinh", "devils plan", "bai"],
    },
    {
      id: "hit-stay", status: "live", path: "games/hit-stay/", thumb: "assets/thumbs/hit-stay.svg",
      name: { vi: "Hit, Stay", en: "Hit, Stay" },
      meta: { vi: "Đấu máy · Online 2-5 người", en: "Vs AI · Online 2-5 players" },
      tagline: { vi: "Sát giới hạn nhất mà không vượt thì ăn cả pot", en: "Get closest to the limit without going over" },
      tags: ["card", "online", "ai"], aliases: ["hit stay", "hit, stay", "hitstay", "hit or stay", "rut bai", "gioi han", "xuc xac", "devils plan", "bai"],
    },
    {
      id: "memory-poker", status: "live", path: "games/memory-poker/", thumb: "assets/thumbs/memory-poker.svg",
      name: { vi: "Poker Trí Nhớ", en: "Memory Poker" },
      meta: { vi: "Đấu máy · Luyện tập · Online 2 người", en: "Vs AI · Practice · Online 2 players" },
      tagline: { vi: "Nhớ 16 lá trong 30 giây, lật đúng 2 lá ghép tay poker mạnh nhất", en: "Memorize 16 cards in 30 seconds, then flip 2 for the best poker hand" },
      tags: ["card", "online", "ai", "2p"], aliases: ["memory poker", "poker tri nho", "tri nho", "ghi nho", "nho bai", "lat bai", "poker", "devils plan", "bai"],
    },
    {
      id: "poker-dice", status: "live", path: "games/poker-dice/", thumb: "assets/thumbs/poker-dice.svg",
      name: { vi: "Poker Xúc Xắc", en: "Poker Dice" },
      meta: { vi: "Đấu máy · Online 2-5 người", en: "Vs AI · Online 2-5 players" },
      tagline: { vi: "Đổ 5 xúc xắc ghép tay poker, viên giữ lại phải lật ngửa", en: "Roll five dice into a poker hand; the dice you keep go face up" },
      tags: ["card", "online", "ai"], aliases: ["poker dice", "poker xuc xac", "xuc xac", "do xuc xac", "dice poker", "dice", "poker", "bai"],
    },
    {
      id: "wall-go", status: "live", path: "games/wall-go/", thumb: "assets/thumbs/wall-go.svg",
      name: { vi: "Wall Go", en: "Wall Go" },
      meta: { vi: "Đấu máy · Online 2-4 người", en: "Vs AI · Online 2-4 players" },
      tagline: { vi: "Đi quân, dựng tường, khoanh đất nhiều nhất", en: "Move, build walls, claim the most land" },
      tags: ["strategy", "online", "ai"], aliases: ["wall go", "wallgo", "dung tuong", "xay tuong", "khoanh dat", "chiem dat", "devils plan", "chien thuat", "strategy"],
    },
    {
      id: "wall-go-2", status: "live", path: "games/wall-go-2/", thumb: "assets/thumbs/wall-go-2.svg",
      name: { vi: "Wall Go II", en: "Wall Go II" },
      meta: { vi: "Đấu máy · Online 2-4 người", en: "Vs AI · Online 2-4 players" },
      tagline: { vi: "Quân vuông đi thẳng, quân tròn rẽ góc, dựng tường khoanh đất", en: "Squares go straight, rounds turn corners; wall off the most land" },
      tags: ["strategy", "online", "ai"], aliases: ["wall go 2", "wall go ii", "wallgo 2", "wallgo2", "quan vuong", "quan tron", "dung tuong", "khoanh dat", "devils plan", "chien thuat", "strategy"],
    },
    {
      id: "bagh-chal", status: "live", path: "games/bagh-chal/", thumb: "assets/thumbs/bagh-chal.svg",
      name: { vi: "Bagh Chal", en: "Bagh Chal" },
      meta: { vi: "Đấu máy · Online 2 người", en: "Vs AI · Online 2 players" },
      tagline: { vi: "4 Hổ săn 20 Dê: Hổ ăn 5 con, hay Dê vây kín cả bầy Hổ", en: "4 tigers hunt 20 goats: capture 5, or trap every tiger" },
      tags: ["strategy", "online", "ai", "2p"], aliases: ["bagh chal", "baghchal", "bagh-chal", "tigers and goats", "tiger and goat", "ho va de", "ho de", "con ho", "con de", "nepal", "devils plan", "chien thuat", "strategy"],
    },
    {
      id: "equation-traffic-light", status: "live", path: "games/equation-traffic-light/", thumb: "assets/thumbs/equation-traffic-light.svg",
      name: { vi: "Phương trình màu sắc", en: "Equation Traffic Light" },
      meta: { vi: "Đấu AI · Online 2 người", en: "Vs AI · Online 2 players" },
      tagline: { vi: "Đoán phép tính bí mật theo đèn xanh, vàng, đỏ", en: "Crack the secret equation by its green, yellow, red lights" },
      tags: ["puzzle", "online", "ai", "2p"], aliases: ["equation traffic light","phuong trinh mau sac","mau sac","den giao thong","doan phep tinh","phep tinh","den xanh do","do tri","puzzle"],
    },
    {
      id: "knight-tour", status: "live", path: "games/knight-tour/", thumb: "assets/thumbs/knight-tour.svg",
      name: { vi: "Mã đi tuần", en: "Knight's Tour" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Cho quân Mã nhảy qua mọi ô, mỗi ô đúng một lần", en: "Land the knight on every square, once each" },
      tags: ["puzzle", "online", "2p"], aliases: ["knight tour","knights tour","ma di tuan","quan ma","devils plan","do tri","puzzle"],
    },
    {
      id: "cube-count", status: "live", path: "games/cube-count/", thumb: "assets/thumbs/cube-count.svg",
      name: { vi: "Đếm khối lập phương", en: "Cube Count" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Đếm hết khối lập phương, kể cả khối bị che", en: "Count every cube in the stack, hidden ones too" },
      tags: ["puzzle", "online", "2p"], aliases: ["cube count","dem khoi","dem khoi lap phuong","khoi lap phuong","devils plan","do tri","puzzle"],
    },
    {
      id: "box-count", status: "live", path: "games/box-count/", thumb: "assets/thumbs/box-count.svg",
      name: { vi: "Đếm hình chữ nhật", en: "Box Count" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Đếm mọi hình chữ nhật có tổng bằng số đích", en: "Count every rectangle that adds up to the target" },
      tags: ["puzzle", "online", "2p"], aliases: ["box count","dem hinh chu nhat","hinh chu nhat","tong","devils plan","do tri","puzzle"],
    },
    {
      id: "slitherlink", status: "live", path: "games/slitherlink/", thumb: "assets/thumbs/slitherlink.svg",
      name: { vi: "Nối hàng rào", en: "Slitherlink" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Nối các chấm thành một vòng kín, khớp với mọi con số", en: "Join the dots into one loop that fits every number" },
      tags: ["puzzle", "online", "2p"], aliases: ["slitherlink","slither link","noi hang rao","loop fence","noi vong","vong kin","hang rao","devils plan","do tri","puzzle"],
    },
    {
      id: "symmetry-puzzle", status: "live", path: "games/symmetry-puzzle/", thumb: "assets/thumbs/symmetry-puzzle.svg",
      name: { vi: "Xếp hình đối xứng", en: "Symmetry Puzzle" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Ghép hết các mảnh thành một hình gấp đôi trùng khít", en: "Fit every piece into one shape with matching halves" },
      tags: ["puzzle", "online", "2p"], aliases: ["symmetry puzzle","symmetrical puzzle","xep hinh doi xung","xep hinh","doi xung","ghep hinh","manh ghep","devils plan","do tri","puzzle"],
    },
    {
      id: "secret-code", status: "live", path: "games/secret-code/", thumb: "assets/thumbs/secret-code.svg",
      name: { vi: "Mật mã bí mật", en: "Secret Code" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Đọc gợi ý, tìm đúng 4 lá trong 26 lá", en: "Read the clues, find the 4 cards out of 26" },
      tags: ["puzzle", "online", "2p"], aliases: ["secret code","mat ma","mat ma bi mat","ma bi mat","giai ma","the bai","devils plan","do tri","puzzle"],
    },
  ];
  const CATS = [
    { id: "all", fill: "blue", icon: "grid" },
    { id: "chess", icon: "pawn", ic: "ic-pink" },
    { id: "caro", icon: "xo", ic: "ic-blue" },
    { id: "puzzle", icon: "bulb", ic: "ic-orange" },
    { id: "card", icon: "cards", ic: "ic-red" },
    { id: "strategy", icon: "wall", ic: "ic-yellow" },
  ];

  /* ---------- ICON (SVG nét, đổi màu theo currentColor) ---------- */
  const S = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const ICON = {
    search: S('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
    grid: S('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
    globe: S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9S14.6 18.4 12 21M12 3C9.4 5.6 8.2 8.6 8.2 12s1.2 6.4 3.8 9"/>'),
    bot: S('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13v1M15 13v1M9.5 17h5"/><circle cx="12" cy="3.5" r="1" fill="currentColor"/>'),
    clock: S('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    pawn: S('<circle cx="12" cy="6.5" r="3"/><path d="M9.5 10.5h5l1.5 6h-8zM6.5 20.5h11l-1-4h-9z" fill="currentColor" stroke-width="1.6"/>'),
    xo: S('<path d="m4 4 6 6M10 4 4 10"/><circle cx="17" cy="17" r="3.6"/><path d="M14 4h6M4 17h6" opacity=".5"/>'),
    users: S('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5"/><circle cx="17" cy="9" r="2.6"/><path d="M15.8 14.2c2.4-.3 4.3 1.2 4.9 4.3"/>'),
    bulb: S('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>'),
    cards: S('<rect x="3.5" y="6" width="10" height="14" rx="2" transform="rotate(-10 8.5 13)"/><rect x="10.5" y="4" width="10" height="14" rx="2" transform="rotate(8 15.5 11)"/><path d="M15.5 9v4M13.5 11h4"/>'),
    wall: S('<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M3.5 12h8.5M12 3.5V12M15 12v8.5" stroke-width="3"/>'),
    star: S('<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8z" fill="currentColor"/>'),
    play: S('<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>'),
    home: S('<path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5"/>'),
    back: S('<path d="M15 5l-7 7 7 7"/>'),
  };
  const MARK = `<svg class="tb-mark" viewBox="0 0 40 40" aria-hidden="true"><g transform="rotate(-12 20 20)"><rect x="4" y="4" width="32" height="32" rx="9" fill="#1d2330"/>
    <rect x="8" y="8" width="11.5" height="11.5" rx="3" fill="#4a6fd8"/><rect x="20.5" y="8" width="11.5" height="11.5" rx="3" fill="#ffc928"/>
    <rect x="8" y="20.5" width="11.5" height="11.5" rx="3" fill="#ef3f5a"/><rect x="20.5" y="20.5" width="11.5" height="11.5" rx="3" fill="#2ea65a"/></g></svg>`;
  const FLAG = {
    vi: '<svg viewBox="0 0 30 30"><rect width="30" height="30" fill="#da251d"/><path d="M15 6.5l2.3 7h7.4l-6 4.3 2.3 7L15 20.5l-6 4.3 2.3-7-6-4.3h7.4z" fill="#ff0"/></svg>',
    en: '<svg viewBox="0 0 30 30"><rect width="30" height="30" fill="#012169"/><path d="M0 0l30 30M30 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l30 30M30 0L0 30" stroke="#c8102e" stroke-width="2.4"/><path d="M15 0v30M0 15h30" stroke="#fff" stroke-width="10"/><path d="M15 0v30M0 15h30" stroke="#c8102e" stroke-width="6"/></svg>',
  };
  const wordmark = () => `<span class="tb-word"><span class="a">${[..."Twist"].map(c => `<i>${c}</i>`).join("")}</span><span class="b">${[..."board"].map(c => `<i>${c}</i>`).join("")}</span></span>`;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fold = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, " ").trim();
  const byId = id => GAMES.find(g => g.id === id);

  // favicon dùng chung (trang nào đã có icon riêng, như game, thì giữ icon đó)
  (function () {
    if (document.querySelector('link[rel="icon"]')) return;
    const ic = document.createElement("link"); ic.rel = "icon"; ic.type = "image/svg+xml";
    ic.href = "data:image/svg+xml," + encodeURIComponent(MARK.replace('class="tb-mark" ', 'xmlns="http://www.w3.org/2000/svg" '));
    document.head.appendChild(ic);
  })();

  /* ---------- HEADER ---------- */
  let headerOpt = {};
  function mountHeader(opt = {}) {
    headerOpt = opt;
    const host = document.getElementById("tb-header"); if (!host) return;
    if (opt.page === "game") document.body.classList.add("tb-game");
    host.outerHTML = `<header class="tb-header" id="tb-header"><div class="tb-header-in">
      <a class="tb-logo" href="${link("")}" aria-label="Twistboard">${MARK}${wordmark()}</a>
      <form class="tb-search" role="search"><input type="search" name="q" autocomplete="off" spellcheck="false"><button type="submit">${ICON.search}</button></form>
      <div class="tb-right"><div class="tb-lang">${["vi", "en"].map(l => `<button type="button" data-lang="${l}">${FLAG[l]}<span>${l.toUpperCase()}</span></button>`).join("")}</div></div>
    </div></header>`;
    const form = document.querySelector(".tb-search"), input = form.querySelector("input");
    if (opt.page === "home") {
      input.value = new URLSearchParams(location.search).get("q") || "";
      input.addEventListener("input", () => homeState.onSearch && homeState.onSearch(input.value));
      form.addEventListener("submit", e => { e.preventDefault(); input.blur(); });
    } else {
      form.addEventListener("submit", e => { e.preventDefault(); location.href = link("") + (input.value.trim() ? "?q=" + encodeURIComponent(input.value.trim()) : ""); });
    }
    document.querySelectorAll(".tb-lang button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
    paintHeader();
  }
  function paintHeader() {
    const input = document.querySelector(".tb-search input"); if (!input) return;
    document.querySelectorAll(".tb-x").forEach(b => { b.setAttribute("aria-label", t("close")); b.title = t("close"); });
    input.placeholder = t("search_ph"); document.querySelector(".tb-search button").setAttribute("aria-label", t("search_btn"));
    document.querySelectorAll(".tb-lang button").forEach(b => b.classList.toggle("on", b.dataset.lang === LANG));
  }
  /* dòng ghi công chuẩn của mọi game: phần tử có class "tb-credit" (thường ở chân hộp Luật chơi), tự đổi theo ngôn ngữ */
  function paintCredits() { document.querySelectorAll(".tb-credit").forEach(e => { e.textContent = t("credit"); }); }
  document.addEventListener("DOMContentLoaded", paintCredits);
  /* logo nhỏ của game đứng trước tên game (chủ game yêu cầu 11/2026). Tên game là ".brand h1" (game thường)
     hoặc "#pkTitle" (game đố, dựng muộn); chữ trong h1 do i18n ghi đè nên logo đặt cạnh h1, không đặt bên trong. */
  const logoDone = { head: false, rules: false };
  function logoImg(g, cls) {
    const img = document.createElement("img");
    img.className = cls; img.src = ROOT + g.thumb; img.alt = ""; img.draggable = false; img.setAttribute("aria-hidden", "true");
    return img;
  }
  function mountGameLogo() {
    const g = GAMES.find(x => x.id === headerOpt.gameId); if (!g || !g.thumb) return true;
    const h1 = !logoDone.head && document.querySelector(".brand h1, #pkTitle");
    if (h1) {
      logoDone.head = true;
      const img = logoImg(g, "tb-glogo");
      if (h1.id === "pkTitle") {   // .pk-top canh 2 đầu nên gói logo + tên vào một khối
        const w = document.createElement("div"); w.className = "tb-gtitle";
        h1.before(w); w.append(img, h1);
      } else { h1.parentElement.classList.add("tb-gbrand"); h1.before(img); }
    }
    // tiêu đề hộp Luật chơi: gói logo + h2 vào một hàng, giữ nguyên khoảng cách trên/dưới của h2 cũ
    const h2 = !logoDone.rules && document.querySelector("#mRules h2, #pkRulesTitle");
    if (h2) {
      logoDone.rules = true;
      const cs = getComputedStyle(h2), w = document.createElement("div");
      w.className = "tb-gtitle tb-rtitle"; w.style.margin = `${cs.marginTop} 0 ${cs.marginBottom}`;
      h2.before(w); w.append(logoImg(g, "tb-rlogo"), h2); h2.style.margin = "0";
    }
    return logoDone.head && (logoDone.rules || document.readyState === "complete");
  }
  function watchGameLogo() {
    if (headerOpt.page !== "game" || mountGameLogo()) return;
    const mo = new MutationObserver(() => { if (mountGameLogo()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 15000);
  }
  document.addEventListener("DOMContentLoaded", watchGameLogo);
  function setLang(l) {
    if (l !== "vi" && l !== "en") return;
    if (l === LANG) { paintHeader(); return; }
    LANG = l; try { localStorage.setItem("lang", l); } catch (e) {}
    document.documentElement.lang = l;
    paintHeader(); paintCredits();
    for (const cb of listeners) try { cb(l); } catch (e) { console.error(e); }
  }

  /* ---------- TRANG CHỦ ---------- */
  const homeState = { q: "", cat: "all", onSearch: null };
  function renderHome(main) {
    homeState.q = new URLSearchParams(location.search).get("q") || "";
    const draw = () => {
      document.title = t("home_title");
      const q = fold(homeState.q);
      const match = g => (homeState.cat === "all" || g.tags.includes(homeState.cat)) &&
        (!q || [g.name.vi, g.name.en, ...g.aliases].some(s => fold(s).includes(q)));
      const list = GAMES.filter(match);
      main.innerHTML = `
        <nav class="tb-card tb-cats" aria-label="categories">${CATS.map(c => {
          const n = c.id === "all" ? GAMES.length : GAMES.filter(g => g.tags.includes(c.id)).length;
          return `<button type="button" class="tb-chip${homeState.cat === c.id ? " on" : ""}" data-cat="${c.id}"><span class="ic ${c.ic || ""}">${ICON[c.icon]}</span>${t("cat_" + c.id)}<span class="n">${n}</span></button>`;
        }).join("")}</nav>
        <section class="tb-section">
          <div class="tb-head"><h2>${homeState.cat === "all" ? t("all_games") : t("cat_" + homeState.cat)}</h2><span class="cnt">${t("games_n", list.length)}</span></div>
          <div class="tb-grid">${list.map(g => `
            <a class="tb-gcard" href="${link(g.path)}" data-id="${g.id}" title="${esc(L(g.meta))}">
              <span class="art"><img src="${ROOT}${g.thumb}" alt="" loading="lazy" draggable="false"></span>
              <span class="txt"><b>${esc(L(g.name))}</b><span>${esc(L(g.tagline) || L(g.meta))}</span></span>
            </a>`).join("")}</div>
          ${list.length ? "" : `<p class="tb-empty">${q ? esc(t("empty", homeState.q)) : t("empty_cat")}</p>`}
        </section>`;
      main.querySelectorAll(".tb-chip").forEach(b => b.addEventListener("click", () => { homeState.cat = b.dataset.cat; draw(); }));
    };
    homeState.onSearch = v => {
      homeState.q = v; draw();
      try { history.replaceState(null, "", v.trim() ? "?q=" + encodeURIComponent(v.trim()) : location.pathname); } catch (e) {}
    };
    listeners.push(draw);
    draw();
  }

  /* ---------- TRANG "SẮP RA MẮT" ---------- */
  function renderSoon(main, id) {
    const g = byId(id), live = GAMES.find(x => x.status === "live");
    const draw = () => {
      document.title = L(g.name) + " · Twistboard";
      main.innerHTML = `
        <div class="tb-crumb"><a href="${link("")}">${t("home")}</a><span>›</span><span>${esc(L(g.name))}</span></div>
        <section class="tb-card tb-soon">
          <div class="thumb"><img src="${ROOT}${g.thumb}" alt=""></div>
          <div>
            <span class="tb-pill">${ICON.clock}${t("soon")}</span>
            <h1>${esc(L(g.name))}</h1>
            <p class="sub">${t("soon_dev")}</p>
            <p class="desc${g.desc ? "" : " todo"}">${g.desc ? esc(L(g.desc)) : t("soon_desc_todo")}</p>
            <div class="acts">
              <a class="tb-btn" href="${link("")}">${ICON.back}${t("back_home")}</a>
              ${live ? `<a class="tb-btn primary" href="${link(live.path)}">${ICON.play}${esc(t("try_other", L(live.name)))}</a>` : ""}
            </div>
          </div>
        </section>`;
    };
    listeners.push(draw);
    draw();
  }

  function footer() {
    const f = document.createElement("footer"); f.className = "tb-footer";
    const draw = () => { f.textContent = t("footer"); };
    listeners.push(draw); draw();
    document.body.appendChild(f);
  }

  /* nút × đóng popup ở góc trên phải: map { "#idPopup": "#idNútĐóngSẵnCó" | hàm }.
     Bấm × chạy nút đóng/huỷ sẵn có (để giữ tác dụng phụ như huỷ kết nối online), rồi tắt hẳn mọi popup:
     không quay lại Luật chơi hay bảng Ván mới như nút Huỷ/Đã hiểu (chủ game chọn). Thẻ hết ván trên bàn không bị tắt theo. */
  function closeX(map) {
    for (const [box, act] of Object.entries(map)) {
      const m = document.querySelector(box); if (!m) continue;
      const card = m.querySelector(".card, .go-card") || m;
      if (card.querySelector(":scope > .tb-x")) continue;
      const b = document.createElement("button");
      b.type = "button"; b.className = "tb-x"; b.innerHTML = "&times;";
      b.setAttribute("aria-label", t("close")); b.title = t("close");
      b.addEventListener("click", e => {
        e.stopPropagation();
        if (typeof act === "function") act(); else { const o = document.querySelector(act); if (o) o.click(); }
        m.hidden = true;
        document.querySelectorAll(".modal, .pk-modal").forEach(x => { x.hidden = true; });
      });
      card.insertBefore(b, card.firstChild);
    }
  }

  document.documentElement.lang = LANG;
  window.TB = {
    closeX, paintCredits,
    get lang() { return LANG; }, setLang, onLang: cb => listeners.push(cb), t, GAMES, ROOT,
    mountHeader,
    mountHome() { document.body.classList.add("tb-home"); renderHome(document.getElementById("tb-main")); footer(); },
    mountSoon(id) { renderSoon(document.getElementById("tb-main"), id); footer(); },
  };
})();
