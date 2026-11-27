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

  /* ---------- NGÔN NGỮ (dùng chung khoá localStorage "lang" với game) ---------- */
  let LANG = "vi";
  try { const s = localStorage.getItem("lang"); LANG = s === "vi" || s === "en" ? s : ((navigator.language || "").toLowerCase().startsWith("vi") ? "vi" : "en"); }
  catch (e) { LANG = (navigator.language || "").toLowerCase().startsWith("vi") ? "vi" : "en"; }
  const listeners = [];

  const I18N = {
    vi: {
      home_title: "Twistboard · Game cờ biến thể", search_ph: "Nhập tên game...", search_btn: "Tìm",
      all_games: "Tất cả game", games_n: "{0} game", empty: "Không tìm thấy game nào khớp với “{0}”.", empty_cat: "Chưa có game nào trong mục này.",
      play: "Chơi ngay", home: "Trang chủ", soon: "Sắp ra mắt", soon_dev: "Game đang được phát triển",
      soon_desc_todo: "Mô tả luật chơi sẽ được cập nhật sớm.", back_home: "Về trang chủ", try_other: "Trong lúc chờ, thử {0}",
      footer: "Twistboard · Game được làm bởi Gary Duc Nguyen",
      cat_all: "Tất cả", cat_online: "Chơi online", cat_ai: "Đấu với máy", cat_soon: "Sắp ra mắt", cat_chess: "Cờ", cat_caro: "Cờ ca-rô", cat_puzzle: "Đố trí", cat_2p: "2 người",
    },
    en: {
      home_title: "Twistboard · Board games with a twist", search_ph: "Search games...", search_btn: "Search",
      all_games: "All games", games_n: "{0} games", empty: "No games match “{0}”.", empty_cat: "No games in this category yet.",
      play: "Play now", home: "Home", soon: "Coming soon", soon_dev: "This game is in development",
      soon_desc_todo: "The rules will be announced soon.", back_home: "Back to home", try_other: "Meanwhile, try {0}",
      footer: "Twistboard · Games made by Gary Duc Nguyen",
      cat_all: "All games", cat_online: "Online", cat_ai: "Vs AI", cat_soon: "Coming soon", cat_chess: "Chess", cat_caro: "Gomoku", cat_puzzle: "Puzzles", cat_2p: "2 players",
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
      id: "knight-tour", status: "live", path: "games/knight-tour/", thumb: "assets/thumbs/knight-tour.svg",
      name: { vi: "Knight's Tour", en: "Knight's Tour" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Cho quân Mã nhảy qua mọi ô, mỗi ô đúng một lần", en: "Land the knight on every square, once each" },
      tags: ["puzzle", "online", "2p"], aliases: ["knight tour","knights tour","ma di tuan","quan ma","devils plan","do tri","puzzle"],
    },
    {
      id: "cube-count", status: "live", path: "games/cube-count/", thumb: "assets/thumbs/cube-count.svg",
      name: { vi: "Cube Count", en: "Cube Count" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Đếm hết khối lập phương, kể cả khối bị che", en: "Count every cube in the stack, hidden ones too" },
      tags: ["puzzle", "online", "2p"], aliases: ["cube count","dem khoi","dem khoi lap phuong","khoi lap phuong","devils plan","do tri","puzzle"],
    },
    {
      id: "box-count", status: "live", path: "games/box-count/", thumb: "assets/thumbs/box-count.svg",
      name: { vi: "Box Count", en: "Box Count" },
      meta: { vi: "Một mình · Online 2 người", en: "Solo · Online 2 players" },
      tagline: { vi: "Đếm mọi hình chữ nhật có tổng bằng số đích", en: "Count every rectangle that adds up to the target" },
      tags: ["puzzle", "online", "2p"], aliases: ["box count","dem hinh chu nhat","hinh chu nhat","tong","devils plan","do tri","puzzle"],
    },
  ];
  const CATS = [
    { id: "all", fill: "blue", icon: "grid" },
    { id: "online", fill: "red", icon: "globe" },
    { id: "ai", fill: "yellow", icon: "bot" },
    { id: "soon", fill: "green", icon: "clock" },
    { id: "chess", icon: "pawn", ic: "ic-pink" },
    { id: "caro", icon: "xo", ic: "ic-blue" },
    { id: "puzzle", icon: "bulb", ic: "ic-orange" },
    { id: "2p", icon: "users", ic: "ic-green" },
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
    input.placeholder = t("search_ph"); document.querySelector(".tb-search button").setAttribute("aria-label", t("search_btn"));
    document.querySelectorAll(".tb-lang button").forEach(b => b.classList.toggle("on", b.dataset.lang === LANG));
  }
  function setLang(l) {
    if (l !== "vi" && l !== "en") return;
    if (l === LANG) { paintHeader(); return; }
    LANG = l; try { localStorage.setItem("lang", l); } catch (e) {}
    document.documentElement.lang = l;
    paintHeader();
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

  document.documentElement.lang = LANG;
  window.TB = {
    get lang() { return LANG; }, setLang, onLang: cb => listeners.push(cb), t, GAMES, ROOT,
    mountHeader,
    mountHome() { document.body.classList.add("tb-home"); renderHome(document.getElementById("tb-main")); footer(); },
    mountSoon(id) { renderSoon(document.getElementById("tb-main"), id); footer(); },
  };
})();
