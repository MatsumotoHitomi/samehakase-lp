/* =========================================================
   サメ博士LP スクリプト
   - スクロールでヘッダー／追従CTAを出現
   - ヒーロー内では隠す（デザインの邪魔をしない）
   ========================================================= */
(function () {
  "use strict";

  // JS有効時のみ出現アニメ用の初期非表示を有効化（no-JSでも必ず見える）
  document.documentElement.classList.add("js");

  var header = document.getElementById("siteHeader");
  var sticky = document.getElementById("stickyCta");
  var hero = document.getElementById("hero");

  // ヒーローを抜けたらヘッダー＆追従CTAを表示
  if ("IntersectionObserver" in window && hero) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var passedHero = !e.isIntersecting;
        if (header) header.classList.toggle("is-visible", passedHero);
        if (sticky) sticky.classList.toggle("is-visible", passedHero);
      });
    }, { rootMargin: "-70% 0px 0px 0px" });
    io.observe(hero);
  } else {
    // フォールバック：スクロール量で判定
    window.addEventListener("scroll", function () {
      var passed = window.scrollY > window.innerHeight * 0.6;
      if (header) header.classList.toggle("is-visible", passed);
      if (sticky) sticky.classList.toggle("is-visible", passed);
    }, { passive: true });
  }

  // JOIN（LINE登録CTAがある最終セクション）が見えたら追従CTAは隠す（重複＆フッター被り防止）
  var joinSec = document.getElementById("join");
  if ("IntersectionObserver" in window && joinSec && sticky) {
    var joinIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) sticky.classList.remove("is-visible");
      });
    }, { threshold: 0.15 });
    joinIO.observe(joinSec);
  }

  // 自動スクロールギャラリー：同じ画像を複製して継ぎ目のない無限ループに
  var specTrack = document.getElementById("specTrack");
  if (specTrack) {
    var specItems = Array.prototype.slice.call(specTrack.children);
    specItems.forEach(function (el) {
      var clone = el.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      specTrack.appendChild(clone);
    });
  }

  // 動画プレースホルダー：実装前の暫定クリック挙動
  var play = document.querySelector(".video-play");
  if (play) {
    play.addEventListener("click", function () {
      // 後で実際の動画埋め込みに差し替え予定
      console.log("動画枠プレースホルダーがクリックされました（動画URL未設定）");
    });
  }

  // 出現アニメーション（軽量なフェードアップ）
  var targets = document.querySelectorAll(
    ".proof-card, .benefit-card, .check-item, .story-step, .stat, .join-card, .insta-card, .video-frame"
  );
  function revealAll() {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  }
  if ("IntersectionObserver" in window && targets.length) {
    targets.forEach(function (el) { el.classList.add("reveal"); });
    var revealIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { revealIO.observe(el); });
    // 安全策：何らかの理由でIOが発火しない環境でも必ず表示する
    setTimeout(revealAll, 1600);
  }
})();
