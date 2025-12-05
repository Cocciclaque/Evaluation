/* ============================================
   🍪 COOKIE CONSENT MANAGER - PeakDLE
   ============================================ */

(function () {
  "use strict";

  const CONSENT_KEY = "peakdle_cookie_consent";
  const CONSENT_EXPIRY_DAYS = 365;

  // Vérifie si le consentement a déjà été donné
  function hasConsent() {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return null;

    try {
      const data = JSON.parse(consent);
      const now = new Date().getTime();

      // Vérifie si le consentement n'a pas expiré
      if (data.expiry && data.expiry > now) {
        return data.accepted;
      }

      // Consentement expiré, on le supprime
      localStorage.removeItem(CONSENT_KEY);
      return null;
    } catch (e) {
      return null;
    }
  }

  // Sauvegarde le consentement
  function saveConsent(accepted) {
    const now = new Date().getTime();
    const expiry = now + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    const data = {
      accepted: accepted,
      timestamp: now,
      expiry: expiry,
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
  }

  // Affiche la bannière
  function showBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      // Petit délai pour l'animation
      setTimeout(() => {
        banner.classList.add("show");
      }, 500);
    }
  }

  // Cache la bannière
  function hideBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.classList.remove("show");
      // Retire complètement après l'animation
      setTimeout(() => {
        banner.classList.add("hidden");
      }, 400);
    }
  }

  // Gère l'acceptation
  function acceptCookies() {
    saveConsent(true);
    hideBanner();

    // Ici, vous pouvez charger Buy Me a Coffee ou d'autres services
    console.log("✅ Cookies acceptés - Services tiers peuvent être chargés");

    // Exemple : Charger Buy Me a Coffee
    // loadBuyMeACoffee();
  }

  // Gère le refus
  function declineCookies() {
    saveConsent(false);
    hideBanner();
    console.log("❌ Cookies refusés - Services tiers bloqués");
  }

  // Initialisation au chargement de la page
  function init() {
    const consent = hasConsent();

    // MODE TEST : Toujours afficher la bannière
    showBanner();
    console.log("🧪 TEST MODE: Banner shown on every refresh");

    /* MODE PRODUCTION : Décommentez ce bloc et supprimez les 2 lignes ci-dessus
    // Si pas de consentement enregistré, afficher la bannière
    if (consent === null) {
      showBanner();
    } else if (consent === false) {
      // L'utilisateur a refusé, ne rien charger
      console.log("🚫 Consentement refusé précédemment");
    } else {
      // L'utilisateur a accepté, charger les services
      console.log("✅ Consentement accepté précédemment");
      // loadBuyMeACoffee();
    }
    */

    // Attacher les événements aux boutons
    const acceptBtn = document.getElementById("cookie-accept");
    const declineBtn = document.getElementById("cookie-decline");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", acceptCookies);
    }

    if (declineBtn) {
      declineBtn.addEventListener("click", declineCookies);
    }
  }

  // Fonction pour charger Buy Me a Coffee (si consentement accepté)
  function loadBuyMeACoffee() {
    // Exemple de chargement du widget Buy Me a Coffee
    // À adapter selon votre configuration
    console.log("🍵 Chargement de Buy Me a Coffee...");

    // Si vous avez un widget Buy Me a Coffee, le charger ici
    // const script = document.createElement('script');
    // script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    // script.setAttribute('data-name', 'BMC-Widget');
    // script.setAttribute('data-id', 'VOTRE_ID');
    // script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    // script.setAttribute('data-message', 'Thanks for visiting!');
    // script.setAttribute('data-color', '#FF6B35');
    // script.setAttribute('data-position', 'Right');
    // script.setAttribute('data-x_margin', '18');
    // script.setAttribute('data-y_margin', '18');
    // document.body.appendChild(script);
  }

  // API publique pour réinitialiser le consentement (utile pour les tests)
  window.PeakDLECookies = {
    reset: function () {
      localStorage.removeItem(CONSENT_KEY);
      location.reload();
    },
    status: function () {
      const consent = hasConsent();
      if (consent === null) return "non défini";
      if (consent === true) return "accepté";
      return "refusé";
    },
    hasConsent: hasConsent,
  };

  // Démarrer quand le DOM est prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
