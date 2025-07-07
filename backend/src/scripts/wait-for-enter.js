"use strict";
//@ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForEnter = waitForEnter;
var playwright_1 = require("playwright");
var dotenv_1 = require("dotenv");
var readline_1 = require("readline");
var database_1 = require("../config/database");
var Profile_1 = require("../models/Profile");
dotenv_1.default.config();
function waitForEnter(msg) {
    return new Promise(function (resolve) {
        var rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(msg, function () {
            rl.close();
            resolve();
        });
    });
}
function autoScroll(page_1) {
    return __awaiter(this, arguments, void 0, function (page, steps, delay) {
        var i;
        if (steps === void 0) { steps = 5; }
        if (delay === void 0) { delay = 1000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < steps)) return [3 /*break*/, 5];
                    return [4 /*yield*/, page.mouse.wheel(0, 5000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(delay)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function debugPageContent(page) {
    return __awaiter(this, void 0, void 0, function () {
        var possibleSelectors, _i, possibleSelectors_1, selector, elements, html, error_1, title, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🔍 Debugging page content...");
                    return [4 /*yield*/, page.screenshot({ path: "debug-page.png" })];
                case 1:
                    _a.sent();
                    console.log("Screenshot saved as debug-page.png");
                    possibleSelectors = [
                        ".entity-result__item",
                        ".search-result__info",
                        ".reusable-search__result-container",
                        "[data-chameleon-result-urn]",
                        ".search-results-container",
                        ".search-result",
                        ".entity-result",
                        ".search-entity-result",
                        '[data-view-name="search-entity-result"]',
                    ];
                    _i = 0, possibleSelectors_1 = possibleSelectors;
                    _a.label = 2;
                case 2:
                    if (!(_i < possibleSelectors_1.length)) return [3 /*break*/, 9];
                    selector = possibleSelectors_1[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, page.$$(selector)];
                case 4:
                    elements = _a.sent();
                    console.log("Found ".concat(elements.length, " elements with selector: ").concat(selector));
                    if (!(elements.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, elements[0].innerHTML()];
                case 5:
                    html = _a.sent();
                    console.log(" Sample HTML for ".concat(selector, ":"), html.substring(0, 200) + "...");
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.log(" Selector ".concat(selector, " not found"));
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [4 /*yield*/, page.title()];
                case 10:
                    title = _a.sent();
                    return [4 /*yield*/, page.url()];
                case 11:
                    url = _a.sent();
                    console.log(" Page title: ".concat(title));
                    console.log(" Current URL: ".concat(url));
                    return [2 /*return*/];
            }
        });
    });
}
function scrapeLinkedInProfiles(searchUrl, credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, page, profiles, _a, profileElements, workingSelector, error_2, i, element, allText, allLinks, name_1, jobTitle, location_1, profileUrl, mainLink, linkText, textLines, _i, textLines_1, line, nameSelectors, _b, nameSelectors_1, selector, spans, _c, spans_1, span, text, e_1, company, error_3, error_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch({
                        headless: false,
                        args: [
                            "--no-sandbox",
                            "--disable-setuid-sandbox",
                            "--disable-dev-shm-usage",
                            "--disable-web-security",
                            "--disable-features=VizDisplayCompositor",
                        ],
                    })];
                case 1:
                    browser = _d.sent();
                    return [4 /*yield*/, browser.newContext({
                            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            viewport: { width: 1920, height: 1080 },
                            locale: "en-US",
                            timezoneId: "America/New_York",
                        })];
                case 2:
                    context = _d.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _d.sent();
                    profiles = [];
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 48, 50, 53]);
                    console.log(" Logging into LinkedIn...");
                    return [4 /*yield*/, page.goto("https://www.linkedin.com/login")];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, page.fill('input[name="session_key"]', credentials.email)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, page.fill('input[name="session_password"]', credentials.password)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, Promise.all([
                            page
                                .waitForNavigation({ waitUntil: "networkidle", timeout: 30000 })
                                .catch(function () { }),
                            page.click('button[type="submit"]'),
                        ])];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9:
                    _d.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, page.waitForSelector('input[placeholder*="Search"]', {
                            timeout: 20000,
                        })];
                case 10:
                    _d.sent();
                    console.log(" Login successful");
                    return [3 /*break*/, 12];
                case 11:
                    _a = _d.sent();
                    console.log(" Login might have failed or took longer than expected");
                    return [3 /*break*/, 12];
                case 12:
                    console.log(" Navigating to search page...");
                    return [4 /*yield*/, page.goto(searchUrl, { waitUntil: "domcontentloaded" })];
                case 13:
                    _d.sent();
                    return [4 /*yield*/, page.waitForTimeout(3000)];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, debugPageContent(page)];
                case 15:
                    _d.sent();
                    console.log(" Please verify the search results are fully loaded.");
                    return [4 /*yield*/, waitForEnter(" Press ENTER here in terminal to continue scraping...")];
                case 16:
                    _d.sent();
                    console.log(" Scrolling to load more results...");
                    return [4 /*yield*/, autoScroll(page, 6, 2000)];
                case 17:
                    _d.sent();
                    profileElements = [];
                    workingSelector = "[data-chameleon-result-urn]";
                    _d.label = 18;
                case 18:
                    _d.trys.push([18, 21, , 22]);
                    return [4 /*yield*/, page.waitForSelector(workingSelector, { timeout: 10000 })];
                case 19:
                    _d.sent();
                    return [4 /*yield*/, page.$(workingSelector)];
                case 20:
                    profileElements = _d.sent();
                    console.log(" Found ".concat(profileElements.length, " results using selector: ").concat(workingSelector));
                    return [3 /*break*/, 22];
                case 21:
                    error_2 = _d.sent();
                    console.log(" Could not find profile elements with selector: ".concat(workingSelector));
                    throw new Error("No profile elements found");
                case 22:
                    if (profileElements.length === 0) {
                        throw new Error("No profile elements found with any selector");
                    }
                    console.log("Extracting profile data...");
                    if (!profileElements || profileElements.length === 0) {
                        console.log(" No profile elements to process");
                        return [2 /*return*/];
                    }
                    i = 0;
                    _d.label = 23;
                case 23:
                    if (!(i < Math.min(profileElements.length, 20))) return [3 /*break*/, 43];
                    element = profileElements[i];
                    console.log("\n Processing profile ".concat(i + 1, "/").concat(profileElements.length, "..."));
                    _d.label = 24;
                case 24:
                    _d.trys.push([24, 41, , 42]);
                    return [4 /*yield*/, element.textContent()];
                case 25:
                    allText = _d.sent();
                    return [4 /*yield*/, element.$('a[href*="/in/"]')];
                case 26:
                    allLinks = _d.sent();
                    console.log("   Full text: \"".concat(allText === null || allText === void 0 ? void 0 : allText.trim().substring(0, 100), "...\""));
                    console.log("    Profile links found: ".concat(allLinks.length));
                    name_1 = "";
                    jobTitle = "";
                    location_1 = "";
                    profileUrl = "";
                    if (!(allLinks.length > 0)) return [3 /*break*/, 29];
                    mainLink = allLinks[0];
                    return [4 /*yield*/, mainLink.getAttribute("href")];
                case 27:
                    profileUrl = (_d.sent()) || "";
                    if (profileUrl && !profileUrl.startsWith("http")) {
                        profileUrl = "https://www.linkedin.com" + profileUrl.split("?")[0];
                    }
                    return [4 /*yield*/, mainLink.textContent()];
                case 28:
                    linkText = _d.sent();
                    if (linkText && linkText.trim()) {
                        name_1 = linkText.trim();
                        console.log("    Found name from link: \"".concat(name_1, "\""));
                    }
                    _d.label = 29;
                case 29:
                    if (!name_1 && allText) {
                        textLines = allText
                            .split("\n")
                            .map(function (line) { return line.trim(); })
                            .filter(function (line) { return line.length > 0; });
                        console.log("    Text lines found: ".concat(textLines.length));
                        for (_i = 0, textLines_1 = textLines; _i < textLines_1.length; _i++) {
                            line = textLines_1[_i];
                            if (line.length > 2 &&
                                line.length < 50 &&
                                !line.includes("@") &&
                                !line.includes("Connection")) {
                                if (!name_1) {
                                    name_1 = line;
                                    console.log("    Found name from text: \"".concat(name_1, "\""));
                                }
                                else if (!jobTitle && line !== name_1) {
                                    jobTitle = line;
                                    console.log("   Found job title: \"".concat(jobTitle, "\""));
                                }
                                else if (!location_1 && line !== name_1 && line !== jobTitle) {
                                    location_1 = line;
                                    console.log("    Found location: \"".concat(location_1, "\""));
                                    break;
                                }
                            }
                        }
                    }
                    if (!!name_1) return [3 /*break*/, 39];
                    nameSelectors = [
                        'span[aria-hidden="true"]',
                        'span[dir="ltr"]',
                        ".artdeco-entity-lockup__title span",
                        "a span",
                    ];
                    _b = 0, nameSelectors_1 = nameSelectors;
                    _d.label = 30;
                case 30:
                    if (!(_b < nameSelectors_1.length)) return [3 /*break*/, 39];
                    selector = nameSelectors_1[_b];
                    _d.label = 31;
                case 31:
                    _d.trys.push([31, 37, , 38]);
                    return [4 /*yield*/, element.$(selector)];
                case 32:
                    spans = _d.sent();
                    _c = 0, spans_1 = spans;
                    _d.label = 33;
                case 33:
                    if (!(_c < spans_1.length)) return [3 /*break*/, 36];
                    span = spans_1[_c];
                    return [4 /*yield*/, span.textContent()];
                case 34:
                    text = _d.sent();
                    if (text &&
                        text.trim() &&
                        text.trim().length > 2 &&
                        text.trim().length < 50) {
                        name_1 = text.trim();
                        console.log("    Found name with selector ".concat(selector, ": \"").concat(name_1, "\""));
                        return [3 /*break*/, 36];
                    }
                    _d.label = 35;
                case 35:
                    _c++;
                    return [3 /*break*/, 33];
                case 36:
                    if (name_1)
                        return [3 /*break*/, 39];
                    return [3 /*break*/, 38];
                case 37:
                    e_1 = _d.sent();
                    return [3 /*break*/, 38];
                case 38:
                    _b++;
                    return [3 /*break*/, 30];
                case 39:
                    company = jobTitle.includes(" at ")
                        ? jobTitle.split(" at ")[1]
                        : "";
                    if (name_1 && profileUrl) {
                        profiles.push({ name: name_1, jobTitle: jobTitle, company: company, location: location_1, profileUrl: profileUrl });
                        console.log("   Successfully extracted: ".concat(name_1, " | ").concat(jobTitle, " | ").concat(location_1));
                    }
                    else {
                        console.log("   Skipped profile ".concat(i + 1, " - Name: \"").concat(name_1, "\", URL: \"").concat(profileUrl, "\""));
                    }
                    return [4 /*yield*/, page.waitForTimeout(300 + Math.random() * 500)];
                case 40:
                    _d.sent();
                    return [3 /*break*/, 42];
                case 41:
                    error_3 = _d.sent();
                    console.log("  Error extracting profile ".concat(i + 1, ":"), error_3.message);
                    return [3 /*break*/, 42];
                case 42:
                    i++;
                    return [3 /*break*/, 23];
                case 43:
                    if (!(profiles.length > 0)) return [3 /*break*/, 46];
                    console.log("Saving to database...");
                    return [4 /*yield*/, (0, database_1.default)()];
                case 44:
                    _d.sent();
                    return [4 /*yield*/, Profile_1.default.insertMany(profiles)];
                case 45:
                    _d.sent();
                    console.log(" Scraped and saved ".concat(profiles.length, " profiles"));
                    // Print summary
                    console.log("\n Summary:");
                    profiles.forEach(function (profile, index) {
                        console.log("".concat(index + 1, ". ").concat(profile.name, " - ").concat(profile.jobTitle));
                    });
                    return [3 /*break*/, 47];
                case 46:
                    console.log(" No profiles were extracted");
                    _d.label = 47;
                case 47: return [3 /*break*/, 53];
                case 48:
                    error_4 = _d.sent();
                    console.error(" Scraping error:", error_4);
                    return [4 /*yield*/, page.screenshot({ path: "scraping-error.png" })];
                case 49:
                    _d.sent();
                    console.log(" Error screenshot saved as scraping-error.png");
                    return [3 /*break*/, 53];
                case 50: return [4 /*yield*/, context.close()];
                case 51:
                    _d.sent();
                    return [4 /*yield*/, browser.close()];
                case 52:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 53: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, searchUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = process.env.LINKEDIN_EMAIL;
                    password = process.env.LINKEDIN_PASSWORD;
                    if (!email || !password) {
                        console.error("❌ Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in your .env file");
                        process.exit(1);
                    }
                    searchUrl = "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER";
                    return [4 /*yield*/, scrapeLinkedInProfiles(searchUrl, { email: email, password: password })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
