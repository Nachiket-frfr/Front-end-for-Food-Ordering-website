document.addEventListener("DOMContentLoaded", () => {
    console.log("index.js loaded and running");

    const set_btn = document.getElementById("set_btn");
    const close_btn = document.getElementById("close_btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar_overlay");
    const greet = document.getElementById("greet");
    const logout = document.getElementById("logout");

    if (!set_btn) console.warn("index.js: #set_btn not found in DOM");
    if (!sidebar) console.warn("index.js: #sidebar not found in DOM");
    if (!overlay) console.warn("index.js: #sidebar_overlay not found in DOM");
    if (!greet) console.warn("index.js: #greet not found in DOM");

    // ---------- Theme toggle ----------
    const THEME_KEY = "theme";
    const themeToggle = document.getElementById("theme_toggle");

    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
    };

    const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(savedTheme);
    if (themeToggle) themeToggle.checked = savedTheme === "light";

    if (themeToggle) {
        themeToggle.addEventListener("change", () => {
            const theme = themeToggle.checked ? "light" : "dark";
            applyTheme(theme);
            localStorage.setItem(THEME_KEY, theme);
        });
    }

    const openSidebar = () => {
        if (sidebar) sidebar.classList.add("active");
        if (overlay) overlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Stop page scrolling
    };

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
        document.body.style.overflow = ""; // Restore page scrolling
    };

    document.addEventListener("click", (e) => {
        // Open Sidebar Icon Click
        if (e.target.closest("#set_btn")) {
            e.preventDefault();
            e.stopPropagation();
            openSidebar();
            return;
        }


        if (e.target.closest("#close_btn") || e.target === overlay) {
            closeSidebar();
            return;
        }


        if (
            sidebar &&
            sidebar.classList.contains("active") &&
            !sidebar.contains(e.target) &&
            !e.target.closest("#set_btn")
        ) {
            closeSidebar();
        }
    });


    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("userName") || localStorage.getItem("username");

    if (greet) {
        if (isLoggedIn && username) {
            greet.textContent = `Welcome, ${username}!`;
        } else {
            greet.textContent = "Welcome, Guest!";
        }
    }

    if (logout) {
        logout.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userName");
            localStorage.removeItem("username");
        });
    }

    // ---------- Category scroll arrows ----------
    const mainMenu = document.getElementById("main_menu");
    const scrollLeftBtn = document.getElementById("scroll_left");
    const scrollRightBtn = document.getElementById("scroll_right");

    const updateArrowState = () => {
        if (!mainMenu) return;
        const maxScroll = mainMenu.scrollWidth - mainMenu.clientWidth;
        if (scrollLeftBtn) scrollLeftBtn.disabled = mainMenu.scrollLeft <= 0;
        if (scrollRightBtn) scrollRightBtn.disabled = mainMenu.scrollLeft >= maxScroll - 1;
    };

    if (mainMenu) {
        updateArrowState();
        mainMenu.addEventListener("scroll", updateArrowState);
        window.addEventListener("resize", updateArrowState);
    }

    document.addEventListener("click", (e) => {
        if (e.target.closest("#scroll_left") && mainMenu) {
            mainMenu.scrollBy({ left: -400, behavior: "smooth" });
        }
        if (e.target.closest("#scroll_right") && mainMenu) {
            mainMenu.scrollBy({ left: 400, behavior: "smooth" });
        }
    });
});