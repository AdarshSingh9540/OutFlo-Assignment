import { chromium } from "playwright";
import dotenv from "dotenv";
import readline from "readline";
import connectToDatabase from "../config/database";
import Profile from "../models/Profile";

dotenv.config();

interface LinkedInProfile {
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
}

export function waitForEnter(msg: string): Promise<void> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(msg, () => {
      rl.close();
      resolve();
    });
  });
}

async function autoScroll(page: any, steps = 5, delay = 1000) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(delay);
  }
}

async function debugPageContent(page: any) {
  console.log("🔍 Debugging page content...");

  await page.screenshot({ path: "debug-page.png" });
  console.log("Screenshot saved as debug-page.png");

  const possibleSelectors = [
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

  for (const selector of possibleSelectors) {
    try {
      const elements = await page.$$(selector);
      console.log(
        `Found ${elements.length} elements with selector: ${selector}`
      );
      if (elements.length > 0) {
        
        const html = await elements[0].innerHTML();
        console.log(
          ` Sample HTML for ${selector}:`,
          html.substring(0, 200) + "..."
        );
      }
    } catch (error) {
      console.log(` Selector ${selector} not found`);
    }
  }

  const title = await page.title();
  const url = await page.url();
  console.log(` Page title: ${title}`);
  console.log(` Current URL: ${url}`);
}

async function scrapeLinkedInProfiles(
  searchUrl: string,
  credentials: { email: string; password: string }
) {
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
    ],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    locale: "en-US",
    timezoneId: "America/New_York",
  });

  const page = await context.newPage();
  const profiles: LinkedInProfile[] = [];

  try {

    console.log(" Logging into LinkedIn...");
    await page.goto("https://www.linkedin.com/login");
    await page.fill('input[name="session_key"]', credentials.email);
    await page.fill('input[name="session_password"]', credentials.password);

    await Promise.all([
      page
        .waitForNavigation({ waitUntil: "networkidle", timeout: 30000 })
        .catch(() => {}),
      page.click('button[type="submit"]'),
    ]);

    try {
      await page.waitForSelector('input[placeholder*="Search"]', {
        timeout: 20000,
      });
      console.log(" Login successful");
    } catch {
      console.log(" Login might have failed or took longer than expected");
    }
    console.log(" Navigating to search page...");
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    await page.waitForTimeout(3000);
    await debugPageContent(page);
    console.log(" Please verify the search results are fully loaded.");
    await waitForEnter(
      " Press ENTER here in terminal to continue scraping..."
    );

    console.log(" Scrolling to load more results...");
    await autoScroll(page, 6, 2000);

    let profileElements = [];
    const workingSelector = "[data-chameleon-result-urn]";

    try {
      await page.waitForSelector(workingSelector, { timeout: 10000 });
      profileElements = await page.$(workingSelector);
      console.log(
        ` Found ${profileElements.length} results using selector: ${workingSelector}`
      );
    } catch (error) {
      console.log(
        ` Could not find profile elements with selector: ${workingSelector}`
      );
      throw new Error("No profile elements found");
    }

    if (profileElements.length === 0) {
      throw new Error("No profile elements found with any selector");
    }

    console.log("Extracting profile data...");

    if (!profileElements || profileElements.length === 0) {
      console.log(" No profile elements to process");
      return;
    }

    for (let i = 0; i < Math.min(profileElements.length, 20); i++) {
      const element = profileElements[i];
      console.log(
        `\n Processing profile ${i + 1}/${profileElements.length}...`
      );

      try {
        
        const allText = await element.textContent();
        const allLinks = await element.$('a[href*="/in/"]');

        console.log(
          `   Full text: "${allText?.trim().substring(0, 100)}..."`
        );
        console.log(`    Profile links found: ${allLinks.length}`);

        let name = "";
        let jobTitle = "";
        let location = "";
        let profileUrl = "";

        if (allLinks.length > 0) {
          const mainLink = allLinks[0];
          profileUrl = (await mainLink.getAttribute("href")) || "";
          if (profileUrl && !profileUrl.startsWith("http")) {
            profileUrl = "https://www.linkedin.com" + profileUrl.split("?")[0];
          }

          const linkText = await mainLink.textContent();
          if (linkText && linkText.trim()) {
            name = linkText.trim();
            console.log(`    Found name from link: "${name}"`);
          }
        }


        if (!name && allText) {
          const textLines = allText
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
          console.log(`    Text lines found: ${textLines.length}`);

          for (const line of textLines) {
            if (
              line.length > 2 &&
              line.length < 50 &&
              !line.includes("@") &&
              !line.includes("Connection")
            ) {
              if (!name) {
                name = line;
                console.log(`    Found name from text: "${name}"`);
              } else if (!jobTitle && line !== name) {
                jobTitle = line;
                console.log(`   Found job title: "${jobTitle}"`);
              } else if (!location && line !== name && line !== jobTitle) {
                location = line;
                console.log(`    Found location: "${location}"`);
                break;
              }
            }
          }
        }

        if (!name) {
          const nameSelectors = [
            'span[aria-hidden="true"]',
            'span[dir="ltr"]',
            ".artdeco-entity-lockup__title span",
            "a span",
          ];

          for (const selector of nameSelectors) {
            try {
              const spans = await element.$(selector);
              for (const span of spans) {
                const text = await span.textContent();
                if (
                  text &&
                  text.trim() &&
                  text.trim().length > 2 &&
                  text.trim().length < 50
                ) {
                  name = text.trim();
                  console.log(
                    `    Found name with selector ${selector}: "${name}"`
                  );
                  break;
                }
              }
              if (name) break;
            } catch (e) {
              continue;
            }
          }
        }

        const company = jobTitle.includes(" at ")
          ? jobTitle.split(" at ")[1]
          : "";

        if (name && profileUrl) {
          profiles.push({ name, jobTitle, company, location, profileUrl });
          console.log(
            `   Successfully extracted: ${name} | ${jobTitle} | ${location}`
          );
        } else {
          console.log(
            `   Skipped profile ${
              i + 1
            } - Name: "${name}", URL: "${profileUrl}"`
          );
        }

        await page.waitForTimeout(300 + Math.random() * 500);
      } catch (error) {
        console.log(`  Error extracting profile ${i + 1}:`, error.message);
        continue;
      }
    }

    if (profiles.length > 0) {
      console.log("Saving to database...");
      await connectToDatabase();
      await Profile.insertMany(profiles);
      console.log(` Scraped and saved ${profiles.length} profiles`);

      // Print summary
      console.log("\n Summary:");
      profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.name} - ${profile.jobTitle}`);
      });
    } else {
      console.log(" No profiles were extracted");
    }
  } catch (error) {
    console.error(" Scraping error:", error);
    await page.screenshot({ path: "scraping-error.png" });
    console.log(" Error screenshot saved as scraping-error.png");
  } finally {
    await context.close();
    await browser.close();
  }
}

async function main() {
  const email = process.env.LINKEDIN_EMAIL;
  const password = process.env.LINKEDIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "❌ Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in your .env file"
    );
    process.exit(1);
  }

  const searchUrl =
    "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER";

  await scrapeLinkedInProfiles(searchUrl, { email, password });
}

main().catch(console.error);
