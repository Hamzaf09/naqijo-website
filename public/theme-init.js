/**
 * No-flash theme init. Runs before paint (loaded with next/script
 * beforeInteractive from the root layout). Keep in sync with the logic in
 * src/components/theme/theme-provider.tsx.
 */
(function () {
  try {
    var e = localStorage.getItem("theme");
    var m = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var d = e === "dark" || ((!e || e === "system") && m);
    var r = document.documentElement;
    r.classList.toggle("dark", d);
    r.style.colorScheme = d ? "dark" : "light";
  } catch {
    /* theme falls back to light */
  }
})();
