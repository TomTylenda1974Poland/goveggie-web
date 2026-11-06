(() => {
  const status = document.getElementById("offline-status");
  const explain = text => { if (status) status.textContent = text; };
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
  navigator.serviceWorker.register("./sw.js", {scope: "./"})
    .then(() => navigator.serviceWorker.ready)
    .then(() => explain("Disponible sin conexión en este navegador."))
    .catch(() => explain("Mantén esta página abierta si vas a perder la conexión."));
})();
