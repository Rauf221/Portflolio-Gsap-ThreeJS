portfolio_gsap

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
[portfolio_gsap] — günün sonu
Tarix: 22 may 2026

1. Hero bölməsi split layout-a keçirildi — mətn sola, 3D sphere sağa.
2. Skills başlığında hər hərf fərqli GSAP giriş animasiyası ilə gəlir.
3. i18n dil dəyişəndə GSAP yenidən qurulur — hərflər locale-ə görə düzgün animasiya alır.
4. i18n tamamilə silindi — sayt yalnız ingilis dilində, `/` birbaşa portfolio açır.
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
[portfolio_gsap] — günün sonu
Tarix: 21 may 2026

1. About səhifəsi sıfırdan mistik GSAP dizaynına keçirildi — ana səhifə ilə eyni glass/orbit/parallax dilində.
2. Fokus sahələri horizontal scroll-pin, custom cursor və scroll progress əlavə olundu.
3. About səhifəsinə String-Tune inteqrasiyası: parallax, magnetic, split, glide; native scroll (touchpad düzəldi).
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
[portfolio_gsap] — günün sonu
Tarix: 20 may 2026

1. Ayrıca `/[locale]/about` səhifəsi: haqqımda mətni, statistikalar və v6 tech orbit (ana səhifə indigo/sphere rəngləri ilə).
2. About səhifəsi genişləndirildi: bio, texnologiya pill-ləri, layihələr, yanaşma və dillər (az/en/tr).
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
[portfolio_gsap] — günün sonu
Tarix: 18 may 2026

1. Portfolio məzmunu CV-yə uyğunlaşdırıldı (ad, layihələr, bacarıqlar, təcrübə).
2. next-intl ilə az/tr/en tərcümələri və nav-da dil keçidi əlavə olundu; əsas səhifə `[locale]` altındadır.
3. Next.js 16 üçün `middleware` əvəzinə `proxy` istifadə olunur; v1–v6 marşrutları tərcümə matcher-dən çıxarılıb.
4. Dil dəyişəndə GSAP/ScrollTrigger pin ilə React DOM uyğunsuzluğu: `Portfolio` `key={locale}` ilə remount + `ScrollTrigger.kill(true)` təmizliyi.
5. Client `PortfolioShell` (`useLocale` + `key`) — provider mətni server RSC-dən əvvəl yeniləndikdə eyni commit-də remount; `clearScrollMemory` əlavə təmizlik.
6. Dil keçidi tam səhifə (`window.location.assign`) — GSAP pin ilə client router uyğunsuzluğunun son tədbiri.
7. AZ dilinə keçid: `localePrefix: "always"` (`/az`, `/tr`, `/en`), kök `/` → `/az` redirect; köhnə `/` + `as-needed` AZ üçün işləmirdi.
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
[portfolio_gsap] — günün sonu
Tarix: 09 may 2026

1. Ana portfolio səhifəsi `src/app/portfolio` altında data, hook, stil və bölüm komponentlərinə bölündü.
2. `tsconfig`də `deneme1` istisnası və `v3`/`v5` TS düzəltmələri ilə `next build` uğurla keçir.
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
[portfolio_gsap] — günün sonu
Tarix: 06 may 2026

1. Three.js küre: wireframe parlaklığı artırıldı (opacity + daha açıq indigo rəng); uyğun halka və partikul tonu.
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
[portfolio_gsap] — günün sonu
Tarix: 05 may 2026

1. ScrollTrigger girişləri sıraya salındı: əvvəlki section viewport-dan çıxmadısa növbətinin ani animasiyası başlamır.
2. Skills: vaxtlı oxda əvvəl pin + x-scroll, sonra ayrı scroll fazında kart/bar reveal.
3. Skill kartları: autoAlpha ilə gizlənib yalnız opacity tween ediləndən “visibility:hidden” qalığı düzəldildi.
4. Skills: kart/bar animasiyası yatay track ilə containerAnimation — hər kart viewport-a girdikdə oynayır.
5. Projects: pin süresi 10.5vh əlavəsinə qısıldı — yatay bitəndə unpin olur, növbəti dikey keçid experience-da işləyir; kartlar containerAnimation ilə bağlandı.
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────

