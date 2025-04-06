/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./board.js":
/*!******************!*\
  !*** ./board.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   angleStep: () => (/* binding */ angleStep),\n/* harmony export */   board: () => (/* binding */ board),\n/* harmony export */   centerRadius: () => (/* binding */ centerRadius),\n/* harmony export */   drawBoard: () => (/* binding */ drawBoard),\n/* harmony export */   letters: () => (/* binding */ letters),\n/* harmony export */   lineColors: () => (/* binding */ lineColors),\n/* harmony export */   outerBorderRadius: () => (/* binding */ outerBorderRadius),\n/* harmony export */   outerBorderThick: () => (/* binding */ outerBorderThick),\n/* harmony export */   radiusStep: () => (/* binding */ radiusStep),\n/* harmony export */   rings: () => (/* binding */ rings),\n/* harmony export */   sectors: () => (/* binding */ sectors),\n/* harmony export */   viewBoxDict: () => (/* binding */ viewBoxDict)\n/* harmony export */ });\n/* harmony import */ var _common_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common_math.js */ \"./common_math.js\");\n/* harmony import */ var _cell_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cell.js */ \"./cell.js\");\nfunction _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(r) { if (Array.isArray(r)) return r; }\n\n\nvar board = document.getElementById(\"board\");\nvar viewBoxDict = board.getAttribute(\"viewBox\").split(\" \").map(Number);\nvar rings = 6;\nvar sectors = 24;\nvar radiusStep = 40;\nvar centerRadius = 100;\nvar outerBorderThick = 9;\nvar outerBorderRadius = rings * radiusStep + centerRadius + outerBorderThick;\nvar angleStep = 360 / sectors;\nvar letters = \"ABCDEFGHIJKL\";\nvar lineColors = [\"yellow-line\", \"blue-line\", \"pink-line\", \"black-line\", \"green-line\", \"maroon-line\", \"gray-line\", \"yellow-line\"];\nfunction drawBoard() {\n  drawcenterCircle();\n  drawCellsAndArcs();\n  drawOuterBorder();\n}\nfunction drawcenterCircle() {\n  var centerCircle = document.createElementNS(\"http://www.w3.org/2000/svg\", \"circle\");\n  centerCircle.setAttribute(\"cx\", 0);\n  centerCircle.setAttribute(\"cy\", 0);\n  centerCircle.setAttribute(\"r\", centerRadius);\n  centerCircle.setAttribute(\"fill\", \"#BE885E\");\n  board.appendChild(centerCircle);\n}\nfunction drawCellsAndArcs() {\n  for (var ring = 1; ring <= rings; ring++) {\n    var innerRadius = (ring - 1) * radiusStep + centerRadius;\n    var outerRadius = ring * radiusStep + centerRadius;\n    for (var sector = 0; sector < sectors; sector++) {\n      var startAngle = sector * angleStep;\n      var endAngle = (sector + 1) * angleStep;\n      var midValues = (0,_cell_js__WEBPACK_IMPORTED_MODULE_1__.drawCell)(ring, sector, innerRadius, outerRadius, startAngle, endAngle);\n      if (ring === rings) {\n        drawArc(midValues, lineColors[sector % lineColors.length]);\n      }\n    }\n  }\n  drawGreenStripes(3, 5, \"thin\");\n  drawGreenStripes(5, 6, \"thick\");\n  (0,_cell_js__WEBPACK_IMPORTED_MODULE_1__.drawAllCellBorders)();\n}\nfunction drawOuterBorder() {\n  var outerBorder = document.createElementNS(\"http://www.w3.org/2000/svg\", \"circle\");\n  outerBorder.setAttribute(\"cx\", 0);\n  outerBorder.setAttribute(\"cy\", 0);\n  outerBorder.setAttribute(\"r\", outerBorderRadius);\n  outerBorder.setAttribute(\"class\", \"outer-border\");\n  board.appendChild(outerBorder);\n  for (var sector = 0; sector < sectors; sector++) {\n    drawLetterOuterBorder(sector);\n  }\n}\nfunction drawLetterOuterBorder(sector) {\n  var midAngle = (sector + 0.5) * angleStep;\n  var letter = letters[(sectors - sector) % letters.length];\n  var text = document.createElementNS(\"http://www.w3.org/2000/svg\", \"text\");\n  text.setAttribute(\"x\", Math.cos((0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.toRad)(midAngle)) * outerBorderRadius + 1);\n  text.setAttribute(\"y\", Math.sin((0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.toRad)(midAngle)) * outerBorderRadius + 1);\n  text.setAttribute(\"text-anchor\", \"middle\");\n  text.setAttribute(\"alignment-baseline\", \"middle\");\n  text.setAttribute(\"font-size\", \"16\");\n  text.setAttribute(\"font-family\", \"sans-serif\");\n  text.setAttribute(\"fill\", \"#000\");\n  text.setAttribute(\"class\", \"board-letter\");\n  text.setAttribute(\"transform\", \"rotate(\".concat(midAngle - 90, \", \\n        \").concat(Math.cos((0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.toRad)(midAngle)) * outerBorderRadius, \", \\n        \").concat(Math.sin((0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.toRad)(midAngle)) * outerBorderRadius, \")\"));\n  text.textContent = letter;\n  board.appendChild(text);\n}\nfunction drawArc(values, lineColor) {\n  var _values = _slicedToArray(values, 2),\n    angle = _values[0],\n    radius = _values[1];\n  var path = \"\\n        M \".concat(getPoint(angle, radius), \" \\n\\n        \").concat(getArcPoint(angle, radius, 1.0, 1.0), \"\\n        \").concat(getArcPoint(angle, radius, 2.0, 2.0), \"\\n        \").concat(getArcPoint(angle, radius, 3.0, 3.0), \"\\n        \").concat(getArcPoint(angle, radius, 4.0, 4.0), \"\\n        \").concat(getArcPoint(angle, radius, 4.0, 4.0), \"\\n        \").concat(getArcPoint(angle, radius, 5.0, 5.0), \"\\n        \").concat(getArcPoint(angle, radius, 5.3, 5.3), \"\\n        \").concat(getArcPoint(angle, radius, 0.0, 8.8, 0.6), \"\\n        \").concat(getArcPoint(angle, radius, -5.3, 5.3), \"\\n        \").concat(getArcPoint(angle, radius, -5.0, 5.0), \"\\n        \").concat(getArcPoint(angle, radius, -4.0, 4.0), \"\\n        \").concat(getArcPoint(angle, radius, -3.0, 3.0), \"\\n        \").concat(getArcPoint(angle, radius, -2.0, 2.0), \"\\n        \").concat(getArcPoint(angle, radius, -1.0, 1.0), \"\\n\\n        A \").concat(radius, \" \").concat(radius, \" 0 0 0 \").concat(getPoint(angle, radius), \"\\n        Z\\n    \");\n  var arc = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n  arc.setAttribute(\"d\", path);\n  arc.setAttribute(\"class\", \"line \".concat(lineColor));\n  board.appendChild(arc);\n}\nfunction getArcPoint(angle, radius, kX, kY) {\n  var kRadius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;\n  return \"A \".concat(radius * kRadius, \" \").concat(radius * kRadius, \" 0 0 0 \") + \"\".concat((0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getX)(angle - angleStep * kX) * (radius - radiusStep * kY), \" \") + \"\".concat((0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getY)(angle - angleStep * kX) * (radius - radiusStep * kY), \" \");\n}\nfunction getPoint(angle, radius) {\n  return \"\".concat((0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getX)(angle) * radius, \" \").concat((0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getY)(angle) * radius, \" \");\n}\nfunction drawGreenStripes(ring1, ring2, kindStripe) {\n  var radius1 = ring1 * radiusStep + centerRadius;\n  var radius2 = ring2 * radiusStep + centerRadius;\n  for (var sector = 5; sector < sectors; sector += 8) {\n    var angle = sector * angleStep;\n    drawGreenStripe(radius1, radius2, angle, kindStripe);\n  }\n}\nfunction drawGreenStripe(radius1, radius2, angle, kindStripe) {\n  var path = \"\\n        M \".concat(getPoint(angle, radius1), \"\\n        L \").concat(getPoint(angle, radius2), \"\\n        Z\\n    \");\n  var stripe = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n  stripe.setAttribute(\"d\", path);\n  stripe.setAttribute(\"class\", \"stripe \".concat(kindStripe));\n  board.appendChild(stripe);\n}\n\n//# sourceURL=webpack://frontend/./board.js?");

/***/ }),

/***/ "./cell.js":
/*!*****************!*\
  !*** ./cell.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawAllCellBorders: () => (/* binding */ drawAllCellBorders),\n/* harmony export */   drawCell: () => (/* binding */ drawCell),\n/* harmony export */   outCell: () => (/* binding */ outCell),\n/* harmony export */   overCell: () => (/* binding */ overCell),\n/* harmony export */   paintAvailCells: () => (/* binding */ paintAvailCells)\n/* harmony export */ });\n/* harmony import */ var _common_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common_math.js */ \"./common_math.js\");\n/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board.js */ \"./board.js\");\n/* harmony import */ var _game_logic_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game_logic.js */ \"./game_logic.js\");\n\n\n\nfunction drawCell(ring, sector, innerRadius, outerRadius, startAngle, endAngle) {\n  var path = createCellPath(innerRadius, outerRadius, startAngle, endAngle);\n  var cell = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n  cell.setAttribute(\"d\", path);\n  var color = (ring + sector) % 2 === 0 ? \"#DCC8BA\" : \"#A45C4B\";\n  cell.color = color;\n  cell.setAttribute(\"fill\", color);\n  cell.setAttribute(\"class\", \"cell\");\n  var letter = _board_js__WEBPACK_IMPORTED_MODULE_1__.letters[(_board_js__WEBPACK_IMPORTED_MODULE_1__.sectors - sector) % _board_js__WEBPACK_IMPORTED_MODULE_1__.letters.length];\n  if (sector === 0 || sector > _board_js__WEBPACK_IMPORTED_MODULE_1__.letters.length) {\n    cell.setAttribute(\"id\", letter + (_board_js__WEBPACK_IMPORTED_MODULE_1__.rings + ring));\n  } else {\n    cell.setAttribute(\"id\", letter + (_board_js__WEBPACK_IMPORTED_MODULE_1__.rings - ring + 1));\n  }\n  var midAngle = (startAngle + endAngle) / 2;\n  var midRadius = (innerRadius + outerRadius) / 2;\n  cell.setAttribute(\"x\", (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getX)(midAngle) * midRadius);\n  cell.setAttribute(\"y\", (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getY)(midAngle) * midRadius);\n  cell.available = false;\n  _board_js__WEBPACK_IMPORTED_MODULE_1__.board.appendChild(cell);\n  addCellListeners(cell);\n  return [midAngle, midRadius];\n}\nfunction createCellPath(innerR, outerR, startAngle, endAngle) {\n  var x1 = (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getX)(startAngle) * innerR;\n  var y1 = (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getY)(startAngle) * innerR;\n  var x2 = (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getX)(endAngle) * innerR;\n  var y2 = (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getY)(endAngle) * innerR;\n  var x3 = (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getX)(endAngle) * outerR;\n  var y3 = (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getY)(endAngle) * outerR;\n  var x4 = (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getX)(startAngle) * outerR;\n  var y4 = (0,_common_math_js__WEBPACK_IMPORTED_MODULE_0__.getY)(startAngle) * outerR;\n  return \"M \".concat(x1, \" \").concat(y1, \" A \").concat(innerR, \" \").concat(innerR, \" 0 0 1 \").concat(x2, \" \").concat(y2, \" \\n            L \").concat(x3, \" \").concat(y3, \" A \").concat(outerR, \" \").concat(outerR, \" 0 0 0 \").concat(x4, \" \").concat(y4, \" Z\");\n}\nfunction addCellListeners(cell) {\n  cell.addEventListener(\"mouseover\", function () {\n    overCell(cell);\n  });\n  cell.addEventListener(\"mouseout\", function () {\n    outCell(cell);\n  });\n}\nfunction drawAllCellBorders() {\n  document.querySelectorAll(\".cell\").forEach(function (cell) {\n    drawCellBorder(cell);\n  });\n}\nfunction drawCellBorder(cell) {\n  var cellBorder = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n  cellBorder.setAttribute(\"id\", cell.id + \"Border\");\n  cellBorder.setAttribute(\"d\", cell.getAttribute(\"d\"));\n  cellBorder.setAttribute(\"fill\", \"none\");\n  cellBorder.setAttribute(\"stroke\", \"white\");\n  cellBorder.setAttribute(\"stroke-width\", \"0\");\n  _board_js__WEBPACK_IMPORTED_MODULE_1__.board.appendChild(cellBorder);\n}\nfunction overCell(cell) {\n  if (!_game_logic_js__WEBPACK_IMPORTED_MODULE_2__.state.someonesDragging) {\n    cell.setAttribute(\"fill\", \"lightgreen\");\n  } else {\n    if (_game_logic_js__WEBPACK_IMPORTED_MODULE_2__.state.chosenCellId !== null) {\n      document.querySelector(\"#\" + _game_logic_js__WEBPACK_IMPORTED_MODULE_2__.state.chosenCellId + \"Border\").setAttribute(\"stroke-width\", \"0\");\n    }\n    document.querySelector(\"#\" + cell.id + \"Border\").setAttribute(\"stroke-width\", \"10\");\n    _game_logic_js__WEBPACK_IMPORTED_MODULE_2__.state.chosenCellId = cell.id;\n  }\n  document.getElementById(\"cell-id-display\").textContent = \"Клетка: \" + cell.id;\n}\nfunction outCell(cell) {\n  if (!_game_logic_js__WEBPACK_IMPORTED_MODULE_2__.state.someonesDragging) {\n    if (_game_logic_js__WEBPACK_IMPORTED_MODULE_2__.state.clickedFigure !== null && cell.available) {\n      cell.setAttribute(\"fill\", \"green\");\n    } else {\n      cell.setAttribute(\"fill\", cell.color);\n    }\n  }\n  document.getElementById(\"cell-id-display\").textContent = \"Наведи на клетку\";\n}\nfunction paintAvailCells(figure) {\n  document.querySelectorAll(\".cell\").forEach(function (cell) {\n    cell.setAttribute(\"fill\", cell.color);\n    cell.available = false;\n  });\n  var availCellIds = (0,_game_logic_js__WEBPACK_IMPORTED_MODULE_2__.getAvailCells)(figure);\n  availCellIds.forEach(function (availCellId) {\n    var availCell = document.querySelector(\"#\" + availCellId);\n    if (availCell.getAttribute(\"fill\") !== \"lightgreen\") {\n      availCell.setAttribute(\"fill\", \"green\");\n    }\n    availCell.available = true;\n  });\n}\n\n//# sourceURL=webpack://frontend/./cell.js?");

/***/ }),

/***/ "./common_math.js":
/*!************************!*\
  !*** ./common_math.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getX: () => (/* binding */ getX),\n/* harmony export */   getY: () => (/* binding */ getY),\n/* harmony export */   toRad: () => (/* binding */ toRad)\n/* harmony export */ });\nfunction getX(angle) {\n  return Math.cos(toRad(angle));\n}\nfunction getY(angle) {\n  return Math.sin(toRad(angle));\n}\nfunction toRad(angle) {\n  return Math.PI / 180 * angle;\n}\n\n//# sourceURL=webpack://frontend/./common_math.js?");

/***/ }),

/***/ "./figure.js":
/*!*******************!*\
  !*** ./figure.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawAllFigures: () => (/* binding */ drawAllFigures),\n/* harmony export */   parseCellId: () => (/* binding */ parseCellId)\n/* harmony export */ });\n/* harmony import */ var _game_logic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_logic.js */ \"./game_logic.js\");\n/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board.js */ \"./board.js\");\n/* harmony import */ var _cell_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cell.js */ \"./cell.js\");\nfunction _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(r) { if (Array.isArray(r)) return r; }\n\n\n\nvar figure_height = 50;\nfunction drawAllFigures() {\n  var boundBoard = _board_js__WEBPACK_IMPORTED_MODULE_1__.board.getBoundingClientRect();\n  document.querySelectorAll(\".figure\").forEach(function (el) {\n    return el.remove();\n  });\n  document.querySelectorAll(\".cell\").forEach(function (cell) {\n    if (_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.figures_pos[cell.id] !== undefined && _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.figures_pos[cell.id] !== null) {\n      var imageUrl = \"\".concat(images, \"/\").concat(_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.figures_pos[cell.id], \".png\");\n      var img = new Image();\n      img.onload = function () {\n        drawFigure(cell, imageUrl, img, boundBoard);\n      };\n      img.src = imageUrl;\n    }\n  });\n}\nfunction drawFigure(cell, imageUrl, img, boundBoard) {\n  var figure = document.createElement('div');\n  figure.cellId = cell.id;\n  figure.name = _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.figures_pos[cell.id];\n  figure.style.backgroundImage = \"url(\".concat(imageUrl, \")\");\n  figure.style.backgroundSize = 'cover';\n  figure.relation = img.naturalWidth / img.naturalHeight;\n  figure.setAttribute(\"class\", \"figure\");\n  figure.widthRelat = parseFloat(_board_js__WEBPACK_IMPORTED_MODULE_1__.board.getAttribute(\"width\")) / _board_js__WEBPACK_IMPORTED_MODULE_1__.viewBoxDict[2];\n  figure.heightRelat = parseFloat(_board_js__WEBPACK_IMPORTED_MODULE_1__.board.getAttribute(\"height\")) / _board_js__WEBPACK_IMPORTED_MODULE_1__.viewBoxDict[3];\n  figure.style.width = figure_height * figure.relation + 'px';\n  figure.style.height = figure_height + 'px';\n  figure.centerX = boundBoard.x + boundBoard.width / 2;\n  figure.centerY = boundBoard.y + boundBoard.height / 2;\n  setFigure(figure, cell);\n  document.body.appendChild(figure);\n  addFigureListeners(figure);\n}\nfunction addFigureListeners(figure) {\n  figure.addEventListener('mouseover', function () {\n    overFigure(figure);\n  });\n  figure.addEventListener('mouseout', function () {\n    var cell = document.querySelector(\"#\" + figure.cellId);\n    (0,_cell_js__WEBPACK_IMPORTED_MODULE_2__.outCell)(cell);\n  });\n  figure.addEventListener('mousedown', function () {\n    downFigure(figure);\n  });\n  document.addEventListener('mousemove', function (e) {\n    moveFigure(e, figure);\n  });\n  document.addEventListener('mouseup', function () {\n    upFigure(figure);\n  });\n}\nfunction overFigure(figure) {\n  var cell = document.querySelector(\"#\" + figure.cellId);\n  (0,_cell_js__WEBPACK_IMPORTED_MODULE_2__.overCell)(cell);\n  figure.style.cursor = 'grab';\n}\nfunction downFigure(figure) {\n  if (!_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.someonesDragging) {\n    figure.isDragging = true;\n    _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.someonesDragging = true;\n    figure.dragOffsetX = figure.offsetWidth / 2;\n    figure.dragOffsetY = figure.offsetHeight / 2;\n    figure.style.cursor = 'grabbing';\n    figure.style.pointerEvents = 'none';\n    figure.style.zIndex = \"100\";\n    (0,_cell_js__WEBPACK_IMPORTED_MODULE_2__.paintAvailCells)(figure);\n    _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.clickedFigure = figure;\n  }\n}\nfunction moveFigure(e, figure) {\n  if (figure.isDragging) {\n    var x = e.clientX - figure.dragOffsetX;\n    var y = e.clientY - figure.dragOffsetY;\n    figure.style.left = x + 'px';\n    figure.style.top = y + 'px';\n  }\n}\nfunction upFigure(figure) {\n  if (figure.isDragging) {\n    figure.isDragging = false;\n    _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.someonesDragging = false;\n    if (_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId === figure.cellId || _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId === null) {\n      overFigure(figure);\n      resetFigurePos(figure);\n      (0,_cell_js__WEBPACK_IMPORTED_MODULE_2__.paintAvailCells)(figure);\n      _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.clickedFigure = figure;\n    } else {\n      // figure.cellId - предыдущая клетка, ее очищаем\n      // state.chosenCellId - новая клетка, утверждаем на ней фигуру\n      console.log(figure.cellId, _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId);\n      if (_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.figures_pos[_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId] !== undefined && _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.figures_pos[_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId] !== null) {\n        document.querySelectorAll(\".figure\").forEach(function (existingFigure) {\n          if (existingFigure.cellId === _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId) {\n            existingFigure.remove();\n          }\n        });\n      }\n      var _figure$name$split = figure.name.split(\"-\"),\n        _figure$name$split2 = _slicedToArray(_figure$name$split, 2),\n        kind = _figure$name$split2[0],\n        player = _figure$name$split2[1];\n      var _parseCellId = parseCellId(_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId),\n        _parseCellId2 = _slicedToArray(_parseCellId, 2),\n        _char = _parseCellId2[0],\n        number = _parseCellId2[1];\n      if (kind === \"pawn\" && (number == 12 || number == 1)) {\n        figure.name = \"queen-\" + player;\n        updateFiguresPos(figure);\n        drawAllFigures();\n      } else {\n        updateFiguresPos(figure);\n      }\n    }\n    figure.style.pointerEvents = 'auto';\n    document.querySelectorAll(\".cell\").forEach(function (cell) {\n      document.querySelector(\"#\" + cell.id + \"Border\").setAttribute(\"stroke-width\", \"0\");\n    });\n    if (_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.clickedFigure === null) {\n      document.querySelectorAll(\".cell\").forEach(function (cell) {\n        cell.setAttribute(\"fill\", cell.color);\n        cell.available = false;\n      });\n    }\n  }\n}\nfunction updateFiguresPos(figure) {\n  _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.figures_pos[_game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId] = figure.name;\n  _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.figures_pos[figure.cellId] = null;\n  figure.cellId = _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId;\n  var cell = document.querySelector(\"#\" + _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId);\n  setFigure(figure, cell);\n  _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.chosenCellId = null;\n  _game_logic_js__WEBPACK_IMPORTED_MODULE_0__.state.clickedFigure = null;\n}\nfunction resetFigurePos(figure) {\n  figure.style.left = figure.style.realLeft;\n  figure.style.top = figure.style.realTop;\n  figure.style.zIndex = figure.style.realZIndex;\n}\nfunction setFigure(figure, cell) {\n  figure.style.left = figure.centerX - figure_height * figure.relation / 2 + parseFloat(cell.getAttribute(\"x\")) * figure.widthRelat + 'px';\n  figure.style.top = figure.centerY - figure_height / 2 + parseFloat(cell.getAttribute(\"y\")) * figure.heightRelat + 'px';\n  figure.style.realLeft = figure.style.left;\n  figure.style.realTop = figure.style.top;\n  var _parseCellId3 = parseCellId(cell.id),\n    _parseCellId4 = _slicedToArray(_parseCellId3, 2),\n    _char2 = _parseCellId4[0],\n    number = _parseCellId4[1];\n  if (number > 6) {\n    figure.style.zIndex = _board_js__WEBPACK_IMPORTED_MODULE_1__.rings - Math.abs(_board_js__WEBPACK_IMPORTED_MODULE_1__.rings - number) + 6 * Math.abs(_board_js__WEBPACK_IMPORTED_MODULE_1__.letters.length / 2 - _board_js__WEBPACK_IMPORTED_MODULE_1__.letters.indexOf(_char2));\n  } else {\n    figure.style.zIndex = Math.abs(_board_js__WEBPACK_IMPORTED_MODULE_1__.rings - number) + 6 * (_board_js__WEBPACK_IMPORTED_MODULE_1__.letters.length - Math.abs(_board_js__WEBPACK_IMPORTED_MODULE_1__.letters.length / 2 - _board_js__WEBPACK_IMPORTED_MODULE_1__.letters.indexOf(_char2)));\n  }\n  figure.style.realZIndex = figure.style.zIndex;\n  figure.isDragging = false;\n  setPawnDirection(figure, cell);\n}\nfunction setPawnDirection(figure, cell) {\n  var _figure$name$split3 = figure.name.split(\"-\"),\n    _figure$name$split4 = _slicedToArray(_figure$name$split3, 2),\n    kind = _figure$name$split4[0],\n    player = _figure$name$split4[1];\n  var _parseCellId5 = parseCellId(cell.id),\n    _parseCellId6 = _slicedToArray(_parseCellId5, 2),\n    _char3 = _parseCellId6[0],\n    number = _parseCellId6[1];\n  if (kind === \"pawn\") {\n    if (player === \"white\") {\n      if (number <= 6 && \"ABCDEFGHIJ\".includes(_char3) || player === \"white\" && number >= 7 && !\"KL\".includes(_char3)) {\n        figure.pawnDirection = 1;\n      } else {\n        figure.pawnDirection = -1;\n      }\n    }\n    if (player === \"gray\") {\n      if (number >= 7 && \"CDEFGHIJKL\".includes(_char3) || number <= 6 && !\"AB\".includes(_char3)) {\n        figure.pawnDirection = -1;\n      } else {\n        figure.pawnDirection = 1;\n      }\n    }\n    if (player === \"black\") {\n      if (number <= 6 && \"GHIJKL\".includes(_char3) || number >= 7 && !\"ABCDEF\".includes(_char3)) {\n        figure.pawnDirection = 1;\n      } else {\n        figure.pawnDirection = -1;\n      }\n    }\n  }\n}\nfunction parseCellId(cellId) {\n  var match = cellId.match(/^([A-Za-z]+)(\\d+)$/);\n  var _char4 = match[1];\n  var number = parseInt(match[2]);\n  return [_char4, number];\n}\n\n//# sourceURL=webpack://frontend/./figure.js?");

/***/ }),

/***/ "./game_logic.js":
/*!***********************!*\
  !*** ./game_logic.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   figures_pos: () => (/* binding */ figures_pos),\n/* harmony export */   getAvailCells: () => (/* binding */ getAvailCells),\n/* harmony export */   state: () => (/* binding */ state)\n/* harmony export */ });\n/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board.js */ \"./board.js\");\n/* harmony import */ var _figure_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./figure.js */ \"./figure.js\");\nfunction _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(r) { if (Array.isArray(r)) return r; }\n\n\nvar state = {\n  someonesDragging: false,\n  chosenCellId: null,\n  clickedFigure: null\n};\nvar userPlayer = \"white\";\nvar figures_pos = {\n  \"A1\": \"rook-white\",\n  \"B1\": \"knight-white\",\n  \"C1\": \"bishop-white\",\n  \"D1\": \"king-white\",\n  \"E1\": \"queen-white\",\n  \"F1\": \"bishop-white\",\n  \"G1\": \"knight-white\",\n  \"H1\": \"rook-white\",\n  \"A2\": \"pawn-white\",\n  \"B2\": \"pawn-white\",\n  \"C2\": \"pawn-white\",\n  \"D2\": \"pawn-white\",\n  \"E2\": \"pawn-white\",\n  \"F2\": \"pawn-white\",\n  \"G2\": \"pawn-white\",\n  \"H2\": \"pawn-white\",\n  \"I1\": \"rook-black\",\n  \"J1\": \"knight-black\",\n  \"K1\": \"bishop-black\",\n  \"L1\": \"king-black\",\n  \"A12\": \"queen-black\",\n  \"B12\": \"bishop-black\",\n  \"C12\": \"knight-black\",\n  \"D12\": \"rook-black\",\n  \"I2\": \"pawn-black\",\n  \"J2\": \"pawn-black\",\n  \"K2\": \"pawn-black\",\n  \"L2\": \"pawn-black\",\n  \"A11\": \"pawn-black\",\n  \"B11\": \"pawn-black\",\n  \"C11\": \"pawn-black\",\n  \"D11\": \"pawn-black\",\n  \"E12\": \"rook-gray\",\n  \"F12\": \"knight-gray\",\n  \"G12\": \"bishop-gray\",\n  \"H12\": \"king-gray\",\n  \"I12\": \"queen-gray\",\n  \"J12\": \"bishop-gray\",\n  \"K12\": \"knight-gray\",\n  \"L12\": \"rook-gray\",\n  \"E11\": \"pawn-gray\",\n  \"F11\": \"pawn-gray\",\n  \"G11\": \"pawn-gray\",\n  \"H11\": \"pawn-gray\",\n  \"I11\": \"pawn-gray\",\n  \"J11\": \"pawn-gray\",\n  \"K11\": \"pawn-gray\",\n  \"L11\": \"pawn-gray\"\n};\nfunction getAvailCells(figure) {\n  var _figure$name$split = figure.name.split(\"-\"),\n    _figure$name$split2 = _slicedToArray(_figure$name$split, 2),\n    kind = _figure$name$split2[0],\n    player = _figure$name$split2[1];\n  var _parseCellId = (0,_figure_js__WEBPACK_IMPORTED_MODULE_1__.parseCellId)(figure.cellId),\n    _parseCellId2 = _slicedToArray(_parseCellId, 2),\n    _char = _parseCellId2[0],\n    number = _parseCellId2[1];\n  if (kind === \"pawn\") {\n    return getAvailCellsPawn(figure, player, _char, number);\n  } else if (kind === \"bishop\") {} else if (kind === \"knight\") {} else if (kind === \"rook\") {} else if (kind === \"queen\") {} else if (kind === \"king\") {} else {\n    console.log(\"Вид фигуры не распознан\");\n  }\n  return [];\n}\nfunction getAvailCellsPawn(figure, player, _char2, number) {\n  var availCells = [];\n  var forwardId = _char2 + (number + figure.pawnDirection);\n  if (figures_pos[forwardId] === null || figures_pos[forwardId] === undefined) {\n    availCells.push(forwardId);\n  }\n  if (figure.pawnDirection === 1 && number >= 4 || figure.pawnDirection === -1 && number <= 9) {\n    pushAvailDiagonalCellPawn(availCells, figure, player, _char2, number, -1);\n    pushAvailDiagonalCellPawn(availCells, figure, player, _char2, number, 1);\n  }\n  return availCells;\n}\nfunction pushAvailDiagonalCellPawn(availCells, figure, player, _char3, number, right) {\n  var forwardDiagonalId = _board_js__WEBPACK_IMPORTED_MODULE_0__.letters[(_board_js__WEBPACK_IMPORTED_MODULE_0__.letters.indexOf(_char3) + right) % _board_js__WEBPACK_IMPORTED_MODULE_0__.letters.length] + (number + figure.pawnDirection);\n  if (figures_pos[forwardDiagonalId] !== null && figures_pos[forwardDiagonalId] !== undefined) {\n    var _figures_pos$forwardD = figures_pos[forwardDiagonalId].split(\"-\"),\n      _figures_pos$forwardD2 = _slicedToArray(_figures_pos$forwardD, 2),\n      kind_fw = _figures_pos$forwardD2[0],\n      player_fw = _figures_pos$forwardD2[1];\n    if (player_fw != player) {\n      availCells.push(forwardDiagonalId);\n    }\n  }\n}\nfunction getAvailCellsBishop(figure, player, _char4, number) {\n  var availCells = [];\n  pushAvailDiagonalCellsBishop(availCells, figure, player, _char4, number, 1, 1);\n  pushAvailDiagonalCellsBishop(availCells, figure, player, _char4, number, -1, 1);\n  pushAvailDiagonalCellsBishop(availCells, figure, player, _char4, number, 1, -1);\n  pushAvailDiagonalCellsBishop(availCells, figure, player, _char4, number, -1, -1);\n  return availCells;\n}\nfunction pushAvailDiagonalCellsBishop(availCells, figure, player, _char5, number, up, right) {\n  while (figures_pos[forwardId] === null || figures_pos[forwardId] === undefined) {\n    var diagonalId = _board_js__WEBPACK_IMPORTED_MODULE_0__.letters[_board_js__WEBPACK_IMPORTED_MODULE_0__.letters.indexOf(_char5) + right] + (number + up);\n  }\n}\n\n//# sourceURL=webpack://frontend/./game_logic.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board.js */ \"./board.js\");\n/* harmony import */ var _figure_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./figure.js */ \"./figure.js\");\n\n\n(0,_board_js__WEBPACK_IMPORTED_MODULE_0__.drawBoard)();\nwindow.addEventListener(\"load\", _figure_js__WEBPACK_IMPORTED_MODULE_1__.drawAllFigures);\nwindow.addEventListener(\"resize\", _figure_js__WEBPACK_IMPORTED_MODULE_1__.drawAllFigures);\n\n//# sourceURL=webpack://frontend/./index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;