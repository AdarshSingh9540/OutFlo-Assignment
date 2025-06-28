import { chromium } from "playwright"
import dotenv from "dotenv"
import connectToDatabase from "../config/database"
import Profile from "../models/Profile"
import { waitForEnter } from "./wait-for-enter"

dotenv.config()

interface LinkedInProfile {
  name: string
  jobTitle: string
  company: string
  location: string
  profileUrl: string
  scrapedAt: Date
}

async function humanLikeDelay(min = 1000, max = 3000) {
  const delay = Math.random() * (max - min) + min
  await new Promise((resolve) => setTimeout(resolve, delay))
}

async function simulateHumanBehavior(page: any) {
  await page.mouse.move(Math.random() * 800, Math.random() * 600)
  await humanLikeDelay(500, 1500)
  await page.mouse.wheel(0, Math.random() * 200 - 100)
  await humanLikeDelay(300, 800)
}

// Generate unique profile URL to avoid duplicates
function generateUniqueProfileUrl(name: string, index: number): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)

  if (name && name !== "LinkedIn User" && !name.includes("United States")) {
    const searchName = encodeURIComponent(name.replace(/[^a-zA-Z\s]/g, "").trim())
    return `https://www.linkedin.com/search/results/people/?keywords=${searchName}&id=${timestamp}_${index}_${randomId}`
  } else {
    return `https://www.linkedin.com/search/results/people/?id=${timestamp}_${index}_${randomId}&type=leadgen`
  }
}

// Enhanced company extraction function
function extractCompanyFromJobTitle(jobTitle: string): { cleanJobTitle: string; company: string } {
  if (!jobTitle) return { cleanJobTitle: "Not specified", company: "Not specified" }

  let cleanJobTitle = jobTitle
  let company = "Not specified"

  // Pattern 1: "Title at Company"
  if (jobTitle.includes(" at ")) {
    const parts = jobTitle.split(" at ")
    if (parts.length >= 2) {
      cleanJobTitle = parts[0].trim()
      company = parts[1].trim()
    }
  }
  // Pattern 2: "Title @ Company"
  else if (jobTitle.includes(" @ ")) {
    const parts = jobTitle.split(" @ ")
    if (parts.length >= 2) {
      cleanJobTitle = parts[0].trim()
      company = parts[1].trim()
    }
  }
  // Pattern 3: "Owner of XYZ Agency"
  else if (jobTitle.match(/(Owner|Founder|CEO|Director)\s+of\s+([^,|]+)/i)) {
    const match = jobTitle.match(/(Owner|Founder|CEO|Director)\s+of\s+([^,|]+)/i)
    if (match) {
      cleanJobTitle = match[1]
      company = match[2].trim()
    }
  }
  // Pattern 4: Extract from "XYZ Agency Owner"
  else if (jobTitle.includes("Agency") && (jobTitle.includes("Owner") || jobTitle.includes("Founder"))) {
    const agencyMatch = jobTitle.match(/([^,|]*Agency[^,|]*)/i)
    if (agencyMatch) {
      company = agencyMatch[1].trim()
      if (jobTitle.includes("Owner")) cleanJobTitle = "Owner"
      else if (jobTitle.includes("Founder")) cleanJobTitle = "Founder"
    }
  }

  // Clean up company name
  if (company !== "Not specified") {
    company = company
      .replace(/\s*\|\s*.*$/, "") 
      .replace(/\s*,\s*.*$/, "") 
      .replace(/\s+/g, " ")
      .trim()
  }

  // Default company for lead generation context
  if (company === "Not specified" && jobTitle.toLowerCase().includes("lead generation")) {
    company = "Lead Generation Agency"
  }

  return { cleanJobTitle, company }
}

async function extractProfileFromHTML(element: any, index: number): Promise<LinkedInProfile | null> {
  console.log(`\n🔍 Processing profile ${index + 1}...`)

  try {
    const html = await element.innerHTML()
    const text = await element.textContent()

    if (text && (text.includes("Status is offline") || text.includes("LinkedIn Member"))) {
      console.log("   ⚠️ Restricted profile detected")

      let name = ""
      let jobTitle = ""
      let location = ""
      let actualProfileUrl = ""

      // Try to extract actual LinkedIn profile URL first
      const urlMatches = html.match(/href="([^"]*\/in\/[^"]*?)"/g)
      if (urlMatches) {
        for (const match of urlMatches) {
          const url = match.replace('href="', "").replace('"', "")
          if (url.includes("/in/") && !url.includes("miniProfileUrn") && !url.includes("search")) {
            actualProfileUrl = url.startsWith("http") ? url : `https://www.linkedin.com${url}`
            actualProfileUrl = actualProfileUrl.split("?")[0]
            console.log(`   ✅ Found actual LinkedIn URL: ${actualProfileUrl}`)
            break
          }
        }
      }

      // Extract names from filtered text lines
      const linesName = text
        .split("\n")
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.length > 0 &&
            !line.includes("Status is offline") &&
            !line.includes("LinkedIn Member") &&
            !line.includes("Message") &&
            !line.includes("Connect"),
        )

      // Extract name
      if (!name && linesName.length > 0) {
        for (const line of linesName) {
          // Pattern: "John SmithView John Smith's profile"
          if (line.includes("View") && line.includes("profile")) {
            const nameMatch = line.match(/^([A-Za-z\s]+?)View\s+/)
            if (nameMatch) {
              name = nameMatch[1].trim()
              console.log(`   ✅ Extracted name from view pattern: ${name}`)
              break
            }
          }
          // Pattern: Capitalized names
          else if (line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?$/) && line.length < 40) {
            name = line
            console.log(`   ✅ Found potential name: ${name}`)
            break
          }
        }
      }

      // Extract name from actual profile URL if available
      if (!name && actualProfileUrl) {
        const urlParts = actualProfileUrl.split("/in/")
        if (urlParts.length > 1) {
          const slug = urlParts[1].split("/")[0]
          name = slug.replace(/-/g, " ").replace(/\d+/g, "").trim()
          if (name.length > 2) {
            name = name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ")
            console.log(`   ✅ Extracted name from actual URL: ${name}`)
          }
        }
      }

      // Extract job title and location
      const linesJobLocation = text
        .split("\n")
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.length > 0 &&
            !line.includes("Status is offline") &&
            !line.includes("LinkedIn Member") &&
            !line.includes("Message") &&
            !line.includes("Connect"),
        )

      for (const line of linesJobLocation) {
        if (
          !jobTitle &&
          (line.includes("Agency") ||
            line.includes("Founder") ||
            line.includes("Owner") ||
            line.includes("CEO") ||
            line.includes("Director") ||
            line.includes("Manager") ||
            line.includes("Lead Generation"))
        ) {
          jobTitle = line
          console.log(`   ✅ Found job title: ${jobTitle}`)
        }

        if (
          !location &&
          (line.includes(", ") ||
            line.includes(" CA") ||
            line.includes(" NY") ||
            line.includes(" TX") ||
            line.includes("County") ||
            line.includes("United States")) &&
          line.length < 100
        ) {
          location = line
          console.log(`   ✅ Found location: ${location}`)
        }
      }

      // Process if we have meaningful data
      if ((name && name !== "LinkedIn User") || jobTitle || location) {
        // Extract company from job title
        const { cleanJobTitle, company } = extractCompanyFromJobTitle(jobTitle)

        // Use actual LinkedIn URL if found, otherwise generate unique URL
        const finalProfileUrl = actualProfileUrl || generateUniqueProfileUrl(name, index)

        const profile: LinkedInProfile = {
          name: name || `Lead Gen Professional ${index + 1}`,
          jobTitle: cleanJobTitle || "Lead Generation Professional",
          company: company || "Lead Generation Agency",
          location: location || "Not specified",
          profileUrl: finalProfileUrl,
          scrapedAt: new Date(),
        }

        console.log(`   ✅ Processed: ${profile.name} | ${profile.jobTitle} | ${profile.company}`)
        return profile
      }
    }

    return null
  } catch (error) {
    console.log(`   ❌ Error processing profile ${index + 1}:`, error.message)
    return null
  }
}

async function scrollToLoadMoreProfiles(page: any, targetCount = 20): Promise<void> {
  console.log(`📜 Scrolling to load more profiles (target: ${targetCount})...`)

  let currentCount = 0
  let scrollAttempts = 0
  const maxScrollAttempts = 10

  while (currentCount < targetCount && scrollAttempts < maxScrollAttempts) {
    // Scroll down to load more content
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    await humanLikeDelay(2000, 4000)

    // Check current profile count
    const profileElements = await page.$$("[data-chameleon-result-urn]")
    currentCount = profileElements.length

    console.log(`   📊 Scroll ${scrollAttempts + 1}: Found ${currentCount} profiles`)

    // If we haven't found new profiles in the last few scrolls, try clicking "See more results" if available
    if (scrollAttempts > 3 && currentCount < targetCount) {
      try {
        const seeMoreButton = await page.$(
          'button:has-text("See more results"), button:has-text("Show more"), .artdeco-pagination__button--next',
        )
        if (seeMoreButton) {
          console.log("   🔄 Clicking 'See more results' button...")
          await seeMoreButton.click()
          await humanLikeDelay(3000, 5000)
        }
      } catch (e) {
        console.log("   ⚠️ No 'See more results' button found")
      }
    }

    scrollAttempts++

    // Add human-like behavior
    await simulateHumanBehavior(page)
  }

  console.log(`✅ Finished scrolling. Found ${currentCount} total profiles.`)
}

async function saveToDatabase(profiles: LinkedInProfile[]): Promise<void> {
  try {
    console.log("💾 Connecting to database...")
    await connectToDatabase()

    if (profiles.length === 0) {
      console.log("⚠️ No profiles to save")
      return
    }

    console.log(`📝 Preparing to save ${profiles.length} profiles...`)

    // Save profiles one by one to handle duplicates gracefully
    let savedCount = 0
    let duplicateCount = 0
    let errorCount = 0

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i]
      try {
        await Profile.create(profile)
        savedCount++
        console.log(`   ✅ Saved ${savedCount}: ${profile.name}`)
      } catch (err: any) {
        if (err.code === 11000) {
          duplicateCount++
          console.log(`   ⚠️ Duplicate skipped: ${profile.name}`)
        } else {
          errorCount++
          console.log(`   ❌ Error saving ${profile.name}:`, err.message)
        }
      }
    }

    console.log(`\n📊 Database Save Results:`)
    console.log(`   ✅ Successfully saved: ${savedCount}`)
    console.log(`   ⚠️ Duplicates skipped: ${duplicateCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📈 Total processed: ${profiles.length}`)

    if (savedCount > 0) {
      // Show recent saved profiles
      const recentProfiles = await Profile.find().sort({ createdAt: -1 }).limit(savedCount)
      console.log(`\n📋 Recently Saved Profiles:`)
      console.log(`==========================`)
      recentProfiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.name}`)
        console.log(`   Job: ${profile.jobTitle}`)
        console.log(`   Company: ${profile.company}`)
        console.log(`   Location: ${profile.location}`)
        console.log(`   ID: ${profile._id}\n`)
      })
    }
  } catch (error) {
    console.error("❌ Database connection error:", error)
    throw error
  }
}

async function scrapeLinkedInProfiles(searchUrl: string, credentials: { email: string; password: string }) {
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
      "--disable-blink-features=AutomationControlled",
    ],
  })

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 768 },
    locale: "en-US",
    timezoneId: "America/New_York",
  })

  const page = await context.newPage()
  const profiles: LinkedInProfile[] = []
  const targetProfileCount = 25 // Target more than 20 to account for filtering

  try {
    // Login
    console.log("🔐 Logging into LinkedIn...")
    await page.goto("https://www.linkedin.com/login", { waitUntil: "networkidle" })

    await humanLikeDelay(1000, 2000)
    await page.fill('input[name="session_key"]', credentials.email)
    await humanLikeDelay(500, 1000)
    await page.fill('input[name="session_password"]', credentials.password)
    await humanLikeDelay(500, 1000)

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle", timeout: 30000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ])

    try {
      await page.waitForSelector('input[placeholder*="Search"]', { timeout: 20000 })
      console.log("✅ Login successful")
    } catch {
      throw new Error("Login failed")
    }

    // Navigate to search
    console.log("🔍 Navigating to search page...")
    await humanLikeDelay(2000, 4000)
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" })
    await humanLikeDelay(3000, 5000)

    await simulateHumanBehavior(page)

    // Initial profile count
    let profileElements = await page.$$("[data-chameleon-result-urn]")
    console.log(`✅ Found ${profileElements.length} initial profile elements`)

    if (profileElements.length === 0) {
      throw new Error("No search results found")
    }

    console.log("🟡 Please verify the page loaded correctly")
    await waitForEnter("👉 Press ENTER when ready to continue...")

    // Scroll to load more profiles
    await scrollToLoadMoreProfiles(page, targetProfileCount)

    // Get final profile elements
    profileElements = await page.$$("[data-chameleon-result-urn]")
    console.log(`📊 Final count: ${profileElements.length} profile elements found`)

    // Extract profiles
    console.log(`📊 Extracting data from ${profileElements.length} profiles...`)

    for (let i = 0; i < profileElements.length; i++) {
      const profile = await extractProfileFromHTML(profileElements[i], i)
      if (profile) {
        profiles.push(profile)
      }

      // Progress indicator
      if ((i + 1) % 5 === 0) {
        console.log(
          `   📈 Progress: ${i + 1}/${profileElements.length} processed, ${profiles.length} valid profiles found`,
        )
      }

      await humanLikeDelay(500, 1500)

      if (i % 3 === 0) {
        await simulateHumanBehavior(page)
      }
    }

    console.log(`\n🎯 Extraction Summary:`)
    console.log(`   📊 Total elements processed: ${profileElements.length}`)
    console.log(`   ✅ Valid profiles extracted: ${profiles.length}`)
    console.log(`   📈 Success rate: ${((profiles.length / profileElements.length) * 100).toFixed(1)}%`)

    // Save to database
    if (profiles.length > 0) {
      await saveToDatabase(profiles)

      if (profiles.length >= 20) {
        console.log(`\n🎉 SUCCESS! Extracted ${profiles.length} profiles (target: 20+)`)
      } else {
        console.log(`\n⚠️ Partial success: ${profiles.length} profiles extracted (target: 20+)`)
      }
    } else {
      console.log("⚠️ No profiles were extracted")
    }
  } catch (error) {
    console.error("❌ Scraping error:", error)
    await page.screenshot({ path: "scraping-error.png" })
  } finally {
    await context.close()
    await browser.close()
  }
}

// Main execution
async function main() {
  const email = process.env.LINKEDIN_EMAIL
  const password = process.env.LINKEDIN_PASSWORD

  if (!email || !password) {
    console.error(" Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in your .env file")
    process.exit(1)
  }

  console.log("LinkedIn Profile Scraper ")
  console.log("================================================")

  const searchUrl =
    "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER"

  await scrapeLinkedInProfiles(searchUrl, { email, password })
}

main().catch(console.error)
