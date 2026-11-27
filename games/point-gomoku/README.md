# Point Gomoku · Cờ Ca-rô Cược Điểm

**Play / Chơi ngay:** https://midunguyeniu.github.io/twistboard/games/point-gomoku/

*Game made by Gary Duc Nguyen · Game được làm bởi Gary Duc Nguyen*

🇬🇧 [English](#english) · 🇻🇳 [Tiếng Việt](#tiếng-việt)

---

## English

Gomoku on a 15×15 board, but nobody places stones directly. Every round both players make secret bids for each point. Rules follow Point Omok on puzzlthink.com.

### Each round

1. **Choose**: the chooser (drawn at random in round 1, then players alternate) marks 3 empty points next to each other in one line: across, down or diagonal. No gaps or bends.
2. **Bid**: each player splits their points over the 3 points, at least 1 on each. Bids are secret.
3. **Place**: each point gets the stone of whoever bid more. **A tie goes to the player who did not choose.** All 3 stones land together.

### Points

- Both players get **10 points** every round.
- **Half** of what you do not spend (rounded down) carries over. Have 10, bid 3-1-1, keep 5, and next round you have 10 + 2 = 12.
- Your opponent's points and bids are hidden. Each round you only learn who got which point. All bids are revealed when the game ends.

### Winning

- Get **exactly 5** in a row to win. Six or more does not count.
- If there is a five at the end of a round, the game ends. If both players have one, more fives wins; the same number is a draw.
- If no three empty points in a row remain, it is a draw.
- 90 seconds to choose, 90 seconds to bid. On timeout three points next to the stones are picked for you, or your current bid is locked. **Three rounds in a row on the clock lose the match.**

### Game modes

- **Vs AI**: 7 levels from IQ 40 to IQ 160. The AI only sees the board, past results and its own bids. From IQ 120 up, each game the AI picks a bidding style (Balanced, Saver, Aggressive, Sniper, Spread, Bluffer), shown when the game ends. The clock pauses while a menu is open.
- **Online**: one player picks *Create room* and sends the 5-letter code (or the invite link) to a friend. Bids are sealed first (a SHA-256 hash is sent), and the real numbers are only sent once both players have locked, so nobody can peek. After a game, if both press *Rematch*, a new game starts. The two browsers connect directly (WebRTC via PeerJS), no account or game server.

---

## Tiếng Việt

Cờ ca-rô trên bàn 15×15, nhưng không ai tự đặt quân. Mỗi vòng, hai bên cược điểm kín để giành từng ô. Luật theo trò Point Omok trên puzzlthink.com.

### Mỗi vòng

1. **Chọn**: người chọn (vòng đầu bốc thăm, sau đó hai bên thay phiên) đánh dấu 3 ô trống liền nhau trên một đường: ngang, dọc hoặc chéo. Không được cách quãng hay gãy khúc.
2. **Cược**: mỗi người chia điểm của mình lên 3 ô, ô nào cũng ít nhất 1 điểm. Cược kín, đối thủ không thấy.
3. **Đặt quân**: ô nào ai cược cao hơn thì người đó được quân ở ô đó. **Hoà điểm thì người không chọn ô thắng.** Cả 3 quân đặt cùng lúc.

### Điểm

- Mỗi vòng mỗi người được cộng **10 điểm**.
- Điểm không tiêu thì chuyển **một nửa** (làm tròn xuống) sang vòng sau. Ví dụ có 10, cược 3-1-1, còn 5 thì vòng sau có 10 + 2 = 12 điểm.
- Số điểm còn lại và cược của đối thủ đều ẩn. Mỗi vòng bạn chỉ biết ô nào về tay ai. Hết ván mới lộ toàn bộ cược.

### Thắng thua

- Ai có **đúng 5 quân** liền hàng thì thắng. Hàng 6 quân trở lên không tính.
- Hết vòng mà có hàng 5 thì hết ván. Nếu cả hai cùng có, ai nhiều hàng 5 hơn thắng, bằng nhau thì hoà.
- Bàn không còn 3 ô trống liền nhau thì hoà.
- Chọn ô có 90 giây, cược có 90 giây. Hết giờ thì máy tự chọn 3 ô cạnh các quân, hoặc khoá cược bạn đang để. **Quá giờ 3 vòng liên tiếp thì thua.**

### Chế độ chơi

- **Đấu với AI**: 7 mức, từ IQ 40 đến IQ 160. AI chỉ thấy bàn cờ, kết quả các vòng và cược của chính nó. Từ IQ 120 trở lên, mỗi ván AI có một kiểu cược riêng (Cân bằng, Tiết kiệm, Tấn công, Bắn tỉa, Rải đều, Hù doạ), hết ván mới hiện ra. Khi đang mở bảng Luật chơi hoặc Ván mới, đồng hồ tạm dừng.
- **Chơi online**: một người chọn *Tạo phòng* rồi gửi mã 5 ký tự (hoặc link mời) cho bạn. Cược được niêm phong trước (chỉ gửi mã băm SHA-256), khi cả hai đã khoá mới gửi số thật, nên không ai nhìn trộm được. Hết ván, nếu cả hai bấm *Chơi lại* thì ván mới bắt đầu. Hai trình duyệt nối thẳng với nhau (WebRTC qua PeerJS), không cần tài khoản hay game server.
