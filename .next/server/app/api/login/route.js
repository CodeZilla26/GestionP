"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/login/route";
exports.ids = ["app/api/login/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "http2":
/*!************************!*\
  !*** external "http2" ***!
  \************************/
/***/ ((module) => {

module.exports = require("http2");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("process");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CLenovo%5CDesktop%5Cpracticas%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CLenovo%5CDesktop%5Cpracticas&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CLenovo%5CDesktop%5Cpracticas%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CLenovo%5CDesktop%5Cpracticas&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/node-polyfill-headers */ \"(rsc)/./node_modules/next/dist/server/node-polyfill-headers.js\");\n/* harmony import */ var next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var C_Users_Lenovo_Desktop_practicas_app_api_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/login/route.ts */ \"(rsc)/./app/api/login/route.ts\");\n\n// @ts-ignore this need to be imported from next/dist to be external\n\n\n// @ts-expect-error - replaced by webpack/turbopack loader\n\nconst AppRouteRouteModule = next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_1__.AppRouteRouteModule;\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_2__.RouteKind.APP_ROUTE,\n        page: \"/api/login/route\",\n        pathname: \"/api/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/login/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Lenovo\\\\Desktop\\\\practicas\\\\app\\\\api\\\\login\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Lenovo_Desktop_practicas_app_api_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/login/route\";\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZsb2dpbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbG9naW4lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNMZW5vdm8lNUNEZXNrdG9wJTVDcHJhY3RpY2FzJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNMZW5vdm8lNUNEZXNrdG9wJTVDcHJhY3RpY2FzJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQWdEO0FBQ2hEO0FBQzBGO0FBQzNCO0FBQy9EO0FBQzZGO0FBQzdGLDRCQUE0QixnSEFBMEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1R0FBdUc7QUFDL0c7QUFDaUo7O0FBRWpKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dGpzLz9lNGJiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcIm5leHQvZGlzdC9zZXJ2ZXIvbm9kZS1wb2x5ZmlsbC1oZWFkZXJzXCI7XG4vLyBAdHMtaWdub3JlIHRoaXMgbmVlZCB0byBiZSBpbXBvcnRlZCBmcm9tIG5leHQvZGlzdCB0byBiZSBleHRlcm5hbFxuaW1wb3J0ICogYXMgbW9kdWxlIGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG4vLyBAdHMtZXhwZWN0LWVycm9yIC0gcmVwbGFjZWQgYnkgd2VicGFjay90dXJib3BhY2sgbG9hZGVyXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcTGVub3ZvXFxcXERlc2t0b3BcXFxccHJhY3RpY2FzXFxcXGFwcFxcXFxhcGlcXFxcbG9naW5cXFxccm91dGUudHNcIjtcbmNvbnN0IEFwcFJvdXRlUm91dGVNb2R1bGUgPSBtb2R1bGUuQXBwUm91dGVSb3V0ZU1vZHVsZTtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2xvZ2luL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbG9naW5cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2xvZ2luL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcTGVub3ZvXFxcXERlc2t0b3BcXFxccHJhY3RpY2FzXFxcXGFwcFxcXFxhcGlcXFxcbG9naW5cXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0IH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvbG9naW4vcm91dGVcIjtcbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0LCBvcmlnaW5hbFBhdGhuYW1lLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CLenovo%5CDesktop%5Cpracticas%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CLenovo%5CDesktop%5Cpracticas&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/login/route.ts":
/*!********************************!*\
  !*** ./app/api/login/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"(rsc)/./node_modules/firebase/auth/dist/index.mjs\");\n/* harmony import */ var _lib_firebase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/firebase */ \"(rsc)/./lib/firebase.ts\");\n\n\n\nconst dynamic = \"force-dynamic\";\nasync function POST(request) {\n    try {\n        const contentType = request.headers.get(\"content-type\") || \"\";\n        if (!contentType.toLowerCase().includes(\"application/json\")) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                ok: false,\n                message: \"Content-Type inv\\xe1lido. Usa application/json\"\n            }, {\n                status: 400\n            });\n        }\n        const body = await request.json().catch(()=>null);\n        if (!body || typeof body !== \"object\") {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                ok: false,\n                message: \"Cuerpo de la petici\\xf3n inv\\xe1lido\"\n            }, {\n                status: 400\n            });\n        }\n        const { email, password, rememberMe } = body;\n        if (typeof email !== \"string\" || typeof password !== \"string\") {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                ok: false,\n                message: \"Email y contrase\\xf1a son requeridos\"\n            }, {\n                status: 400\n            });\n        }\n        const remember = typeof rememberMe === \"boolean\" ? rememberMe : false;\n        // Usar Firebase Auth en lugar del servidor Express\n        try {\n            const userCredential = await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.signInWithEmailAndPassword)(_lib_firebase__WEBPACK_IMPORTED_MODULE_2__.auth, email, password);\n            const user = userCredential.user;\n            const userData = {\n                uid: user.uid,\n                email: user.email,\n                name: user.displayName || \"Usuario\"\n            };\n            console.log(\"Firebase login successful:\", userData);\n            // Setear cookie HttpOnly para sesión\n            const maxAge = remember ? 60 * 60 * 24 * 7 : 60 * 60 * 4; // 7 días o 4 horas\n            const response = next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                ok: true,\n                user: userData\n            });\n            const isProd = \"development\" === \"production\";\n            response.cookies.set({\n                name: \"auth\",\n                value: \"session\",\n                httpOnly: true,\n                secure: isProd,\n                sameSite: \"lax\",\n                path: \"/\",\n                maxAge\n            });\n            response.cookies.set({\n                name: \"user_email\",\n                value: email,\n                httpOnly: false,\n                secure: isProd,\n                sameSite: \"lax\",\n                path: \"/\",\n                maxAge\n            });\n            return response;\n        } catch (firebaseError) {\n            console.error(\"Firebase login error:\", firebaseError);\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                ok: false,\n                message: \"Credenciales inv\\xe1lidas\"\n            }, {\n                status: 401\n            });\n        }\n    } catch (e) {\n        console.error(\"Login API error:\", e);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            ok: false,\n            message: \"Error del servidor\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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c0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQgfSBmcm9tICdmaXJlYmFzZS9hdXRoJztcbmltcG9ydCB7IGF1dGggfSBmcm9tICcuLi8uLi8uLi9saWIvZmlyZWJhc2UnO1xuXG5leHBvcnQgY29uc3QgZHluYW1pYyA9ICdmb3JjZS1keW5hbWljJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVxdWVzdC5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgfHwgJyc7XG4gICAgaWYgKCFjb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBvazogZmFsc2UsIG1lc3NhZ2U6ICdDb250ZW50LVR5cGUgaW52w6FsaWRvLiBVc2EgYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKS5jYXRjaCgoKSA9PiBudWxsIGFzIGFueSk7XG4gICAgaWYgKCFib2R5IHx8IHR5cGVvZiBib2R5ICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IG9rOiBmYWxzZSwgbWVzc2FnZTogJ0N1ZXJwbyBkZSBsYSBwZXRpY2nDs24gaW52w6FsaWRvJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIHJlbWVtYmVyTWUgfSA9IGJvZHkgYXMge1xuICAgICAgZW1haWw/OiB1bmtub3duO1xuICAgICAgcGFzc3dvcmQ/OiB1bmtub3duO1xuICAgICAgcmVtZW1iZXJNZT86IHVua25vd247XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgZW1haWwgIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBwYXNzd29yZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBvazogZmFsc2UsIG1lc3NhZ2U6ICdFbWFpbCB5IGNvbnRyYXNlw7FhIHNvbiByZXF1ZXJpZG9zJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHJlbWVtYmVyID0gdHlwZW9mIHJlbWVtYmVyTWUgPT09ICdib29sZWFuJyA/IHJlbWVtYmVyTWUgOiBmYWxzZTtcblxuICAgIC8vIFVzYXIgRmlyZWJhc2UgQXV0aCBlbiBsdWdhciBkZWwgc2Vydmlkb3IgRXhwcmVzc1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB1c2VyQ3JlZGVudGlhbCA9IGF3YWl0IHNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGF1dGgsIGVtYWlsLCBwYXNzd29yZCk7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckNyZWRlbnRpYWwudXNlcjtcbiAgICAgIFxuICAgICAgY29uc3QgdXNlckRhdGEgPSB7XG4gICAgICAgIHVpZDogdXNlci51aWQsXG4gICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICBuYW1lOiB1c2VyLmRpc3BsYXlOYW1lIHx8ICdVc3VhcmlvJ1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coJ0ZpcmViYXNlIGxvZ2luIHN1Y2Nlc3NmdWw6JywgdXNlckRhdGEpO1xuXG4gICAgICAvLyBTZXRlYXIgY29va2llIEh0dHBPbmx5IHBhcmEgc2VzacOzblxuICAgICAgY29uc3QgbWF4QWdlID0gcmVtZW1iZXIgPyA2MCAqIDYwICogMjQgKiA3IDogNjAgKiA2MCAqIDQ7IC8vIDcgZMOtYXMgbyA0IGhvcmFzXG4gICAgICBjb25zdCByZXNwb25zZSA9IE5leHRSZXNwb25zZS5qc29uKHsgb2s6IHRydWUsIHVzZXI6IHVzZXJEYXRhIH0pO1xuICAgICAgY29uc3QgaXNQcm9kID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJztcbiAgICAgIFxuICAgICAgcmVzcG9uc2UuY29va2llcy5zZXQoe1xuICAgICAgICBuYW1lOiAnYXV0aCcsXG4gICAgICAgIHZhbHVlOiAnc2Vzc2lvbicsXG4gICAgICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGlzUHJvZCxcbiAgICAgICAgc2FtZVNpdGU6ICdsYXgnLFxuICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgIG1heEFnZSxcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICByZXNwb25zZS5jb29raWVzLnNldCh7XG4gICAgICAgIG5hbWU6ICd1c2VyX2VtYWlsJyxcbiAgICAgICAgdmFsdWU6IGVtYWlsLFxuICAgICAgICBodHRwT25seTogZmFsc2UsXG4gICAgICAgIHNlY3VyZTogaXNQcm9kLFxuICAgICAgICBzYW1lU2l0ZTogJ2xheCcsXG4gICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgbWF4QWdlLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIFxuICAgIH0gY2F0Y2ggKGZpcmViYXNlRXJyb3I6IGFueSkge1xuICAgICAgY29uc29sZS5lcnJvcignRmlyZWJhc2UgbG9naW4gZXJyb3I6JywgZmlyZWJhc2VFcnJvcik7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiAnQ3JlZGVuY2lhbGVzIGludsOhbGlkYXMnIH0sIFxuICAgICAgICB7IHN0YXR1czogNDAxIH1cbiAgICAgICk7XG4gICAgfVxuICAgIFxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcignTG9naW4gQVBJIGVycm9yOicsIGUpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiBmYWxzZSwgbWVzc2FnZTogJ0Vycm9yIGRlbCBzZXJ2aWRvcicgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwic2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQiLCJhdXRoIiwiZHluYW1pYyIsIlBPU1QiLCJyZXF1ZXN0IiwiY29udGVudFR5cGUiLCJoZWFkZXJzIiwiZ2V0IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImpzb24iLCJvayIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJib2R5IiwiY2F0Y2giLCJlbWFpbCIsInBhc3N3b3JkIiwicmVtZW1iZXJNZSIsInJlbWVtYmVyIiwidXNlckNyZWRlbnRpYWwiLCJ1c2VyIiwidXNlckRhdGEiLCJ1aWQiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJjb25zb2xlIiwibG9nIiwibWF4QWdlIiwicmVzcG9uc2UiLCJpc1Byb2QiLCJwcm9jZXNzIiwiY29va2llcyIsInNldCIsInZhbHVlIiwiaHR0cE9ubHkiLCJzZWN1cmUiLCJzYW1lU2l0ZSIsInBhdGgiLCJmaXJlYmFzZUVycm9yIiwiZXJyb3IiLCJlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/firebase.ts":
/*!*************************!*\
  !*** ./lib/firebase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   analytics: () => (/* binding */ analytics),\n/* harmony export */   auth: () => (/* binding */ auth),\n/* harmony export */   db: () => (/* binding */ db),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ \"(rsc)/./node_modules/firebase/app/dist/index.mjs\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/firestore */ \"(rsc)/./node_modules/firebase/firestore/dist/index.mjs\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/auth */ \"(rsc)/./node_modules/firebase/auth/dist/index.mjs\");\n/* harmony import */ var firebase_analytics__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/analytics */ \"(rsc)/./node_modules/firebase/analytics/dist/index.mjs\");\n// Firebase configuration and initialization\n\n\n\n\n// Your web app's Firebase configuration\nconst firebaseConfig = {\n    apiKey: \"AIzaSyArupUba23UsfNXcVYYBvtL0eKxpNWmD8Q\",\n    authDomain: \"fireapp-82c88.firebaseapp.com\",\n    databaseURL: \"https://fireapp-82c88-default-rtdb.firebaseio.com\",\n    projectId: \"fireapp-82c88\",\n    storageBucket: \"fireapp-82c88.firebasestorage.app\",\n    messagingSenderId: \"69604234606\",\n    appId: \"1:69604234606:web:871d2ccf0942ed8c431d7f\",\n    measurementId: \"G-5FGDRX59BR\"\n};\n// Initialize Firebase\nconst app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig);\n// Initialize Firebase services\nconst db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.getFirestore)(app);\nconst auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_2__.getAuth)(app);\n// Initialize Analytics (only in browser)\nconst analytics =  false ? 0 : null;\n// Development emulators (optional - for local testing)\nif (false) {}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZmlyZWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBNEM7QUFDQztBQUMrQjtBQUNmO0FBQ1g7QUFFbEQsd0NBQXdDO0FBQ3hDLE1BQU1JLGlCQUFpQjtJQUNyQkMsUUFBUTtJQUNSQyxZQUFZO0lBQ1pDLGFBQWE7SUFDYkMsV0FBVztJQUNYQyxlQUFlO0lBQ2ZDLG1CQUFtQjtJQUNuQkMsT0FBTztJQUNQQyxlQUFlO0FBQ2pCO0FBRUEsc0JBQXNCO0FBQ3RCLE1BQU1DLE1BQU1iLDJEQUFhQSxDQUFDSTtBQUUxQiwrQkFBK0I7QUFDeEIsTUFBTVUsS0FBS2IsZ0VBQVlBLENBQUNZLEtBQUs7QUFDN0IsTUFBTUUsT0FBT2Isc0RBQU9BLENBQUNXLEtBQUs7QUFFakMseUNBQXlDO0FBQ2xDLE1BQU1HLFlBQVksTUFBa0IsR0FBY2IsQ0FBaUJVLEdBQUcsS0FBSztBQUVsRix1REFBdUQ7QUFDdkQsSUFBSUksS0FBNEQsRUFBYSxFQUk1RTtBQUVELGlFQUFlSixHQUFHQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dGpzLy4vbGliL2ZpcmViYXNlLnRzPzVkMjEiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlyZWJhc2UgY29uZmlndXJhdGlvbiBhbmQgaW5pdGlhbGl6YXRpb25cbmltcG9ydCB7IGluaXRpYWxpemVBcHAgfSBmcm9tIFwiZmlyZWJhc2UvYXBwXCI7XG5pbXBvcnQgeyBnZXRGaXJlc3RvcmUsIGNvbm5lY3RGaXJlc3RvcmVFbXVsYXRvciB9IGZyb20gXCJmaXJlYmFzZS9maXJlc3RvcmVcIjtcbmltcG9ydCB7IGdldEF1dGgsIGNvbm5lY3RBdXRoRW11bGF0b3IgfSBmcm9tIFwiZmlyZWJhc2UvYXV0aFwiO1xuaW1wb3J0IHsgZ2V0QW5hbHl0aWNzIH0gZnJvbSBcImZpcmViYXNlL2FuYWx5dGljc1wiO1xuXG4vLyBZb3VyIHdlYiBhcHAncyBGaXJlYmFzZSBjb25maWd1cmF0aW9uXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgYXBpS2V5OiBcIkFJemFTeUFydXBVYmEyM1VzZk5YY1ZZWUJ2dEwwZUt4cE5XbUQ4UVwiLFxuICBhdXRoRG9tYWluOiBcImZpcmVhcHAtODJjODguZmlyZWJhc2VhcHAuY29tXCIsXG4gIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vZmlyZWFwcC04MmM4OC1kZWZhdWx0LXJ0ZGIuZmlyZWJhc2Vpby5jb21cIixcbiAgcHJvamVjdElkOiBcImZpcmVhcHAtODJjODhcIixcbiAgc3RvcmFnZUJ1Y2tldDogXCJmaXJlYXBwLTgyYzg4LmZpcmViYXNlc3RvcmFnZS5hcHBcIixcbiAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNjk2MDQyMzQ2MDZcIixcbiAgYXBwSWQ6IFwiMTo2OTYwNDIzNDYwNjp3ZWI6ODcxZDJjY2YwOTQyZWQ4YzQzMWQ3ZlwiLFxuICBtZWFzdXJlbWVudElkOiBcIkctNUZHRFJYNTlCUlwiXG59O1xuXG4vLyBJbml0aWFsaXplIEZpcmViYXNlXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcblxuLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZSBzZXJ2aWNlc1xuZXhwb3J0IGNvbnN0IGRiID0gZ2V0RmlyZXN0b3JlKGFwcCk7XG5leHBvcnQgY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcblxuLy8gSW5pdGlhbGl6ZSBBbmFseXRpY3MgKG9ubHkgaW4gYnJvd3NlcilcbmV4cG9ydCBjb25zdCBhbmFseXRpY3MgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IGdldEFuYWx5dGljcyhhcHApIDogbnVsbDtcblxuLy8gRGV2ZWxvcG1lbnQgZW11bGF0b3JzIChvcHRpb25hbCAtIGZvciBsb2NhbCB0ZXN0aW5nKVxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIC8vIFVuY29tbWVudCB0aGVzZSBsaW5lcyBpZiB5b3Ugd2FudCB0byB1c2UgRmlyZWJhc2UgZW11bGF0b3JzIGxvY2FsbHlcbiAgLy8gY29ubmVjdEZpcmVzdG9yZUVtdWxhdG9yKGRiLCAnbG9jYWxob3N0JywgODA4MCk7XG4gIC8vIGNvbm5lY3RBdXRoRW11bGF0b3IoYXV0aCwgJ2h0dHA6Ly9sb2NhbGhvc3Q6OTA5OScpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhcHA7XG4iXSwibmFtZXMiOlsiaW5pdGlhbGl6ZUFwcCIsImdldEZpcmVzdG9yZSIsImdldEF1dGgiLCJnZXRBbmFseXRpY3MiLCJmaXJlYmFzZUNvbmZpZyIsImFwaUtleSIsImF1dGhEb21haW4iLCJkYXRhYmFzZVVSTCIsInByb2plY3RJZCIsInN0b3JhZ2VCdWNrZXQiLCJtZXNzYWdpbmdTZW5kZXJJZCIsImFwcElkIiwibWVhc3VyZW1lbnRJZCIsImFwcCIsImRiIiwiYXV0aCIsImFuYWx5dGljcyIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/firebase.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@firebase","vendor-chunks/@grpc","vendor-chunks/firebase","vendor-chunks/protobufjs","vendor-chunks/long","vendor-chunks/@protobufjs","vendor-chunks/lodash.camelcase","vendor-chunks/idb"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CLenovo%5CDesktop%5Cpracticas%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CLenovo%5CDesktop%5Cpracticas&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();