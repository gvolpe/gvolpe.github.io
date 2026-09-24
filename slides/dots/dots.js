(function () {
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  function trimBlock(value) {
    var lines = value.replace(/\t/g, "  ").split(/\r?\n/);
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    var indent = lines.reduce(function (min, line) {
      if (line.trim() === "") return min;
      var match = line.match(/^ */);
      return Math.min(min, match ? match[0].length : 0);
    }, Infinity);
    if (!isFinite(indent)) indent = 0;
    return lines.map(function (line) {
      return line.slice(Math.min(indent, line.length));
    }).join("\n");
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findCommentStart(line) {
    var inString = false;
    var escaped = false;
    for (var i = 0; i < line.length; i += 1) {
      var char = line[i];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === "\"") {
          inString = false;
        }
      } else if (char === "\"") {
        inString = true;
      } else if (char === "#") {
        return i;
      }
    }
    return -1;
  }

  function highlightNixCode(raw) {
    return raw.split("\n").map(function (line) {
      var commentIndex = findCommentStart(line);
      var code = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
      var comment = commentIndex >= 0 ? line.slice(commentIndex) : "";
      var tokens = [];
      var pattern = /("(?:\\.|[^"\\])*")|(\b(?:assert|else|if|in|inherit|let|rec|then|with|or)\b)|(\b(?:true|false|null)\b)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_'-]*(?=\s*=))/g;
      var cursor = 0;
      var out = "";
      var match;

      while ((match = pattern.exec(code))) {
        out += escapeHtml(code.slice(cursor, match.index));
        if (match[1]) {
          tokens.push("<span class=\"str\">" + escapeHtml(match[1]) + "</span>");
        } else if (match[2]) {
          tokens.push("<span class=\"kw\">" + escapeHtml(match[2]) + "</span>");
        } else if (match[3]) {
          tokens.push("<span class=\"bool\">" + escapeHtml(match[3]) + "</span>");
        } else if (match[4]) {
          tokens.push("<span class=\"number\">" + escapeHtml(match[4]) + "</span>");
        } else if (match[5]) {
          tokens.push("<span class=\"attr\">" + escapeHtml(match[5]) + "</span>");
        }
        out += tokens.pop();
        cursor = pattern.lastIndex;
      }

      out += escapeHtml(code.slice(cursor));
      if (comment) {
        out += "<span class=\"comment\">" + escapeHtml(comment) + "</span>";
      }
      return out;
    }).join("\n");
  }

  function highlightTerminal(raw) {
    return raw.split("\n").map(function (line) {
      var escaped = escapeHtml(line);
      if (/^\s*\$ /.test(line)) {
        return escaped.replace(/^(\s*)\$ /, "$1<span class=\"prompt\">$</span> ");
      }
      if (/^\s*error:/.test(line)) {
        return "<span class=\"error\">" + escaped + "</span>";
      }
      return escaped
        .replace(/(\/nix\/store\/[A-Za-z0-9._+?-]+)/g, "<span class=\"path\">$1</span>")
        .replace(/\b(Done|Activating|success|finished)\b/g, "<span class=\"ok\">$1</span>")
        .replace(/\b(Unproductive)\b/g, "<span class=\"error\">$1</span>");
    }).join("\n");
  }

  function wrapLines(html, withLines) {
    var className = withLines ? "code-lines" : "";
    var lines = html.split("\n").map(function (line) {
      var text = line.length ? line : "&nbsp;";
      return "<span class=\"code-line\"><span class=\"code-text\">" + text + "</span></span>";
    }).join("");
    return "<code class=\"" + className + "\">" + lines + "</code>";
  }

  function renderCodeBlocks() {
    var blocks = document.querySelectorAll("script[type='text/plain'][data-code], script[type='text/plain'][data-terminal]");
    blocks.forEach(function (source, index) {
      var isTerminal = source.hasAttribute("data-terminal");
      var language = isTerminal ? "terminal" : source.dataset.code || "text";
      var title = source.dataset.title || (isTerminal ? "terminal" : language);
      var raw = trimBlock(source.textContent);
      var figure = document.createElement("figure");
      var lines = source.dataset.lines !== "false" && !isTerminal;
      var highlighted = isTerminal ? highlightTerminal(raw) : language === "nix" ? highlightNixCode(raw) : escapeHtml(raw);

      figure.className = "code-window " + (isTerminal ? "terminal" : "language-" + language);
      figure.dataset.renderedCode = String(index + 1);
      var codeWindowWidth = source.dataset.width || source.dataset.terminalWidth;
      if (codeWindowWidth) {
        figure.style.setProperty("--code-window-width", codeWindowWidth);
      }
      if (isTerminal && source.dataset.terminalWidth) {
        figure.style.setProperty("--terminal-width", source.dataset.terminalWidth);
      }
      figure.innerHTML =
        "<figcaption><span>" + escapeHtml(title) + "</span><span>" + escapeHtml(language) + "</span></figcaption>" +
        "<pre>" + wrapLines(highlighted, lines) + "</pre>";
      source.replaceWith(figure);
    });
  }

  renderCodeBlocks();

  var slides = Array.from(document.querySelectorAll(".slide"));
  var counter = document.getElementById("counter");
  var progress = document.getElementById("progress");
  var previousButton = document.getElementById("prevSlide");
  var nextButton = document.getElementById("nextSlide");
  var touchStartX = 0;
  var touchStartY = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function indexFromHash() {
    var value = Number(window.location.hash.replace("#", ""));
    return Number.isFinite(value) && value > 0 ? value - 1 : 0;
  }

  var activeIndex = clamp(indexFromHash(), 0, slides.length - 1);

  function showSlide(nextIndex, updateHash) {
    activeIndex = clamp(nextIndex, 0, slides.length - 1);
    slides.forEach(function (slide, index) {
      var isActive = index === activeIndex;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    counter.textContent = String(activeIndex + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    progress.style.width = (((activeIndex + 1) / slides.length) * 100) + "%";
    document.title = (slides[activeIndex].dataset.title || "Dots") + " - Dots";
    if (updateHash) {
      history.replaceState(null, "", "#" + (activeIndex + 1));
    }
  }

  function nextSlide() {
    showSlide(activeIndex + 1, true);
  }

  function previousSlide() {
    showSlide(activeIndex - 1, true);
  }

  previousButton.addEventListener("click", previousSlide);
  nextButton.addEventListener("click", nextSlide);

  document.addEventListener("keydown", function (event) {
    var tagName = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
    if (tagName === "input" || tagName === "textarea" || event.target.isContentEditable) return;

    if (["ArrowRight", "PageDown", " ", "j", "l"].includes(event.key)) {
      event.preventDefault();
      nextSlide();
    } else if (["ArrowLeft", "PageUp", "Backspace", "h", "k"].includes(event.key)) {
      event.preventDefault();
      previousSlide();
    } else if (event.key === "Home") {
      event.preventDefault();
      showSlide(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      showSlide(slides.length - 1, true);
    }
  });

  document.addEventListener("touchstart", function (event) {
    if (!event.changedTouches.length) return;
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", function (event) {
    if (!event.changedTouches.length) return;
    var dx = event.changedTouches[0].clientX - touchStartX;
    var dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) nextSlide();
    else previousSlide();
  }, { passive: true });

  window.addEventListener("hashchange", function () {
    showSlide(indexFromHash(), false);
  });

  showSlide(activeIndex, Boolean(window.location.hash));
})();
