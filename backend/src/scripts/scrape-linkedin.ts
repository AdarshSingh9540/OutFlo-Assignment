// scripts/scrape-linkedin.ts
import { chromium } from "playwright";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Profile from "@/lib/models/Profile"; // Define a Profile model

interface LinkedInProfile {
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
}

async function scrapeLinkedInProfiles(searchUrl: string, credentials: { email: string; password: string }) {
  const browser = await chromium.launch({ headless: false }); // Set to true in production
  const page = await browser.newPage();
  const profiles: LinkedInProfile[] = [];

  try {
    // Log in to LinkedIn
    await page.goto("https://www.linkedin.com/login");
    await page.fill('input[name="session_key"]', credentials.email);
    await page.fill('input[name="session_password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ timeout: 10000 });

    // Navigate to search URL
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // Scroll to load more results
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000); // Mimic human delay
    }

    // Extract profiles
    const profileElements = await page.$$(".reusable-search__result-container");
    for (const element of profileElements.slice(0, 20)) {
      const name = await element.$eval(".entity-result__title-text a", (el) =>
        el.textContent?.trim() || ""
      );
      const jobTitle = await element.$eval(".entity-result__primary-subtitle", (el) =>
        el.textContent?.trim() || ""
      );
      const company = await element.$eval(".entity-result__primary-subtitle", (el) =>
        el.textContent?.split(" at ")?.[1]?.trim() || ""
      );
      const location = await element.$eval(".entity-result__secondary-subtitle", (el) =>
        el.textContent?.trim() || ""
      );
      const profileUrl = await element.$eval(".entity-result__title-text a", (el) =>
        el.getAttribute("href")?.split("?")[0] || ""
      );

      profiles.push({ name, jobTitle, company, location, profileUrl });
      await page.waitForTimeout(1000 + Math.random() * 1000); // Random delay
    }

    // Save to MongoDB
    await connectToDatabase();
    await Profile.insertMany(profiles);

    console.log(`Scraped and saved ${profiles.length} profiles`);
  } catch (error) {
    console.error("Scraping error:", error);
  } finally {
    await browser.close();
  }

  return profiles;
}

// Run locally with your credentials
scrapeLinkedInProfiles(
  "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER&sid=z%40k&titleFreeText=Founder",
  {
    email: process.env.LINKEDIN_EMAIL || "your-email",
    password: process.env.LINKEDIN_PASSWORD || "your-password",
  }
);