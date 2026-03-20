(function () {
  const VALID_THEMES = ["light", "dark"];
  const STORAGE_KEY = "themePreference";
  const htmlEl = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  const iconSun = document.getElementById("icon-sun");
  const iconMoon = document.getElementById("icon-moon");

  // ── Đọc theme hiện tại từ data-theme (đã được set bởi script inline trong <head>) ──
  function getCurrentTheme() {
    return htmlEl.getAttribute("data-theme") || "light";
  }

  // ── Cập nhật icon theo theme ──
  function updateIcon(theme) {
    if (theme === "dark") {
      iconSun.style.display = "none";
      iconMoon.style.display = "block";
      toggleBtn.setAttribute("aria-label", "Chuyển sang giao diện sáng");
      toggleBtn.title = "Chuyển sang giao diện sáng ☀️";
    } else {
      iconSun.style.display = "block";
      iconMoon.style.display = "none";
      toggleBtn.setAttribute("aria-label", "Chuyển sang giao diện tối");
      toggleBtn.title = "Chuyển sang giao diện tối 🌙";
    }
  }

  // ── Áp dụng theme ──
  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    updateIcon(theme);
  }

  // ── Lưu vào localStorage (với error handling cho Private Mode) ──
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // Private mode: không lưu được, nhưng app vẫn hoạt động trong session này
      console.warn(
        "[ThemeSwitcher] localStorage không khả dụng (chế độ riêng tư?)",
      );
    }
  }

  // ── Khởi tạo: đồng bộ icon với theme đã được set bởi script FOUC ──
  updateIcon(getCurrentTheme());

  // ── Xử lý click toggle ──
  toggleBtn.addEventListener("click", function () {
    const current = getCurrentTheme();
    const next = current === "light" ? "dark" : "light";

    applyTheme(next);
    saveTheme(next);

    // Animation xoay icon
    toggleBtn.classList.add("spinning");
    setTimeout(() => toggleBtn.classList.remove("spinning"), 500);
  });

  // ── Lắng nghe thay đổi theme hệ điều hành ──
  // Chỉ phản ứng nếu người dùng CHƯA chọn thủ công
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", function (e) {
    let manualChoice = null;
    try {
      manualChoice = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      /* Private mode */
    }

    if (!VALID_THEMES.includes(manualChoice)) {
      // Người dùng chưa chọn thủ công → follow hệ điều hành
      applyTheme(e.matches ? "dark" : "light");
    }
    // Nếu đã chọn thủ công → giữ nguyên, bỏ qua
  });

  // ── Reading Progress Bar ──
  const progressBar = document.getElementById("progress-bar");
  function updateProgress() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY;
    const pct = docH > 0 ? Math.min(100, (scrollY / docH) * 100) : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
})();
