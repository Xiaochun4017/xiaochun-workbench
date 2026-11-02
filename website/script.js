/* 晓春工作台 · 交互脚本 */
(function () {
  "use strict";

  var zTop = 20;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ---- 时钟与问候 ---- */
  function tick() {
    var now = new Date();
    var h = now.getHours();
    var greeting =
      h < 5 ? "夜深了" :
      h < 9 ? "早上好" :
      h < 12 ? "上午好" :
      h < 14 ? "中午好" :
      h < 18 ? "下午好" :
      h < 23 ? "晚上好" : "夜深了";
    var pad = function (n) { return n < 10 ? "0" + n : "" + n; };
    var week = ["日", "一", "二", "三", "四", "五", "六"][now.getDay()];
    $("#greeting").textContent = greeting + "，晓春";
    $("#clock").textContent =
      now.getFullYear() + "/" + pad(now.getMonth() + 1) + "/" + pad(now.getDate()) +
      " 周" + week + " " + pad(h) + ":" + pad(now.getMinutes());
  }
  tick();
  setInterval(tick, 10000);

  /* ---- 窗口开关 ---- */
  function openWindow(id) {
    var win = document.getElementById(id);
    if (!win) return;
    win.classList.add("open");
    focusWindow(win);
  }
  function closeWindow(id) {
    var win = document.getElementById(id);
    if (win) win.classList.remove("open");
  }
  function focusWindow(win) {
    $all(".window").forEach(function (w) { w.classList.remove("top"); });
    win.classList.add("top");
    win.style.zIndex = ++zTop;
  }

  $all("[data-window]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openWindow(btn.getAttribute("data-window"));
    });
  });
  $all(".win-close").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeWindow(btn.getAttribute("data-close"));
    });
  });

  /* ---- 窗口拖动 ---- */
  $all(".window").forEach(function (win) {
    var bar = $(".win-bar", win);
    var dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;

    function onMove(e) {
      if (!dragging) return;
      var x = e.clientX - sx + ox;
      var y = e.clientY - sy + oy;
      var rect = win.getBoundingClientRect();
      var maxX = window.innerWidth - rect.width - 12;
      var maxY = window.innerHeight - 60;
      x = Math.max(-rect.width + 80, Math.min(x, maxX));
      y = Math.max(40, Math.min(y, maxY));
      win.style.left = x + "px";
      win.style.top = y + "px";
    }
    function onUp() {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    bar.addEventListener("mousedown", function (e) {
      if (e.target.closest(".win-close")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      focusWindow(win);
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
    win.addEventListener("mousedown", function () { focusWindow(win); });
  });

  /* ---- 触屏：图标单击已可打开，桌面空白处双击全部收起 ---- */
  $("#desktop").addEventListener("dblclick", function (e) {
    if (e.target.closest(".window") || e.target.closest(".icon")) return;
    $all(".window.open").forEach(function (w) { w.classList.remove("open"); });
  });
})();
