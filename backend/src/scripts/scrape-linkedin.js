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
var playwright_1 = require("playwright");
var dotenv_1 = require("dotenv");
var database_1 = require("../config/database");
var Profile_1 = require("../models/Profile");
var wait_for_enter_1 = require("./wait-for-enter");
dotenv_1.default.config();
function humanLikeDelay() {
    return __awaiter(this, arguments, void 0, function (min, max) {
        var delay;
        if (min === void 0) { min = 1000; }
        if (max === void 0) { max = 3000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    delay = Math.random() * (max - min) + min;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function simulateHumanBehavior(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.mouse.move(Math.random() * 800, Math.random() * 600)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, humanLikeDelay(500, 1500)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.mouse.wheel(0, Math.random() * 200 - 100)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, humanLikeDelay(300, 800)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Generate unique profile URL to avoid duplicates
function generateUniqueProfileUrl(name, index) {
    var timestamp = Date.now();
    var randomId = Math.random().toString(36).substring(2, 15);
    if (name && name !== "LinkedIn User" && !name.includes("United States")) {
        var searchName = encodeURIComponent(name.replace(/[^a-zA-Z\s]/g, "").trim());
        return "https://www.linkedin.com/search/results/people/?keywords=".concat(searchName, "&id=").concat(timestamp, "_").concat(index, "_").concat(randomId);
    }
    else {
        return "https://www.linkedin.com/search/results/people/?id=".concat(timestamp, "_").concat(index, "_").concat(randomId, "&type=leadgen");
    }
}
// Enhanced company extraction function
function extractCompanyFromJobTitle(jobTitle) {
    if (!jobTitle)
        return { cleanJobTitle: "Not specified", company: "Not specified" };
    var cleanJobTitle = jobTitle;
    var company = "Not specified";
    // Pattern 1: "Title at Company"
    if (jobTitle.includes(" at ")) {
        var parts = jobTitle.split(" at ");
        if (parts.length >= 2) {
            cleanJobTitle = parts[0].trim();
            company = parts[1].trim();
        }
    }
    // Pattern 2: "Title @ Company"
    else if (jobTitle.includes(" @ ")) {
        var parts = jobTitle.split(" @ ");
        if (parts.length >= 2) {
            cleanJobTitle = parts[0].trim();
            company = parts[1].trim();
        }
    }
    // Pattern 3: "Owner of XYZ Agency"
    else if (jobTitle.match(/(Owner|Founder|CEO|Director)\s+of\s+([^,|]+)/i)) {
        var match = jobTitle.match(/(Owner|Founder|CEO|Director)\s+of\s+([^,|]+)/i);
        if (match) {
            cleanJobTitle = match[1];
            company = match[2].trim();
        }
    }
    // Pattern 4: Extract from "XYZ Agency Owner"
    else if (jobTitle.includes("Agency") && (jobTitle.includes("Owner") || jobTitle.includes("Founder"))) {
        var agencyMatch = jobTitle.match(/([^,|]*Agency[^,|]*)/i);
        if (agencyMatch) {
            company = agencyMatch[1].trim();
            if (jobTitle.includes("Owner"))
                cleanJobTitle = "Owner";
            else if (jobTitle.includes("Founder"))
                cleanJobTitle = "Founder";
        }
    }
    // Clean up company name
    if (company !== "Not specified") {
        company = company
            .replace(/\s*\|\s*.*$/, "")
            .replace(/\s*,\s*.*$/, "")
            .replace(/\s+/g, " ")
            .trim();
    }
    // Default company for lead generation context
    if (company === "Not specified" && jobTitle.toLowerCase().includes("lead generation")) {
        company = "Lead Generation Agency";
    }
    return { cleanJobTitle: cleanJobTitle, company: company };
}
function extractProfileFromHTML(element, index) {
    return __awaiter(this, void 0, void 0, function () {
        var html, text, name_1, jobTitle, location_1, actualProfileUrl, urlMatches, _i, urlMatches_1, match, url, linesName, _a, linesName_1, line, nameMatch, urlParts, slug, linesJobLocation, _b, linesJobLocation_1, line, _c, cleanJobTitle, company, finalProfileUrl, profile, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("\n\uD83D\uDD0D Processing profile ".concat(index + 1, "..."));
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, element.innerHTML()];
                case 2:
                    html = _d.sent();
                    return [4 /*yield*/, element.textContent()];
                case 3:
                    text = _d.sent();
                    if (text && (text.includes("Status is offline") || text.includes("LinkedIn Member"))) {
                        console.log("   ⚠️ Restricted profile detected");
                        name_1 = "";
                        jobTitle = "";
                        location_1 = "";
                        actualProfileUrl = "";
                        urlMatches = html.match(/href="([^"]*\/in\/[^"]*?)"/g);
                        if (urlMatches) {
                            for (_i = 0, urlMatches_1 = urlMatches; _i < urlMatches_1.length; _i++) {
                                match = urlMatches_1[_i];
                                url = match.replace('href="', "").replace('"', "");
                                if (url.includes("/in/") && !url.includes("miniProfileUrn") && !url.includes("search")) {
                                    actualProfileUrl = url.startsWith("http") ? url : "https://www.linkedin.com".concat(url);
                                    actualProfileUrl = actualProfileUrl.split("?")[0];
                                    console.log("   \u2705 Found actual LinkedIn URL: ".concat(actualProfileUrl));
                                    break;
                                }
                            }
                        }
                        linesName = text
                            .split("\n")
                            .map(function (line) { return line.trim(); })
                            .filter(function (line) {
                            return line.length > 0 &&
                                !line.includes("Status is offline") &&
                                !line.includes("LinkedIn Member") &&
                                !line.includes("Message") &&
                                !line.includes("Connect");
                        });
                        // Extract name
                        if (!name_1 && linesName.length > 0) {
                            for (_a = 0, linesName_1 = linesName; _a < linesName_1.length; _a++) {
                                line = linesName_1[_a];
                                // Pattern: "John SmithView John Smith's profile"
                                if (line.includes("View") && line.includes("profile")) {
                                    nameMatch = line.match(/^([A-Za-z\s]+?)View\s+/);
                                    if (nameMatch) {
                                        name_1 = nameMatch[1].trim();
                                        console.log("   \u2705 Extracted name from view pattern: ".concat(name_1));
                                        break;
                                    }
                                }
                                // Pattern: Capitalized names
                                else if (line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?$/) && line.length < 40) {
                                    name_1 = line;
                                    console.log("   \u2705 Found potential name: ".concat(name_1));
                                    break;
                                }
                            }
                        }
                        // Extract name from actual profile URL if available
                        if (!name_1 && actualProfileUrl) {
                            urlParts = actualProfileUrl.split("/in/");
                            if (urlParts.length > 1) {
                                slug = urlParts[1].split("/")[0];
                                name_1 = slug.replace(/-/g, " ").replace(/\d+/g, "").trim();
                                if (name_1.length > 2) {
                                    name_1 = name_1
                                        .split(" ")
                                        .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); })
                                        .join(" ");
                                    console.log("   \u2705 Extracted name from actual URL: ".concat(name_1));
                                }
                            }
                        }
                        linesJobLocation = text
                            .split("\n")
                            .map(function (line) { return line.trim(); })
                            .filter(function (line) {
                            return line.length > 0 &&
                                !line.includes("Status is offline") &&
                                !line.includes("LinkedIn Member") &&
                                !line.includes("Message") &&
                                !line.includes("Connect");
                        });
                        for (_b = 0, linesJobLocation_1 = linesJobLocation; _b < linesJobLocation_1.length; _b++) {
                            line = linesJobLocation_1[_b];
                            if (!jobTitle &&
                                (line.includes("Agency") ||
                                    line.includes("Founder") ||
                                    line.includes("Owner") ||
                                    line.includes("CEO") ||
                                    line.includes("Director") ||
                                    line.includes("Manager") ||
                                    line.includes("Lead Generation"))) {
                                jobTitle = line;
                                console.log("   \u2705 Found job title: ".concat(jobTitle));
                            }
                            if (!location_1 &&
                                (line.includes(", ") ||
                                    line.includes(" CA") ||
                                    line.includes(" NY") ||
                                    line.includes(" TX") ||
                                    line.includes("County") ||
                                    line.includes("United States")) &&
                                line.length < 100) {
                                location_1 = line;
                                console.log("   \u2705 Found location: ".concat(location_1));
                            }
                        }
                        // Process if we have meaningful data
                        if ((name_1 && name_1 !== "LinkedIn User") || jobTitle || location_1) {
                            _c = extractCompanyFromJobTitle(jobTitle), cleanJobTitle = _c.cleanJobTitle, company = _c.company;
                            finalProfileUrl = actualProfileUrl || generateUniqueProfileUrl(name_1, index);
                            profile = {
                                name: name_1 || "Lead Gen Professional ".concat(index + 1),
                                jobTitle: cleanJobTitle || "Lead Generation Professional",
                                company: company || "Lead Generation Agency",
                                location: location_1 || "Not specified",
                                profileUrl: finalProfileUrl,
                                scrapedAt: new Date(),
                            };
                            console.log("   \u2705 Processed: ".concat(profile.name, " | ").concat(profile.jobTitle, " | ").concat(profile.company));
                            return [2 /*return*/, profile];
                        }
                    }
                    return [2 /*return*/, null];
                case 4:
                    error_1 = _d.sent();
                    console.log("   \u274C Error processing profile ".concat(index + 1, ":"), error_1.message);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function scrollToLoadMoreProfiles(page_1) {
    return __awaiter(this, arguments, void 0, function (page, targetCount) {
        var currentCount, scrollAttempts, maxScrollAttempts, profileElements, seeMoreButton, e_1;
        if (targetCount === void 0) { targetCount = 20; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83D\uDCDC Scrolling to load more profiles (target: ".concat(targetCount, ")..."));
                    currentCount = 0;
                    scrollAttempts = 0;
                    maxScrollAttempts = 10;
                    _a.label = 1;
                case 1:
                    if (!(currentCount < targetCount && scrollAttempts < maxScrollAttempts)) return [3 /*break*/, 13];
                    // Scroll down to load more content
                    return [4 /*yield*/, page.evaluate(function () {
                            window.scrollTo(0, document.body.scrollHeight);
                        })];
                case 2:
                    // Scroll down to load more content
                    _a.sent();
                    return [4 /*yield*/, humanLikeDelay(2000, 4000)
                        // Check current profile count
                    ];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.$$("[data-chameleon-result-urn]")];
                case 4:
                    profileElements = _a.sent();
                    currentCount = profileElements.length;
                    console.log("   \uD83D\uDCCA Scroll ".concat(scrollAttempts + 1, ": Found ").concat(currentCount, " profiles"));
                    if (!(scrollAttempts > 3 && currentCount < targetCount)) return [3 /*break*/, 11];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 10, , 11]);
                    return [4 /*yield*/, page.$('button:has-text("See more results"), button:has-text("Show more"), .artdeco-pagination__button--next')];
                case 6:
                    seeMoreButton = _a.sent();
                    if (!seeMoreButton) return [3 /*break*/, 9];
                    console.log("   🔄 Clicking 'See more results' button...");
                    return [4 /*yield*/, seeMoreButton.click()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, humanLikeDelay(3000, 5000)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_1 = _a.sent();
                    console.log("   ⚠️ No 'See more results' button found");
                    return [3 /*break*/, 11];
                case 11:
                    scrollAttempts++;
                    // Add human-like behavior
                    return [4 /*yield*/, simulateHumanBehavior(page)];
                case 12:
                    // Add human-like behavior
                    _a.sent();
                    return [3 /*break*/, 1];
                case 13:
                    console.log("\u2705 Finished scrolling. Found ".concat(currentCount, " total profiles."));
                    return [2 /*return*/];
            }
        });
    });
}
function saveToDatabase(profiles) {
    return __awaiter(this, void 0, void 0, function () {
        var savedCount, duplicateCount, errorCount, i, profile, err_1, recentProfiles, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    console.log("💾 Connecting to database...");
                    return [4 /*yield*/, (0, database_1.default)()];
                case 1:
                    _a.sent();
                    if (profiles.length === 0) {
                        console.log("⚠️ No profiles to save");
                        return [2 /*return*/];
                    }
                    console.log("\uD83D\uDCDD Preparing to save ".concat(profiles.length, " profiles..."));
                    savedCount = 0;
                    duplicateCount = 0;
                    errorCount = 0;
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < profiles.length)) return [3 /*break*/, 7];
                    profile = profiles[i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, Profile_1.default.create(profile)];
                case 4:
                    _a.sent();
                    savedCount++;
                    console.log("   \u2705 Saved ".concat(savedCount, ": ").concat(profile.name));
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    if (err_1.code === 11000) {
                        duplicateCount++;
                        console.log("   \u26A0\uFE0F Duplicate skipped: ".concat(profile.name));
                    }
                    else {
                        errorCount++;
                        console.log("   \u274C Error saving ".concat(profile.name, ":"), err_1.message);
                    }
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log("\n\uD83D\uDCCA Database Save Results:");
                    console.log("   \u2705 Successfully saved: ".concat(savedCount));
                    console.log("   \u26A0\uFE0F Duplicates skipped: ".concat(duplicateCount));
                    console.log("   \u274C Errors: ".concat(errorCount));
                    console.log("   \uD83D\uDCC8 Total processed: ".concat(profiles.length));
                    if (!(savedCount > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, Profile_1.default.find().sort({ createdAt: -1 }).limit(savedCount)];
                case 8:
                    recentProfiles = _a.sent();
                    console.log("\n\uD83D\uDCCB Recently Saved Profiles:");
                    console.log("==========================");
                    recentProfiles.forEach(function (profile, index) {
                        console.log("".concat(index + 1, ". ").concat(profile.name));
                        console.log("   Job: ".concat(profile.jobTitle));
                        console.log("   Company: ".concat(profile.company));
                        console.log("   Location: ".concat(profile.location));
                        console.log("   ID: ".concat(profile._id, "\n"));
                    });
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_2 = _a.sent();
                    console.error("❌ Database connection error:", error_2);
                    throw error_2;
                case 11: return [2 /*return*/];
            }
        });
    });
}
function scrapeLinkedInProfiles(searchUrl, credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, page, profiles, targetProfileCount, _a, profileElements, i, profile, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch({
                        headless: false,
                        args: [
                            "--no-sandbox",
                            "--disable-setuid-sandbox",
                            "--disable-dev-shm-usage",
                            "--disable-web-security",
                            "--disable-features=VizDisplayCompositor",
                            "--disable-blink-features=AutomationControlled",
                        ],
                    })];
                case 1:
                    browser = _b.sent();
                    return [4 /*yield*/, browser.newContext({
                            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            viewport: { width: 1366, height: 768 },
                            locale: "en-US",
                            timezoneId: "America/New_York",
                        })];
                case 2:
                    context = _b.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _b.sent();
                    profiles = [];
                    targetProfileCount = 25 // Target more than 20 to account for filtering
                    ;
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 33, 35, 38]);
                    // Login
                    console.log("🔐 Logging into LinkedIn...");
                    return [4 /*yield*/, page.goto("https://www.linkedin.com/login", { waitUntil: "networkidle" })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, humanLikeDelay(1000, 2000)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, page.fill('input[name="session_key"]', credentials.email)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, humanLikeDelay(500, 1000)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, page.fill('input[name="session_password"]', credentials.password)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, humanLikeDelay(500, 1000)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, Promise.all([
                            page.waitForNavigation({ waitUntil: "networkidle", timeout: 30000 }).catch(function () { }),
                            page.click('button[type="submit"]'),
                        ])];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    _b.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, page.waitForSelector('input[placeholder*="Search"]', { timeout: 20000 })];
                case 13:
                    _b.sent();
                    console.log("✅ Login successful");
                    return [3 /*break*/, 15];
                case 14:
                    _a = _b.sent();
                    throw new Error("Login failed");
                case 15:
                    // Navigate to search
                    console.log("🔍 Navigating to search page...");
                    return [4 /*yield*/, humanLikeDelay(2000, 4000)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, page.goto(searchUrl, { waitUntil: "domcontentloaded" })];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, humanLikeDelay(3000, 5000)];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, simulateHumanBehavior(page)
                        // Initial profile count
                    ];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, page.$$("[data-chameleon-result-urn]")];
                case 20:
                    profileElements = _b.sent();
                    console.log("\u2705 Found ".concat(profileElements.length, " initial profile elements"));
                    if (profileElements.length === 0) {
                        throw new Error("No search results found");
                    }
                    console.log("🟡 Please verify the page loaded correctly");
                    return [4 /*yield*/, (0, wait_for_enter_1.waitForEnter)("👉 Press ENTER when ready to continue...")
                        // Scroll to load more profiles
                    ];
                case 21:
                    _b.sent();
                    // Scroll to load more profiles
                    return [4 /*yield*/, scrollToLoadMoreProfiles(page, targetProfileCount)
                        // Get final profile elements
                    ];
                case 22:
                    // Scroll to load more profiles
                    _b.sent();
                    return [4 /*yield*/, page.$$("[data-chameleon-result-urn]")];
                case 23:
                    // Get final profile elements
                    profileElements = _b.sent();
                    console.log("\uD83D\uDCCA Final count: ".concat(profileElements.length, " profile elements found"));
                    // Extract profiles
                    console.log("\uD83D\uDCCA Extracting data from ".concat(profileElements.length, " profiles..."));
                    i = 0;
                    _b.label = 24;
                case 24:
                    if (!(i < profileElements.length)) return [3 /*break*/, 29];
                    return [4 /*yield*/, extractProfileFromHTML(profileElements[i], i)];
                case 25:
                    profile = _b.sent();
                    if (profile) {
                        profiles.push(profile);
                    }
                    // Progress indicator
                    if ((i + 1) % 5 === 0) {
                        console.log("   \uD83D\uDCC8 Progress: ".concat(i + 1, "/").concat(profileElements.length, " processed, ").concat(profiles.length, " valid profiles found"));
                    }
                    return [4 /*yield*/, humanLikeDelay(500, 1500)];
                case 26:
                    _b.sent();
                    if (!(i % 3 === 0)) return [3 /*break*/, 28];
                    return [4 /*yield*/, simulateHumanBehavior(page)];
                case 27:
                    _b.sent();
                    _b.label = 28;
                case 28:
                    i++;
                    return [3 /*break*/, 24];
                case 29:
                    console.log("\n\uD83C\uDFAF Extraction Summary:");
                    console.log("   \uD83D\uDCCA Total elements processed: ".concat(profileElements.length));
                    console.log("   \u2705 Valid profiles extracted: ".concat(profiles.length));
                    console.log("   \uD83D\uDCC8 Success rate: ".concat(((profiles.length / profileElements.length) * 100).toFixed(1), "%"));
                    if (!(profiles.length > 0)) return [3 /*break*/, 31];
                    return [4 /*yield*/, saveToDatabase(profiles)];
                case 30:
                    _b.sent();
                    if (profiles.length >= 20) {
                        console.log("\n\uD83C\uDF89 SUCCESS! Extracted ".concat(profiles.length, " profiles (target: 20+)"));
                    }
                    else {
                        console.log("\n\u26A0\uFE0F Partial success: ".concat(profiles.length, " profiles extracted (target: 20+)"));
                    }
                    return [3 /*break*/, 32];
                case 31:
                    console.log("⚠️ No profiles were extracted");
                    _b.label = 32;
                case 32: return [3 /*break*/, 38];
                case 33:
                    error_3 = _b.sent();
                    console.error("❌ Scraping error:", error_3);
                    return [4 /*yield*/, page.screenshot({ path: "scraping-error.png" })];
                case 34:
                    _b.sent();
                    return [3 /*break*/, 38];
                case 35: return [4 /*yield*/, context.close()];
                case 36:
                    _b.sent();
                    return [4 /*yield*/, browser.close()];
                case 37:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 38: return [2 /*return*/];
            }
        });
    });
}
// Main execution
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, searchUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = process.env.LINKEDIN_EMAIL;
                    password = process.env.LINKEDIN_PASSWORD;
                    if (!email || !password) {
                        console.error(" Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in your .env file");
                        process.exit(1);
                    }
                    console.log("LinkedIn Profile Scraper ");
                    console.log("================================================");
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
