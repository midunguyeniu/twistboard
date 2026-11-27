/* Wall Go I và II: toàn bộ giao diện + luật + AI + online dùng chung.
   Trang nạp file này đặt trước window.WALLGO_VARIANT = 1 | 2 và có <div id="wg-root"></div> ngay sau header. */
"use strict";
const VARIANT = window.WALLGO_VARIANT === 2 ? 2 : 1;
document.getElementById("wg-root").outerHTML = `
<div id="app">
  <header class="top">
    <div class="brand"><h1 data-i18n="brand">Wall Go</h1><span data-i18n="tagline"></span></div>
    <div class="actions">
      <button class="btn" id="btnRules" data-i18n="b_rules"></button>
      <button class="btn primary" id="btnNew" data-i18n="b_new"></button>
    </div>
  </header>
  <div id="status"><span id="stDot"></span><span id="statusText"></span><span id="ctl"></span><span id="timer"></span></div>
  <main id="stage">
    <div id="boardWrap">
      <div id="board"><div id="grid"></div></div>
      <div id="gameover" hidden>
        <div class="go-card">
          <h2 id="goTitle"></h2>
          <p id="goSub"></p>
          <ol class="rank" id="goList"></ol>
          <p class="note" id="goNote" style="margin:10px 0 0"></p>
          <div class="row">
            <button class="btn" id="goView" data-i18n="o_view"></button>
            <button class="btn" id="goLeave" data-i18n="n_leave" hidden></button>
            <button class="btn primary" id="goAgain"></button>
          </div>
        </div>
      </div>
    </div>
    <aside class="side">
      <section class="card2"><h3 class="h3"><span data-i18n="h_players" style="color:inherit;letter-spacing:.1em;text-transform:uppercase;font-weight:800"></span><span id="fmtTag"></span></h3><ul class="plist" id="plist"></ul><p id="info"></p></section>
      <section class="card2"><h3 class="h3" data-i18n="h_log"></h3><ol id="log"></ol></section>
    </aside>
  </main>
</div>

<div class="modal" id="mRules" hidden>
  <div class="card">
    <h2 data-i18n="brand">Wall Go</h2>
    <p data-i18n="r_intro"></p>
    <div class="figs" id="ruleFigs"></div>
    <h3 data-i18n="r_h_setup"></h3>
    <ul><li data-i18n="r_s2"></li><li data-i18n="r_s34"></li><li data-i18n="r_order"></li></ul>
    <h3 data-i18n="r_h_turn"></h3>
    <ul><li data-i18n="r_move"></li><li data-i18n="r_wall"></li><li data-i18n="r_lock"></li></ul>
    <h3 data-i18n="r_h_break"></h3>
    <ul><li data-i18n="r_break"></li><li data-i18n="r_break2"></li></ul>
    <h3 data-i18n="r_h_end"></h3>
    <ul><li data-i18n="r_end"></li><li data-i18n="r_score"></li><li data-i18n="r_frozen"></li><li data-i18n="r_tie"></li></ul>
    <h3 data-i18n="r_h_play"></h3>
    <ul><li data-i18n="r_ctl"></li><li data-i18n="r_time"></li><li data-i18n="r_away"></li></ul>
    <p class="note" data-i18n="r_inspired"></p>
    <div class="foot"><span class="note credit tb-credit"></span><button class="btn primary" id="rulesOk" data-i18n="ok"></button></div>
  </div>
</div>

<div class="modal" id="mMode" hidden>
  <div class="card">
    <h2 data-i18n="m_title"></h2>
    <h3 data-i18n="m_name"></h3>
    <input class="field" id="myName" maxlength="12" autocomplete="off" spellcheck="false">
    <h3 data-i18n="m_vs"></h3>
    <div class="seg" id="segVs"><button data-v="bot" data-i18n="m_bot"></button><button data-v="online" data-i18n="m_online"></button></div>
    <div id="botOpts">
      <h3 data-i18n="m_bots"></h3>
      <div class="seg" id="segBots"><button data-v="1"></button><button data-v="2"></button><button data-v="3"></button></div>
      <p class="note" id="fmtNote"></p>
      <h3 data-i18n="m_level"></h3>
      <div id="botLevels"></div>
      <p class="note" id="levelNote"></p>
    </div>
    <div id="netOpts">
      <h3 data-i18n="m_net"></h3>
      <div class="netrow">
        <div class="seg" id="segNet"><button data-v="create" data-i18n="m_create"></button><button data-v="join" data-i18n="m_join"></button></div>
        <input class="field" id="joinCode" maxlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false">
      </div>
      <p class="note" data-i18n="m_net_note"></p>
    </div>
    <div class="foot">
      <button class="btn" id="modeCancel"></button>
      <button class="btn primary" id="modeStart" data-i18n="m_start"></button>
    </div>
  </div>
</div>

<div class="modal" id="mLobby" hidden>
  <div class="card">
    <h2 id="lobbyTitle"></h2>
    <div id="lobbyCode" hidden>
      <div class="netcode" id="netCode"></div>
      <div class="netlink"><input id="netLink" readonly><button class="btn" id="netCopy" data-i18n="n_copy"></button></div>
    </div>
    <h3 data-i18n="n_seats"></h3>
    <ul class="lseats" id="lobbySeats"></ul>
    <div class="addbot" id="lobbyBot" hidden>
      <div class="seg small" id="segBotLv"><button data-v="easy" data-i18n="lv_easy"></button><button data-v="medium" data-i18n="lv_medium"></button><button data-v="hard" data-i18n="lv_hard"></button></div>
      <button class="btn" id="addBot" data-i18n="n_addbot"></button>
    </div>
    <p class="note" id="lobbyFmt" style="margin:10px 0 0"></p>
    <p id="lobbyMsg"></p>
    <div class="foot">
      <button class="btn" id="lobbyLeave" data-i18n="n_leave"></button>
      <button class="btn primary" id="lobbyStart" hidden></button>
    </div>
  </div>
</div>

<div class="modal" id="mNet" hidden>
  <div class="card" style="max-width:440px;text-align:center">
    <h2 id="netTitle"></h2>
    <p id="netMsg"></p>
    <div class="foot" style="justify-content:center">
      <button class="btn" id="netRetry" data-i18n="n_retry" hidden></button>
      <button class="btn primary" id="netClose" data-i18n="ok_close"></button>
    </div>
  </div>
</div>
`;
/* ============================================================
   WALL GO
   Thứ tự: tiện ích, chữ (I18N), âm thanh, LUẬT + AI (thuần, cắt ra chạy bằng Node được: tools/test-wall-go.js),
   trạng thái chung, chủ bàn (máy giữ luật: đấu máy, chủ phòng online), mạng, vẽ, thao tác, bảng chọn chế độ, khởi động.
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const escH = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- CHỮ ---------- */
const I18N = {
  vi: {
    title: "Wall Go", brand: "Wall Go", tagline: "Đi quân, dựng tường, khoanh đất nhiều nhất",
    b_rules: "Luật chơi", b_new: "Ván mới", ok: "Đã hiểu", ok_close: "Đóng", cancel: "Huỷ", m_back: "Xem lại Luật chơi",
    h_players: "Người chơi", h_log: "Diễn biến", you: "Bạn", n_you: " (bạn)",
    col0: "Đỏ", col1: "Xanh", col2: "Lá", col3: "Vàng",
    fmt2: "2 người · 4 quân mỗi bên", fmt3: "3 người · 2 quân · phá tường", fmt4: "4 người · 2 quân",
    fmtn2: "2 người: mỗi bên 4 quân, 2 quân đặt sẵn, 2 quân tự đặt. Không có phá tường.",
    fmtn3: "3 người: mỗi người 2 quân tự đặt, mỗi người được phá tường 1 lần (giống ván 3 người trong show).",
    fmtn4: "4 người: mỗi người 2 quân tự đặt, không có phá tường.",
    m_title: "Chọn cách chơi", m_name: "Tên của bạn", m_vs: "Chơi với", m_bot: "Máy", m_online: "Bạn bè (online)", m_bots: "Số người chơi (bạn + máy)",
    m_bots_n: "{0} người", m_level: "Mức độ", m_bot_n: "Máy {0}", lv_easy: "★", lv_medium: "★★", lv_hard: "★★★", n_lv_tip: "Bấm để đổi mức",
    lvn_easy: "★ Máy đi khá tuỳ hứng, hay để hở đường.", lvn_medium: "★★ Máy biết chặn đường và tính trước nước đáp của đối thủ.",
    lvn_hard: "★★★ Máy tính trước nhiều nước, giành đất rất chặt.",
    m_net: "Phòng chơi", m_create: "Tạo phòng", m_join: "Vào phòng", m_code_ph: "Mã phòng", m_start: "Bắt đầu", def_name: "Người chơi",
    m_net_note: "Phòng 2 đến 4 ghế, chủ phòng có thể cho máy ngồi ghế trống. Bạn bè mở link mời là vào phòng ngay.",
    n_title_host: "Phòng của bạn", n_title_guest: "Phòng {0}", n_copy: "Sao chép", n_copied: "Đã chép", n_seats: "Người chơi",
    n_addbot: "Thêm máy", n_leave: "Rời phòng", n_start: "Bắt đầu ({0} người)", n_host: "Chủ phòng", n_human: "Người chơi", n_bot: "Máy · {0}",
    n_empty: "Ghế trống", n_wait_host: "Gửi mã hoặc link cho bạn bè. Cần ít nhất 2 ghế (tính cả máy) để bắt đầu.",
    n_wait_guest: "Chờ chủ phòng bắt đầu...", n_connecting: "Đang tạo phòng...", n_joining: "Đang vào phòng {0}...", n_retry: "Vào lại",
    n_title_err: "Không kết nối được", n_err_lib: "Không tải được thư viện PeerJS. Kiểm tra mạng rồi thử lại.",
    n_err_nopeer: "Không tìm thấy phòng {0}. Kiểm tra lại mã.", n_err_net: "Lỗi mạng ({0}).", n_err_full: "Phòng đã đủ 4 người.",
    n_err_started: "Phòng đang chơi dở, không vào thêm được.", n_err_version: "Hai bên đang dùng phiên bản game khác nhau. Tải lại trang (Ctrl+F5) rồi thử lại.",
    n_err_timeout: "Chủ phòng không phản hồi.", n_err_kicked: "Chủ phòng đã mời bạn ra khỏi phòng.", n_err_hostleft: "Chủ phòng đã rời đi. Ván dừng tại đây.",
    n_err_lost: "Mất kết nối với chủ phòng. Bấm Vào lại để lấy lại ghế.", n_err_code: "Nhập mã phòng 5 ký tự.",
    s_bot: "Máy {0}", s_human: "Người chơi", s_away: "Mất kết nối, máy chơi thay", s_cells: "ô đất", s_brk: "Còn 1 lần phá tường", s_brk_used: "Đã phá tường",
    s_done: "Đã chốt hết quân",
    i_bot: "Đấu máy", i_online: "Online · phòng {0}", i_time: "Mỗi lượt 90 giây, hết giờ máy đi hộ.",
    st_idle: "Bấm Ván mới để chọn cách chơi.", st_place: "<b>Tới lượt bạn:</b> bấm một ô trống để đặt quân (còn {0} quân).",
    st_pick: "<b>Tới lượt bạn:</b> chọn một quân để đi.", st_dest: "Bấm ô muốn tới (tối đa 2 bước), hoặc bấm lại quân để đứng yên.",
    st_dest_brk: " Muốn phá tường thì bấm vào bức tường đang nhấp nháy đỏ cạnh quân.",
    st_wall: "<b>Dựng tường:</b> bấm một cạnh của ô quân vừa tới.", st_broke: "Đã chọn phá tường (bấm lại để thôi).",
    st_wait_place: "{0} đang đặt quân...", st_wait: "{0} đang nghĩ...", st_over: "Hết ván.",
    c_stay: "Đứng yên", c_cancel: "Bỏ chọn",
    l_draw: "Bốc thăm thứ tự đi: {0}", l_place: "{0} đặt quân ở {1}", l_move: "{0}: {1} → {2}, tường {3}", l_stay: "{0}: đứng yên ở {1}, tường {2}",
    l_brk: "{0} phá tường cạnh {1}", l_close: "{0} khép xong vùng {1} ô", l_done: "{0} đã chốt hết quân", l_auto: "{0} hết giờ, máy đi hộ",
    l_away: "{0} mất kết nối, máy chơi thay", l_back: "{0} đã quay lại", l_over: "Hết ván",
    d0: "phía trên", d1: "bên phải", d2: "phía dưới", d3: "bên trái",
    o_win: "Bạn thắng!", o_won: "{0} thắng!", o_tie: "Hoà!", o_tie_with: "Bạn đồng hạng nhất", o_lose: "Bạn xếp hạng {0}",
    o_sub_score: "Ô đất của mỗi người", o_cells: "{0} ô", o_big: "vùng lớn nhất {0}", o_view: "Xem bàn cờ", o_again: "Chơi lại", o_newroom: "Trận mới",
    o_wait: "Chờ chủ phòng mở trận mới.", o_tiebreak: "Bằng điểm, xét vùng lớn nhất.",
    q_leave: "Bỏ dở ván đang chơi?",
    r_intro: "Mỗi người điều khiển vài quân trên bàn 7×7. Đi quân rồi dựng tường để khoanh đất cho riêng mình. Khi mọi quân đều đã bị tường ngăn vào vùng riêng, ai có nhiều ô đất nhất thắng.",
    f1_h: "Đi rồi dựng tường", f1_p: "Đi tối đa 2 bước, được rẽ, rồi dựng 1 tường ở cạnh ô vừa tới.",
    f2_h: "Khoanh đất", f2_p: "Vùng kín chỉ có quân của bạn: mỗi ô 1 điểm (ở đây 6 điểm).",
    f3_h: "Phá tường", f3_p: "Chỉ ván 3 người: phá 1 tường sát quân rồi đi qua, mỗi người 1 lần.",
    r_h_setup: "Chuẩn bị",
    r_s2: "<b>2 người:</b> mỗi bên 4 quân. 2 quân đã đặt sẵn đối xứng nhau, 2 quân còn lại tự đặt vào ô trống theo thứ tự Đỏ, Xanh, Xanh, Đỏ.",
    r_s34: "<b>3 hoặc 4 người:</b> mỗi người 2 quân, tự đặt vào ô trống bất kỳ theo thứ tự đi rồi quay ngược lại (1, 2, 3, 3, 2, 1...).",
    r_order: "Thứ tự đi được bốc thăm đầu ván. Người đi đầu cầm Đỏ, tiếp theo là Xanh, Lá, Vàng.",
    r_h_turn: "Mỗi lượt",
    r_move: "Chọn 1 quân của mình, đi 0, 1 hoặc 2 bước theo hàng ngang hoặc dọc (bước thứ hai được rẽ). Không đi xuyên tường hay quân khác, không dừng ở ô có quân.",
    r_wall: "Đi xong <b>bắt buộc</b> dựng 1 bức tường ở một cạnh của ô quân đó vừa dừng. Mép bàn đã là tường sẵn, không dựng chồng lên tường có sẵn. Tường dựng rồi không gỡ được.",
    r_lock: "Quân nằm trong vùng kín chỉ có quân của bạn là <b>đã chốt</b>, không đi nữa. Ai không còn quân nào đi được thì được bỏ qua lượt.",
    r_h_break: "Phá tường (chỉ ván 3 người)",
    r_break: "Mỗi người được phá 1 bức tường mỗi ván: chọn quân, bấm vào một bức tường sát ô quân đó để phá, rồi đi tiếp (vẫn tối đa 2 bước) và dựng tường như thường. Không dùng thì thôi.",
    r_break2: "Ván 2 người và 4 người không có phá tường.",
    r_h_end: "Kết thúc và tính điểm",
    r_end: "Ván kết thúc ngay khi mọi quân đều đã chốt.",
    r_score: "Mỗi ô trong vùng kín chỉ có quân của bạn được 1 điểm. Vùng trống hoặc còn quân của nhiều người không tính cho ai.",
    r_tie: "Bằng điểm thì ai có vùng đơn lẻ lớn nhất thắng; vẫn bằng nữa thì hoà.",
    r_h_play: "Cách bấm và thời gian",
    r_ctl: "Bấm quân → bấm ô muốn tới (bấm lại quân nếu muốn đứng yên) → bấm một trong các cạnh tô màu quanh quân để dựng tường. Trước khi dựng tường vẫn đổi ý được.",
    r_time: "Chơi online: mỗi lượt 90 giây, hết giờ máy đi hộ bạn. Đấu máy không tính giờ.",
    r_away: "Ai rớt mạng thì máy chơi thay; mở lại link mời là lấy lại ghế.",
    r_inspired: "Lấy cảm hứng từ Wall Go trong The Devil's Plan mùa 2.",

    // ---- chung (dùng cả bản I) ----
    s_stuck: "Không đi được, bỏ lượt", l_skip: "{0} không đi được, bỏ lượt", r_frozen: "", k_r: "tròn", k_s: "vuông",
    // ---- Wall Go II ----
    title_v2: "Wall Go II", brand_v2: "Wall Go II", tagline_v2: "Quân vuông đi thẳng, quân tròn rẽ góc, dựng tường khoanh đất",
    fmt2_v2: "2 người · 2 vuông + 2 tròn", fmt3_v2: "3 người · vuông + tròn · phá tường", fmt4_v2: "4 người · 1 vuông + 1 tròn",
    fmtn2_v2: "2 người: mỗi bên 2 quân tròn đặt sẵn và 2 quân vuông tự đặt. Không có phá tường.",
    fmtn3_v2: "3 người: mỗi người 1 quân tròn và 1 quân vuông, mỗi người được phá tường 1 lần.",
    fmtn4_v2: "4 người: mỗi người 1 quân tròn và 1 quân vuông, không có phá tường.",
    st_place_v2: "<b>Tới lượt bạn:</b> bấm một ô trống để đặt <b>quân {1}</b> (còn {0} quân).",
    st_dest_v2: "Bấm ô muốn tới (quân vuông đi thẳng 1-2 ô, quân tròn đi 1 ô rồi có thể rẽ).",
    st_dest_brk_v2: " Tường viền đỏ là tường chắn đường, bấm vào để phá rồi đi qua.",
    r_intro_v2: "Giống Wall Go nhưng có hai loại quân đi khác nhau, và lượt nào cũng phải đi: quân vuông đi thẳng, quân tròn rẽ góc. Dựng tường, khoanh đất và tính điểm y như bản I.",
    f1_h_v2: "Quân vuông", f1_p_v2: "Đi thẳng 1 hoặc 2 ô, rồi dựng 1 tường cạnh ô vừa tới.",
    f2_h_v2: "Quân tròn", f2_p_v2: "Đi 1 ô, rồi có thể rẽ trái hoặc phải thêm 1 ô.",
    f3_h_v2: "Phá tường", f3_p_v2: "Chỉ ván 3 người: phá bức tường chắn bước đi rồi đi qua đúng chỗ đó.",
    r_s2_v2: "<b>2 người:</b> mỗi bên 2 quân tròn và 2 quân vuông. Quân tròn đặt sẵn đối xứng nhau, quân vuông tự đặt vào ô trống theo thứ tự Đỏ, Xanh, Xanh, Đỏ.",
    r_s34_v2: "<b>3 hoặc 4 người:</b> mỗi người 1 quân tròn và 1 quân vuông. Lượt đi (1, 2, 3...) ai cũng đặt quân tròn, lượt về (...3, 2, 1) đặt quân vuông.",
    r_move_v2: "Chọn 1 quân của mình và <b>bắt buộc đi</b>, không được đứng yên. <b>Quân vuông:</b> 1 hoặc 2 ô thẳng theo một hướng. <b>Quân tròn:</b> 1 ô, rồi có thể rẽ trái hoặc phải thêm 1 ô. Không đi xuyên tường hay quân khác.",
    r_lock_v2: "Quân nằm trong vùng kín chỉ có quân của bạn là <b>đã chốt</b>. Quân không đi được ô nào thì không chọn được; ai không còn quân nào đi được thì bị bỏ qua lượt.",
    r_break_v2: "Mỗi người được phá 1 bức tường mỗi ván, và phải là bức tường đang chắn bước đi của quân: chọn quân, bấm vào bức tường viền đỏ để phá, rồi quân phải đi qua đúng chỗ vừa phá. Sau đó dựng tường như thường.",
    r_end_v2: "Ván kết thúc khi không còn ai đi được: mọi quân đã chốt, hoặc các quân còn lại đều bị kẹt.",
    r_frozen_v2: "Quân của nhiều người bị nhốt chung một vùng mà không quân nào đi được: mỗi quân được 1 điểm cho ô nó đứng.",
    r_ctl_v2: "Bấm quân → bấm ô muốn tới (các chấm) → bấm một trong các cạnh tô màu quanh quân để dựng tường. Trước khi dựng tường vẫn đổi ý được.",
    r_inspired_v2: "Lấy cảm hứng từ Wall Go II trong The Devil's Plan mùa 3, luật theo quoridorgame.com.",
  },
  en: {
    title: "Wall Go", brand: "Wall Go", tagline: "Move, build walls, claim the most land",
    b_rules: "Rules", b_new: "New game", ok: "Got it", ok_close: "Close", cancel: "Cancel", m_back: "Back to the rules",
    h_players: "Players", h_log: "Game log", you: "You", n_you: " (you)",
    col0: "Red", col1: "Blue", col2: "Green", col3: "Yellow",
    fmt2: "2 players · 4 pieces each", fmt3: "3 players · 2 pieces · wall break", fmt4: "4 players · 2 pieces",
    fmtn2: "2 players: 4 pieces each, 2 already on the board and 2 you place. No wall breaking.",
    fmtn3: "3 players: 2 pieces each, all placed by the players; everyone may break one wall (like the 3-player game on the show).",
    fmtn4: "4 players: 2 pieces each, all placed by the players; no wall breaking.",
    m_title: "Choose a mode", m_name: "Your name", m_vs: "Play against", m_bot: "Bots", m_online: "Friends (online)", m_bots: "Players (you + bots)",
    m_bots_n: "{0} players", m_level: "Difficulty", m_bot_n: "Bot {0}", lv_easy: "★", lv_medium: "★★", lv_hard: "★★★", n_lv_tip: "Click to change the level",
    lvn_easy: "★ Plays on a whim and often leaves gaps.", lvn_medium: "★★ Blocks your paths and looks one reply ahead.",
    lvn_hard: "★★★ Looks several moves ahead and fights hard for every square.",
    m_net: "Room", m_create: "Create room", m_join: "Join room", m_code_ph: "Room code", m_start: "Start", def_name: "Player",
    m_net_note: "Rooms hold 2 to 4 seats; the host can fill empty seats with bots. Friends join straight from the invite link.",
    n_title_host: "Your room", n_title_guest: "Room {0}", n_copy: "Copy", n_copied: "Copied", n_seats: "Players",
    n_addbot: "Add bot", n_leave: "Leave", n_start: "Start ({0} players)", n_host: "Host", n_human: "Player", n_bot: "Bot · {0}",
    n_empty: "Empty seat", n_wait_host: "Share the code or link. You need at least 2 seats (bots count) to start.",
    n_wait_guest: "Waiting for the host to start...", n_connecting: "Creating the room...", n_joining: "Joining room {0}...", n_retry: "Rejoin",
    n_title_err: "Connection problem", n_err_lib: "Couldn't load PeerJS. Check your connection and try again.",
    n_err_nopeer: "Room {0} not found. Check the code.", n_err_net: "Network error ({0}).", n_err_full: "The room is full (4 seats).",
    n_err_started: "That game is already in progress.", n_err_version: "You're on different versions of the game. Reload (Ctrl+F5) and try again.",
    n_err_timeout: "The host isn't responding.", n_err_kicked: "The host removed you from the room.", n_err_hostleft: "The host left. The game has ended.",
    n_err_lost: "Lost connection to the host. Press Rejoin to take your seat back.", n_err_code: "Enter the 5-character room code.",
    s_bot: "Bot {0}", s_human: "Player", s_away: "Disconnected, a bot is playing", s_cells: "squares", s_brk: "1 wall break left", s_brk_used: "Wall break used",
    s_done: "All pieces settled",
    i_bot: "Vs bots", i_online: "Online · room {0}", i_time: "90 seconds per turn; when time runs out a bot moves for you.",
    st_idle: "Press New game to choose a mode.", st_place: "<b>Your turn:</b> click an empty square to place a piece ({0} left).",
    st_pick: "<b>Your turn:</b> pick one of your pieces.", st_dest: "Click where to go (up to 2 steps), or click the piece again to stay.",
    st_dest_brk: " To break a wall, click a red flashing wall next to the piece.",
    st_wall: "<b>Build a wall:</b> click a side of the square you moved to.", st_broke: "Wall break selected (click it again to undo).",
    st_wait_place: "{0} is placing a piece...", st_wait: "{0} is thinking...", st_over: "Game over.",
    c_stay: "Stay", c_cancel: "Cancel",
    l_draw: "Turn order drawn: {0}", l_place: "{0} placed a piece on {1}", l_move: "{0}: {1} → {2}, wall {3}", l_stay: "{0}: stayed on {1}, wall {2}",
    l_brk: "{0} broke the wall next to {1}", l_close: "{0} sealed off {1} squares", l_done: "{0} has settled all pieces", l_auto: "{0} ran out of time, a bot moved",
    l_away: "{0} disconnected, a bot took over", l_back: "{0} is back", l_over: "Game over",
    d0: "above", d1: "on the right", d2: "below", d3: "on the left",
    o_win: "You win!", o_won: "{0} wins!", o_tie: "It's a tie!", o_tie_with: "You share first place", o_lose: "You finished #{0}",
    o_sub_score: "Squares claimed", o_cells: "{0}", o_big: "largest area {0}", o_view: "View board", o_again: "Play again", o_newroom: "New game",
    o_wait: "Waiting for the host to start a new game.", o_tiebreak: "Tied on squares, decided by the largest area.",
    q_leave: "Abandon the current game?",
    r_intro: "Each player moves a few pieces on a 7×7 board. Move, then build a wall to fence off land for yourself. Once every piece is walled into its own area, whoever holds the most squares wins.",
    f1_h: "Move, then build", f1_p: "Move up to 2 steps (you may turn), then build 1 wall beside the square you stopped on.",
    f2_h: "Claim land", f2_p: "A closed area holding only your pieces scores 1 point per square (6 here).",
    f3_h: "Wall break", f3_p: "3 players only: break 1 wall next to your piece and walk through, once per game.",
    r_h_setup: "Setup",
    r_s2: "<b>2 players:</b> 4 pieces each. 2 start on the board in mirrored spots; place the other 2 on empty squares in the order Red, Blue, Blue, Red.",
    r_s34: "<b>3 or 4 players:</b> 2 pieces each, placed on any empty square in turn order and then back again (1, 2, 3, 3, 2, 1...).",
    r_order: "Turn order is drawn at random. The first player is Red, then Blue, Green, Yellow.",
    r_h_turn: "Each turn",
    r_move: "Pick one of your pieces and move it 0, 1 or 2 steps horizontally or vertically (the second step may turn). You can't pass through walls or pieces, or stop on an occupied square.",
    r_wall: "Then you <b>must</b> build 1 wall on a side of the square the piece stopped on. The board edge already counts as a wall, and you can't build on a side that has one. Walls stay for good.",
    r_lock: "A piece inside a closed area holding only your pieces is <b>settled</b> and no longer moves. A player with no movable pieces is skipped.",
    r_h_break: "Wall break (3 players only)",
    r_break: "Each player may break one wall per game: pick a piece, click a wall right next to it to break it, then move as usual (still up to 2 steps) and build a wall. Unused breaks are simply lost.",
    r_break2: "2- and 4-player games have no wall break.",
    r_h_end: "End and scoring",
    r_end: "The game ends as soon as every piece is settled.",
    r_score: "Each square in a closed area holding only your pieces is worth 1 point. Empty areas, or areas shared by several players, score for nobody.",
    r_tie: "Tied on points? The player with the largest single area wins; still tied, it's a draw.",
    r_h_play: "Controls and time",
    r_ctl: "Click a piece → click where to go (click the piece again to stay) → click one of the tinted sides around the piece to build a wall. You can change your mind until the wall is built.",
    r_time: "Online: 90 seconds per turn; when time runs out a bot moves for you. No clock against bots.",
    r_away: "If someone disconnects, a bot plays their seat; reopening the invite link takes the seat back.",
    r_inspired: "Inspired by Wall Go from The Devil's Plan season 2.",

    // ---- shared (also used by version I) ----
    s_stuck: "Can't move, turn skipped", l_skip: "{0} can't move, turn skipped", r_frozen: "", k_r: "round", k_s: "square",
    // ---- Wall Go II ----
    title_v2: "Wall Go II", brand_v2: "Wall Go II", tagline_v2: "Squares go straight, rounds turn corners; wall off the most land",
    fmt2_v2: "2 players · 2 squares + 2 rounds", fmt3_v2: "3 players · square + round · wall break", fmt4_v2: "4 players · 1 square + 1 round",
    fmtn2_v2: "2 players: each side has 2 round pieces already on the board and places 2 square pieces. No wall breaking.",
    fmtn3_v2: "3 players: 1 round and 1 square piece each; everyone may break one wall.",
    fmtn4_v2: "4 players: 1 round and 1 square piece each; no wall breaking.",
    st_place_v2: "<b>Your turn:</b> click an empty square to place a <b>{1} piece</b> ({0} left).",
    st_dest_v2: "Click where to go (squares go 1-2 straight, rounds go 1 and may turn).",
    st_dest_brk_v2: " A red-ringed wall blocks your way: click it to break it and walk through.",
    r_intro_v2: "Like Wall Go, but with two kinds of pieces that move differently, and you must move every turn: squares go straight, rounds turn corners. Walls, territory and scoring work exactly as in version I.",
    f1_h_v2: "Square piece", f1_p_v2: "Move 1 or 2 squares in a straight line, then build a wall beside it.",
    f2_h_v2: "Round piece", f2_p_v2: "Move 1 square, then optionally turn left or right for 1 more.",
    f3_h_v2: "Wall break", f3_p_v2: "3 players only: break the wall blocking your step and walk through that gap.",
    r_s2_v2: "<b>2 players:</b> 2 round and 2 square pieces each. The rounds start on the board in mirrored spots; place the squares on empty squares in the order Red, Blue, Blue, Red.",
    r_s34_v2: "<b>3 or 4 players:</b> 1 round and 1 square piece each. On the way out (1, 2, 3...) everyone places their round piece, on the way back (...3, 2, 1) their square piece.",
    r_move_v2: "Pick one of your pieces; you <b>must move</b>, staying put is not allowed. <b>Square:</b> 1 or 2 squares in a straight line. <b>Round:</b> 1 square, then it may turn left or right for 1 more. No passing through walls or pieces.",
    r_lock_v2: "A piece inside a closed area holding only your pieces is <b>settled</b>. A piece with nowhere to go can't be picked; a player with no movable pieces is skipped.",
    r_break_v2: "Each player may break one wall per game, and it must be the wall blocking the step you are about to take: pick a piece, click the red-ringed wall to break it, and the piece must then move through that gap. Then build a wall as usual.",
    r_end_v2: "The game ends when nobody can move: every piece is settled, or the rest are stuck.",
    r_frozen_v2: "If pieces of different players are shut in together and none of them can move, each piece scores the square it stands on.",
    r_ctl_v2: "Click a piece → click where to go (the dots) → click one of the tinted sides around it to build a wall. You can change your mind until the wall is built.",
    r_inspired_v2: "Inspired by Wall Go II from The Devil's Plan season 3; rules as on quoridorgame.com.",
  },
};
let LANG = (() => { try { const s = localStorage.getItem("lang"); if (s === "vi" || s === "en") return s; } catch (e) {} return (navigator.language || "").toLowerCase().startsWith("vi") ? "vi" : "en"; })();
// bản II: khoá nào có "<khoá>_v2" thì dùng chữ đó (luật, hình minh hoạ, hướng dẫn bấm); còn lại dùng chung với bản I
const trRaw = k => (VARIANT === 2 ? I18N[LANG][k + "_v2"] ?? I18N.vi[k + "_v2"] : undefined) ?? I18N[LANG][k] ?? I18N.vi[k] ?? k;
const tr = (k, ...a) => String(trRaw(k)).replace(/\{(\d)\}/g, (m, i) => a[i] ?? "");

/* ---------- ÂM THANH (tổng hợp bằng Web Audio, không có file) ---------- */
let AC = null;
try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; }
function tone(freq, start, dur, type = "sine", vol = .16) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.value = freq; o.connect(g); g.connect(AC.destination);
  g.gain.setValueAtTime(0.0001, start); g.gain.exponentialRampToValueAtTime(vol, start + .01); g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.start(start); o.stop(start + dur + .02);
}
function noise(start, dur, freq, vol) {
  const n = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(AC.destination); s.start(start);
}
function sfx(name) {
  if (!AC) return;
  if (AC.state === "suspended") AC.resume();
  const t = AC.currentTime;
  try {
    if (name === "place") { tone(520, t, .09, "triangle", .14); tone(780, t + .04, .1, "sine", .08); }
    else if (name === "move") { noise(t, .12, 900, .25); }
    else if (name === "wall") { tone(150, t, .14, "square", .07); noise(t, .08, 400, .5); }
    else if (name === "break") { noise(t, .25, 1800, .6); tone(110, t, .2, "sawtooth", .08); }
    else if (name === "close") { [523, 659, 784].forEach((f, i) => tone(f, t + i * .08, .22, "triangle", .12)); }
    else if (name === "turn") { tone(880, t, .08, "sine", .07); }
    else if (name === "win") { [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * .12, .3, "triangle", .14)); }
    else if (name === "lose") { [392, 330, 262].forEach((f, i) => tone(f, t + i * .16, .32, "triangle", .12)); }
    else if (name === "tick") { tone(1200, t, .04, "square", .04); }
  } catch (e) {}
}

/* RULES-AI-START */
/* ---------- LUẬT ----------
   Bàn 7x7, ô c = r*7 + col. Cạnh (chỗ dựng tường) đánh số 0..83:
   - cạnh ngang (giữa ô (r,col) và (r+1,col)): r*7 + col, r 0..5  → 0..41
   - cạnh dọc (giữa ô (r,col) và (r,col+1)): 42 + r*6 + col, col 0..5 → 42..83
   Mép bàn không phải cạnh, không dựng tường được. Hướng d: 0 lên, 1 phải, 2 xuống, 3 trái. */
const N = 7, NC = 49, NE = 84;
const NB = [], EDGE = [];   // NB[c*4+d]: ô kề (-1 nếu ra ngoài), EDGE[c*4+d]: cạnh giữa hai ô (-1 nếu là mép bàn)
for (let c = 0; c < NC; c++) {
  const r = Math.floor(c / N), k = c % N;
  NB.push(r > 0 ? c - N : -1, k < N - 1 ? c + 1 : -1, r < N - 1 ? c + N : -1, k > 0 ? c - 1 : -1);
  EDGE.push(r > 0 ? (r - 1) * N + k : -1, k < N - 1 ? 42 + r * 6 + k : -1, r < N - 1 ? r * N + k : -1, k > 0 ? 42 + r * 6 + k - 1 : -1);
}
const EDGE_CELLS = [];      // hai ô hai bên mỗi cạnh
for (let e = 0; e < NE; e++) EDGE_CELLS.push(e < 42 ? [e, e + N] : [Math.floor((e - 42) / 6) * N + (e - 42) % 6, Math.floor((e - 42) / 6) * N + (e - 42) % 6 + 1]);

// Thể thức theo số người (chủ game chọn 11/2026, theo The Devil's Plan mùa 2 cho 2 và 3 người):
// 2 người: 4 quân mỗi bên, 2 quân đặt sẵn đối xứng quanh tâm (show không công bố toạ độ, mình tự đặt); 3 người: 2 quân, được phá tường 1 lần; 4 người: 2 quân, không phá tường.
const SETUPS = {
  2: { pp: 4, brk: false, fixed: [[8, 40], [12, 36]] },   // Đỏ ô (1,1),(5,5); Xanh (1,5),(5,1)
  3: { pp: 2, brk: true, fixed: null },
  4: { pp: 2, brk: false, fixed: null },
};

/* Wall Go II (The Devil's Plan mùa 3, luật theo quoridorgame.com/en/wall-go/rules): hai loại quân, lượt nào cũng bắt buộc đi.
   Quân vuông "s": 1 hoặc 2 ô thẳng một hướng. Quân tròn "r": 1 ô, rồi có thể rẽ trái/phải thêm 1 ô.
   2 người: 2 tròn (đặt sẵn, cùng ô với 2 quân đặt sẵn của bản I) + 2 vuông tự đặt; 3-4 người: 1 tròn + 1 vuông,
   lượt đi của thứ tự rắn đặt quân tròn, lượt về đặt quân vuông. Bản I mọi quân là "n" (0-2 bước, rẽ tự do, được đứng yên). */
function newGame(n, v = 1) {
  const S = SETUPS[n];
  const G = {
    n, v, pp: S.pp, brk: S.brk, phase: "place", turn: 0, ply: 0, over: null, last: null,
    kind: Array.from({ length: n * S.pp }, (_, i) => v !== 2 ? "n" : (i % S.pp) < (S.pp === 4 ? 2 : 1) ? "r" : "s"),
    pos: new Array(n * S.pp).fill(-1),      // quân i của người floor(i / pp)
    walls: new Array(NE).fill(0),           // 0 trống, k+1 = tường của người k
    brkLeft: new Array(n).fill(S.brk ? 1 : 0),
    queue: [],                               // thứ tự đặt quân còn lại
  };
  if (S.fixed) S.fixed.forEach((cells, p) => cells.forEach((c, k) => { G.pos[p * S.pp + k] = c; }));
  // đặt quân kiểu rắn: 0,1,..,n-1,n-1,..,0, lặp lại tới khi đủ
  const per = S.fixed ? S.pp - S.fixed[0].length : S.pp;
  for (let k = 0; k < per; k++) for (let i = 0; i < n; i++) G.queue.push(k % 2 === 0 ? i : n - 1 - i);
  G.turn = G.queue[0];
  return G;
}
const ownerOf = (G, i) => Math.floor(i / G.pp);
const pieceAt = (G, c) => G.pos.indexOf(c);
function nextFree(G, p) { const b = p * G.pp; for (let k = 0; k < G.pp; k++) if (G.pos[b + k] < 0) return b + k; return -1; }

// vùng: các ô nối nhau qua cạnh không có tường. comp[c] = mã vùng; mask[v] = tập người có quân trong vùng (bit)
function regions(walls, pos, pp) {
  const comp = new Int8Array(NC).fill(-1), size = [], mask = [], st = [];
  let v = 0;
  for (let s = 0; s < NC; s++) {
    if (comp[s] >= 0) continue;
    comp[s] = v; st.push(s); let sz = 0;
    while (st.length) {
      const c = st.pop(); sz++;
      for (let d = 0; d < 4; d++) { const nb = NB[c * 4 + d]; if (nb >= 0 && comp[nb] < 0 && !walls[EDGE[c * 4 + d]]) { comp[nb] = v; st.push(nb); } }
    }
    size.push(sz); mask.push(0); v++;
  }
  for (let i = 0; i < pos.length; i++) if (pos[i] >= 0) mask[comp[pos[i]]] |= 1 << Math.floor(i / pp);
  return { comp, size, mask };
}
const single = m => m !== 0 && (m & (m - 1)) === 0;
// quân "đã chốt": vùng của nó chỉ có quân của một người, không còn chọn để đi
function lockedSet(G, R) {
  R = R || regions(G.walls, G.pos, G.pp);
  return G.pos.map(c => c >= 0 && single(R.mask[R.comp[c]]));
}
// điểm: tổng số ô các vùng chỉ có quân của mình; largest: vùng lớn nhất
// chủ của từng ô: người p (đất riêng), -2 (vùng trống đã khép kín), -1 (chưa của ai).
// Luật phụ: quân của nhiều người bị nhốt chung một vùng mà không quân nào đi được thì mỗi quân được ô nó đứng
// (chỉ xảy ra ở bản II vì phải đi mỗi lượt; bản I quân nào chưa chốt cũng đứng yên + dựng tường được).
// Đang đặt quân: chưa có tường, cả bàn là một vùng; ván 3-4 người lúc mới có quân của 1 người thì vùng đó trông như đất riêng, không tính.
function territory(G, R) {
  R = R || regions(G.walls, G.pos, G.pp);
  const own = new Int8Array(NC).fill(-1);
  if (G.phase === "place") return own;
  const frozen = R.mask.map(m => !single(m) && m !== 0);
  G.pos.forEach((c, i) => { if (c >= 0 && frozen[R.comp[c]] && pieceCanAct(G, i)) frozen[R.comp[c]] = false; });
  for (let c = 0; c < NC; c++) {
    const v = R.comp[c], m = R.mask[v];
    if (single(m)) own[c] = 31 - Math.clz32(m);
    else if (m === 0) own[c] = -2;
    else if (frozen[v]) { const i = G.pos.indexOf(c); if (i >= 0) own[c] = ownerOf(G, i); }
  }
  return own;
}
// điểm: số ô đất của mình; big: vùng đất riêng lớn nhất (ô lẻ của luật phụ tính là vùng 1 ô)
function scoreOf(G) {
  const R = regions(G.walls, G.pos, G.pp), own = territory(G, R), sc = new Array(G.n).fill(0), big = new Array(G.n).fill(0);
  for (let c = 0; c < NC; c++) if (own[c] >= 0) { const p = own[c]; sc[p]++; big[p] = Math.max(big[p], single(R.mask[R.comp[c]]) ? R.size[R.comp[c]] : 1); }
  return { sc, big, R, own };
}
// xếp hạng: điểm, rồi vùng lớn nhất; bằng cả hai thì cùng hạng
function ranking(sc, big) {
  const ord = sc.map((_, p) => p).sort((a, b) => sc[b] - sc[a] || big[b] - big[a]);
  const rank = new Array(sc.length);
  ord.forEach((p, i) => { rank[p] = i > 0 && sc[p] === sc[ord[i - 1]] && big[p] === big[ord[i - 1]] ? rank[ord[i - 1]] : i + 1; });
  return { ord, rank };
}

// Bản II: các đường đi của quân theo loại: [ô đích, [cạnh đi qua], [ô đi qua]]
function moveShapes(G, i) {
  const s = G.pos[i], sq = G.kind[i] === "s", out = [];
  for (let d = 0; d < 4; d++) {
    const c1 = NB[s * 4 + d];
    if (c1 < 0) continue;
    const e1 = EDGE[s * 4 + d];
    out.push([c1, [e1], [c1]]);
    for (const d2 of sq ? [d] : [(d + 1) % 4, (d + 3) % 4]) {
      const c2 = NB[c1 * 4 + d2];
      if (c2 >= 0) out.push([c2, [e1, EDGE[c1 * 4 + d2]], [c1, c2]]);
    }
  }
  return out;
}
// ô quân i đi tới được. brk: cạnh vừa phá (hoặc -1).
// Bản I: 0 tới 2 bước ngang dọc, rẽ được, không xuyên quân hay tường.
// Bản II: theo loại quân, không đứng yên; đã phá tường thì đường đi phải đi qua đúng chỗ vừa phá.
function reach(G, i, brk = -1) {
  if (G.v === 2) {
    const out = [];
    for (const [to, es, cs] of moveShapes(G, i)) {
      if (out.includes(to) || cs.some(c => G.pos.includes(c))) continue;
      let ok = true, used = false;
      for (const e of es) if (G.walls[e]) { if (e === brk) used = true; else ok = false; }
      if (ok && (brk < 0 || used)) out.push(to);
    }
    return out;
  }
  const s = G.pos[i], out = [s], seen = new Set([s]);
  let fr = [s];
  for (let step = 0; step < 2; step++) {
    const nx = [];
    for (const c of fr) for (let d = 0; d < 4; d++) {
      const nb = NB[c * 4 + d], e = EDGE[c * 4 + d];
      if (nb < 0 || seen.has(nb) || (G.walls[e] && e !== brk)) continue;
      if (G.pos.includes(nb)) continue;
      seen.add(nb); nx.push(nb); out.push(nb);
    }
    fr = nx;
  }
  return out;
}
// cạnh dựng tường được quanh ô c (sau khi phá cạnh brk)
function wallOpts(G, c, brk = -1) {
  const out = [];
  for (let d = 0; d < 4; d++) { const e = EDGE[c * 4 + d]; if (e >= 0 && (!G.walls[e] || e === brk)) out.push(e); }
  return out;
}
// cạnh phá được (chỉ khi thể thức cho phá và người đó còn lượt phá).
// Bản I: tường bất kỳ sát ô của quân i. Bản II: tường đang chắn một bước đi của quân (đường đi chỉ vướng đúng bức tường đó).
function breakOpts(G, i) {
  const p = ownerOf(G, i);
  if (!G.brk || !G.brkLeft[p]) return [];
  if (G.v === 2) {
    const out = [];
    for (const [, es, cs] of moveShapes(G, i)) {
      if (cs.some(c => G.pos.includes(c))) continue;
      const w = es.filter(e => G.walls[e]);
      if (w.length === 1 && !out.includes(w[0])) out.push(w[0]);
    }
    return out;
  }
  const c = G.pos[i], out = [];
  for (let d = 0; d < 4; d++) { const e = EDGE[c * 4 + d]; if (e >= 0 && G.walls[e]) out.push(e); }
  return out;
}
// hành động: {k:"place", c} | {k:"move", i, b (cạnh phá, -1), to, w}
function isLegal(G, a) {
  if (!a || G.over) return false;
  if (G.phase === "place") return a.k === "place" && Number.isInteger(a.c) && a.c >= 0 && a.c < NC && !G.pos.includes(a.c) && nextFree(G, G.turn) >= 0;
  if (a.k !== "move" || !Number.isInteger(a.i) || a.i < 0 || a.i >= G.pos.length || ownerOf(G, a.i) !== G.turn) return false;
  if (lockedSet(G)[a.i]) return false;
  const b = Number.isInteger(a.b) ? a.b : -1;
  if (b >= 0 && !breakOpts(G, a.i).includes(b)) return false;
  if (!reach(G, a.i, b).includes(a.to)) return false;
  return wallOpts(G, a.to, b).includes(a.w);
}
// quân i có nước nào không (chưa tính chốt). Bản I luôn có (đứng yên + dựng tường); bản II phải đi được ít nhất 1 ô.
// (Ô tới luôn có ít nhất 1 cạnh dựng được: cạnh vừa đi qua.)
function pieceCanAct(G, i) {
  if (G.pos[i] < 0) return false;
  if (G.v !== 2) return true;
  return reach(G, i).length > 0 || breakOpts(G, i).length > 0;
}
function hasMove(G, p, L) {
  L = L || lockedSet(G);
  for (let k = 0; k < G.pp; k++) { const i = p * G.pp + k; if (!L[i] && pieceCanAct(G, i)) return true; }
  return false;
}
// đi một hành động đã hợp lệ (gọi isLegal trước), rồi chuyển lượt hoặc kết thúc ván
function apply(G, a) {
  const p = G.turn;
  if (a.k === "place") {
    G.pos[nextFree(G, p)] = a.c;
    G.queue.shift();
    G.last = { k: "place", c: a.c, by: p };
    G.ply++;
    if (G.queue.length) G.turn = G.queue[0];
    else { G.phase = "move"; G.turn = 0; }
    return;
  }
  const from = G.pos[a.i], b = Number.isInteger(a.b) ? a.b : -1;
  if (b >= 0) { G.walls[b] = 0; G.brkLeft[p]--; }
  G.pos[a.i] = a.to;
  G.walls[a.w] = p + 1;
  G.last = { k: "move", i: a.i, from, to: a.to, w: a.w, b, by: p };
  G.ply++;
  // lượt tiếp: người kế tiếp còn nước; không ai còn nước (mọi quân đã chốt hoặc kẹt) thì hết ván
  const L = lockedSet(G);
  for (let k = 1; k <= G.n; k++) { const q = (p + k) % G.n; if (hasMove(G, q, L)) { G.turn = q; return; } }
  finish(G, "done");
}
function finish(G, why) {
  const { sc, big } = scoreOf(G), { ord, rank } = ranking(sc, big);
  G.phase = "over";
  G.over = { why, sc, big, ord, rank, winners: ord.filter(p => rank[p] === 1) };
}
// mọi hành động hợp lệ của người tới lượt
function allActions(G) {
  if (G.over) return [];
  if (G.phase === "place") { const out = []; for (let c = 0; c < NC; c++) if (!G.pos.includes(c)) out.push({ k: "place", c }); return out; }
  const p = G.turn, L = lockedSet(G), out = [];
  for (let k = 0; k < G.pp; k++) {
    const i = p * G.pp + k;
    if (L[i] || G.pos[i] < 0) continue;
    for (const b of [-1].concat(breakOpts(G, i))) for (const to of reach(G, i, b)) for (const w of wallOpts(G, to, b)) out.push({ k: "move", i, b, to, w });
  }
  return out;
}
const cloneG = G => ({ ...G, pos: G.pos.slice(), walls: G.walls.slice(), brkLeft: G.brkLeft.slice(), queue: G.queue.slice(), kind: G.kind.slice(), last: G.last && { ...G.last }, over: G.over && JSON.parse(JSON.stringify(G.over)) });
// mã trạng thái gọn để so hai máy (online)
function stateHash(G) {
  let h = 2166136261;
  const add = x => { h ^= x & 255; h = Math.imul(h, 16777619); };
  G.pos.forEach(c => add(c + 1)); G.walls.forEach(add); G.brkLeft.forEach(add); add(G.turn); add(G.ply); add(G.ply >> 8);
  return (h >>> 0).toString(36);
}

/* ---------- AI ----------
   Đánh giá thế cờ cho từng người: đất chắc (vùng chỉ có quân mình) + phần đất "gần mình hơn" (BFS từ các quân chưa chốt,
   ô nào mình tới được sớm hơn hẳn mọi người khác thì tính cho mình, quân người khác chặn đường). Tất cả chạy trên mảng
   walls/pos trần, đi và hoàn tác trực tiếp nên nhanh. */
const AI_LEVELS = {
  easy:   { top: 6, rand: .3, noise: 2.2, reply: 0, depth: 1, ms: 0 },
  medium: { top: 1, rand: 0, noise: .35, reply: 8, depth: 2, ms: 400 },
  hard:   { top: 1, rand: 0, noise: .05, reply: 12, depth: 4, ms: 1500, mpReply: 20, round: 2 },
};
const VOR_W = .85;
const _dist = new Int8Array(4 * NC), _q = new Int8Array(NC), _occ = new Int8Array(NC);
function evalPos(walls, pos, n, pp, placing = false) {
  const R = regions(walls, pos, pp), val = new Array(n).fill(0);
  if (placing) R.mask = R.mask.map(() => -1);   // lúc đặt quân: không vùng nào là đất riêng, chỉ so ai gần ô nào hơn
  R.size.forEach((sz, v) => { const m = R.mask[v]; if (single(m)) val[31 - Math.clz32(m)] += sz; });
  if (!placing) {   // vùng nhiều người đã kín chỗ: không ai đi được nữa, mỗi quân được ô của nó (luật phụ, bỏ qua phá tường)
    const cnt = new Array(R.size.length).fill(0);
    for (let i = 0; i < pos.length; i++) if (pos[i] >= 0) cnt[R.comp[pos[i]]]++;
    for (let i = 0; i < pos.length; i++) { const c = pos[i]; if (c >= 0 && !single(R.mask[R.comp[c]]) && cnt[R.comp[c]] === R.size[R.comp[c]]) val[Math.floor(i / pp)] += 1; }
  }
  _occ.fill(-1);
  for (let i = 0; i < pos.length; i++) if (pos[i] >= 0) _occ[pos[i]] = Math.floor(i / pp);
  _dist.fill(99);
  for (let p = 0; p < n; p++) {
    let h = 0, t = 0;
    const D = p * NC;
    for (let k = 0; k < pp; k++) { const c = pos[p * pp + k]; if (c >= 0 && !single(R.mask[R.comp[c]])) { _dist[D + c] = 0; _q[t++] = c; } }
    while (h < t) {
      const c = _q[h++], dc = _dist[D + c];
      for (let d = 0; d < 4; d++) {
        const nb = NB[c * 4 + d];
        if (nb < 0 || walls[EDGE[c * 4 + d]] || _dist[D + nb] <= dc + 1) continue;
        if (_occ[nb] >= 0 && _occ[nb] !== p) continue;
        _dist[D + nb] = dc + 1; _q[t++] = nb;
      }
    }
  }
  for (let c = 0; c < NC; c++) {
    if (single(R.mask[R.comp[c]]) || R.mask[R.comp[c]] === 0) continue;
    let best = 99, who = -1, tie = false;
    for (let p = 0; p < n; p++) { const d = _dist[p * NC + c]; if (d < best) { best = d; who = p; tie = false; } else if (d === best) tie = true; }
    if (who >= 0 && !tie && best < 99) val[who] += VOR_W;
  }
  return val;
}
// Lượt phá tường chưa dùng không được cộng điểm: đã thử cộng 1 / 2,5 ô thì mức ★★★ (3 người) thắng ít hơn hẳn
// (28 và 22 trên 72 ván, so với 39/72 khi không cộng), nên để máy tự phá khi tìm kiếm thấy có lợi.
// điểm của người p so với đối thủ mạnh nhất
const rel = (val, p) => { let m = -1e9; for (let q = 0; q < val.length; q++) if (q !== p && val[q] > m) m = val[q]; return val[p] - m; };

// đi thử / hoàn tác trên G thật (không qua apply để nhanh; không đổi turn/phase)
function simDo(G, a) {
  const u = { i: a.i, from: G.pos[a.i], b: a.b, bw: a.b >= 0 ? G.walls[a.b] : 0, w: a.w };
  if (a.b >= 0) { G.walls[a.b] = 0; G.brkLeft[ownerOf(G, a.i)]--; }
  G.pos[a.i] = a.to; G.walls[a.w] = ownerOf(G, a.i) + 1;
  return u;
}
function simUndo(G, u) {
  G.walls[u.w] = 0; G.pos[u.i] = u.from;
  if (u.b >= 0) { G.walls[u.b] = u.bw; G.brkLeft[ownerOf(G, u.i)]++; }
}
function nextMover(G, p) {
  const L = lockedSet(G);
  for (let k = 1; k <= G.n; k++) { const q = (p + k) % G.n; if (hasMove(G, q, L)) return q; }
  return -1;
}
function movesFor(G, p) { const t = G.turn; G.turn = p; const a = allActions(G); G.turn = t; return a; }
// chấm nhanh mọi nước của p, trả về [{a, v (giá trị tương đối của p), val}] xếp giảm dần
function rateMoves(G, p) {
  const out = [];
  for (const a of movesFor(G, p)) {
    const u = simDo(G, a), val = evalPos(G.walls, G.pos, G.n, G.pp);
    simUndo(G, u);
    out.push({ a, v: rel(val, p), val });
  }
  out.sort((x, y) => y.v - x.v);
  return out;
}
// 2 người: negamax alpha-beta trên các nước tốt nhất (cắt bớt theo đánh giá nhanh). side là bên tới lượt, giá trị theo góc nhìn của side.
function negamax(G, side, depth, alpha, beta, K, dl) {
  if (dl && performance.now() > dl) throw "time";
  const list = rateMoves(G, side);
  if (!list.length) return rel(evalPos(G.walls, G.pos, G.n, G.pp), side);
  if (depth <= 1) {   // con là lá: đã có sẵn điểm từ bước chấm nhanh, chỉ cần xét nước kết thúc ván
    let best = -1e9;
    for (const m of list) {
      let v = m.v;
      { const u = simDo(G, m.a); if (nextMover(G, side) < 0) v *= 10; simUndo(G, u); }
      if (v > best) best = v;
    }
    return best;
  }
  let best = -1e9;
  for (const m of list.slice(0, K)) {
    const u = simDo(G, m.a);
    let v;
    try { v = childValue(G, side, depth - 1, alpha, beta, K, dl); } finally { simUndo(G, u); }
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}
// giá trị (theo góc nhìn của side) sau khi side vừa đi
function childValue(G, side, depth, alpha, beta, K, dl) {
  const q = nextMover(G, side);
  if (q < 0) return rel(evalPos(G.walls, G.pos, G.n, G.pp), side) * 10;   // hết ván: đất đã chốt hết, nhân lên cho chắc
  if (depth <= 0) return rel(evalPos(G.walls, G.pos, G.n, G.pp), side);
  return q === side ? negamax(G, side, depth, alpha, beta, K, dl) : -negamax(G, q, depth, -beta, -alpha, K, dl);
}
function aiPick(G, level, rnd = Math.random) {
  const L = AI_LEVELS[level] || AI_LEVELS.medium, p = G.turn;
  if (G.phase === "place") {
    const free = nextFree(G, p), rated = [];
    for (let c = 0; c < NC; c++) {
      if (G.pos.includes(c)) continue;
      G.pos[free] = c;
      rated.push({ a: { k: "place", c }, v: rel(evalPos(G.walls, G.pos, G.n, G.pp, true), p) + (rnd() - .5) * L.noise });
      G.pos[free] = -1;
    }
    rated.sort((x, y) => y.v - x.v);
    return rated[Math.floor(rnd() * Math.min(L.top, rated.length))].a;
  }
  const rated = rateMoves(G, p);
  if (!rated.length) return null;
  // nước kết thúc ván: tính đúng điểm cuối
  for (const m of rated.slice(0, 30)) { const u = simDo(G, m.a); if (nextMover(G, p) < 0) m.v *= 10; simUndo(G, u); }
  rated.forEach(m => { m.v += (rnd() - .5) * L.noise; });
  rated.sort((x, y) => y.v - x.v);
  if (L.rand && rnd() < L.rand) return rated[Math.floor(rnd() * Math.min(14, rated.length))].a;
  if (L.top > 1) return rated[Math.floor(rnd() * Math.min(L.top, rated.length))].a;
  if (!L.reply) return rated[0].a;
  let cand = rated.slice(0, G.n === 2 ? L.reply : L.mpReply || L.reply);
  const dl = performance.now() + L.ms * (G.n === 2 ? 1 : 1.6);
  if (G.n === 2) {
    // tăng dần độ sâu tới khi hết giờ, giữ kết quả của độ sâu xong trọn vẹn gần nhất
    let bestA = cand[0].a;
    for (let d = 2; d <= L.depth; d++) {
      try {
        let bv = -1e9;
        for (const m of cand) {
          const u = simDo(G, m.a);
          try { m.s = childValue(G, p, d - 1, bv - 1e-6, 1e9, L.reply, dl) + (rnd() - .5) * L.noise; } finally { simUndo(G, u); }
          if (m.s > bv) bv = m.s;
        }
        cand = cand.slice().sort((x, y) => y.s - x.s);   // vòng sâu hơn xét nước tốt trước
        bestA = cand[0].a;
      } catch (e) { if (e !== "time") throw e; break; }
      if (performance.now() > dl) break;
    }
    return bestA;
  }
  // 3-4 người: với mỗi nước ứng viên, các đối thủ lần lượt đáp lại bằng nước tốt nhất cho họ (round: 1 = chỉ người kế tiếp,
  // ≥1 vòng đầy đủ khi round > 0: cả vòng đối thủ, rồi round 2 thêm nước tiếp theo của mình); chọn nước mà sau đó mình còn tốt nhất
  let bv = -1e9, ba = cand[0].a;
  for (const m of cand) {
    const stack = [simDo(G, m.a)];
    let v, q = nextMover(G, p), end = q < 0;
    const steps = L.round ? G.n - 1 : 1;
    for (let k = 0; k < steps && !end && q !== p && performance.now() < dl; k++) {
      const rep = rateMoves(G, q)[0];
      stack.push(simDo(G, rep.a));
      q = nextMover(G, q); if (q < 0) end = true;
    }
    if (end) v = rel(evalPos(G.walls, G.pos, G.n, G.pp), p) * 10;
    else if (L.round === 2 && q === p) { const mine = rateMoves(G, p); v = mine.length ? mine[0].v : rel(evalPos(G.walls, G.pos, G.n, G.pp), p); }
    else v = rel(evalPos(G.walls, G.pos, G.n, G.pp), p);
    while (stack.length) simUndo(G, stack.pop());
    v += (rnd() - .5) * L.noise;
    if (v > bv) { bv = v; ba = m.a; }
  }
  return ba;
}
/* RULES-AI-END */

/* ============================================================
   TRẠNG THÁI CHUNG
   ============================================================ */
const PREFS_KEY = "wallgo.prefs";
const PREFS = { name: "", vs: "bot", bots: 1, levels: ["medium", "medium", "medium"], net: "create", botLv: "medium", id: "" };
try { Object.assign(PREFS, JSON.parse(localStorage.getItem(PREFS_KEY) || "{}")); } catch (e) {}
if (!PREFS.id) PREFS.id = Math.random().toString(36).slice(2, 12);
const LEVELS = ["easy", "medium", "hard"];
if (!Array.isArray(PREFS.levels)) PREFS.levels = [];
for (let i = 0; i < 3; i++) if (!LEVELS.includes(PREFS.levels[i])) PREFS.levels[i] = "medium";
if (![1, 2, 3].includes(PREFS.bots)) PREFS.bots = 1;
if (!LEVELS.includes(PREFS.botLv)) PREFS.botLv = "medium";
const savePrefs = () => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(PREFS)); } catch (e) {} };
savePrefs();   // lưu ngay mã người chơi (id): khách vào bằng link rồi tải lại trang vẫn lấy lại được ghế
const MAX_SEATS = 4;
const COLORS = ["#e5484d", "#3b7be0", "#23a25a", "#f0a01e"], SOFT = ["#fbd9d9", "#d6e4fa", "#d3f0de", "#fcecc8"];
const BOT_NAMES = ["Atlas", "Cleo", "Juno", "Milo", "Nova", "Otto", "Wren", "Basil", "Ivy", "Rook", "Luna", "Mason", "Hana", "Bảo", "Linh", "Khoa"];
const cleanName = s => String(s || "").replace(/[<>&"'`]/g, "").replace(/\s+/g, " ").trim().slice(0, 12);   // tên tối đa 12 ký tự (mọi game có đặt tên)
const myName = () => cleanName(PREFS.name) || tr("def_name");
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const cellName = c => "abcdefg"[c % 7] + (7 - Math.floor(c / 7));

let MODE = null;    // {kind: "bot" | "online"}
let T = null;       // ván thật: chỉ có ở máy giữ luật (đấu máy, chủ phòng online): {G, seats, log}
let V = null;       // góc nhìn để vẽ: {g, seats, me, log, code, mode, dlAt} (luật Wall Go không có gì giấu nên g là toàn bộ ván)
let ME = -1;        // người chơi của máy này (chỉ số theo thứ tự đi)
let played = false; // đã vào ván nào chưa (nút Huỷ của bảng chế độ thành "Xem lại Luật chơi" khi chưa)
let PENDING = -1;   // khách đã gửi nước ở lượt này, chờ chủ phòng xác nhận
const isHost = () => !!T;

function viewFor(p) {
  return {
    g: T.G, me: p, log: T.log.slice(-150), code: NET.code, mode: MODE.kind,
    seats: T.seats.map(s => ({ name: s.name, kind: s.kind, level: s.level || null, away: !!s.away })),
    left: HOST.deadline ? Math.max(0, HOST.deadline - performance.now()) : 0,
  };
}

/* ============================================================
   CHỦ BÀN: chạy luật, máy, đồng hồ (đấu máy, chủ phòng online)
   ============================================================ */
const HOST = { deadline: 0, dlKey: "", jobs: new Map() };
const TURN_MS = 90000;
const botSeat = p => T.seats[p].kind === "bot" || T.seats[p].away;
function job(key, ms, fn) { if (HOST.jobs.has(key)) return; HOST.jobs.set(key, setTimeout(() => { HOST.jobs.delete(key); fn(); }, ms)); }
function clearJobs() { for (const t of HOST.jobs.values()) clearTimeout(t); HOST.jobs.clear(); }
function hostUpdate() {
  if (!T) return;
  setDeadline();
  scheduleBots();
  if (MODE.kind === "online") broadcast();
  V = viewFor(ME); V.dlAt = HOST.deadline;
  render();
}
function scheduleBots() {
  const G = T.G;
  if (G.over || !botSeat(G.turn)) return;
  const p = G.turn, ply = G.ply;
  job(`b${ply}:${p}`, G.phase === "place" ? 450 + Math.random() * 350 : 600 + Math.random() * 450, () => {
    if (!T || T.G !== G || G.ply !== ply || G.over || G.turn !== p || !botSeat(p)) return;
    const s = T.seats[p], a = aiPick(G, s.kind === "bot" ? s.level : "medium");
    if (a) hostAct(p, a);
  });
}
function setDeadline() {
  const G = T.G;
  const key = MODE.kind === "online" && !G.over && !botSeat(G.turn) ? `${G.ply}:${G.turn}` : "";
  if (key !== HOST.dlKey) { HOST.dlKey = key; HOST.deadline = key ? performance.now() + TURN_MS : 0; }
}
// hết giờ (online): máy (mức ★★) đi hộ
function hostTick() {
  if (!T || !HOST.deadline || performance.now() < HOST.deadline) return;
  HOST.deadline = 0;
  const G = T.G;
  if (G.over) return;
  const p = G.turn, a = aiPick(G, "medium");
  T.log.push({ k: "auto", by: p, ply: G.ply });
  if (!a || !hostAct(p, a)) hostUpdate();
}
setInterval(hostTick, 250);
// một nước đi thật (người hoặc máy): kiểm luật, đi, ghi diễn biến
function hostAct(p, a) {
  const G = T.G;
  if (G.over || G.turn !== p || !isLegal(G, a)) return false;
  const L0 = lockedSet(G), mv0 = [];
  for (let q = 0; q < G.n; q++) mv0.push(hasMove(G, q, L0));
  apply(G, a);
  T.log.push({ ...G.last, ply: G.ply });
  if (a.k === "move") {
    const R = regions(G.walls, G.pos, G.pp), L1 = lockedSet(G, R), seen = new Set();
    G.pos.forEach((c, i) => {
      if (!L1[i] || L0[i]) return;
      const v = R.comp[c];
      if (!seen.has(v)) { seen.add(v); T.log.push({ k: "close", by: ownerOf(G, i), n: R.size[v], ply: G.ply }); }
    });
    // ai vừa chốt hết quân thì ghi một lần; ai bị bỏ lượt vì kẹt (bản II) thì ghi lúc bị bỏ qua
    if (!G.over) {
      const allLocked = q => [...Array(G.pp).keys()].every(k => L1[q * G.pp + k]);
      for (let q = 0; q < G.n; q++) if (mv0[q] && allLocked(q)) T.log.push({ k: "done", by: q, ply: G.ply });
      for (let q = (p + 1) % G.n; q !== G.turn; q = (q + 1) % G.n) if (!allLocked(q)) T.log.push({ k: "skip", by: q, ply: G.ply });
    }
  }
  if (G.over) T.log.push({ k: "over", ply: G.ply });
  if (T.log.length > 400) T.log.splice(0, T.log.length - 400);
  hostUpdate();
  return true;
}
function leaveAll() {
  clearJobs();
  netClose(true);
  T = null; V = null; MODE = null; ME = -1; PENDING = -1;
  HOST.deadline = 0; HOST.dlKey = "";
  overSeen = ""; lastPly = -1; lastOverSnd = "";
  for (const id of ["#mLobby", "#mNet"]) $(id).hidden = true;
  $("#gameover").hidden = true;
}
// seats: [{name, kind, level, id}] theo thứ tự phòng (ghế 0 là máy này). Bốc thăm thứ tự đi: người đi đầu cầm Đỏ.
function beginGame(seats) {
  const order = shuffle(seats.map((_, i) => i));
  T = { G: newGame(seats.length, VARIANT), seats: order.map(i => ({ ...seats[i], lob: i, away: false })), log: [] };
  ME = T.seats.findIndex(s => s.lob === 0);
  T.log.push({ k: "draw", ply: 0, names: T.seats.map(s => s.name) });
  played = true; overSeen = ""; lastPly = -1; lastOverSnd = "";
  resetSel();
  hostUpdate();
}
function startBotGame() {
  leaveAll();
  MODE = { kind: "bot" };
  const names = shuffle(BOT_NAMES.slice()).slice(0, PREFS.bots);
  beginGame([{ name: myName(), kind: "human" }].concat(names.map((n, i) => ({ name: n, kind: "bot", level: PREFS.levels[i] }))));
}

/* ============================================================
   CHƠI ONLINE (PeerJS, WebRTC P2P)
   Chủ phòng giữ luật, chạy máy và đồng hồ, gửi toàn bộ ván cho mọi khách sau mỗi nước (tin "st"; Wall Go không có thông tin ẩn).
   Khách chỉ gửi nước của mình ("act" kèm số nước n để bỏ tin cũ). Phòng chờ: chủ phòng gửi "lobby". Khách rớt mạng giữa ván thì
   máy chơi thay (away), mở lại link (cùng id lưu trong localStorage) là lấy lại ghế. Chủ phòng rời đi thì ván dừng.
   ============================================================ */
const NET_PROTO = 1;
const PEER_SRC = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
const PEER_SRI = "sha384-nlUQ8ZqCbvStErob+biJNzSgltf6urV3VGqhfIfzhmg9RXmpeRm76ELw0pYnKlTR";
const PEER_PREFIX = VARIANT === 2 ? "wallgo2-" : "wallgo-";   // hai bản dùng mã phòng riêng, không vào nhầm phòng của nhau
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", CODE_LEN = 5;
const NET = { role: null, peer: null, conn: null, code: "", gen: 0, lobby: [], started: false, got: false, lobbyView: null, seen: 0 };
const normCode = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LEN);
const newCode = () => Array.from({ length: CODE_LEN }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
const inviteLink = code => location.href.split("#")[0] + "#room=" + code;
const sendTo = (conn, d) => { if (conn && conn.open) try { conn.send(d); } catch (e) {} };
const netSend = d => sendTo(NET.conn, d);
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
function netClose(bye) {
  NET.gen++;
  if (bye) { if (NET.role === "host") for (const x of NET.lobby) sendTo(x.conn, { t: "bye" }); else netSend({ t: "bye" }); }
  const peer = NET.peer;
  NET.peer = NET.conn = null; NET.role = null; NET.code = ""; NET.lobby = []; NET.started = false; NET.got = false; NET.lobbyView = null;
  if (peer) setTimeout(() => { try { peer.destroy(); } catch (e) {} }, bye ? 400 : 0);
}
function netFail(key, arg, retryCode) {
  const wasGuest = NET.role === "guest";
  netClose(false);
  clearJobs(); T = null; V = null; MODE = null;
  $("#mLobby").hidden = true; $("#gameover").hidden = true;
  $("#netTitle").textContent = tr("n_title_err");
  $("#netMsg").textContent = tr(key, arg);
  $("#netRetry").hidden = !(wasGuest && retryCode);
  $("#netRetry").onclick = () => { $("#mNet").hidden = true; startGuest(retryCode); };
  $("#mNet").hidden = false;
  render();
}
/* --- chủ phòng --- */
async function startHost() {
  leaveAll();
  MODE = { kind: "online" };
  const gen = ++NET.gen;
  NET.role = "host"; NET.started = false;
  NET.lobby = [{ id: PREFS.id, name: myName(), kind: "human", conn: null }];
  showLobby();
  try { await loadPeer(); } catch (e) { if (gen === NET.gen) netFail("n_err_lib"); return; }
  if (gen === NET.gen) hostOpenPeer(gen, 0);
}
function hostOpenPeer(gen, tries) {
  const code = newCode(), peer = new Peer(PEER_PREFIX + code);
  NET.peer = peer;
  peer.on("open", () => { if (gen !== NET.gen) return; NET.code = code; if (!NET.started) showLobby(); else render(); });
  peer.on("connection", conn => {
    if (gen !== NET.gen) return;
    conn.on("data", d => { if (gen === NET.gen) hostData(conn, d); });
    conn.on("close", () => { if (gen === NET.gen) hostLost(conn); });
    conn.on("error", () => { if (gen === NET.gen) hostLost(conn); });
  });
  peer.on("disconnected", () => { if (gen === NET.gen && !peer.destroyed) setTimeout(() => { if (gen === NET.gen && !peer.destroyed) try { peer.reconnect(); } catch (e) {} }, 1500); });
  peer.on("error", e => {
    if (gen !== NET.gen) return;
    if (e.type === "unavailable-id" && tries < 3) { try { peer.destroy(); } catch (x) {} hostOpenPeer(gen, tries + 1); return; }
    if (!NET.code) netFail("n_err_net", e.type || String(e)); else console.warn("PeerJS:", e.type, e);
  });
}
const pOfLob = i => T ? T.seats.findIndex(s => s.lob === i) : -1;
function hostData(conn, d) {
  if (!d || typeof d !== "object") return;
  const seenAt = NET.lobby.find(x => x.conn === conn);
  if (seenAt) seenAt.seen = performance.now();
  if (d.t === "ping") return;
  if (d.t === "hello") {
    if (d.v !== NET_PROTO) { sendTo(conn, { t: "err", code: "version" }); setTimeout(() => conn.close(), 400); return; }
    const id = String(d.id || "").slice(0, 24), name = cleanName(d.name) || tr("def_name");
    const i = NET.lobby.findIndex((x, k) => k > 0 && x.kind === "human" && x.id === id);
    if (i > 0) {   // người cũ quay lại (tải lại trang, rớt mạng)
      NET.lobby[i].conn = conn; NET.lobby[i].seen = performance.now();
      if (!NET.started) { NET.lobby[i].name = name; lobbyUpdate(); }
      else if (T) { const p = pOfLob(i); if (p >= 0 && T.seats[p].away) { T.seats[p].away = false; T.log.push({ k: "back", by: p, ply: T.G.ply }); } hostUpdate(); }
      return;
    }
    if (NET.started) { sendTo(conn, { t: "err", code: "started" }); setTimeout(() => conn.close(), 400); return; }
    if (NET.lobby.length >= MAX_SEATS) { sendTo(conn, { t: "err", code: "full" }); setTimeout(() => conn.close(), 400); return; }
    NET.lobby.push({ id, name, kind: "human", conn, seen: performance.now() });
    lobbyUpdate();
    return;
  }
  const i = NET.lobby.findIndex(x => x.conn === conn);
  if (i <= 0) return;
  if (d.t === "bye") return hostLost(conn);
  if (d.t === "act" && T && d.a && typeof d.a === "object") {
    const p = pOfLob(i);
    if (p < 0 || d.n !== T.G.ply || !hostAct(p, cleanAct(d.a))) sendTo(conn, { t: "st", v: viewFor(p) });   // nước cũ hoặc sai: gửi lại ván để khách mở khoá
  }
}
const cleanAct = a => a.k === "place" ? { k: "place", c: Number(a.c) } : { k: "move", i: Number(a.i), b: Number(a.b), to: Number(a.to), w: Number(a.w) };
function hostLost(conn) {
  const i = NET.lobby.findIndex(x => x.conn === conn);
  if (i <= 0) return;
  NET.lobby[i].conn = null;
  try { conn.close(); } catch (e) {}
  if (!NET.started) { NET.lobby.splice(i, 1); lobbyUpdate(); return; }
  const p = pOfLob(i);
  if (T && p >= 0 && !T.seats[p].away && !T.G.over) { T.seats[p].away = true; T.log.push({ k: "away", by: p, ply: T.G.ply }); hostUpdate(); }
}
function lobbyUpdate() {
  showLobby();
  NET.lobby.forEach((x, i) => { if (i > 0) sendTo(x.conn, { t: "lobby", code: NET.code, seats: lobbySeats(), you: i }); });
}
const lobbySeats = () => NET.lobby.map(x => ({ name: x.name, kind: x.kind, level: x.level || null }));
function showLobby() {
  if (NET.role === "host") renderLobby({ code: NET.code, seats: lobbySeats(), you: 0, host: true });
  else if (NET.lobbyView) renderLobby({ ...NET.lobbyView, host: false });
  $("#mLobby").hidden = false;
}
function hostStart() {
  if (NET.role !== "host" || NET.started || NET.lobby.length < 2) return;
  NET.started = true;
  $("#mLobby").hidden = true;
  beginGame(NET.lobby.map(x => ({ name: x.name, kind: x.kind, level: x.level || "medium", id: x.id })));
}
function hostToLobby() {   // hết ván: về phòng chờ để chơi ván mới (bỏ ghế của người đã rời)
  clearJobs();
  NET.started = false; T = null; V = null; ME = -1;
  NET.lobby = NET.lobby.filter((x, i) => i === 0 || x.kind === "bot" || x.conn);
  HOST.deadline = 0; HOST.dlKey = "";
  $("#gameover").hidden = true;
  lobbyUpdate(); render();
}
function broadcast() {
  NET.lobby.forEach((x, i) => { if (i > 0 && x.conn) sendTo(x.conn, { t: "st", v: viewFor(pOfLob(i)) }); });
}
/* Nhịp tim: WebRTC nhiều khi không báo khi máy bên kia đóng tab, nên hai bên gửi "ping" mỗi 3 giây;
   im lặng quá 10 giây (chủ phòng) / 12 giây (khách) thì coi như rớt mạng. */
setInterval(() => {
  const now = performance.now();
  if (NET.role === "host") NET.lobby.forEach((x, i) => {
    if (i === 0 || !x.conn) return;
    if (x.seen && now - x.seen > 10000) hostLost(x.conn); else sendTo(x.conn, { t: "ping" });
  });
  else if (NET.role === "guest" && NET.got) {
    if (now - NET.seen > 12000) netFail("n_err_lost", null, NET.code); else netSend({ t: "ping" });
  }
}, 3000);
/* --- khách --- */
async function startGuest(code) {
  leaveAll();
  MODE = { kind: "online" };
  const gen = ++NET.gen;
  NET.role = "guest"; NET.code = code;
  $("#netTitle").textContent = tr("n_title_guest", code); $("#netMsg").textContent = tr("n_joining", code);
  $("#netRetry").hidden = true; $("#mNet").hidden = false;
  try { await loadPeer(); } catch (e) { if (gen === NET.gen) netFail("n_err_lib"); return; }
  if (gen !== NET.gen) return;
  const peer = new Peer(); NET.peer = peer;
  peer.on("open", () => {
    if (gen !== NET.gen) return;
    const conn = peer.connect(PEER_PREFIX + code, { reliable: true });
    NET.conn = conn;
    conn.on("open", () => { if (gen === NET.gen) conn.send({ t: "hello", v: NET_PROTO, id: PREFS.id, name: myName() }); });
    conn.on("data", d => { if (gen === NET.gen) guestData(d); });
    conn.on("close", () => { if (gen === NET.gen) netFail("n_err_lost", null, code); });
    conn.on("error", () => { if (gen === NET.gen) netFail("n_err_lost", null, code); });
    setTimeout(() => { if (gen === NET.gen && !NET.got) netFail("n_err_timeout", null, code); }, 20000);
  });
  peer.on("error", e => {
    if (gen !== NET.gen) return;
    if (e.type === "peer-unavailable") netFail("n_err_nopeer", code);
    else if (!NET.got) netFail("n_err_net", e.type || String(e), code);
    else console.warn("PeerJS:", e.type, e);
  });
}
function guestData(d) {
  if (!d || typeof d !== "object") return;
  NET.got = true; NET.seen = performance.now();
  if (d.t === "ping") return;
  if (d.t === "lobby") {
    NET.lobbyView = { code: NET.code, seats: d.seats, you: d.you };
    V = null; ME = -1; $("#mNet").hidden = true; $("#gameover").hidden = true; overSeen = "";
    showLobby(); render();
  } else if (d.t === "st" && d.v && d.v.g) {
    $("#mLobby").hidden = true; $("#mNet").hidden = true;
    played = true;
    V = d.v; V.dlAt = V.left ? performance.now() + V.left : 0; ME = V.me; PENDING = -1;
    render();
  } else if (d.t === "err") netFail({ full: "n_err_full", started: "n_err_started", version: "n_err_version", kicked: "n_err_kicked" }[d.code] || "n_err_net", d.code);
  else if (d.t === "bye") netFail("n_err_hostleft");
}
// nước của mình: máy giữ luật đi luôn, khách gửi cho chủ phòng
function doAct(a) {
  if (isHost()) { hostAct(ME, a); return; }
  if (!V) return;
  PENDING = V.g.ply;
  netSend({ t: "act", a, n: V.g.ply });
  render();
}

/* ============================================================
   VẼ
   ============================================================ */
const SEL = { i: -1, b: -1, to: -1, ply: -1 };
function resetSel() { SEL.i = -1; SEL.b = -1; SEL.to = -1; SEL.ply = V && V.g ? V.g.ply : -1; }
let overSeen = "", lastPly = -1, lastOverSnd = "", builtFor = "";
const myTurn = () => !!(V && V.g && !V.g.over && ME >= 0 && V.g.turn === ME && !(V.seats[ME] && V.seats[ME].away) && PENDING !== V.g.ply);
const colName = p => tr("col" + p);
const pName = p => V && V.seats[p] ? (p === ME ? tr("you") : V.seats[p].name) : "?";
const HAMMER = '<svg class="hm" viewBox="0 0 24 24"><path d="M14.5 3.5l6 6-2.5 2.5-2-2-7.5 7.5-3-3L13 7l-1-1z" fill="#e5484d" stroke="#8a1c20" stroke-width="1.4" stroke-linejoin="round"/><path d="M5.5 16.5l-2.5 2.5 2 2 2.5-2.5" fill="none" stroke="#6e6152" stroke-width="2" stroke-linecap="round"/></svg>';

function buildBoard() {
  const G = V && V.g, np = G ? G.pos.length : 0, key = String(np);
  if (builtFor === key) return;
  builtFor = key;
  let h = "";
  for (let c = 0; c < NC; c++) h += `<div class="tile" data-c="${c}" style="--r:${Math.floor(c / 7)};--c:${c % 7}"></div>`;
  for (let e = 0; e < NE; e++) {
    const hz = e < 42, r = hz ? Math.floor(e / 7) : Math.floor((e - 42) / 6), c = hz ? e % 7 : (e - 42) % 6;
    h += `<div class="wall ${hz ? "h" : "v"}" data-e="${e}" style="--r:${r};--c:${c}"></div>`;
  }
  for (let i = 0; i < np; i++) h += `<div class="pc" data-i="${i}" hidden><i></i></div>`;
  for (let c = 0; c < 7; c++) h += `<span class="lbl" style="left:calc(${c} * var(--cell));top:calc(7 * var(--cell) + var(--gap) / 2);width:var(--cell);height:calc(var(--pad) - var(--gap) / 2)">${"abcdefg"[c]}</span>`;
  for (let r = 0; r < 7; r++) h += `<span class="lbl" style="left:calc(-1 * var(--pad));top:calc(${r} * var(--cell));width:calc(var(--pad) - var(--gap) / 2);height:var(--cell)">${7 - r}</span>`;
  $("#grid").innerHTML = h;
}

// những gì người chơi trên máy này đang chọn được
function uiState() {
  const G = V && V.g, S = { place: false, movable: [], reach: [], wopts: [], bopts: [] };
  if (!G || SEL.ply !== G.ply) resetSel();
  if (!myTurn()) return S;
  if (G.phase === "place") { S.place = true; return S; }
  const L = lockedSet(G);
  for (let k = 0; k < G.pp; k++) { const i = ME * G.pp + k; if (!L[i] && pieceCanAct(G, i)) S.movable.push(i); }
  if (SEL.i < 0 && S.movable.length === 1) SEL.i = S.movable[0];
  if (SEL.i >= 0) {
    S.bopts = breakOpts(G, SEL.i);
    S.reach = reach(G, SEL.i, SEL.b).filter(c => wallOptsUI(G, c).length);
    if (SEL.to >= 0 && !S.reach.includes(SEL.to)) SEL.to = -1;
    if (SEL.to >= 0) S.wopts = wallOptsUI(G, SEL.to);
  }
  return S;
}
// cạnh dựng được (bỏ cạnh vừa phá, để bấm lại tường đó là thôi phá chứ không dựng lại)
// cạnh dựng được (kể cả dựng lại đúng chỗ vừa phá: ô tới có thể chỉ còn cạnh đó, ví dụ chui vào ô 1 ô rồi đóng lại)
const wallOptsUI = (G, c) => wallOpts(G, c, SEL.b);

function render() {
  buildBoard();
  const G = V && V.g, S = uiState();
  renderBoard(G, S);
  renderPlayers(G);
  renderStatus(G, S);
  renderLog();
  renderOver(G);
  sounds(G);
}
function renderBoard(G, S) {
  const grid = $("#grid");
  grid.style.setProperty("--mc", ME >= 0 ? COLORS[ME] : "#888");
  grid.style.setProperty("--ms", ME >= 0 ? SOFT[ME] : "#eee");
  const tiles = grid.children;
  const own = G ? territory(G) : null;
  grid.classList.toggle("ghost-sq", !!(S.place && G.kind[nextFree(G, ME)] === "s"));
  const last = G && G.last, reachSet = new Set(S.reach);
  const cur = G && SEL.i >= 0 && myTurn() ? (SEL.to >= 0 ? SEL.to : G.pos[SEL.i]) : -1;   // ô của quân đang đi
  for (let c = 0; c < NC; c++) {
    let cls = "tile";
    if (G) {
      const o = own[c];
      if (o >= 0) cls += ` own p${o}`; else if (o === -2) cls += " dead";
      if (S.place && !G.pos.includes(c)) cls += " place";
      if (reachSet.has(c)) cls += " tgt" + (c === SEL.to ? " on" : "");
      if (c === cur) cls += " cur";
      if (S.movable.length && G.pos.includes(c) && S.movable.includes(G.pos.indexOf(c))) cls += " can";
    }
    if (tiles[c].className !== cls) tiles[c].className = cls;
  }
  for (let e = 0; e < NE; e++) {
    const el = tiles[NC + e];
    let cls = "wall " + (e < 42 ? "h" : "v");
    if (G) {
      const w = G.walls[e];
      if (w) cls += ` on p${w - 1}` + (last && last.k === "move" && last.w === e ? " new" : "") + (e === SEL.b ? " broken" : "");
      if (S.wopts.includes(e)) cls += " can";
      if (SEL.to < 0 && (S.bopts.includes(e) || e === SEL.b)) cls += " brk";   // đã chọn ô tới thì tường vừa phá thành chỗ dựng được
    }
    if (el.className !== cls) el.className = cls;
  }
  if (!G) { for (let i = NC + NE; i < tiles.length; i++) if (tiles[i].classList.contains("pc")) tiles[i].hidden = true; return; }
  const L = lockedSet(G);
  for (let i = 0; i < G.pos.length; i++) {
    const el = tiles[NC + NE + i];
    if (!el) continue;
    let c = G.pos[i];
    if (i === SEL.i && SEL.to >= 0) c = SEL.to;
    el.hidden = c < 0;
    if (c < 0) continue;
    const p = ownerOf(G, i);
    let cls = `pc p${p}` + (G.kind[i] === "s" ? " sq" : "");
    if (last && (last.k === "move" ? last.i === i : last.c === G.pos[i])) cls += (last.k === "place" ? " new" : "") + " last" + (last.by === ME ? "" : " theirs");
    if (i === SEL.i) cls += " sel";
    else if (S.movable.includes(i) && SEL.i < 0) cls += " can";
    if (L[i] && G.phase !== "place") cls += " lock";
    if (el.className !== cls) el.className = cls;
    el.style.setProperty("--r", Math.floor(c / 7)); el.style.setProperty("--c", c % 7);
  }
}
function fmtTag(n) { return tr("fmt" + n); }
function renderPlayers(G) {
  $("#fmtTag").textContent = G ? fmtTag(G.n) : "";
  if (!G) { $("#plist").innerHTML = ""; $("#info").textContent = tr("st_idle"); return; }
  const { sc } = scoreOf(G), L = lockedSet(G);
  $("#plist").innerHTML = V.seats.map((s, p) => {
    const active = !G.over && G.turn === p;
    let sub = s.away ? tr("s_away") : s.kind === "bot" ? tr("s_bot", tr("lv_" + (s.level || "medium"))) : tr("s_human");
    if (G.phase === "move" && !G.over && !hasMove(G, p, L)) sub = tr([...Array(G.pp).keys()].every(k => L[p * G.pp + k]) ? "s_done" : "s_stuck");
    const brk = G.brk ? `<i title="${tr(G.brkLeft[p] ? "s_brk" : "s_brk_used")}">${HAMMER.replace('class="hm"', `class="hm${G.brkLeft[p] ? "" : " used"}"`)}</i>` : "";
    let bar = "";
    if (active && V.dlAt) { const left = Math.max(0, V.dlAt - performance.now()); bar = `<i class="bar${left < 15000 ? " low" : ""}" style="width:100%;transform:scaleX(${(left / TURN_MS).toFixed(3)})"></i>`; }
    return `<li class="p${p}${active ? " active" : ""}"><span class="tok"></span><span class="nm"><b>${escH(s.name)}${p === ME ? tr("n_you") : ""}${brk}</b><span>${colName(p)} · ${sub}</span></span>
      <span class="pts"><b>${sc[p]}</b><span>${tr("s_cells")}</span></span>${bar}</li>`;
  }).join("");
  $("#info").innerHTML = (V.mode === "online" ? tr("i_online", V.code || NET.code) + "<br>" + tr("i_time") : tr("i_bot"));
}
function renderStatus(G, S) {
  const dot = $("#stDot"), st = $("#statusText"), ctl = $("#ctl");
  let txt = "", p = -1, think = false, btn = "";
  if (!G) txt = tr("st_idle");
  else if (G.over) { txt = tr("st_over"); }
  else {
    p = G.turn;
    if (myTurn()) {
      if (G.phase === "place") txt = tr("st_place", G.pos.slice(ME * G.pp, ME * G.pp + G.pp).filter(c => c < 0).length, tr("k_" + G.kind[nextFree(G, ME)]));
      else if (SEL.i < 0) txt = tr("st_pick");
      else if (SEL.to < 0) txt = (SEL.b >= 0 ? tr("st_broke") + " " : "") + tr("st_dest") + (S.bopts.length && SEL.b < 0 ? tr("st_dest_brk") : "");
      else txt = tr("st_wall");
      if (G.phase === "move" && SEL.i >= 0) {
        if (SEL.to < 0 && G.v !== 2) btn += `<button class="btn sm" data-c="stay">${tr("c_stay")}</button>`;
        if (S.movable.length > 1 || SEL.to >= 0 || SEL.b >= 0) btn += `<button class="btn sm" data-c="cancel">${tr("c_cancel")}</button>`;
      }
    } else { txt = tr(G.phase === "place" ? "st_wait_place" : "st_wait", escH(V.seats[p] ? V.seats[p].name : "?")); think = true; }
  }
  if (st.innerHTML !== txt) st.innerHTML = txt;
  if (ctl.innerHTML !== btn) ctl.innerHTML = btn;
  dot.className = (p >= 0 ? "p" + p : "") + (think ? " think" : "");
  dot.style.visibility = p >= 0 ? "visible" : "hidden";
  updateTimer();
}
function updateTimer() {
  const el = $("#timer");
  if (!V || !V.dlAt || !V.g || V.g.over) { if (el.textContent) el.textContent = ""; return; }
  const left = Math.max(0, V.dlAt - performance.now()), s = Math.ceil(left / 1000);
  const t = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  if (el.textContent !== t) { el.textContent = t; if (myTurn() && s <= 10 && s > 0) sfx("tick"); }
  el.classList.toggle("low", s <= 15);
  const bar = $("#plist .bar");
  if (bar) { bar.style.transform = `scaleX(${(left / TURN_MS).toFixed(3)})`; bar.classList.toggle("low", s <= 15); }
}
setInterval(updateTimer, 250);
function logLine(e) {
  const n = p => escH(V.seats[p] ? V.seats[p].name : "?");
  switch (e.k) {
    case "draw": return [-1, tr("l_draw", e.names.map((x, p) => `${colName(p)} ${escH(x)}`).join(", "))];
    case "place": return [e.by, tr("l_place", n(e.by), cellName(e.c))];
    case "move": {
      const d = [0, 1, 2, 3].find(d => EDGE[e.to * 4 + d] === e.w), wd = tr("d" + d);
      const s = e.from === e.to ? tr("l_stay", n(e.by), cellName(e.to), wd) : tr("l_move", n(e.by), cellName(e.from), cellName(e.to), wd);
      return [e.by, e.b >= 0 ? tr("l_brk", n(e.by), cellName(e.from)) + "; " + s.replace(n(e.by) + ": ", "") : s];
    }
    case "close": return [e.by, tr("l_close", n(e.by), e.n)];
    case "done": return [e.by, tr("l_done", n(e.by))];
    case "skip": return [e.by, tr("l_skip", n(e.by))];
    case "auto": return [e.by, tr("l_auto", n(e.by))];
    case "away": return [e.by, tr("l_away", n(e.by))];
    case "back": return [e.by, tr("l_back", n(e.by))];
    case "over": return [-1, tr("l_over")];
  }
  return [-1, ""];
}
function renderLog() {
  const el = $("#log");
  const log = V ? V.log : [], sig = LANG + ":" + log.length + ":" + (log.length ? log[log.length - 1].ply + log[log.length - 1].k : "");
  if (el._sig === sig) return;
  el._sig = sig;
  el.innerHTML = log.map(e => { const [p, s] = logLine(e); return `<li class="${p >= 0 ? "p" + p : "sys"}">${p >= 0 ? '<span class="d"></span>' : ""}<span>${s}</span></li>`; }).join("");
  el.scrollTop = el.scrollHeight;
}
function renderOver(G) {
  const box = $("#gameover");
  if (!G || !G.over) { box.hidden = true; return; }
  const key = (V.code || "") + ":" + G.ply + ":" + G.over.sc.join(",");
  if (overSeen === key) { box.hidden = true; return; }
  const O = G.over, w = O.winners, meWin = w.includes(ME);
  $("#goTitle").textContent = meWin ? (w.length === 1 ? tr("o_win") : tr("o_tie")) : w.length === 1 ? tr("o_won", V.seats[w[0]].name) : tr("o_tie");
  const top = O.ord[0], second = O.ord[1];
  let sub = meWin && w.length > 1 ? tr("o_tie_with") : !meWin && ME >= 0 ? tr("o_lose", O.rank[ME]) : "";
  if (second != null && O.sc[top] === O.sc[second] && O.big[top] !== O.big[second]) sub = (sub ? sub + ". " : "") + tr("o_tiebreak");
  $("#goSub").textContent = sub;
  $("#goList").innerHTML = O.ord.map(p => `<li class="p${p}${p === ME ? " me" : ""}"><span class="pl">${O.rank[p]}</span><span class="tok" style="width:22px;height:22px;border-radius:50%;flex:none;background:var(--pc);border:2.5px solid var(--pd)"></span>
    <b>${escH(V.seats[p].name)}${p === ME ? tr("n_you") : ""}<small>${tr("o_big", O.big[p])}</small></b><span class="sc">${tr("o_cells", O.sc[p])}</span></li>`).join("");
  const guest = V.mode === "online" && !isHost();
  $("#goAgain").hidden = guest;
  $("#goAgain").textContent = V.mode === "online" ? tr("o_newroom") : tr("o_again");
  $("#goLeave").hidden = !guest;
  $("#goNote").textContent = guest ? tr("o_wait") : "";
  box.hidden = false;
}
function sounds(G) {
  if (!G) { lastPly = -1; return; }
  if (lastPly >= 0 && G.ply > lastPly) {
    const L = G.last;
    if (L) {
      if (L.k === "place") sfx("place");
      else { sfx("wall"); if (L.b >= 0) sfx("break"); }
    }
    if (V.log.some(e => e.k === "close" && e.ply > lastPly)) setTimeout(() => sfx("close"), 180);
    if (myTurn()) setTimeout(() => sfx("turn"), 250);
  }
  lastPly = G.ply;
  if (G.over) {
    const k = G.ply + ":" + G.over.sc.join(",");
    if (lastOverSnd !== k) { lastOverSnd = k; setTimeout(() => sfx(G.over.winners.includes(ME) ? "win" : "lose"), 450); }
  }
}

/* ---------- THAO TÁC ---------- */
$("#grid").addEventListener("click", e => {
  if (!myTurn()) return;
  const G = V.g;
  const w = e.target.closest(".wall");
  if (w) {
    const ed = +w.dataset.e;
    if (w.classList.contains("can") && SEL.i >= 0 && SEL.to >= 0) { doAct({ k: "move", i: SEL.i, b: SEL.b, to: SEL.to, w: ed }); return; }
    if (w.classList.contains("brk") && SEL.i >= 0) { SEL.b = SEL.b === ed ? -1 : ed; SEL.to = -1; if (SEL.b >= 0) sfx("break"); render(); return; }
  }
  const t = e.target.closest(".tile");
  if (!t) return;
  const c = +t.dataset.c;
  if (G.phase === "place") { if (!G.pos.includes(c)) doAct({ k: "place", c }); return; }
  if (SEL.i >= 0) {
    const start = G.pos[SEL.i];
    if (c === SEL.to) { SEL.to = -1; render(); return; }               // bấm lại ô đích: thôi chọn ô đích
    if (c === start) {                                                 // bấm ô của quân: đứng yên (bản II không được đứng yên: bỏ chọn)
      if (G.v !== 2) SEL.to = start; else if (uiState().movable.length > 1) { SEL.i = -1; SEL.b = -1; }
      render(); return;
    }
    if (uiState().reach.includes(c)) { SEL.to = c; sfx("move"); render(); return; }
  }
  const pi = G.pos.indexOf(c);
  if (pi >= 0 && ownerOf(G, pi) === ME && !lockedSet(G)[pi]) { SEL.i = pi; SEL.b = -1; SEL.to = -1; render(); return; }
  if (SEL.i >= 0) { SEL.i = -1; SEL.b = -1; SEL.to = -1; render(); }
});
$("#ctl").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b || !myTurn() || SEL.i < 0) return;
  if (b.dataset.c === "stay") SEL.to = V.g.pos[SEL.i];
  else { SEL.i = -1; SEL.b = -1; SEL.to = -1; }
  render();
});

/* ---------- HÌNH MINH HOẠ TRONG LUẬT CHƠI ---------- */
function figSVG(o) {
  const n = 4, s = 30, pd = 6, W = n * s + pd * 2, X = c => pd + c * s, Y = r => pd + r * s, col = { r: COLORS[0], b: COLORS[1] }, dk = { r: "#a8262b", b: "#1f4fa3" };
  let h = `<svg viewBox="0 0 ${W} ${W}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${W}" rx="9" fill="#38405a"/>`;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const tint = (o.tint || []).some(([a, b]) => a === r && b === c);
    h += `<rect x="${X(c) + 2}" y="${Y(r) + 2}" width="${s - 4}" height="${s - 4}" rx="5" fill="${tint ? "#fbd9d9" : "#f4efe4"}"/>`;
  }
  const wl = ([r, c, k, cl, extra], sw = 4.5) => {
    const [x1, y1, x2, y2] = k === "h" ? [X(c) + 1, Y(r + 1), X(c + 1) - 1, Y(r + 1)] : [X(c + 1), Y(r) + 1, X(c + 1), Y(r + 1) - 1];
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${cl === "x" ? "#e5322b" : cl === "g" ? "#ffc928" : col[cl]}" stroke-width="${sw}" stroke-linecap="round"${extra || ""}/>`;
  };
  (o.walls || []).forEach(w => { h += wl(w); });
  (o.broken || []).forEach(([r, c, k]) => { h += wl([r, c, k, "x", ' stroke-dasharray="3 4" opacity=".8"']); });
  if (o.path) h += `<polyline points="${o.path.map(([r, c]) => `${X(c) + s / 2},${Y(r) + s / 2}`).join(" ")}" fill="none" stroke="#ffc928" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round"/>`;
  (o.ghost || []).forEach(([r, c, cl, sq]) => { h += sq ? `<rect x="${X(c) + s / 2 - 8}" y="${Y(r) + s / 2 - 8}" width="16" height="16" rx="4" fill="${col[cl]}" opacity=".28"/>` : `<circle cx="${X(c) + s / 2}" cy="${Y(r) + s / 2}" r="8" fill="${col[cl]}" opacity=".28"/>`; });
  (o.pieces || []).forEach(([r, c, cl, sq]) => { h += sq ? `<rect x="${X(c) + s / 2 - 8.5}" y="${Y(r) + s / 2 - 8.5}" width="17" height="17" rx="4" fill="${col[cl]}" stroke="${dk[cl]}" stroke-width="2.2"/>` : `<circle cx="${X(c) + s / 2}" cy="${Y(r) + s / 2}" r="8.5" fill="${col[cl]}" stroke="${dk[cl]}" stroke-width="2.2"/>`; });
  (o.newWalls || []).forEach(w => { h += wl([w[0], w[1], w[2], "g", ' opacity=".85"'], 9) + wl(w); });   // tường vừa dựng: viền vàng
  if (o.label) h += `<text x="${o.label[0]}" y="${o.label[1]}" font-family="Baloo 2, sans-serif" font-weight="800" font-size="20" fill="#a8262b" text-anchor="middle">${o.label[2]}</text>`;
  return h + "</svg>";
}
function renderFigs() {
  if (VARIANT === 2) {
    const g1 = figSVG({ walls: [[0, 2, "v", "b"], [3, 1, "h", "b"]], ghost: [[2, 0, "r", 1]], path: [[2, 0], [2, 1], [2, 2]], pieces: [[2, 2, "r", 1], [0, 0, "b"]], newWalls: [[1, 2, "h", "r"]] });
    const g2 = figSVG({ walls: [[0, 3, "h", "b"], [2, 2, "v", "b"]], ghost: [[3, 0, "r"]], path: [[3, 0], [2, 0], [2, 1]], pieces: [[2, 1, "r"], [0, 3, "b", 1]], newWalls: [[1, 1, "h", "r"]] });
    const g3 = figSVG({ walls: [[2, 3, "h", "b"], [3, 2, "v", "r"]], broken: [[1, 0, "v"]], ghost: [[1, 0, "r", 1]], path: [[1, 0], [1, 1], [1, 2]], pieces: [[1, 2, "r", 1], [3, 0, "b"]], newWalls: [[1, 2, "h", "r"]] });
    $("#ruleFigs").innerHTML = [[g1, "f1"], [g2, "f2"], [g3, "f3"]].map(([svg, k]) => `<div class="fig">${svg}<div><b>${tr(k + "_h")}</b><span>${tr(k + "_p")}</span></div></div>`).join("");
    return;
  }
  const f1 = figSVG({ walls: [[0, 2, "v", "b"], [2, 2, "h", "b"]], ghost: [[2, 0, "r"]], path: [[2, 0], [2, 1], [1, 1]], pieces: [[1, 1, "r"], [3, 3, "b"]], newWalls: [[1, 1, "v", "r"]] });
  const f2 = figSVG({ tint: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]], walls: [[1, 0, "h", "r"], [1, 1, "h", "r"], [1, 2, "h", "b"], [0, 2, "v", "r"], [1, 2, "v", "b"]], pieces: [[0, 0, "r"], [3, 2, "b"]], label: [51, 59, "6"] });
  const f3 = figSVG({ walls: [[0, 1, "h", "r"], [2, 3, "h", "b"]], broken: [[1, 1, "v"]], ghost: [[1, 1, "r"]], path: [[1, 1], [1, 2], [1, 3]], pieces: [[1, 3, "r"], [3, 0, "b"]], newWalls: [[1, 3, "h", "r"]] });
  $("#ruleFigs").innerHTML = [[f1, "f1"], [f2, "f2"], [f3, "f3"]].map(([svg, k]) => `<div class="fig">${svg}<div><b>${tr(k + "_h")}</b><span>${tr(k + "_p")}</span></div></div>`).join("");
}

/* ============================================================
   BẢNG CHỌN CHẾ ĐỘ, PHÒNG CHỜ, CHỮ
   ============================================================ */
function syncModeUI() {
  $$("#segVs button").forEach(b => b.classList.toggle("on", b.dataset.v === PREFS.vs));
  $$("#segBots button").forEach(b => { b.classList.toggle("on", +b.dataset.v === PREFS.bots); b.textContent = tr("m_bots_n", +b.dataset.v + 1); });
  $("#fmtNote").textContent = tr("fmtn" + (PREFS.bots + 1));
  $("#botLevels").innerHTML = PREFS.levels.slice(0, PREFS.bots).map((l, i) => `<div class="lvrow"><span>${tr("m_bot_n", i + 1)}</span><div class="seg small">${LEVELS.map(x => `<button data-i="${i}" data-v="${x}" class="${x === l ? "on" : ""}">${tr("lv_" + x)}</button>`).join("")}</div></div>`).join("");
  $("#levelNote").innerHTML = LEVELS.map(x => tr("lvn_" + x)).join("<br>");
  $$("#segNet button").forEach(b => b.classList.toggle("on", b.dataset.v === PREFS.net));
  $("#botOpts").hidden = PREFS.vs !== "bot";
  $("#netOpts").hidden = PREFS.vs !== "online";
  $("#joinCode").hidden = PREFS.net !== "join";
  $("#modeCancel").textContent = played ? tr("cancel") : tr("m_back");
}
function openMode() { $("#myName").value = cleanName(PREFS.name); syncModeUI(); $("#mMode").hidden = false; }
function modeStart() {
  PREFS.name = cleanName($("#myName").value); savePrefs();
  if (PREFS.vs === "bot") { $("#mMode").hidden = true; startBotGame(); return; }
  if (PREFS.net === "create") { $("#mMode").hidden = true; startHost(); return; }
  const code = normCode($("#joinCode").value);
  if (code.length !== CODE_LEN) { $("#joinCode").focus(); $("#joinCode").placeholder = tr("n_err_code"); return; }
  $("#mMode").hidden = true; startGuest(code);
}
function renderLobby(L) {
  $("#lobbyTitle").textContent = L.host ? tr("n_title_host") : tr("n_title_guest", L.code || NET.code);
  $("#lobbyCode").hidden = !L.code;
  if (L.code) { $("#netCode").textContent = L.code; $("#netLink").value = inviteLink(L.code); }
  const seats = L.seats || [];
  let h = seats.map((s, i) => `<li><span class="av">${escH((s.name || "?").charAt(0).toUpperCase())}</span><b>${escH(s.name)}${i === L.you ? tr("n_you") : ""}</b>
    ${s.kind === "bot" && L.host ? `<button class="lv" data-lv="${i}" title="${tr("n_lv_tip")}">${tr("n_bot", tr("lv_" + (s.level || "medium")))}</button>` : `<small>${i === 0 ? tr("n_host") : s.kind === "bot" ? tr("n_bot", tr("lv_" + (s.level || "medium"))) : tr("n_human")}</small>`}${L.host && i > 0 ? `<button data-rm="${i}" aria-label="x">×</button>` : ""}</li>`).join("");
  for (let i = seats.length; i < MAX_SEATS; i++) h += `<li class="empty">${tr("n_empty")}</li>`;
  $("#lobbySeats").innerHTML = h;
  $("#lobbyBot").hidden = !L.host || seats.length >= MAX_SEATS;
  $$("#segBotLv button").forEach(b => b.classList.toggle("on", b.dataset.v === PREFS.botLv));
  $("#lobbyFmt").textContent = seats.length >= 2 ? tr("fmtn" + seats.length) : "";
  $("#lobbyStart").hidden = !L.host;
  $("#lobbyStart").disabled = seats.length < 2;
  $("#lobbyStart").textContent = tr("n_start", seats.length);
  $("#lobbyMsg").textContent = L.host ? (L.code ? tr("n_wait_host") : tr("n_connecting")) : tr("n_wait_guest");
}
function applyLang() {
  document.documentElement.lang = LANG; document.title = tr("title") + " · Twistboard";
  $$("[data-i18n]").forEach(e => { e.innerHTML = tr(e.dataset.i18n); if (e.tagName === "LI") e.hidden = !e.innerHTML; });
  $("#joinCode").placeholder = tr("m_code_ph"); $("#myName").placeholder = tr("def_name");
  renderFigs();
  syncModeUI();
  if (NET.role && !$("#mLobby").hidden) showLobby();
  $("#log")._sig = null;
  if (window.TB && TB.paintCredits) TB.paintCredits();
  render();
}
function setLang(l) {
  if (l !== "vi" && l !== "en" || l === LANG && document.documentElement.lang === l) return;
  LANG = l; try { localStorage.setItem("lang", l); } catch (e) {}
  applyLang();
  if (window.TB) TB.setLang(l);
}
if (window.TB) TB.onLang(l => setLang(l));

let PORTRAIT = false;
function fit() {
  PORTRAIT = innerWidth < 820;
  document.body.classList.toggle("portrait", PORTRAIT);
  let availW = PORTRAIT ? Math.min(innerWidth - 16, 600) : innerWidth - 24 - 300 - 18;
  const top = $("#board").getBoundingClientRect().top + scrollY;
  const availH = PORTRAIT ? 1e9 : innerHeight - top - 16;
  const S = Math.max(250, Math.min(availW, availH, 660));
  let cell = Math.floor(S / 7.66);
  let pad = Math.round(cell * .33);
  if (pad < 18) { pad = 18; cell = Math.floor((S - 36) / 7); }
  const gap = Math.max(7, Math.round(cell * .15));
  const r = document.documentElement.style;
  r.setProperty("--cell", cell + "px"); r.setProperty("--pad", pad + "px"); r.setProperty("--gap", gap + "px");
}

/* ============================================================
   SỰ KIỆN
   ============================================================ */
$("#btnNew").onclick = () => openMode();
$("#btnRules").onclick = () => { $("#mRules").hidden = false; };
$("#rulesOk").onclick = () => { $("#mRules").hidden = true; if (!played && !NET.role) openMode(); };
$("#segVs").onclick = e => { const b = e.target.closest("button"); if (b) { PREFS.vs = b.dataset.v; syncModeUI(); } };
$("#segBots").onclick = e => { const b = e.target.closest("button"); if (b) { PREFS.bots = +b.dataset.v; syncModeUI(); } };
$("#botLevels").onclick = e => { const b = e.target.closest("button[data-i]"); if (b) { PREFS.levels[+b.dataset.i] = b.dataset.v; syncModeUI(); } };
$("#segNet").onclick = e => { const b = e.target.closest("button"); if (b) { PREFS.net = b.dataset.v; syncModeUI(); if (PREFS.net === "join") $("#joinCode").focus(); } };
$("#joinCode").oninput = e => { e.target.value = normCode(e.target.value); };
$("#joinCode").onkeydown = e => { if (e.key === "Enter") modeStart(); };
$("#myName").onkeydown = e => { if (e.key === "Enter") modeStart(); };
$("#modeStart").onclick = modeStart;
$("#modeCancel").onclick = () => { $("#mMode").hidden = true; if (!played) $("#mRules").hidden = false; };
$("#netCopy").onclick = () => {
  const inp = $("#netLink"), done = () => { $("#netCopy").textContent = tr("n_copied"); setTimeout(() => { $("#netCopy").textContent = tr("n_copy"); }, 1500); };
  if (navigator.clipboard) navigator.clipboard.writeText(inp.value).then(done, () => { inp.select(); document.execCommand("copy"); done(); });
  else { inp.select(); document.execCommand("copy"); done(); }
};
$("#segBotLv").onclick = e => { const b = e.target.closest("button"); if (b) { PREFS.botLv = b.dataset.v; savePrefs(); showLobby(); } };
$("#addBot").onclick = () => {
  if (NET.role !== "host" || NET.started || NET.lobby.length >= MAX_SEATS) return;
  const used = new Set(NET.lobby.map(x => x.name)), name = shuffle(BOT_NAMES.filter(n => !used.has(n)))[0] || "Bot";
  NET.lobby.push({ id: "bot" + Math.random().toString(36).slice(2, 8), name, kind: "bot", level: PREFS.botLv, conn: null });
  lobbyUpdate();
};
$("#lobbySeats").onclick = e => {
  const lvb = e.target.closest("[data-lv]");
  if (lvb && NET.role === "host" && !NET.started) {   // bấm nhãn mức của máy: 1 → 2 → 3 sao → 1
    const x = NET.lobby[+lvb.dataset.lv];
    if (x && x.kind === "bot") { x.level = LEVELS[(LEVELS.indexOf(x.level || "medium") + 1) % 3]; lobbyUpdate(); }
    return;
  }
  const b = e.target.closest("[data-rm]");
  if (!b || NET.role !== "host" || NET.started) return;
  const i = +b.dataset.rm, x = NET.lobby[i];
  if (!x || i === 0) return;
  if (x.conn) { const c = x.conn; sendTo(c, { t: "err", code: "kicked" }); setTimeout(() => { try { c.close(); } catch (er) {} }, 400); }
  NET.lobby.splice(i, 1);
  lobbyUpdate();
};
$("#lobbyStart").onclick = hostStart;
$("#lobbyLeave").onclick = () => { leaveAll(); render(); openMode(); };
$("#netClose").onclick = () => { $("#mNet").hidden = true; if (!T && !V) { if (NET.role) leaveAll(); openMode(); } };
$("#goView").onclick = () => { const G = V && V.g; if (G && G.over) overSeen = (V.code || "") + ":" + G.ply + ":" + G.over.sc.join(","); $("#gameover").hidden = true; };
$("#goAgain").onclick = () => {
  $("#gameover").hidden = true;
  if (MODE && MODE.kind === "online" && NET.role === "host") hostToLobby();
  else if (MODE && MODE.kind === "bot") startBotGame();
  else openMode();
};
$("#goLeave").onclick = () => { leaveAll(); render(); openMode(); };
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!$("#mRules").hidden) { $("#rulesOk").click(); return; }
  if (!$("#mMode").hidden) { $("#mMode").hidden = true; return; }
  if (SEL.i >= 0 && myTurn()) { if (SEL.to >= 0) SEL.to = -1; else { SEL.i = -1; SEL.b = -1; } render(); }
});
let fitT = 0;
window.addEventListener("resize", () => { clearTimeout(fitT); fitT = setTimeout(() => { fit(); render(); }, 80); });
window.addEventListener("beforeunload", () => { if (NET.role) netClose(true); });

window.game = {
  get T() { return T; }, get V() { return V; }, get G() { return V && V.g; }, get MODE() { return MODE; }, get ME() { return ME; }, NET, HOST, SEL,
  doAct, startBotGame, aiPick, isLegal, allActions, scoreOf, lockedSet, regions, newGame, apply,
};

/* ---------- KHỞI ĐỘNG ---------- */
(function init() {
  applyLang();
  fit();
  if (window.TB && TB.closeX) TB.closeX({ "#mRules": "#rulesOk", "#mMode": "#modeCancel", "#mNet": "#netClose", "#mLobby": "#lobbyLeave", "#gameover": "#goView" });
  const room = normCode((location.hash.match(/room=([A-Za-z0-9]+)/) || [])[1]);
  if (room.length === CODE_LEN) {
    if (PREFS.name) startGuest(room);
    else { PREFS.vs = "online"; PREFS.net = "join"; openMode(); $("#joinCode").value = room; $("#myName").focus(); }
  } else $("#mRules").hidden = false;
  render();
})();

