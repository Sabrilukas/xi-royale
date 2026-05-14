# XI Royale — Fantasy Football MVP

> **Versiyon:** 1.0 — Frontend Demo  
> **Tür:** Gamification / Fantasy Football SPA  
> **Platform:** Web (Mobile-first, Desktop uyumlu)

---

## Proje Nedir?

**XI Royale**, Dünya Kupası temalı bir fantasy football oyunudur. Kullanıcı sanal bütçeyle yıldız oyuncular seçer, kadro kurar ve demo maç simülasyonu oynayarak leaderboard'da puan kazanır.

- Gerçek Dünya Kupası fikstür entegrasyonuna hazır iskelet yapısı
- Mobile-first, responsive tasarım
- TR / EN dil desteği
- Gerçek para, bahis veya ödeme altyapısı **içermez**

---

## Nasıl Açılır?

Herhangi bir kurulum gerekmez.

```
index.html dosyasını tarayıcıda aç → uygulama çalışır
```

> Chrome, Edge veya Firefox önerilir.

---

## Dosya Yapısı

```
/project-root
  index.html              → Uygulama giriş noktası
  /css
    style.css             → Tüm stiller
  /js
    app.js                → Tüm uygulama mantığı
  /assets                 → Görseller ve ikonlar
  README.md               → Bu doküman
  README_BACKEND_TR.md    → Backend geliştirici teknik dokümantasyonu
```

---

## Özellikler

### 🏠 Home
- Hero section, jackpot hedefi
- **Ana Kasa** — demo sanal yatırım bonusu (+100K veya +500K)
- Today Challenge kartı
- Transfer Window durumu
- Nasıl oynanır adımları

### 👕 Line-up
- 3 formasyon seçeneği: **4-4-2 · 3-5-2 · 4-3-3**
- İnteraktif saha üzerinden oyuncu yerleştirme
- 5 yedek bench slotu
- **Otomatik Kadro Kur** butonu
- Slot yönetimi (oyuncu değiştir / kaldır)
- Kadro tamamlama progress bar
- Kadro Gücü ve bakiye takibi

### ⚽ Maç Simülasyonu
- Minimum 6 oyuncu seçilince aktif olur
- Demo maç simülasyonu (oynatma süresi ~1 sn)
- **Match Result popup** — puan breakdown
- Booster sistemi: 8.5+ performanslı oyuncular +15 puan kazanır
- Ana Kasa yatırım bonusu puanlara yansır

### 🎡 Bonus Wheel
- Leaderboard'da ilk 3'e giren kullanıcıya açılır
- Bir kez çevrilir
- Ödüller: +50 / +75 / +100 / +150 puan, +10 Kadro Gücü, Bonus Yok

### 📊 Board
- Gerçek zamanlı leaderboard sıralaması
- Puan Breakdown kartları (Maç · Booster · Ana Kasa · Çark)
- Podium (ilk 3)
- Maç geçmişi (son 3 maç)

### 🌐 Dil Desteği
- Türkçe ve İngilizce
- Header'daki **TR / EN** butonu ile anlık geçiş

---

## Puan Sistemi

| Bileşen | Hesaplama |
|---|---|
| Maç Puanı | Tüm oyuncuların rating puanı toplamı (`rating × 10`) |
| Booster Points | 8.5+ performanslı uygun oyuncu sayısı × 15 |
| Ana Kasa Bonusu | Demo yatırım bonusu (100K → +100 puan) |
| Çark Bonusu | Maç sonrası çarktan gelen puan |
| **Toplam Puan** | Maç + Booster + Ana Kasa + Çark |

---

## Demo Oyuncu Kadrosu

28 gerçek dünya yıldızı dahil edilmiştir:

| Oyuncu | Ülke | Pozisyon | Rating |
|---|---|---|---|
| Kylian M. | France | FWD | 9.1 |
| Vinicius J. | Brazil | FWD | 9.0 |
| Rodri H. | Spain | MID | 8.9 |
| Jude B. | England | MID | 8.8 |
| Harry K. | England | FWD | 8.7 |
| Bukayo S. | England | FWD | 8.4 |
| … | … | … | … |

> Tam liste `js/app.js` → `demoPlayers` array içinde.

---

## Demo Kısıtlamaları

| Kısıt | Açıklama |
|---|---|
| Kalıcı kayıt yok | Sayfa yenilenince state sıfırlanır |
| Gerçek kullanıcı yok | Tek kullanıcı modeli, hesap sistemi yoktur |
| Rakip data sabit | Leaderboard rakipleri frontend'de sabit demo datadır |
| Maç simülasyonu demo | Booster ve puan hesabı rastgele demo mantığıyla çalışır |
| Gerçek ödeme yok | Ana Kasa tamamen sanal, ödeme altyapısı bağlı değil |

---

## Backend Entegrasyonu

Bu MVP backend entegrasyonuna hazır şekilde tasarlanmıştır. Teknik detaylar, API önerileri ve veritabanı şeması için:

📄 **`README_BACKEND_TR.md`** dosyasına bakınız.

---

## Teknik Notlar

- **Framework yok** — saf HTML, CSS, Vanilla JavaScript
- **Bağımlılık yok** — npm, node_modules, build süreci gerekmez
- **Offline çalışır** — yalnızca Google Fonts için internet bağlantısı
- Tüm uygulama mantığı tek dosyada: `js/app.js`
- CSS custom properties (değişkenler) ile tema yönetimi

---

## Tarayıcı Desteği

| Tarayıcı | Durum |
|---|---|
| Chrome 90+ | ✅ Tam destekli |
| Edge 90+ | ✅ Tam destekli |
| Firefox 88+ | ✅ Tam destekli |
| Safari 14+ | ✅ Destekli |
| IE 11 | ❌ Desteklenmiyor |

---

*XI Royale Frontend MVP v1.0 — 2026*
