/* Sibusisiwe Cancer Care Center — progressive enhancements.
   The site is fully readable without JavaScript; this adds the mobile menu,
   scroll reveals, gallery lightbox, copy buttons and the enquiry forms. */
(function () {
  "use strict";

  // Number the enquiry forms send to (international format, no "+" or spaces).
  var WHATSAPP_NUMBER = "27828127151";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Mobile navigation ---------- */
  var toggle = $(".nav-toggle");
  var nav = $("#primary-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = $(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Gallery lightbox ---------- */
  var box = $("#lightbox");
  var links = $$("[data-lightbox]");
  if (box && typeof box.showModal === "function" && links.length) {
    var img = $("img", box);
    var cap = $("figcaption", box);
    var current = 0;
    var show = function (i) {
      current = (i + links.length) % links.length;
      var a = links[current];
      var thumb = $("img", a);
      img.src = a.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      cap.textContent = a.getAttribute("data-caption") || (thumb ? thumb.alt : "");
    };
    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        show(i);
        box.showModal();
      });
    });
    $(".lb-prev", box).addEventListener("click", function () { show(current - 1); });
    $(".lb-next", box).addEventListener("click", function () { show(current + 1); });
    $(".lb-close", box).addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box || e.target.classList.contains("lightbox-inner")) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    box.addEventListener("close", function () { img.removeAttribute("src"); });
  }

  /* ---------- Copy to clipboard ---------- */
  $$("[data-copy]").forEach(function (btn) {
    var label = btn.querySelector("span");
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        if (!label) return;
        var old = label.textContent;
        label.textContent = "Copied";
        setTimeout(function () { label.textContent = old; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (err) { /* ignore */ }
        document.body.removeChild(ta); done();
      }
    });
  });

  /* ---------- Enquiry forms -> WhatsApp ----------
     A static site has no server to receive form posts, so the forms compose
     a message and hand it to WhatsApp (and the phone number is always shown
     beside them for anyone who would rather call). */
  $$("form[data-whatsapp]").forEach(function (form) {
    var status = $(".form-status", form);

    // Pre-select a topic from ?topic=partner etc.
    var topic = new URLSearchParams(window.location.search).get("topic");
    var select = $("select[name='topic']", form);
    if (topic && select) {
      Array.prototype.some.call(select.options, function (o) {
        if (o.value === topic) { select.value = topic; return true; }
        return false;
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var lines = [form.getAttribute("data-intro") || "Hello Sibusisiwe Cancer Care Center,", ""];
      var add = function (label, value) { if (value) lines.push(label + ": " + value); };

      add("Name", data.get("name"));
      add("Phone / WhatsApp", data.get("phone"));
      add("Area / town", data.get("area"));
      if (select) {
        var opt = select.options[select.selectedIndex];
        add("Enquiry about", opt ? opt.text : "");
      }
      add("Support is for", data.get("for"));
      var needs = data.getAll("need");
      if (needs.length) add("Support needed", needs.join(", "));
      if (data.get("message")) { lines.push(""); lines.push(String(data.get("message"))); }

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      if (status) status.textContent = "Opening WhatsApp with your message… If nothing opens, please call us on 082 812 7151.";
      window.open(url, "_blank", "noopener");
    });
  });
})();
