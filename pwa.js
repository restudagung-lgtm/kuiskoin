// ─── PWA: Service Worker ───
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("./sw.js")
      .then(function(reg) {
        reg.addEventListener("updatefound", function() {
          var nw = reg.installing;
          nw.addEventListener("statechange", function() {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              if (typeof toast === "function")
                toast("🔄 Update tersedia! Refresh untuk versi terbaru.", "var(--blue)");
            }
          });
        });
      })
      .catch(function(e) { console.warn("[PWA] SW failed:", e); });
  });
}

// ─── Install Prompt ───
var deferredInstall = null;

window.addEventListener("beforeinstallprompt", function(e) {
  e.preventDefault();
  deferredInstall = e;
  var banner = document.getElementById("installBanner");
  if (banner) banner.style.display = "flex";
});

window.addEventListener("appinstalled", function() {
  deferredInstall = null;
  dismissInstall();
  if (typeof toast === "function") toast("🎉 KuisKoin berhasil diinstall!", "var(--green)");
});

function installApp() {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  deferredInstall.userChoice.then(function(c) {
    if (c.outcome === "accepted") {
      if (typeof toast === "function") toast("📲 Menginstall KuisKoin...", "var(--accent)");
    }
    deferredInstall = null;
    dismissInstall();
  });
}

function dismissInstall() {
  var b = document.getElementById("installBanner");
  if (b) b.style.display = "none";
}

// ─── Share Score ───
function shareScore(score, rankName) {
  var text = "Aku dapat skor " + score + " di KuisKoin! Rank: " + rankName + " 🎯🪙 Bisa kalahkan aku?";
  if (navigator.share) {
    navigator.share({ title: "KuisKoin 🎯", text: text, url: window.location.href }).catch(function(){});
  } else {
    navigator.clipboard && navigator.clipboard.writeText(text)
      .then(function() { if (typeof toast === "function") toast("📋 Skor disalin!", "var(--accent)"); });
  }
}

// ─── Notification Permission ───
function requestNotifPermission() {
  if (!("Notification" in window) || Notification.permission !== "default") return;
  Notification.requestPermission().then(function(p) {
    if (p === "granted" && typeof toast === "function")
      toast("🔔 Notifikasi aktif!", "var(--green)");
  });
}
