/* ============================================================
   PUZZLE KIT: khung chung cho các game đố (Knight's Tour, Cube Count, Box Count)
   - Chơi một mình: vượt màn từ dễ tới khó, tính tổng thời gian, sai cộng 5 giây, lưu kỷ lục trong localStorage.
   - Online 2 người (PeerJS, nối thẳng hai trình duyệt): cùng giải một đề, ai đúng trước được 1 điểm, chạm đích trước thắng.
   Mỗi game gọi PK.start(GAME) với:
     id, peerPrefix, proto, kind: "number" (nhập số) | "self" (game tự báo giải xong qua ctx.solved()),
     solo: { stages, gen(stage, rng, level), useLevel? }, online: { target, maxRounds, roundMs, levels?, wrong: "lock" | "out" | null, lockMs, gen(k, level, rng) },
     answer(puzzle) (kind number), mount(el, puzzle, ctx) -> view { destroy(), start?(), reveal?(), resize?() },
     solo.useLevel: người chơi một mình cũng chọn mức trong online.levels (ví dụ kích thước bàn), kỷ lục lưu riêng theo mức.
     online.defaultLevel: mức chọn sẵn (mặc định "normal" nếu có trong levels, không thì mức đầu tiên).
     i18n: { vi: {...}, en: {...} } (bắt buộc có brand, r_intro, r_rules[], prompt...), rules: [[tiêu đề, [khoá...]], ...]
   ============================================================ */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const now = () => performance.now();
  let G = null;
  let LANG = (window.TB && TB.lang) || "vi";

  /* ---------- CHỮ CHUNG ---------- */
  const KI = {
    vi: {
      b_rules: "Luật chơi", b_new: "Chơi mới",
      m_title: "Chọn chế độ", m_solo: "Chơi một mình", m_online: "Online 2 người",
      m_solo_note: "Vượt {0} màn từ dễ tới khó. Đồng hồ chỉ chạy khi đang giải, trả lời sai bị cộng 5 giây.",
      m_online_note: "Hai người cùng giải một đề, ai đúng trước được 1 điểm. Ai đạt {0} điểm trước thì thắng.",
      m_net: "Phòng online", m_create: "Tạo phòng", m_join: "Vào phòng", m_code_ph: "Mã phòng",
      m_net_create: "Bạn tạo phòng rồi gửi mã (hoặc link) cho bạn bè. Chủ phòng chọn độ khó.",
      m_net_join: "Nhập mã 5 ký tự bạn bè gửi. Độ khó do chủ phòng chọn.",
      m_level: "Độ khó", lv_easy: "Dễ", lv_normal: "Vừa", lv_hard: "Khó",
      m_start: "Bắt đầu", m_back: "Đóng", cancel: "Huỷ",
      n_title_host: "Tạo phòng", n_title_join: "Vào phòng", n_title_err: "Có lỗi kết nối",
      n_connecting: "Đang kết nối máy chủ...", n_wait: "Gửi mã này (hoặc link) cho bạn bè. Đang chờ người vào phòng...",
      n_joining: "Đang vào phòng {0}...", n_copy: "Chép link", n_copied: "Đã chép", n_close: "Đóng",
      n_err_lib: "Không tải được thư viện kết nối. Kiểm tra mạng rồi thử lại.",
      n_err_nopeer: "Không tìm thấy phòng {0}. Kiểm tra lại mã, hoặc chủ phòng đã thoát.",
      n_err_timeout: "Không kết nối được tới phòng. Thử lại sau.", n_err_full: "Phòng đã đủ 2 người.",
      n_err_version: "Hai máy đang chạy hai phiên bản game khác nhau. Tải lại trang (Ctrl+F5) ở cả hai máy rồi thử lại.",
      n_err_desync: "Hai máy bị lệch dữ liệu nên ván đã dừng.", n_err_net: "Lỗi kết nối ({0}).", n_err_code: "Mã phòng gồm 5 ký tự.",
      c_stage: "Màn", c_time: "Thời gian", c_miss: "Sai", c_best: "Kỷ lục", c_best_v: "màn {0} · {1}", c_none: "chưa có",
      c_you: "Bạn", c_opp: "Đối thủ", c_round: "Đề", c_left: "Còn",
      cv_stage: "Màn {0}/{1}", cv_start: "Bắt đầu", cv_hint: "Đề hiện ra và đồng hồ chạy khi bạn bấm Bắt đầu.",
      cv_round: "Đề {0}", cv_wait: "Đang chờ đề đầu tiên...",
      k_ok: "Trả lời", k_del: "Xoá",
      f_wrong: "Chưa đúng, bị cộng 5 giây.", f_wait: "Chờ {0} giây rồi trả lời lại.",
      f_lock: "Sai rồi! Bị khoá {0} giây.", f_out: "Sai rồi! Bạn mất quyền trả lời đề này.",
      f_sent: "Đã gửi đáp án, đang chờ kết quả...", f_solved: "Xong! Đang chờ kết quả...",
      o_wrong: "Đối thủ vừa trả lời sai.", o_out: "Đối thủ đã mất quyền trả lời đề này.", o_lock: "Đối thủ trả lời sai, bị khoá {0} giây.",
      r_me: "Bạn nhanh hơn!", r_opp: "Đối thủ nhanh hơn", r_none: "Không ai ăn điểm", r_time: "Hết giờ cho đề này.", r_out: "Cả hai đều trả lời sai.",
      r_point_me: "Bạn được 1 điểm.", r_point_opp: "Đối thủ được 1 điểm.", r_ans: "Đáp án: <b>{0}</b>", r_next: "Đề tiếp theo sau {0} giây...",
      s_clear: "Xong màn {0}!", s_took: "Màn này mất <b>{0}</b>{1}. Tổng: <b>{2}</b>.", s_pen: " (gồm {0} phạt)", s_next: "Màn tiếp",
      s_done: "Phá đảo!", s_done_p: "Bạn đã qua cả {0} màn với tổng thời gian <b>{1}</b>.", s_newbest: "Kỷ lục mới!", s_again: "Chơi lại từ màn 1",
      g_win: "Bạn thắng!", g_lose: "Bạn thua", g_draw: "Hoà", g_left: "Đối thủ đã rời phòng nên bạn thắng.",
      g_abort: "Ván dừng giữa chừng.", g_rematch: "Chơi lại", g_wait_rm: "Đang chờ đối thủ bấm Chơi lại...", g_opp_rm: "Đối thủ muốn chơi lại!",
      g_view: "Xem đề", g_menu: "Chọn chế độ", s_vs: "Tỉ số",
    },
    en: {
      b_rules: "Rules", b_new: "New game",
      m_title: "Game mode", m_solo: "Solo", m_online: "Online 2 players",
      m_solo_note: "Clear {0} stages from easy to hard. The clock only runs while you solve, and each wrong answer adds 5 seconds.",
      m_online_note: "Both players solve the same puzzle and the first correct answer scores a point. First to {0} points wins.",
      m_net: "Online room", m_create: "Create room", m_join: "Join room", m_code_ph: "Room code",
      m_net_create: "Create a room, then send the code (or link) to a friend. The host picks the difficulty.",
      m_net_join: "Enter the 5-character code your friend sent. The host picks the difficulty.",
      m_level: "Difficulty", lv_easy: "Easy", lv_normal: "Medium", lv_hard: "Hard",
      m_start: "Start", m_back: "Close", cancel: "Cancel",
      n_title_host: "Create room", n_title_join: "Join room", n_title_err: "Connection problem",
      n_connecting: "Connecting to the server...", n_wait: "Send this code (or the link) to a friend. Waiting for them to join...",
      n_joining: "Joining room {0}...", n_copy: "Copy link", n_copied: "Copied", n_close: "Close",
      n_err_lib: "Couldn't load the connection library. Check your network and try again.",
      n_err_nopeer: "Room {0} wasn't found. Check the code, or the host may have left.",
      n_err_timeout: "Couldn't reach the room. Try again later.", n_err_full: "This room already has 2 players.",
      n_err_version: "The two devices run different versions of the game. Reload the page (Ctrl+F5) on both and try again.",
      n_err_desync: "The two devices got out of sync, so the match stopped.", n_err_net: "Connection error ({0}).", n_err_code: "Room codes have 5 characters.",
      c_stage: "Stage", c_time: "Time", c_miss: "Wrong", c_best: "Best", c_best_v: "stage {0} · {1}", c_none: "none yet",
      c_you: "You", c_opp: "Opponent", c_round: "Puzzle", c_left: "Left",
      cv_stage: "Stage {0}/{1}", cv_start: "Start", cv_hint: "The puzzle appears and the clock starts when you press Start.",
      cv_round: "Puzzle {0}", cv_wait: "Waiting for the first puzzle...",
      k_ok: "Answer", k_del: "Delete",
      f_wrong: "Not quite, +5 seconds.", f_wait: "Wait {0} seconds before answering again.",
      f_lock: "Wrong! Locked for {0} seconds.", f_out: "Wrong! You can't answer this puzzle any more.",
      f_sent: "Answer sent, waiting for the result...", f_solved: "Done! Waiting for the result...",
      o_wrong: "Your opponent just answered wrong.", o_out: "Your opponent can't answer this puzzle any more.", o_lock: "Your opponent answered wrong and is locked for {0} seconds.",
      r_me: "You were faster!", r_opp: "Your opponent was faster", r_none: "No point this time", r_time: "Time is up for this puzzle.", r_out: "Both players answered wrong.",
      r_point_me: "You score a point.", r_point_opp: "Your opponent scores a point.", r_ans: "Answer: <b>{0}</b>", r_next: "Next puzzle in {0} seconds...",
      s_clear: "Stage {0} cleared!", s_took: "This stage took <b>{0}</b>{1}. Total: <b>{2}</b>.", s_pen: " (incl. {0} penalty)", s_next: "Next stage",
      s_done: "All clear!", s_done_p: "You cleared all {0} stages in <b>{1}</b> total.", s_newbest: "New best!", s_again: "Play again from stage 1",
      g_win: "You win!", g_lose: "You lose", g_draw: "Draw", g_left: "Your opponent left, so you win.",
      g_abort: "The match stopped.", g_rematch: "Rematch", g_wait_rm: "Waiting for your opponent to press Rematch...", g_opp_rm: "Your opponent wants a rematch!",
      g_view: "View puzzle", g_menu: "Game mode", s_vs: "Score",
    },
  };
  function tr(key, ...a) {
    const pick = l => (G && G.i18n[l] && G.i18n[l][key] !== undefined) ? G.i18n[l][key] : KI[l][key];
    let s = pick(LANG); if (s === undefined) s = pick("vi");
    if (s === undefined) return key;
    if (typeof s === "function") return s(...a);
    if (Array.isArray(s)) return s;
    return String(s).replace(/\{(\d)\}/g, (m, i) => a[i]);
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function fmtTime(ms) {
    const t = Math.floor(Math.max(0, ms) / 100), ds = t % 10, s = Math.floor(t / 10) % 60, m = Math.floor(t / 600);
    return m + ":" + String(s).padStart(2, "0") + "." + ds;
  }
  const fmtSec = ms => Math.ceil(Math.max(0, ms) / 1000);

  /* ---------- SỐ NGẪU NHIÊN CÓ SEED (hai máy sinh đề giống hệt nhau) ---------- */
  function mulberry(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function mix(a, b) {
    let h = (a ^ Math.imul((b + 0x9e3779b9) | 0, 0x85ebca6b)) | 0;
    h = Math.imul(h ^ (h >>> 16), 0x7feb352d); h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
    return (h ^ (h >>> 16)) >>> 0;
  }
  const randSeed = () => (Math.random() * 4294967296) >>> 0;
  const RNG = {
    make: mulberry, mix, randSeed,
    int: (r, a, b) => a + Math.floor(r() * (b - a + 1)),
    pick: (r, arr) => arr[Math.floor(r() * arr.length)],
    shuffle(r, arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; },
  };

  /* ---------- ÂM THANH (Web Audio, không cần file) ---------- */
  let AC = null;
  const SND = {
    ok: [[660, .08], [990, .16]], bad: [[200, .2]], tick: [[560, .07]], go: [[880, .2]], step: [[740, .035]],
    win: [[523, .11], [659, .11], [784, .11], [1047, .26]], lose: [[392, .16], [330, .16], [262, .3]], pop: [[420, .05]],
  };
  function sfx(k) {
    const seq = SND[k]; if (!seq) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      let t = AC.currentTime + .01;
      for (const [f, d] of seq) {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = k === "bad" ? "square" : "triangle"; o.frequency.value = f;
        const v = k === "step" ? .07 : k === "bad" ? .06 : .16;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
        o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .03); t += d * .92;
      }
    } catch (e) {}
  }

  /* ---------- TRẠNG THÁI ---------- */
  const ST = {
    mode: null,          // "solo" | "online"
    phase: "idle",       // idle | ready | countdown | play | sent | result | done | wait
    puzzle: null, view: null, input: "",
    // một mình
    stage: 1, total: 0, miss: 0, startAt: 0, penHere: 0, missHere: 0, lockUntil: 0, lastTook: 0, newBest: false,
    // online
    seed: 0, level: "normal", k: 0, me: 0, opp: 0, out: false, oppNote: null, oppProg: 0, result: null, over: null, cdEnd: 0, nextAt: 0,
  };
  const BEST_KEY = () => "twistboard." + G.id + ".best" + (G.solo.useLevel ? "." + ST.level : "");   // chọn mức khi chơi một mình: kỷ lục riêng từng mức
  const defLevel = () => G.online.defaultLevel || (!G.online.levels || G.online.levels.includes("normal") ? "normal" : G.online.levels[0]);
  function loadBest() { try { const b = JSON.parse(localStorage.getItem(BEST_KEY()) || "null"); return b && b.stage > 0 && b.ms > 0 ? b : null; } catch (e) { return null; } }
  function saveBest(stage, ms) {
    const b = loadBest();
    if (b && (b.stage > stage || (b.stage === stage && b.ms <= ms))) return false;
    try { localStorage.setItem(BEST_KEY(), JSON.stringify({ stage, ms: Math.round(ms) })); } catch (e) {}
    return true;
  }
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  const clearTimers = () => { for (const id of timers) clearTimeout(id); timers.clear(); };

  /* ---------- DỰNG GIAO DIỆN ---------- */
  function buildDom() {
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "del", "0", "ok"];
    const app = document.createElement("div");
    app.innerHTML = `
<div class="pk" id="pk">
  <header class="pk-top"><h1 id="pkTitle"></h1>
    <div class="pk-acts"><button class="btn" id="pkRulesBtn"></button><button class="btn primary" id="pkNewBtn"></button></div></header>
  <div class="pk-bar" id="pkBar"></div>
  <main class="pk-main">
    <section class="pk-stage" id="pkStage"><div class="pk-play" id="pkPlay"></div><div class="pk-cover" id="pkCover" hidden></div></section>
    <aside class="pk-side">
      <div class="pk-box pk-prompt" id="pkPrompt"></div>
      <div class="pk-box" id="pkAns"${G.kind === "number" ? "" : " hidden"}>
        <div class="pk-disp" id="pkDisp"></div>
        <div class="pk-keys" id="pkKeys">${keys.map(k => `<button type="button" data-k="${k}"${k === "ok" ? ' class="ok"' : ""}>${k === "del" ? "⌫" : k === "ok" ? "" : k}</button>`).join("")}</div>
        <div class="pk-msg" id="pkMsg"></div>
      </div>
      <div class="pk-box pk-tools-box" id="pkToolsBox" hidden><div class="pk-tools" id="pkTools"></div><div class="pk-msg" id="pkMsg2"></div></div>
      <div class="pk-box pk-result" id="pkResult" hidden></div>
    </aside>
  </main>
</div>
<div class="pk-modal" id="pkRules" hidden><div class="card"><h2 id="pkRulesTitle"></h2><div id="pkRulesBody"></div>
  <div class="foot"><button class="btn primary" id="pkRulesOk">OK</button></div></div></div>
<div class="pk-modal" id="pkMode" hidden><div class="card">
  <h2 data-k="m_title"></h2>
  <div class="seg" id="pkSegVs"><button data-v="solo" data-k="m_solo"></button><button data-v="online" data-k="m_online"></button></div>
  <p class="note" id="pkVsNote"></p>
  <div id="pkNetOpts">
    <h3 data-k="m_net"></h3>
    <div class="netrow"><div class="seg" id="pkSegNet"><button data-v="create" data-k="m_create"></button><button data-v="join" data-k="m_join"></button></div>
      <input id="pkCode" maxlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false"></div>
    <p class="note" id="pkNetNote"></p>
  </div>
  <div id="pkLevelOpts"${G.online.levels ? "" : " hidden"}><h3 data-k="m_level"></h3>
    <div class="seg" id="pkSegLevel">${(G.online.levels || []).map(l => `<button data-v="${l}" data-k="lv_${l}"></button>`).join("")}</div>
    <p class="note" id="pkLevelNote"></p></div>
  <div class="foot"><button class="btn" id="pkModeCancel"></button><button class="btn primary" id="pkModeStart"></button></div>
</div></div>
<div class="pk-modal" id="pkNet" hidden><div class="card"><h2 id="pkNetTitle"></h2>
  <div id="pkNetCodeBox" hidden><div class="pk-netcode" id="pkNetCode"></div><div class="pk-netlink"><input id="pkNetLink" readonly><button class="btn" id="pkNetCopy"></button></div></div>
  <p id="pkNetMsg"></p><div class="foot"><button class="btn" id="pkNetCancel"></button></div></div></div>`;
    while (app.firstElementChild) document.body.appendChild(app.firstElementChild);
  }
  function applyStatic() {
    document.title = tr("brand") + " · Twistboard";
    $("#pkTitle").textContent = tr("brand");
    $("#pkRulesBtn").textContent = tr("b_rules"); $("#pkNewBtn").textContent = tr("b_new");
    document.querySelectorAll("[data-k]").forEach(el => { if (el.tagName !== "BUTTON" || !el.closest("#pkKeys")) el.textContent = tr(el.dataset.k); });
    $('#pkKeys [data-k="ok"]').textContent = tr("k_ok");
    $('#pkKeys [data-k="del"]').setAttribute("aria-label", tr("k_del"));
    $("#pkRulesTitle").textContent = tr("brand");
    $("#pkRulesBody").innerHTML = `<p>${tr("r_intro")}</p>` + G.rules.map(([h, list]) =>
      `<h3>${esc(tr(h))}</h3><ul>${[].concat(...list.map(k => { const v = tr(k); return Array.isArray(v) ? v : [v]; })).map(x => `<li>${x}</li>`).join("")}</ul>`).join("") +
      (tr("r_note") !== "r_note" ? `<p class="note">${tr("r_note")}</p>` : "");
    $("#pkNetCopy").textContent = tr("n_copy");
  }

  /* ---------- GẮN ĐỀ VÀO VÙNG CHƠI ---------- */
  const ctx = {
    get lang() { return LANG; }, tr, esc, sfx, fmtTime,
    canPlay: () => ST.phase === "play",
    solved() { if (ST.phase === "play") onCorrect(); },
    progress(n) { if (ST.mode === "online" && ST.phase === "play") netSend({ t: "prog", k: ST.k, n }); },
    prompt() { renderPrompt(); },
    tools(list) {
      const box = $("#pkTools"); box.innerHTML = "";
      for (const t of list) {
        const b = document.createElement("button"); b.className = "btn"; b.type = "button"; b.dataset.tool = t.id;
        b.addEventListener("click", () => t.on()); box.appendChild(b);
      }
      ctx._tools = list; paintTools();
    },
    note(text, cls) { const m = $("#pkMsg2"); m.textContent = text || ""; m.className = "pk-msg" + (cls ? " " + cls : ""); },
    _tools: [],
  };
  function paintTools() {
    for (const t of ctx._tools) {
      const b = document.querySelector(`#pkTools [data-tool="${t.id}"]`); if (!b) continue;
      b.textContent = typeof t.label === "function" ? t.label() : tr(t.label);
      b.disabled = t.always ? false : ST.phase !== "play";
    }
    $("#pkToolsBox").hidden = !ctx._tools.length;
  }
  function mountPuzzle() {
    if (ST.view && ST.view.destroy) ST.view.destroy();
    ctx._tools = []; $("#pkTools").innerHTML = ""; ctx.note("");
    $("#pkDisp").className = "pk-disp"; setMsg("");
    const el = $("#pkPlay"); el.innerHTML = "";
    ST.view = G.mount(el, ST.puzzle, ctx) || {};
    paintTools();
  }

  /* ---------- CHƠI MỘT MÌNH ---------- */
  function startSolo() {
    netClose(true); clearTimers();
    Object.assign(ST, { mode: "solo", stage: 1, total: 0, miss: 0, newBest: false, over: null });
    loadStage();
  }
  function loadStage() {
    ST.puzzle = G.solo.gen(ST.stage, RNG.make(randSeed()), ST.level);
    Object.assign(ST, { input: "", missHere: 0, penHere: 0, lockUntil: 0, result: null });
    mountPuzzle();
    ST.phase = "ready"; render();
  }
  function beginPlay() {
    ST.phase = "play"; ST.startAt = now();
    if (ST.view.start) ST.view.start();
    sfx("go"); render();
  }
  function soloWrong() {
    ST.miss++; ST.missHere++; ST.penHere += 5000;
    const lock = ST.missHere >= 3 ? Math.min((ST.missHere - 2) * 3000, 15000) : 800;   // đoán bừa nhiều lần thì phải chờ lâu dần
    ST.lockUntil = now() + lock;
    flash("bad"); sfx("bad");
    setMsg(tr("f_wrong") + (lock > 1000 ? " " + tr("f_wait", fmtSec(lock)) : ""), "bad");
    render();
  }
  function soloCorrect() {
    const took = now() - ST.startAt + ST.penHere;
    ST.total += took; ST.lastTook = took;
    ST.newBest = saveBest(ST.stage, ST.total);
    ST.phase = ST.stage >= G.solo.stages ? "done" : "result";
    flash("good"); sfx(ST.phase === "done" ? "win" : "ok");
    if (ST.view.reveal) ST.view.reveal();
    render();
  }

  /* ---------- TRẢ LỜI ---------- */
  function submit() {
    if (ST.phase !== "play" || G.kind !== "number" || !ST.input || now() < ST.lockUntil || ST.out) return;
    const v = parseInt(ST.input, 10);
    if (v === G.answer(ST.puzzle)) onCorrect(); else onWrong();
  }
  function onCorrect() { if (ST.mode === "solo") soloCorrect(); else netCorrect(); }
  function onWrong() { if (ST.mode === "solo") soloWrong(); else netWrong(); }
  function typeKey(k) {
    if (ST.phase !== "play" || G.kind !== "number") return;
    if (k === "ok") return submit();
    if (k === "del") ST.input = ST.input.slice(0, -1);
    else if (/^\d$/.test(k) && ST.input.length < 4) { ST.input = (ST.input === "0" ? "" : ST.input) + k; if (ST.mode === "solo") setMsg(""); }
    $("#pkDisp").className = "pk-disp";
    renderInput();
  }
  function flash(cls) {
    const d = $("#pkDisp"); if (!d) return;
    d.className = "pk-disp"; void d.offsetWidth; d.className = "pk-disp " + cls;
    if (cls === "bad") later(() => { if (d.classList.contains("bad")) { ST.input = ""; d.className = "pk-disp"; renderInput(); } }, 700);
  }
  function setMsg(text, cls) { const m = $(G.kind === "number" ? "#pkMsg" : "#pkMsg2"); m.textContent = text || ""; m.className = "pk-msg" + (cls ? " " + cls : ""); }

  /* ============================================================
     ONLINE (PeerJS, cùng kiểu các game cờ của Twistboard)
     Chủ phòng là trọng tài: gửi start (seed, level) rồi round (k) cho từng đề. Hai máy tự sinh đề k từ seed nên giống hệt nhau.
     Ai giải xong gửi ans {k, ok, ms} với ms = thời gian giải tính từ lúc đề hiện trên máy mình (để không thiệt vì mạng chậm).
     Chủ phòng nhận đáp án đúng đầu tiên thì chờ thêm GRACE ms phòng đáp án nhanh hơn đang trên đường tới, rồi chốt res {k, win}.
     Tin nhắn: hello, start, round, ans, prog, res, rematch, bye, err.
     ============================================================ */
  const PEER_SRC = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
  const PEER_SRI = "sha384-nlUQ8ZqCbvStErob+biJNzSgltf6urV3VGqhfIfzhmg9RXmpeRm76ELw0pYnKlTR";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", CODE_LEN = 5;
  const GRACE = 900, NEXT_DELAY = 4000, COUNTDOWN = 3;
  const NET = { peer: null, conn: null, role: null, code: "", playing: false, rm: { me: false, them: false }, gen: 0, H: null };
  const normCode = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LEN);
  const newCode = () => Array.from({ length: CODE_LEN }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
  const netOpen = () => !!(NET.conn && NET.conn.open);
  const netSend = d => { if (netOpen()) try { NET.conn.send(d); } catch (e) {} };
  const inviteLink = code => location.href.split("#")[0] + "#room=" + code;
  const myRole = () => NET.role === "host" ? "host" : "guest";

  let peerLoading = null;
  function loadPeer() {
    if (window.Peer) return Promise.resolve();
    return peerLoading || (peerLoading = new Promise((ok, fail) => {
      const s = document.createElement("script");
      s.src = PEER_SRC; s.integrity = PEER_SRI; s.crossOrigin = "anonymous";
      s.onload = () => (window.Peer ? ok() : fail());
      s.onerror = () => { peerLoading = null; s.remove(); fail(); };
      document.head.appendChild(s);
    }));
  }
  function showNet(title, msg, opt = {}) {
    $("#pkNetTitle").textContent = title; $("#pkNetMsg").textContent = msg;
    $("#pkNetCodeBox").hidden = !opt.code;
    if (opt.code) { $("#pkNetCode").textContent = opt.code; $("#pkNetLink").value = inviteLink(opt.code); }
    $("#pkNetCancel").textContent = tr(opt.done ? "n_close" : "cancel");
    $("#pkNet").hidden = false;
  }
  function startOnline(net, code, level) {
    netClose(true); clearTimers();
    $("#pkMode").hidden = true; $("#pkRules").hidden = true;
    Object.assign(ST, { mode: "online", phase: "idle", level: level || ST.level, me: 0, opp: 0, k: 0, over: null, result: null });
    if (net === "join") netJoin(code); else netHost();
    render();
  }
  async function netHost(tries = 0) {
    const gen = ++NET.gen;
    NET.role = "host";
    showNet(tr("n_title_host"), tr("n_connecting"));
    try { await loadPeer(); } catch (e) { if (gen === NET.gen) netFail("n_err_lib"); return; }
    if (gen !== NET.gen) return;
    const code = newCode(), peer = new Peer(G.peerPrefix + code);
    NET.peer = peer; NET.code = code;
    peer.on("open", () => { if (gen === NET.gen) showNet(tr("n_title_host"), tr("n_wait"), { code }); });
    peer.on("connection", conn => {
      if (gen !== NET.gen || NET.conn) { conn.on("open", () => { conn.send({ t: "err", code: "full" }); setTimeout(() => conn.close(), 500); }); return; }
      NET.conn = conn; bindConn(conn, gen);
    });
    peer.on("disconnected", () => {
      if (gen === NET.gen && !NET.playing && !peer.destroyed) setTimeout(() => { if (gen === NET.gen && !peer.destroyed) peer.reconnect(); }, 1500);
    });
    peer.on("error", e => {
      if (gen !== NET.gen) return;
      if (e.type === "unavailable-id" && tries < 3) { peer.destroy(); NET.peer = null; netHost(tries + 1); return; }
      netError(e);
    });
  }
  async function netJoin(code) {
    const gen = ++NET.gen;
    NET.role = "guest"; NET.code = code;
    showNet(tr("n_title_join"), tr("n_joining", code));
    try { await loadPeer(); } catch (e) { if (gen === NET.gen) netFail("n_err_lib"); return; }
    if (gen !== NET.gen) return;
    const peer = new Peer(); NET.peer = peer;
    peer.on("open", () => {
      if (gen !== NET.gen) return;
      const conn = peer.connect(G.peerPrefix + code, { reliable: true });
      NET.conn = conn; bindConn(conn, gen);
      setTimeout(() => { if (gen === NET.gen && !NET.playing) netFail("n_err_timeout"); }, 25000);
    });
    peer.on("error", e => { if (gen === NET.gen) netError(e); });
  }
  function bindConn(conn, gen) {
    conn.on("open", () => { if (gen === NET.gen && NET.role === "guest") conn.send({ t: "hello", v: G.proto }); });
    conn.on("data", d => { if (gen === NET.gen) onNetData(d); });
    conn.on("close", () => { if (gen === NET.gen && NET.conn === conn) onNetLost(); });
    conn.on("error", () => { if (gen === NET.gen && NET.conn === conn) onNetLost(); });
  }
  function beginMatch(seed, level) {
    clearTimers();
    NET.playing = true; NET.rm = { me: false, them: false }; NET.H = null;
    for (const id of ["#pkNet", "#pkMode", "#pkRules"]) $(id).hidden = true;
    Object.assign(ST, { mode: "online", seed, level, k: 0, me: 0, opp: 0, over: null, result: null, phase: "wait", puzzle: null });
    if (ST.view && ST.view.destroy) ST.view.destroy();
    ST.view = {}; ctx._tools = []; $("#pkPlay").innerHTML = ""; paintTools();
    render();
  }
  function hostStartMatch() {
    const seed = randSeed(), level = ST.level;
    netSend({ t: "start", v: G.proto, seed, level });
    beginMatch(seed, level);
    later(hostNextRound, 900);
  }
  function hostNextRound() {
    if (!NET.playing || ST.over) return;
    const k = ST.k + 1;
    netSend({ t: "round", k });
    startRound(k);
  }
  function startRound(k) {
    clearTimers();
    Object.assign(ST, { k, out: false, oppNote: null, oppProg: 0, result: null, lockUntil: 0, input: "" });
    ST.puzzle = G.online.gen(k, ST.level, RNG.make(mix(ST.seed, k)));
    mountPuzzle(); setMsg("");
    ST.phase = "countdown"; ST.cdEnd = now() + COUNTDOWN * 1000;
    for (let i = 0; i < COUNTDOWN; i++) later(() => { sfx("tick"); render(); }, i * 1000);
    later(() => {
      ST.phase = "play"; ST.startAt = now();
      if (ST.view.start) ST.view.start();
      sfx("go"); render();
    }, COUNTDOWN * 1000);
    if (NET.role === "host") {
      NET.H = { k, claims: {}, wrong: {}, done: false, grace: null };
      if (G.online.roundMs) later(() => hostResolve("time"), COUNTDOWN * 1000 + G.online.roundMs + 300);
    }
    render();
  }
  function netCorrect() {
    const ms = now() - ST.startAt;
    ST.phase = "sent"; flash("good"); sfx("pop");
    setMsg(tr(G.kind === "number" ? "f_sent" : "f_solved"), "good");
    if (NET.role === "host") hostClaim("host", ms); else netSend({ t: "ans", k: ST.k, ok: true, ms: Math.round(ms) });
    render();
  }
  function netWrong() {
    flash("bad"); sfx("bad");
    const pol = G.online.wrong;
    if (pol === "out") { ST.out = true; setMsg(tr("f_out"), "bad"); }
    else { const lock = G.online.lockMs || 5000; ST.lockUntil = now() + lock; setMsg(tr("f_lock", fmtSec(lock)), "bad"); later(() => { if (ST.phase === "play") { setMsg(""); render(); } }, lock + 50); }
    if (NET.role === "host") { netSend({ t: "ans", k: ST.k, ok: false }); hostWrong("host"); }
    else netSend({ t: "ans", k: ST.k, ok: false });
    render();
  }
  function hostClaim(who, ms) {
    const H = NET.H; if (!H || H.done) return;
    if (H.claims[who] !== undefined) return;
    H.claims[who] = ms;
    if (H.claims.host !== undefined && H.claims.guest !== undefined) return hostResolve("solve");
    if (!H.grace) H.grace = later(() => hostResolve("solve"), GRACE);
  }
  function hostWrong(who) {
    const H = NET.H; if (!H || H.done) return;
    H.wrong[who] = true;
    if (G.online.wrong === "out" && H.wrong.host && H.wrong.guest && H.claims.host === undefined && H.claims.guest === undefined) hostResolve("out");
  }
  function hostResolve(why) {
    const H = NET.H; if (!H || H.done) return;
    const c = H.claims, hasH = c.host !== undefined, hasG = c.guest !== undefined;
    if (why === "time" && (hasH || hasG)) why = "solve";
    H.done = true;
    let win = null;
    if (hasH || hasG) win = !hasG ? "host" : !hasH ? "guest" : (c.guest < c.host ? "guest" : "host");
    netSend({ t: "res", k: H.k, win, why });
    applyResult(H.k, win, why);
  }
  function applyResult(k, win, why) {
    clearTimers();
    const res = win === null ? "none" : win === myRole() ? "me" : "opp";
    if (res === "me") ST.me++; else if (res === "opp") ST.opp++;
    ST.result = { res, why }; ST.phase = "result";
    if (ST.view.reveal) ST.view.reveal();
    const O = G.online;
    if (ST.me >= O.target || ST.opp >= O.target || k >= O.maxRounds) {
      ST.over = { res: ST.me > ST.opp ? "win" : ST.me < ST.opp ? "lose" : "draw" };
      ST.phase = "done";
      later(() => sfx(ST.over.res === "win" ? "win" : ST.over.res === "lose" ? "lose" : "pop"), 350);
    } else {
      ST.nextAt = now() + NEXT_DELAY;
      for (let i = 1; i < NEXT_DELAY / 1000; i++) later(render, i * 1000 + 30);
      if (NET.role === "host") later(hostNextRound, NEXT_DELAY);
    }
    sfx(res === "me" ? "ok" : res === "opp" ? "bad" : "pop");
    render();
  }
  function onNetData(d) {
    if (!d || typeof d !== "object") return;
    switch (d.t) {
      case "hello":
        if (NET.role !== "host" || NET.playing) return;
        if (d.v !== G.proto) { netSend({ t: "err", code: "version" }); const c = NET.conn; NET.conn = null; setTimeout(() => c && c.close(), 500); return; }
        return hostStartMatch();
      case "start":
        if (NET.role !== "guest") return;
        if (d.v !== G.proto) return netFail("n_err_version");
        if (!Number.isInteger(d.seed)) return netDesync();
        return beginMatch(d.seed >>> 0, (G.online.levels || []).includes(d.level) ? d.level : defLevel());
      case "round":
        if (NET.role !== "guest" || !NET.playing || ST.over) return;
        if (d.k !== ST.k + 1) return netDesync();
        return startRound(d.k);
      case "ans":
        if (d.k !== ST.k) return;
        if (d.ok) {
          if (NET.role === "host" && Number.isFinite(d.ms) && d.ms >= 0) hostClaim("guest", d.ms);
        } else {
          ST.oppNote = G.online.wrong === "out" ? tr("o_out") : G.online.wrong === "lock" ? tr("o_lock", fmtSec(G.online.lockMs)) : tr("o_wrong");
          if (NET.role === "host") hostWrong("guest");
          render();
        }
        return;
      case "prog":
        if (d.k === ST.k && Number.isInteger(d.n)) { ST.oppProg = d.n; renderBar(); }
        return;
      case "res":
        if (NET.role !== "guest" || d.k !== ST.k || ST.phase === "result" || ST.phase === "done") return;
        return applyResult(d.k, d.win === "host" || d.win === "guest" ? d.win : null, d.why);
      case "rematch":
        if (!ST.over || NET.rm.them) return;
        NET.rm.them = true;
        if (NET.role === "host" && NET.rm.me) return hostStartMatch();
        render();
        return;
      case "bye": return onNetLost();
      case "err": return netFail(d.code === "full" ? "n_err_full" : d.code === "version" ? "n_err_version" : "n_err_desync");
    }
  }
  function requestRematch() {
    if (NET.rm.me || !netOpen()) return;
    NET.rm.me = true; netSend({ t: "rematch" });
    if (NET.role === "host" && NET.rm.them) return hostStartMatch();
    render();
  }
  function netDesync() { netSend({ t: "err", code: "desync" }); netFail("n_err_desync"); }
  function netError(e) {
    const type = (e && e.type) || "";
    if (netOpen()) { console.warn("PeerJS:", type, e); return; }
    if (type === "peer-unavailable") return netFail("n_err_nopeer", NET.code);
    netFail("n_err_net", type || String(e));
  }
  function netFail(key, arg) {
    const mid = NET.playing && !ST.over;
    netClose(false);
    if (mid) { clearTimers(); ST.over = { res: "abort" }; ST.phase = "done"; render(); }
    showNet(tr("n_title_err"), tr(key, arg), { done: true });
  }
  function onNetLost() {
    if (NET.role === "host" && !NET.playing) { NET.conn = null; return; }
    const mid = NET.playing && !ST.over;
    netClose(false);
    if (mid) { clearTimers(); ST.over = { res: "win", left: true }; ST.phase = "done"; sfx("win"); }
    render();
  }
  function netClose(bye) {
    NET.gen++;
    if (bye) try { netSend({ t: "bye" }); } catch (e) {}
    const peer = NET.peer, conn = NET.conn;
    NET.peer = NET.conn = null; NET.playing = false; NET.rm = { me: false, them: false }; NET.H = null;
    if (peer || conn) setTimeout(() => { try { if (conn) conn.close(); } catch (e) {} try { if (peer) peer.destroy(); } catch (e) {} }, bye ? 400 : 0);
  }

  /* ---------- VẼ ---------- */
  function curTime() {
    if (ST.mode === "solo") return ST.total + (ST.phase === "play" ? now() - ST.startAt + ST.penHere : 0);
    if (ST.mode === "online" && ST.phase === "play") return now() - ST.startAt;
    return 0;
  }
  function renderBar() {
    const bar = $("#pkBar");
    if (ST.mode === "solo") {
      const b = loadBest();
      const head = G.solo.stages > 1 ? `<span class="pk-chip">${tr("c_stage")} <b>${ST.stage}</b><small>/ ${G.solo.stages}</small></span>`
        : G.solo.useLevel ? `<span class="pk-chip">${tr("m_level")} <b>${tr("lv_" + ST.level)}</b></span>` : "";
      bar.innerHTML = `${head}
        <span class="pk-chip">${tr("c_time")} <b id="pkClock">${fmtTime(curTime())}</b></span>
        ${G.kind === "number" ? `<span class="pk-chip${ST.miss ? " warn" : ""}">${tr("c_miss")} <b>${ST.miss}</b></span>` : ""}
        <span class="pk-chip">${tr("c_best")} <b style="font-size:14px">${b ? (G.solo.stages > 1 ? tr("c_best_v", b.stage, fmtTime(b.ms)) : fmtTime(b.ms)) : tr("c_none")}</b></span>`;
    } else if (ST.mode === "online") {
      const O = G.online, left = O.roundMs && ST.phase === "play" ? O.roundMs - (now() - ST.startAt) : null;
      const prog = G.progressText && ST.k && (ST.phase === "play" || ST.phase === "sent") ? G.progressText(ST.puzzle, ST.oppProg) : "";
      bar.innerHTML = `<span class="pk-chip me">${tr("c_you")} <b>${ST.me}</b></span><span class="pk-chip opp">${tr("c_opp")} <b>${ST.opp}</b></span>
        <span class="pk-chip">${tr("c_round")} <b>${ST.k || "-"}</b><small>· ${O.target} ${LANG === "vi" ? "điểm thắng" : "to win"}</small></span>
        ${left !== null ? `<span class="pk-chip${left < 20000 ? " warn" : ""}">${tr("c_left")} <b id="pkClock">${fmtTime(left)}</b></span>` : `<span class="pk-chip">${tr("c_time")} <b id="pkClock">${fmtTime(curTime())}</b></span>`}
        ${prog ? `<span class="pk-oppst">${esc(prog)}</span>` : ""}${ST.oppNote && ST.phase !== "result" && ST.phase !== "done" ? `<span class="pk-oppst bad">${esc(ST.oppNote)}</span>` : ""}`;
    } else bar.innerHTML = "";
  }
  function renderCover() {
    const cv = $("#pkCover");
    let html = "", dim = false;
    if (ST.mode === "solo" && ST.phase === "ready") {
      html = `<div><div class="kicker">${esc(tr("brand"))}</div><h2>${G.solo.stages > 1 ? tr("cv_stage", ST.stage, G.solo.stages) : G.solo.useLevel ? tr("lv_" + ST.level) : ""}</h2>
        <p>${G.stageNote ? G.stageNote(ST.puzzle, ST.stage) + "<br>" : ""}${tr("cv_hint")}</p><div class="row"><button class="btn primary" id="pkGo">${tr("cv_start")}</button></div></div>`;
    } else if (ST.mode === "online" && ST.phase === "countdown") {
      const n = Math.max(1, Math.ceil((ST.cdEnd - now()) / 1000));
      html = `<div><div class="kicker">${tr("cv_round", ST.k)}</div><div class="big" data-n="${n}">${n}</div></div>`;
    } else if (ST.mode === "online" && ST.phase === "wait") {
      html = `<div><h2>${esc(tr("brand"))}</h2><p>${tr("cv_wait")}</p></div>`;
    } else if (ST.mode === "online" && ST.phase === "done" && ST.over && !ST.overSeen) {
      dim = true;
      const o = ST.over, title = o.res === "win" ? tr("g_win") : o.res === "lose" ? tr("g_lose") : o.res === "draw" ? tr("g_draw") : tr("g_abort");
      const canRm = netOpen() && o.res !== "abort" && !o.left;
      html = `<div><h2>${title}</h2><div class="score"><span class="me">${ST.me}</span> – <span class="opp">${ST.opp}</span></div>
        ${o.left ? `<p>${tr("g_left")}</p>` : NET.rm.me ? `<p>${tr("g_wait_rm")}</p>` : NET.rm.them ? `<p>${tr("g_opp_rm")}</p>` : "<p></p>"}
        <div class="row">${canRm ? `<button class="btn primary" id="pkRematch"${NET.rm.me ? " disabled" : ""}>${tr("g_rematch")}</button>` : `<button class="btn primary" id="pkMenu">${tr("g_menu")}</button>`}
        ${ST.puzzle ? `<button class="btn" id="pkView">${tr("g_view")}</button>` : ""}</div></div>`;
    }
    cv.hidden = !html; cv.classList.toggle("dim", dim);
    if (html && cv.dataset.html !== html) {
      cv.innerHTML = html; cv.dataset.html = html;
      const go = $("#pkGo"); if (go) { go.addEventListener("click", beginPlay); setTimeout(() => go.focus(), 30); }
      const rm = $("#pkRematch"); if (rm) rm.addEventListener("click", requestRematch);
      const mn = $("#pkMenu"); if (mn) mn.addEventListener("click", openMode);
      const vw = $("#pkView"); if (vw) vw.addEventListener("click", () => { ST.overSeen = true; render(); });
    }
    if (!html) cv.dataset.html = "";
  }
  function renderPrompt() {
    $("#pkPrompt").innerHTML = ST.puzzle && ST.phase !== "ready" && ST.phase !== "countdown" ? G.prompt(ST.puzzle, ctx)
      : `<span class="q">${esc(tr("brand"))}</span>${esc(tr("tagline"))}`;
  }
  function renderInput() { const d = $("#pkDisp"); if (d) d.textContent = ST.input; }
  function renderResult() {
    const box = $("#pkResult");
    let html = "";
    if (ST.mode === "solo" && (ST.phase === "result" || ST.phase === "done")) {
      const pen = ST.penHere ? tr("s_pen", fmtTime(ST.penHere)) : "";
      if (ST.phase === "done") html = `<h3 class="me">${tr("s_done")}</h3>${ST.newBest ? `<span class="newbest">${tr("s_newbest")}</span>` : ""}
        <p>${tr("s_done_p", G.solo.stages, fmtTime(ST.total))}</p><button class="btn primary" id="pkAgain">${tr("s_again")}</button>`;
      else html = `<h3 class="me">${tr("s_clear", ST.stage)}</h3>${ST.newBest ? `<span class="newbest">${tr("s_newbest")}</span>` : ""}
        <p>${tr("s_took", fmtTime(ST.lastTook), pen, fmtTime(ST.total))}</p><button class="btn primary" id="pkNext">${tr("s_next")}</button>`;
    } else if (ST.mode === "online" && ST.result && (ST.phase === "result" || ST.phase === "done")) {
      const r = ST.result;
      const head = r.res === "me" ? tr("r_me") : r.res === "opp" ? tr("r_opp") : tr("r_none");
      const sub = r.res === "me" ? tr("r_point_me") : r.res === "opp" ? tr("r_point_opp") : r.why === "time" ? tr("r_time") : r.why === "out" ? tr("r_out") : "";
      const ans = G.kind === "number" ? `<br>${tr("r_ans", G.answer(ST.puzzle))}` : "";
      const nxt = ST.phase === "result" ? `<br>${tr("r_next", fmtSec(ST.nextAt - now()))}` : "";
      html = `<h3 class="${r.res}">${head}</h3><p>${sub}${ans}${nxt}</p>`;
      if (ST.phase === "done" && ST.overSeen) html += `<button class="btn primary" id="pkReopen">${ST.over.res === "win" ? tr("g_win") : ST.over.res === "lose" ? tr("g_lose") : tr("g_draw")} · ${ST.me}–${ST.opp}</button>`;
    }
    box.hidden = !html;
    if (box.dataset.html !== html) {
      box.innerHTML = html; box.dataset.html = html;
      const nx = $("#pkNext"); if (nx) { nx.addEventListener("click", () => { ST.stage++; loadStage(); }); setTimeout(() => nx.focus(), 30); }
      const ag = $("#pkAgain"); if (ag) ag.addEventListener("click", startSolo);
      const ro = $("#pkReopen"); if (ro) ro.addEventListener("click", () => { ST.overSeen = false; render(); });
    }
  }
  function render() {
    if (ST.phase !== "done") ST.overSeen = false;
    renderBar(); renderCover(); renderPrompt(); renderResult(); paintTools();
    const showAns = G.kind === "number" && ST.mode && ST.phase !== "result" && ST.phase !== "done";
    $("#pkAns").hidden = !showAns;
    const locked = ST.phase !== "play" || ST.out || now() < ST.lockUntil;
    document.querySelectorAll("#pkKeys button").forEach(b => { b.disabled = locked; });
    renderInput();
    if (ST.phase !== "play" && ST.phase !== "sent") { if (ST.phase !== "result" && ST.phase !== "done") setMsg(""); }
  }
  // đồng hồ: chỉ cập nhật số, không vẽ lại cả trang
  setInterval(() => {
    if (!G) return;
    const c = $("#pkClock");
    if (c && ST.phase === "play") {
      const O = G.online;
      if (ST.mode === "online" && O.roundMs) c.textContent = fmtTime(O.roundMs - (now() - ST.startAt)); else c.textContent = fmtTime(curTime());
    }
    if (ST.phase === "play" && ST.lockUntil && now() >= ST.lockUntil) {
      ST.lockUntil = 0;
      document.querySelectorAll("#pkKeys button").forEach(b => { b.disabled = ST.out; });
    }
  }, 100);

  /* ---------- BẢNG CHỌN CHẾ ĐỘ ---------- */
  const PREF_KEY = () => "twistboard." + G.id + ".prefs";
  let draft = null;
  function loadPrefs() {
    let p = {}; try { p = JSON.parse(localStorage.getItem(PREF_KEY()) || "{}") || {}; } catch (e) {}
    return { vs: p.vs === "online" ? "online" : "solo", level: (G.online.levels || []).includes(p.level) ? p.level : defLevel(), net: "create", code: "" };
  }
  function savePrefs() { try { localStorage.setItem(PREF_KEY(), JSON.stringify({ vs: draft.vs, level: draft.level })); } catch (e) {} }
  function syncMode() {
    for (const [id, key] of [["#pkSegVs", "vs"], ["#pkSegNet", "net"], ["#pkSegLevel", "level"]])
      document.querySelectorAll(id + " button").forEach(b => b.classList.toggle("on", b.dataset.v === draft[key]));
    const online = draft.vs === "online", join = online && draft.net === "join";
    $("#pkVsNote").textContent = online ? tr("m_online_note", G.online.target) : tr("m_solo_note", G.solo.stages);
    $("#pkNetOpts").classList.toggle("off", !online);
    $("#pkSegNet").querySelectorAll("button").forEach(b => { b.disabled = !online; });
    $("#pkCode").disabled = !join; $("#pkCode").placeholder = tr("m_code_ph");
    $("#pkNetNote").textContent = tr(join ? "m_net_join" : "m_net_create");
    const lvOff = online ? join : !G.solo.useLevel;
    $("#pkLevelOpts").classList.toggle("off", lvOff);
    $("#pkSegLevel").querySelectorAll("button").forEach(b => { b.disabled = lvOff; });
    $("#pkLevelNote").textContent = G.online.levels ? tr("lvn_" + draft.level) : "";
    $("#pkModeStart").textContent = online ? tr(join ? "m_join" : "m_create") : tr("m_start");
    $("#pkModeCancel").textContent = ST.mode ? tr("cancel") : tr("m_back");
  }
  function openMode() {
    draft = loadPrefs();
    if (!$("#pkCode").value) $("#pkCode").value = "";
    syncMode(); $("#pkMode").hidden = false;
  }

  /* ---------- NGÔN NGỮ ---------- */
  function setLang(l) {
    if (l !== "vi" && l !== "en") return;
    LANG = l;
    applyStatic(); if (draft && !$("#pkMode").hidden) syncMode();
    if (ST.view && ST.view.lang) ST.view.lang(l);
    $("#pkCover").dataset.html = ""; $("#pkResult").dataset.html = "";
    render();
  }

  /* ---------- SỰ KIỆN ---------- */
  function bindEvents() {
    $("#pkKeys").addEventListener("click", e => { const b = e.target.closest("button"); if (b && !b.disabled) typeKey(b.dataset.k); });
    document.addEventListener("keydown", e => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === "Escape") {
        if (!$("#pkNet").hidden) $("#pkNetCancel").click();
        else if (!$("#pkRules").hidden) $("#pkRulesOk").click();
        else if (!$("#pkMode").hidden && ST.mode) $("#pkMode").hidden = true;
        return;
      }
      if (!$("#pkMode").hidden || !$("#pkRules").hidden || !$("#pkNet").hidden) return;
      if (ST.phase === "ready" && e.key === "Enter") { e.preventDefault(); return beginPlay(); }
      if (G.kind === "number" && ST.phase === "play") {
        if (/^\d$/.test(e.key)) { e.preventDefault(); typeKey(e.key); }
        else if (e.key === "Backspace") { e.preventDefault(); typeKey("del"); }
        else if (e.key === "Enter") { e.preventDefault(); typeKey("ok"); }
      }
      if (ST.view && ST.view.key) ST.view.key(e);
    });
    $("#pkRulesBtn").addEventListener("click", () => { $("#pkRules").hidden = false; });
    $("#pkRulesOk").addEventListener("click", () => {
      $("#pkRules").hidden = true;
      try { localStorage.setItem("twistboard." + G.id + ".seenRules", "1"); } catch (e) {}
      if (!ST.mode) openMode();
    });
    $("#pkNewBtn").addEventListener("click", openMode);
    for (const [id, key] of [["#pkSegVs", "vs"], ["#pkSegNet", "net"], ["#pkSegLevel", "level"]])
      document.querySelectorAll(id + " button").forEach(b => b.addEventListener("click", () => {
        draft[key] = b.dataset.v; syncMode();
        if (draft.vs === "online" && draft.net === "join" && key !== "level") $("#pkCode").focus();
      }));
    $("#pkCode").addEventListener("input", e => { const v = normCode(e.target.value); if (e.target.value !== v) e.target.value = v; });
    $("#pkCode").addEventListener("keydown", e => { if (e.key === "Enter") $("#pkModeStart").click(); });
    $("#pkModeCancel").addEventListener("click", () => { $("#pkMode").hidden = true; if (!ST.mode) $("#pkRules").hidden = false; });
    $("#pkModeStart").addEventListener("click", () => {
      savePrefs();
      if (draft.vs === "online") {
        if (draft.net === "join") {
          draft.code = normCode($("#pkCode").value);
          if (draft.code.length !== CODE_LEN) { $("#pkNetNote").textContent = tr("n_err_code"); $("#pkCode").focus(); return; }
        }
        return startOnline(draft.net, draft.code, draft.level);
      }
      $("#pkMode").hidden = true;
      if (G.solo.useLevel) ST.level = draft.level;
      startSolo();
    });
    $("#pkNetCancel").addEventListener("click", () => {
      const wasPlaying = NET.playing;
      if (!wasPlaying) netClose(true);
      $("#pkNet").hidden = true;
      if (!NET.playing && !(ST.mode === "online" && ST.over)) { ST.mode = null; ST.phase = "idle"; render(); openMode(); }
    });
    $("#pkNetCopy").addEventListener("click", () => {
      const inp = $("#pkNetLink"), btn = $("#pkNetCopy");
      const done = () => { btn.textContent = tr("n_copied"); setTimeout(() => { btn.textContent = tr("n_copy"); }, 1500); };
      const legacy = () => { inp.select(); try { document.execCommand("copy"); done(); } catch (e) {} };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inp.value).then(done, legacy); else legacy();
    });
    window.addEventListener("pagehide", () => { if (netOpen()) try { NET.conn.send({ t: "bye" }); } catch (e) {} });
    document.querySelectorAll(".pk-modal").forEach(m => m.addEventListener("mousedown", e => {
      if (e.target !== m || m.id === "pkNet" || (m.id === "pkMode" && !ST.mode)) return;
      if (m.id === "pkRules") return $("#pkRulesOk").click();
      m.hidden = true;
    }));
    window.addEventListener("resize", () => { if (ST.view && ST.view.resize) ST.view.resize(); });
    if (window.TB) TB.onLang(l => { if (l !== LANG) setLang(l); });
  }

  /* ---------- KHỞI ĐỘNG ---------- */
  function start(game) {
    G = game;
    buildDom(); applyStatic(); bindEvents(); render();
    const room = normCode((location.hash.match(/room=([A-Za-z0-9]+)/) || [])[1]);
    if (room.length === CODE_LEN) {   // mở từ link mời: vào phòng luôn
      try { history.replaceState(null, "", location.href.split("#")[0]); } catch (e) {}
      draft = loadPrefs();
      startOnline("join", room);
    } else {
      let seen = false; try { seen = !!localStorage.getItem("twistboard." + G.id + ".seenRules"); } catch (e) {}
      if (seen) openMode(); else $("#pkRules").hidden = false;
    }
    window.game = { get state() { return ST; }, get net() { return NET; }, G, RNG, tr, submitAnswer(v) { ST.input = String(v); submit(); } };
  }

  window.PK = { start, RNG, tr: (...a) => tr(...a), esc, fmtTime, sfx };
})();
