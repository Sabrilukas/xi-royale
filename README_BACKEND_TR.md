# XI Royale — Backend Teknik Dokümantasyonu

> **Versiyon:** 1.0 — Frontend MVP  
> **Dil:** Türkçe  
> **Hedef kitle:** Backend geliştirici

---

## 1. Proje Özeti

**XI Royale**, fantasy football temalı bir gamification MVP'sidir. Kullanıcı sanal bütçeyle oyuncu seçer, kadro kurar ve demo maç simülasyonu oynatarak leaderboard'da puan kazanır.

- Gerçek Dünya Kupası fikstürlerine entegrasyon için tasarlanmış iskelet yapısı.
- Şu an **frontend-only demo**dur. Tüm state tarayıcı hafızasında tutulur, sayfa yenilenince sıfırlanır.
- **Gerçek para, bahis, ödeme veya wallet altyapısı içermez.**
- Tüm yatırım ve puan işlemleri "demo" / "sanal" kategorisindedir.

---

## 2. Mevcut Frontend Stack

```
/project-root
  /css
    style.css          → Tüm UI stilleri
  /js
    app.js             → Tüm uygulama mantığı (state + render + event)
  /assets              → Görseller, ikonlar (varsa)
  index.html           → Tek sayfa HTML shell
```

| Teknoloji | Kullanım |
|---|---|
| HTML5 | SPA shell, modal yapıları |
| CSS3 | Responsive layout, animasyonlar |
| Vanilla JavaScript (ES6+) | State yönetimi, render pipeline, game logic |
| Google Fonts | Inter, Rajdhani tipografi |

Framework yoktur. `state` objesi global, `renderAll()` tüm UI'ı her state değişiminde yeniden çizer.

---

## 3. Ana Kullanıcı Akışı

```
[Home]
  → Cash Vault demo yatırım (opsiyonel, +puan bonus)
  → "Kadromu Kur" butonu → [Line-up view]

[Line-up]
  → Otomatik Kadro Kur (autoBuildSquad)
  → Manuel: pitch slot'a tıkla → Picker modal → oyuncu seç
  → Bench slotlarını doldur
  → "Demo Maçı Oynat" butonu

[Match Simulation]
  → 700ms gecikme sonrası calculateMatchResult() çalışır
  → Match Result popup açılır (puan breakdown)
  → Transfer kilitlenir (transferOpen = false)

[Match Result Popup]
  → "Board'da Gör" → [Board view]
  → Popup kapanır → Bonus Wheel açılır (ilk 3'e girdiyse)

[Bonus Wheel]
  → Bir kez çevrilir
  → Ödül: puan / kadro gücü / boş
  → state.totalPoints üzerine eklenir

[Board / Leaderboard]
  → Sıralama gösterilir
  → Puan Breakdown (Maç + Booster + Kasa + Çark)
  → Match History

[Yeni Tur]
  → "Yeni Tur Başlat" → Reset confirm modal
  → Tüm state sıfırlanır, transfer açılır
```

---

## 4. Mevcut State Yapısı

Tüm uygulama state'i `app.js` başındaki tek bir `state` objesinde tutulur.

```js
const state = {
  language,
  balance,
  squadCount,
  minimumPlayers,
  maxPlayers,
  totalPoints,
  squadRatingPoints,
  squadRatingPointsBonus,
  transferOpen,
  currentView,
  selectedFormation,
  selectedPlayers,
  lineupSlots,
  benchSlots,
  matchSimulation,
  investmentBonusPoints,
  demoInvestmentAmount,
  matchResultModal,
  bonusWheel
};
```

### Alan Detayları

| Alan | Tip | Açıklama | Backend Tablosu | Taşınmalı mı? |
|---|---|---|---|---|
| `language` | `"tr"` \| `"en"` | Aktif UI dili | — | Hayır (client-side) |
| `balance` | `number` | Oyuncunun sanal bakiyesi ($) | `squads.balance` | ✅ Evet |
| `squadCount` | `number` | Seçili oyuncu sayısı (hesaplanır) | — | Hayır (hesaplanır) |
| `minimumPlayers` | `number` | Maç için minimum oyuncu (6) | `rounds.min_players` | ✅ Config olarak |
| `maxPlayers` | `number` | Maksimum kadro büyüklüğü (16) | `rounds.max_players` | ✅ Config olarak |
| `totalPoints` | `number` | Bu turun toplam puanı | `leaderboard_entries.total_points` | ✅ Evet |
| `squadRatingPoints` | `number` | Oyuncu ratinglerinden gelen kadro gücü | `squads.squad_power` | ✅ Evet |
| `squadRatingPointsBonus` | `number` | Bonus çarkından gelen kadro gücü artışı | `wheel_spins.squad_power_bonus` | ✅ Evet |
| `transferOpen` | `boolean` | Transfer penceresinin açık/kapalı olması | `rounds.transfer_open` | ✅ Evet |
| `currentView` | `string` | Aktif sekme (home/lineup/board) | — | Hayır (UI only) |
| `selectedFormation` | `string` | Seçili formasyon (4-4-2 vb.) | `squads.formation` | ✅ Evet |
| `selectedPlayers` | `number[]` | Kadroya eklenmiş player ID listesi | `squad_players` tablosu | ✅ Evet |
| `lineupSlots` | `object` | Slot ID → Player ID eşlemesi (ilk 11) | `squad_slots` tablosu | ✅ Evet |
| `benchSlots` | `object` | Bench slot ID → Player ID eşlemesi | `squad_slots` tablosu | ✅ Evet |
| `matchSimulation.isPlayed` | `boolean` | Bu turda maç oynandı mı? | `rounds.match_played` | ✅ Evet |
| `matchSimulation.lastResult` | `object` | Son maç sonucu snapshot | `matches` tablosu | ✅ Evet |
| `matchSimulation.history` | `array` | Son 3 maç geçmişi | `matches` tablosu | ✅ Evet |
| `investmentBonusPoints` | `number` | Demo yatırımdan gelen puan bonusu | `matches.investment_bonus_points` | ✅ Evet |
| `demoInvestmentAmount` | `number` | Toplam demo yatırım miktarı ($) | `squads.demo_investment` | ✅ (demo field) |
| `matchResultModal.isOpen` | `boolean` | Popup açık mı? | — | Hayır (UI only) |
| `bonusWheel.isUnlocked` | `boolean` | Çark aktif mi? | `wheel_spins.is_unlocked` | ✅ Evet |
| `bonusWheel.hasSpun` | `boolean` | Bu turda çark çevrildi mi? | `wheel_spins.has_spun` | ✅ Evet |
| `bonusWheel.lastReward` | `object` | Çark ödülü objesi | `wheel_spins.reward_type/value` | ✅ Evet |
| `bonusWheel.rotation` | `number` | CSS animasyon için derece değeri | — | Hayır (UI only) |

---

## 5. Oyuncu Datası

Şu an `app.js` içinde statik array olarak duruyor:

```js
const demoPlayers = [
  { id: 1, name: "Kylian M.", country: "France", price: 91000, rating: 9.1, position: "FWD" },
  { id: 2, name: "Jude B.",   country: "England", price: 88000, rating: 8.8, position: "MID" },
  // ...28 oyuncu toplam
];
```

### Player Fields

| Field | Tip | Açıklama |
|---|---|---|
| `id` | `integer` | Benzersiz oyuncu ID |
| `name` | `string` | Kısa görünen ad |
| `country` | `string` | Millî takım ülkesi |
| `price` | `integer` | Sanal fiyat ($) |
| `rating` | `float` | Temel rating (6.5–10.0) |
| `position` | `enum` | `GK`, `DEF`, `MID`, `FWD` |

### Backend Önerisi

```sql
-- players tablosu
CREATE TABLE players (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  country     VARCHAR(100),
  price       INTEGER NOT NULL,
  rating      DECIMAL(3,1) NOT NULL,
  position    ENUM('GK','DEF','MID','FWD') NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 6. Kadro Sistemi

### Çalışma Mantığı

- **Lineup slots:** Formasyona göre belirlenir (4-4-2 = 11 slot). Her slot bir pozisyon etiketine sahip. Yanlış pozisyondaki oyuncu reddedilir.
- **Bench slots:** 5 sabit slot (`bench-1` … `bench-5`). Pozisyon kısıtı yoktur.
- **Duplicate prevention:** Bir oyuncu aynı anda yalnızca bir slotta olabilir.
- **Maksimum kadro:** 16 oyuncu (11 lineup + 5 bench).

### Desteklenen Formasyonlar

| Formasyon | GK | DEF | MID | FWD |
|---|---|---|---|---|
| 4-4-2 | 1 | 4 | 4 | 2 |
| 3-5-2 | 1 | 3 | 5 | 2 |
| 4-3-3 | 1 | 4 | 3 | 3 |

### Backend Önerisi

```sql
CREATE TABLE squads (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER REFERENCES users(id),
  round_id            INTEGER REFERENCES rounds(id),
  formation           VARCHAR(10) DEFAULT '4-4-2',
  balance             INTEGER DEFAULT 1000000,
  demo_investment     INTEGER DEFAULT 0,
  squad_power         INTEGER DEFAULT 0,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE squad_slots (
  id          SERIAL PRIMARY KEY,
  squad_id    INTEGER REFERENCES squads(id),
  slot_key    VARCHAR(30) NOT NULL,     -- örn: "442-fwd-1", "bench-1"
  slot_type   ENUM('lineup','bench') NOT NULL,
  position    ENUM('GK','DEF','MID','FWD','BENCH'),
  player_id   INTEGER REFERENCES players(id),
  UNIQUE (squad_id, slot_key)
);
```

---

## 7. Maç Simülasyonu Kuralları

> ⚠️ **Not:** Eski "Bonus Puan" sistemi kaldırıldı. `squadBonus`, `avgBonus`, `randomDemoBonus` artık kullanılmıyor. Random bonus mekanizması kaldırıldı.

### Güncel Puan Formülü

```
Toplam Puan = Maç Puanı + Booster Points + Ana Kasa Bonusu + Çark Bonusu
```

| Bileşen | Hesaplama |
|---|---|
| **Maç Puanı** | `Σ (oyuncu.rating × 10)` — tüm seçili oyuncular |
| **Booster Points** | Uygun oyuncu sayısı × 15 |
| **Ana Kasa Bonusu** | Demo yatırım × 0.001 (100K → +100 puan) |
| **Çark Bonusu** | Maçtan sonra ayrıca `state.totalPoints`'e eklenir |

### Frontend Kodu (referans)

```js
const basePoints = players.reduce(
  (sum, player) => sum + calculatePlayerPoints(player), 0
);
// calculatePlayerPoints = Math.round(player.rating * 10)

const boosterPoints = boosterPlayers.length * 15;
const investmentBonusPoints = state.investmentBonusPoints || 0;
const totalEarned = basePoints + boosterPoints + investmentBonusPoints;
```

### Match Result Objesi

```js
{
  id,                    // Date.now() — backend'de UUID olmalı
  squadSize,
  startingPlayers,
  benchPlayers,
  basePoints,
  boosterPlayers,        // [ { id, name, position, performanceRating, boostPoints } ]
  boosterPoints,
  investmentBonusPoints, // snapshot — totalEarned içinde zaten var
  totalEarned,
  avgRating,
  rankChange,
  createdAt
}
```

---

## 8. Booster Logic

### Demo Çalışma Şekli

Her oyuncu için simülasyonda:

1. `delta = random(-0.4, +0.6)` uygulanır → `performanceRating = player.rating + delta`
2. `playerTeamLost = Math.random() < 0.45` — %45 ihtimalle "takım kaybetti" sayılır (demo-only)
3. `performanceRating >= 8.5 && playerTeamLost` koşulunu sağlayan oyuncu **booster** kazanır → `+15 puan`

```js
const boosterPlayers = players
  .map(player => {
    const delta = -0.4 + Math.random() * 1.0;
    const performanceRating = Math.min(10, Math.max(6.5, player.rating + delta));
    const playerTeamLost = Math.random() < 0.45;
    return { player, performanceRating, playerTeamLost };
  })
  .filter(({ performanceRating, playerTeamLost }) =>
    performanceRating >= 8.5 && playerTeamLost
  );
```

### Backend'e Taşınırken

- Gerçek fikstür API'sından gerçek maç sonuçları ve oyuncu ratinglari alınmalıdır.
- `playerTeamLost` ve `performanceRating` server-side, güvenilir kaynaklardan (opta, statsperform vb.) hesaplanmalıdır.
- Frontend'de random üretilmesi **production için geçerli değildir**.

---

## 9. Ana Kasa Demo Yatırım Bonusu

### Çalışma Mantığı

| Yatırım | Puan Bonusu |
|---|---|
| +100,000 sanal | +100 puan |
| +500,000 sanal | +500 puan |

```js
function applyDemoInvestment(amount) {
  const bonusPoints = Math.round(amount / 1000); // 100000 / 1000 = 100
  state.balance             += amount;
  state.demoInvestmentAmount += amount;
  state.investmentBonusPoints += bonusPoints;
  state.totalPoints           += bonusPoints;
}
```

### Önemli Notlar

- Gerçek ödeme, cüzdan veya para transferi **yoktur**.
- Backend'de `demo_investment` alanı olarak tutulmalı, gerçek finansal işlem tablosuna bağlanmamalıdır.
- Ürün ileride gerçek ödeme altyapısına geçecekse **hukuki ve ödeme sistemi incelemesi** zorunludur.
- Yatırım bonusu maç öncesi `investmentBonusPoints` olarak snapshotlanır; maç sonrası değişmez.

---

## 10. Bonus Wheel Logic

### Kural Sırası

1. Maç simülasyonu tamamlanır → `checkBonusWheelUnlock()` çağrılır.
2. Kullanıcı leaderboard'da **ilk 3'e girdiyse** çark açılır (`isUnlocked = true`).
3. Match Result popup **kapandıktan sonra** çark açılır (iki modal çakışmaz).
4. Çark **yalnızca 1 kez** çevrilebilir (`hasSpun = true` olunca kilitlenir).

### Ödül Listesi

| Ödül | Tip | Değer |
|---|---|---|
| +50 Puan | `points` | 50 |
| +75 Puan | `points` | 75 |
| +100 Puan | `points` | 100 |
| +150 Puan | `points` | 150 |
| +10 Kadro Gücü | `squadPower` | 10 |
| Bonus Yok | `empty` | 0 |

- `points` tipi → `state.totalPoints += reward.points`
- `squadPower` tipi → `state.squadRatingPointsBonus += reward.squadPower`; puan değil, kadro gücüne eklenir.
- Seçim şu an `Math.random()` ile yapılır — **production'da server-side olmalıdır.**

### Backend Önerisi

```sql
CREATE TABLE wheel_spins (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id),
  round_id        INTEGER REFERENCES rounds(id),
  match_id        INTEGER REFERENCES matches(id),
  is_unlocked     BOOLEAN DEFAULT false,
  has_spun        BOOLEAN DEFAULT false,
  reward_type     ENUM('points','squadPower','empty'),
  reward_value    INTEGER DEFAULT 0,
  spun_at         TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, round_id)            -- tur başına 1 hak
);
```

---

## 11. Leaderboard Logic

### Demo Yapısı

Şu an frontend'de sabit `OPPONENT_TEAMS` array'i var:

```js
const OPPONENT_TEAMS = [
  { name: "Royal Strikers", points: 1250, movement:  3 },
  { name: "Samba Kings",    points: 1120, movement:  1 },
  // ...9 rakip
];
```

- Kullanıcının `state.totalPoints` değeri bu listeye eklenerek `points` değerine göre `sort()` yapılır.
- Rank, sıralı indeks + 1'dir.

### Backend Önerisi

```sql
CREATE TABLE leaderboard_entries (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id),
  round_id        INTEGER REFERENCES rounds(id),
  total_points    INTEGER DEFAULT 0,
  rank_position   INTEGER,
  rank_change     INTEGER DEFAULT 0,
  avg_rating      DECIMAL(3,1),
  snapshot_at     TIMESTAMP DEFAULT NOW()
);
```

- Rank hesabı backend'de `RANK() OVER (ORDER BY total_points DESC)` ile yapılabilir.
- Her maç sonrası snapshot alınmalıdır.

---

## 12. Transfer Lock

### Kural

- Maç oynandığında `state.transferOpen = false` olur.
- Transfer kapalıyken oyuncu ekleme/kaldırma/değiştirme tüm fonksiyonlarda bloklanır.
- "Yeni Tur Başlat" → `resetSquad()` → `transferOpen = true`.

### Backend Önerisi

```sql
CREATE TABLE rounds (
  id              SERIAL PRIMARY KEY,
  round_number    INTEGER NOT NULL,
  transfer_open   BOOLEAN DEFAULT true,
  match_played    BOOLEAN DEFAULT false,
  started_at      TIMESTAMP,
  ended_at        TIMESTAMP
);
```

- Her kullanıcı için `user_round_status` tablosu veya `squads` içinde `transfer_open` field yeterlidir.

---

## 13. Modal ve UI Sistemleri

| Modal | Tetikleyici | State Alanı |
|---|---|---|
| Match Result | Maç simülasyonu tamamlanınca | `matchResultModal.isOpen` |
| Bonus Wheel | Match Result kapandıktan sonra (ilk 3) | `bonusWheel.isOpen` |
| Picker | Pitch/bench slot tıklanınca | `activePicker.isOpen` |
| Rules | "Kurallar" butonuna basınca | `rulesModalOpen` |
| Reset Confirm | "Kadroyu Sıfırla" butonuna basınca | `resetConfirmOpen` |

- Aynı anda yalnızca bir modal açık olabilir.
- `body.classList.toggle("modal-open")` scroll lock için kullanılır.
- Backend açısından bu alanlar önemsizdir; frontend-only kalabilir.

---

## 14. Dil Sistemi

- `state.language`: `"tr"` veya `"en"`
- `translations` objesi tüm UI metinlerini TR ve EN olarak içerir.
- `t("key", ...args)` helper fonksiyonu aktif dile göre çevirir.
- `data-i18n`, `data-i18n-html`, `data-i18n-aria` attribute'ları HTML'de statik elemanlar için kullanılır.
- `renderTranslations()` her `renderAll()` çağrısında tüm etiketleri günceller.

**Backend'e taşınması zorunlu değildir.** Production'da `i18next`, `react-intl` gibi bir kütüphane veya ayrı JSON locale dosyaları önerilir.

---

## 15. Backend'e Taşınması Gerekenler

| Özellik | Öncelik | Not |
|---|---|---|
| Kullanıcı hesabı (auth) | 🔴 Kritik | JWT / OAuth |
| Player database | 🔴 Kritik | Şu an frontend array |
| Squad kayıtları | 🔴 Kritik | Sayfa yenilenince kayboluyor |
| Match result kayıtları | 🔴 Kritik | Skor geçmişi için |
| Leaderboard | 🔴 Kritik | Gerçek çok kullanıcılı sıralama |
| Transfer lock state | 🟡 Önemli | Round başına |
| Wheel spin claim | 🟡 Önemli | Tekrar çevirme önleme |
| Tournament round yönetimi | 🟡 Önemli | Tur sıfırlama |
| Match history | 🟡 Önemli | Son 3 maç gösterimi |
| Booster hesaplama | 🟡 Önemli | Gerçek fixture API gerektirir |
| Demo yatırım field | 🟢 Düşük | Legal review sonrası |
| Dil tercihi | 🟢 Düşük | `user_preferences` tablosunda tutulabilir |

---

## 16. Önerilen API Endpointleri

### `GET /api/players`
Tüm oyuncu listesini döner.

```json
// Response
[
  { "id": 1, "name": "Kylian M.", "country": "France", "price": 91000, "rating": 9.1, "position": "FWD" }
]
```

---

### `GET /api/users/me`
Oturum açmış kullanıcı bilgisi.

```json
// Response
{
  "id": 42,
  "username": "xiroyale_user",
  "balance": 750000,
  "total_points": 1340
}
```

---

### `GET /api/squads/current`
Kullanıcının bu turdaki aktif kadrosunu döner.

```json
// Response
{
  "formation": "4-4-2",
  "balance": 750000,
  "transfer_open": true,
  "slots": [
    { "slot_key": "442-fwd-1", "slot_type": "lineup", "position": "FWD", "player_id": 1 },
    { "slot_key": "bench-1",   "slot_type": "bench",  "position": "BENCH", "player_id": 7 }
  ]
}
```

---

### `POST /api/squads/auto-build`
Otomatik kadro kurma işlemini tetikler.

```json
// Request
{ "formation": "4-4-2" }

// Response
{ "squad": { /* güncel kadro objesi */ }, "balance": 620000 }
```

---

### `POST /api/squads/players`
Kadroya oyuncu ekler.

```json
// Request
{ "player_id": 5, "slot_key": "442-fwd-2" }

// Response
{ "success": true, "balance": 710000, "squad_power": 840 }
```

---

### `DELETE /api/squads/players/:slotKey`
Slottaki oyuncuyu kaldırır.

```json
// Response
{ "success": true, "balance": 801000, "refunded_player_id": 5 }
```

---

### `POST /api/matches/simulate`
Maç simülasyonunu başlatır, sonucu hesaplayıp kaydeder.

```json
// Request
{}  // squad bilgisi server-side oturumdan alınır

// Response
{
  "match_id": 1001,
  "base_points": 840,
  "booster_points": 30,
  "investment_bonus_points": 100,
  "total_earned": 970,
  "avg_rating": 8.3,
  "rank_change": 4,
  "booster_players": [
    { "player_id": 1, "name": "Kylian M.", "performance_rating": 9.2, "boost_points": 15 }
  ]
}
```

---

### `GET /api/leaderboard`
Aktif turun sıralamasını döner.

```json
// Response
[
  { "rank": 1, "username": "Royal Strikers", "total_points": 1250, "movement": 3, "is_current": false },
  { "rank": 5, "username": "xiroyale_user",  "total_points": 970,  "movement": 4, "is_current": true }
]
```

---

### `POST /api/wheel/spin`
Bonus çarkını çevirir. Server-side ödül belirler.

```json
// Request
{}  // round + user bilgisi oturumdan

// Response
{
  "reward_type": "points",
  "reward_value": 100,
  "new_total_points": 1070
}
```

---

### `POST /api/rounds/reset`
Yeni tur başlatır, kullanıcı state'ini sıfırlar.

```json
// Request
{ "confirm": true }

// Response
{
  "new_round_id": 2,
  "balance": 1000000,
  "total_points": 0,
  "transfer_open": true
}
```

---

## 17. Önerilen Database Şeması

```sql
-- Kullanıcılar
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Oyuncular
CREATE TABLE players (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  full_name   VARCHAR(200),
  country     VARCHAR(100),
  price       INTEGER NOT NULL,
  rating      DECIMAL(3,1) NOT NULL,
  position    VARCHAR(10) NOT NULL,  -- GK, DEF, MID, FWD
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Turnuva Turları
CREATE TABLE rounds (
  id              SERIAL PRIMARY KEY,
  round_number    INTEGER NOT NULL,
  transfer_open   BOOLEAN DEFAULT true,
  match_played    BOOLEAN DEFAULT false,
  min_players     INTEGER DEFAULT 6,
  max_players     INTEGER DEFAULT 16,
  started_at      TIMESTAMP,
  ended_at        TIMESTAMP
);

-- Kadrolar
CREATE TABLE squads (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER REFERENCES users(id),
  round_id          INTEGER REFERENCES rounds(id),
  formation         VARCHAR(10) DEFAULT '4-4-2',
  balance           INTEGER DEFAULT 1000000,
  squad_power       INTEGER DEFAULT 0,
  demo_investment   INTEGER DEFAULT 0,
  transfer_open     BOOLEAN DEFAULT true,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, round_id)
);

-- Kadro Slotları
CREATE TABLE squad_slots (
  id          SERIAL PRIMARY KEY,
  squad_id    INTEGER REFERENCES squads(id) ON DELETE CASCADE,
  slot_key    VARCHAR(30) NOT NULL,
  slot_type   VARCHAR(10) NOT NULL,  -- lineup, bench
  position    VARCHAR(10),           -- GK, DEF, MID, FWD, NULL (bench)
  player_id   INTEGER REFERENCES players(id),
  UNIQUE (squad_id, slot_key)
);

-- Maç Sonuçları
CREATE TABLE matches (
  id                        SERIAL PRIMARY KEY,
  user_id                   INTEGER REFERENCES users(id),
  round_id                  INTEGER REFERENCES rounds(id),
  squad_id                  INTEGER REFERENCES squads(id),
  squad_size                INTEGER,
  base_points               INTEGER DEFAULT 0,
  booster_points            INTEGER DEFAULT 0,
  investment_bonus_points   INTEGER DEFAULT 0,
  wheel_bonus_points        INTEGER DEFAULT 0,
  total_earned              INTEGER DEFAULT 0,
  avg_rating                DECIMAL(3,1),
  rank_change               INTEGER DEFAULT 0,
  played_at                 TIMESTAMP DEFAULT NOW()
);

-- Booster Oyuncuları (maç başına)
CREATE TABLE match_boosters (
  id                  SERIAL PRIMARY KEY,
  match_id            INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  player_id           INTEGER REFERENCES players(id),
  performance_rating  DECIMAL(3,1),
  boost_points        INTEGER DEFAULT 15
);

-- Leaderboard Kayıtları
CREATE TABLE leaderboard_entries (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id),
  round_id        INTEGER REFERENCES rounds(id),
  match_id        INTEGER REFERENCES matches(id),
  total_points    INTEGER DEFAULT 0,
  rank_position   INTEGER,
  rank_change     INTEGER DEFAULT 0,
  avg_rating      DECIMAL(3,1),
  snapshot_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, round_id)
);

-- Bonus Çark Çevrimleri
CREATE TABLE wheel_spins (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  round_id      INTEGER REFERENCES rounds(id),
  match_id      INTEGER REFERENCES matches(id),
  is_unlocked   BOOLEAN DEFAULT false,
  has_spun      BOOLEAN DEFAULT false,
  reward_type   VARCHAR(20),    -- points, squadPower, empty
  reward_value  INTEGER DEFAULT 0,
  spun_at       TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, round_id)
);
```

---

## 18. Güvenlik ve Ürün Notları

| Konu | Durum | Not |
|---|---|---|
| Gerçek para | ❌ Yok | Demo-only, hiçbir ödeme altyapısı bağlı değil |
| Bahis / gambling | ❌ Yok | Gamification mekaniği, bahis değil |
| Frontend state güvenilirliği | ⚠️ Güvenilmez | Kullanıcı devtools ile değiştirebilir |
| Random üretimi | ⚠️ Frontend-side | Production'da server-side olmalı |
| Puan hesabı | ⚠️ Frontend-side | Manipülasyon riski, server-side taşınmalı |
| Booster logic | ⚠️ Demo random | Gerçek fixture/rating API gerektirir |
| Wheel sonucu | ⚠️ Frontend random | Server-side + seed ile üretilmeli |
| Ödeme entegrasyonu | 🔴 Yok | Eklenirse PCI-DSS + hukuki inceleme zorunlu |

**Altın Kural:** Backend kurulmadan önce tüm puan, sıralama ve ödül hesapları client'a güvenilmez. Tüm kritik hesaplamalar server-side yapılmalı, frontend yalnızca görüntüleme katmanı olmalıdır.

---

## 19. MVP'den Production'a Geçiş Planı

```
Adım 1 — Player DB
  → demoPlayers array'ini /api/players endpoint'ine taşı
  → Admin panelden oyuncu ekle/düzenle/devre dışı bırak

Adım 2 — User Auth
  → JWT tabanlı kayıt/giriş
  → Kullanıcı ID ile tüm state'i ilişkilendir

Adım 3 — Squad Persistence
  → Kadro verilerini veritabanına kaydet
  → Sayfa yenilemede kadro yüklensin
  → Transfer lock server-side korunsun

Adım 4 — Match Simulation Backend
  → calculateMatchResult() server-side'a taşı
  → Booster logic gerçek fixture API'ye bağla
  → Sonucu matches tablosuna kaydet

Adım 5 — Leaderboard Backend
  → Gerçek çok kullanıcılı sıralama
  → OPPONENT_TEAMS sabit verisi kaldırılır
  → Rank real-time güncellenir

Adım 6 — Wheel Spin Backend
  → Spin sonucunu server-side üret (seed + timestamp)
  → has_spun kontrolü server-side yapılsın
  → wheel_spins tablosuna kaydet

Adım 7 — Admin Panel
  → Round yönetimi (başlat/bitir/sıfırla)
  → Oyuncu fiyat/rating güncelleme
  → Leaderboard düzenleme

Adım 8 — Real Fixture API Entegrasyonu
  → Gerçek maç takvimi
  → Gerçek oyuncu performans ratingleri
  → Booster logic gerçek veriye bağlanır
```

---

## 20. Backend Developer İçin Net Özet

### Frontend Şu An Ne Yapıyor?

- Tüm state tarayıcı RAM'inde, hiçbiri kalıcı değil.
- Puan hesabı, kadro kurma, maç simülasyonu, leaderboard — hepsi `app.js` içinde.
- Kullanıcı yoktur; tek kullanıcı varsayımıyla çalışır.
- Sayfa yenilenince her şey sıfırlanır.

### Backend'in Yapması Gerekenler

1. **State'i kalıcı hale getir:** Kadro, bakiye, puan, transfer durumu — veritabanında sakla.
2. **Hesaplamaları server-side taşı:** Puan, booster, wheel sonucu frontend'den alınmamalı.
3. **Çok kullanıcıyı destekle:** Gerçek leaderboard için user_id zorunlu.
4. **Round yönetimi:** Tur başlat/bitir/sıfırla akışı backend kontrolünde olmalı.
5. **Frontend sadece görüntüle:** API'dan gelen datayı render et, hesaplama yapma.

### Kritik Uyarılar

- Wheel sonucu ve puan hesabı **asla frontend'den alınmamalıdır.**
- Demo yatırım field'ı **gerçek ödeme sistemiyle karıştırılmamalıdır.**
- Booster logic için **gerçek fixture/rating API** gerekmedikçe demo random kabul edilebilir.
- Production öncesi **güvenlik, hukuki uyumluluk ve veri gizliliği** gözden geçirilmelidir.

---

*Bu doküman XI Royale Frontend MVP v1.0 baz alınarak hazırlanmıştır.*  
*Güncelleme tarihi: 2026-05-14*
