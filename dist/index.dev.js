"use strict";

!function _callee2() {
  var platform, xss, md, decodeUnicode, sabersData, sabers, filters, filteredHandle, handle, filterModels, initModels;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          initModels = function _ref5() {
            filterModels();
            $("#sabers").html("");
            var nowIndex = 0,
                maxIndex = 10;

            function loadModels() {
              var _loop = function _loop() {
                var model = sabers.shift();
                nowIndex++;
                if (!model) return "continue";
                var dom = $("<div class=\"model\">\n            <div class=\"image\">\n                <img class=\"img\" data-gisrc=''\n                    data-gishow />\n                    <div class=\"img-no-image\">\u65E0\u56FE\u7247</div>\n            </div>\n            <div class=\"id\"></div>\n            <div class=\"detail\">\n                <div class=\"information\">\n                    <div class=\"name\"></div>\n                    <div class=\"author\"></div>\n                </div>\n                <div class=\"operations\">\n                    <button class=\"btn btn-icon more-information-btn\">\n                        <i class=\"icon ti ti-info-circle\"></i>\n                    </button>\n                    <button class=\"btn btn-icon download-btn\">\n                        <i class=\"icon ti ti-download\"></i>\n                    </button>\n                </div>\n            </div>\n        </div>");

                if (!model["imgurl"]) {
                  // dom.find(".detail").addClass("no-image");
                  dom.find(".img").remove();
                  dom.find(".img-no-image").addClass("shown");
                } else {
                  if (platform == "Github Pages") dom.find(".img").attr("data-gisrc", "https://raw.githubusercontent.com/MicroCBer/ModelViewer/main/" + model["imgurl"]);else dom.find(".img").attr("src", model["imgurl"]);
                }

                dom.find(".name").text(decodeUnicode(model["name"]));
                dom.find(".author").text(decodeUnicode(model["author"]));
                dom.find(".id").text(model["uploadtime"]);
                $("#sabers").append(dom[0]);
                $($("#sabers")[0].lastChild).find(".more-information-btn").click(function () {
                  $.ui.dialog({
                    title: model["name"],
                    message: md(model["description"])
                  });
                });
                $($("#sabers")[0].lastChild).find(".download-btn").click(function () {
                  document.location.assign(model["modelurl"]);
                });
              };

              while (maxIndex > nowIndex) {
                var _ret = _loop();

                if (_ret === "continue") continue;
              }

              if (platform == "Github Pages") $("img[data-gisrc]").gazeimg({
                bg: ['#000']
              });
            }

            var loadLock = false;
            if (handle) removeEventListener("scroll", handle);
            handle = addEventListener("scroll", function () {
              if (window.scrollY > document.body.scrollHeight - 1500 && !loadLock) {
                loadLock = true;
                maxIndex = Math.min(sabers.length, maxIndex + 10);
                loadModels();
                setTimeout(function () {
                  return loadLock = false;
                }, 100);
              }
            });
            loadModels();
          };

          filterModels = function _ref4() {
            sabers = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              model: for (var _iterator = sabersData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var model = _step.value;

                for (var _i = 0, _Object$values = Object.values(filters); _i < _Object$values.length; _i++) {
                  var filter = _Object$values[_i];
                  if (!filter(model)) continue model;
                }

                sabers.push(model);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            filteredHandle();
          };

          decodeUnicode = function _ref3(str) {
            return unescape(str.replace(/\\u/g, '%u'));
          };

          md = function _ref2(str) {
            return xss(decodeUnicode(str)).replace(/__(.*?)__/g, "<i>$1</i>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
          };

          xss = function _ref(str) {
            return str.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>");
          };

          platform = {
            "localhost:5500": "localhost",
            "127.0.0.1:5500": "localhost",
            "microblock.ink": "Github Pages"
          }[document.location.host] || "Unknown";
          if (document.location.host.includes("zeyu")) platform = "WGzeyu";
          $(".meta").text("\u7248\u672C\uFF1A0.13\uFF0C\u524D\u7AEF\uFF1AMicroBlock\uFF0C\u540E\u7AEF\uFF1AWGzeyu\uFF0C\u670D\u52A1\u5668\uFF1A".concat(platform, "\uFF0C\u6570\u636E\u6E90\uFF1AQosmeticsDiscord."));
          if (platform == "WGzeyu") $(".contact").text("If you don't want your models to appear on this website, please contact WGzeyu at Discord WGzeyu#7287 or 785777793@qq.com");
          _context2.t0 = regeneratorRuntime;
          _context2.next = 12;
          return regeneratorRuntime.awrap(fetch("data/qsabers-web.json" + "?" + new Date().getTime()));

        case 12:
          _context2.t1 = _context2.sent.json();
          _context2.next = 15;
          return _context2.t0.awrap.call(_context2.t0, _context2.t1);

        case 15:
          sabersData = _context2.sent["model"];
          sabers = [];
          filters = {};

          filteredHandle = function filteredHandle() {
            sabers.sort(function (a, b) {
              return b["uploadtime"] - a["uploadtime"];
            });
          };

          handle = null;
          initModels();
          $("#gqui-imageonly").on("change", function () {
            if (this.checked) filters["imageonly"] = function (model) {
              return model["imgurl"] ? true : false;
            };else delete filters["imageonly"];
            initModels();
          });
          $("#gqui-timesort").on("change", function () {
            filteredHandle = function filteredHandle() {
              sabers.sort(function (a, b) {
                return a["uploadtime"] - b["uploadtime"];
              });
            };

            initModels();
          });
          $("#gqui-timesort-reversed").on("change", function () {
            filteredHandle = function filteredHandle() {
              sabers.sort(function (a, b) {
                return b["uploadtime"] - a["uploadtime"];
              });
            };

            initModels();
          });
          $("#gqui-unsort").on("click", function () {
            filteredHandle = function filteredHandle() {
              sabers.sort(function (a, b) {
                return Math.random() - 0.5;
              });
            };

            initModels();
          });
          $("#gqui-search").on("change", function () {
            if (this.checked) {
              search.disabled = true;

              filters["search"] = function (model) {
                return model["description"].includes(search.value);
              };
            } else {
              delete filters["search"];
              search.disabled = false;
            }

            initModels();
          });
          $(".btnSubtitle").click(function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!$(this).hasClass("activated")) {
                      _context.next = 2;
                      break;
                    }

                    return _context.abrupt("return");

                  case 2:
                    $(".btnSubtitle").removeClass("activated");
                    $(this).addClass("activated");
                    _context.t0 = regeneratorRuntime;
                    _context.next = 7;
                    return regeneratorRuntime.awrap(fetch(this.dataset.file + "?" + new Date().getTime()));

                  case 7:
                    _context.t1 = _context.sent.json();
                    _context.next = 10;
                    return _context.t0.awrap.call(_context.t0, _context.t1);

                  case 10:
                    sabersData = _context.sent["model"];
                    $("#sabers").fadeOut(200);
                    setTimeout(function () {
                      initModels();
                      $("#sabers").fadeIn(200);
                    }, 200);

                  case 13:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, this);
          });

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  });
}();