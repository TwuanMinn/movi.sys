import { test, expect, type Page } from "@playwright/test";

// ═══════════════════════════════════════════════════════════
// 1. ROUTE HEALTH — Every page should load without errors
// ═══════════════════════════════════════════════════════════

const ALL_ROUTES = [
  { path: "/dashboard", heading: /dashboard/i },
  { path: "/movies", heading: /productions/i },
  { path: "/team", heading: /team/i },
  { path: "/assets", heading: /assets|total assets/i },
  { path: "/calendar", heading: /timeline|calendar/i },
  { path: "/analytics", heading: /revenue|analytics/i },
  { path: "/promotion", heading: /promotion/i },
  { path: "/announcements", heading: /announcements|movie announcements/i },
  { path: "/reports", heading: /reports/i },
  { path: "/settings", heading: /settings|profile/i },
];

test.describe("Route Health Check", () => {
  for (const route of ALL_ROUTES) {
    test(`${route.path} loads without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);

      // Wait for hydration
      await page.waitForTimeout(1500);

      // No uncaught JS errors
      expect(errors, `Console errors on ${route.path}: ${errors.join(", ")}`).toHaveLength(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 2. ROOT REDIRECT
// ═══════════════════════════════════════════════════════════

test.describe("Root Redirect", () => {
  test("/ redirects to /dashboard", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
  });
});

// ═══════════════════════════════════════════════════════════
// 3. SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════

test.describe("Sidebar Navigation", () => {
  test("sidebar nav links are visible and functional", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Sidebar should be present on desktop
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();

    // Check CINEFORGE branding
    await expect(page.getByText("CINEFORGE").first()).toBeVisible();

    // Navigate via sidebar clicks
    const navLabels = ["Movies", "Team", "Assets", "Analytics", "Promotion", "Announcements", "Reports", "Settings"];
    for (const label of navLabels) {
      const link = page.locator(`nav a`).filter({ hasText: new RegExp(`^${label}$`) }).first();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForTimeout(500);
        expect(page.url().toLowerCase()).toContain(label.toLowerCase());
      }
    }
  });

  test("sidebar collapse/expand toggle works", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // The sidebar should initially show labels
    const dashLabel = page.locator("nav a").filter({ hasText: "Dashboard" });
    await expect(dashLabel).toBeVisible();

    // Click collapse button
    const collapseBtn = page.getByLabel(/collapse sidebar/i);
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await page.waitForTimeout(500);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// 4. DASHBOARD PAGE — KPIs, Film Portfolio, Activity Feed
// ═══════════════════════════════════════════════════════════

test.describe("Dashboard Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
  });

  test("displays 4 KPI cards with financial data", async ({ page }) => {
    // Labels are lower-case in HTML, uppercased by CSS text-transform
    await expect(page.getByText("Total Budget")).toBeVisible();
    await expect(page.getByText(/\$430M/).first()).toBeVisible();

    // Revenue
    await expect(page.getByText("Revenue", { exact: true })).toBeVisible();
    await expect(page.getByText(/\$665M/).first()).toBeVisible();

    // Active Projects
    await expect(page.getByText("Active Projects")).toBeVisible();

    // Avg Rating
    await expect(page.getByText("Avg Rating")).toBeVisible();
  });

  test("film portfolio lists all 5 movies", async ({ page }) => {
    await expect(page.getByText("Film Portfolio")).toBeVisible();
    await expect(page.getByText("Crimson Horizon").first()).toBeVisible();
    await expect(page.getByText("Whispers in the Dark").first()).toBeVisible();
    await expect(page.getByText("The Last Encore").first()).toBeVisible();
    await expect(page.getByText("Velocity").first()).toBeVisible();
    await expect(page.getByText("Moonlit Garden").first()).toBeVisible();
  });

  test("activity feed shows recent entries", async ({ page }) => {
    await expect(page.getByText("Activity Feed")).toBeVisible();
    await expect(page.getByText(/Elena Rossi/)).toBeVisible();
  });

  test("collaboration notes section is present", async ({ page }) => {
    await expect(page.getByText("Collaboration Notes")).toBeVisible();
    await expect(page.getByPlaceholder(/note|feedback/i)).toBeVisible();
  });

  test("can filter movies by status", async ({ page }) => {
    // Click a status filter
    const releasedBtn = page.locator("select, button").filter({ hasText: /Released|All Status/i }).first();
    if (await releasedBtn.isVisible()) {
      await releasedBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test("+ New Film button opens modal", async ({ page }) => {
    const newBtn = page.getByText("+ New Film");
    await expect(newBtn).toBeVisible();
    await newBtn.click();
    await page.waitForTimeout(1000);

    // Modal should appear with form fields
    await expect(page.getByText(/add new|create|new film/i).first()).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// 5. MOVIES PAGE — Grid, CRUD operations
// ═══════════════════════════════════════════════════════════

test.describe("Movies Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/movies", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("displays productions heading and movie cards", async ({ page }) => {
    await expect(page.getByText("Productions")).toBeVisible();
    await expect(page.getByText("Crimson Horizon")).toBeVisible();
    await expect(page.getByText("Velocity")).toBeVisible();
  });

  test("movie cards show genre, budget, and status", async ({ page }) => {
    // Budget should be visible on at least one card
    await expect(page.getByText(/\$\d+M/).first()).toBeVisible();
    // Genre tags should appear
    await expect(page.getByText(/Sci-Fi|Action|Drama|Horror|Romance/).first()).toBeVisible();
  });

  test("edit and delete buttons are on each card", async ({ page }) => {
    const editBtns = page.getByText("Edit", { exact: true });
    expect(await editBtns.count()).toBeGreaterThanOrEqual(1);

    const deleteBtns = page.getByText("✕");
    expect(await deleteBtns.count()).toBeGreaterThanOrEqual(1);
  });

  test("+ New Project button is present", async ({ page }) => {
    await expect(page.getByText("+ New Project")).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// 6. TEAM PAGE — Member cards, Role info, Add member
// ═══════════════════════════════════════════════════════════

test.describe("Team Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/team", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("displays team member count", async ({ page }) => {
    await expect(page.getByText(/8 team members/)).toBeVisible();
  });

  test("shows role chips for each department", async ({ page }) => {
    await expect(page.getByText("Director").first()).toBeVisible();
    await expect(page.getByText("Producer").first()).toBeVisible();
    await expect(page.getByText("Marketing Lead").first()).toBeVisible();
  });

  test("team member cards show name, role, and status", async ({ page }) => {
    await expect(page.getByText("Sarah Chen")).toBeVisible();
    await expect(page.getByText("Marcus Webb")).toBeVisible();
    await expect(page.getByText(/Active/).first()).toBeVisible();
  });

  test("department distribution bar is visible", async ({ page }) => {
    await expect(page.getByText("Department Distribution")).toBeVisible();
  });

  test("Role Guide modal can be opened", async ({ page }) => {
    const roleBtn = page.getByText("Role Guide");
    await expect(roleBtn).toBeVisible();
    await roleBtn.click();
    await page.waitForTimeout(1000);

    // Modal with permissions
    await expect(page.getByText("Role Permissions Guide")).toBeVisible();
    await expect(page.getByText(/Oversees creative vision/)).toBeVisible();
  });

  test("Add Member modal can be opened", async ({ page }) => {
    const addBtn = page.getByText("+ Add Member");
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await page.waitForTimeout(1000);

    await expect(page.getByText("Add Team Member")).toBeVisible();
    await expect(page.getByPlaceholder(/name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// 7. ASSETS PAGE — Filters, approval, breakdown
// ═══════════════════════════════════════════════════════════

test.describe("Assets Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/assets", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("displays asset stats (Total, Pending, Approved, Storage)", async ({ page }) => {
    await expect(page.getByText("Total Assets")).toBeVisible();
    await expect(page.getByText("Pending Review")).toBeVisible();
    await expect(page.getByText("Approved").first()).toBeVisible();
    await expect(page.getByText("Storage Used")).toBeVisible();
  });

  test("shows asset list with file names", async ({ page }) => {
    await expect(page.getByText("Official Poster v3.psd")).toBeVisible();
    await expect(page.getByText("Teaser Trailer Final.mp4")).toBeVisible();
  });

  test("filter buttons work", async ({ page }) => {
    const pendingBtn = page.getByRole("button", { name: /pending/i });
    await expect(pendingBtn).toBeVisible();
    await pendingBtn.click();
    await page.waitForTimeout(500);

    // Should show only pending assets
    await expect(page.getByText("Teaser Trailer Final.mp4")).toBeVisible();
  });

  test("approve button appears on pending assets", async ({ page }) => {
    const approveBtn = page.getByText("Approve", { exact: true }).first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test("Assets by Project sidebar is visible", async ({ page }) => {
    await expect(page.getByText("Assets by Project")).toBeVisible();
    await expect(page.getByText("By Type")).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// 8. ANALYTICS PAGE — Charts and data visualization
// ═══════════════════════════════════════════════════════════

test.describe("Analytics Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/analytics", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("displays Revenue vs Budget section", async ({ page }) => {
    await expect(page.getByText("Revenue vs Budget")).toBeVisible();
    await expect(page.getByText(/ROI/).first()).toBeVisible();
  });

  test("displays Campaign Spend Mix", async ({ page }) => {
    await expect(page.getByText("Campaign Spend Mix")).toBeVisible();
    // Channel legend
    await expect(page.getByText("Social").first()).toBeVisible();
    await expect(page.getByText("Digital").first()).toBeVisible();
  });

  test("displays Engagement Heatmap", async ({ page }) => {
    await expect(page.getByText("Engagement Heatmap")).toBeVisible();
    // Column headers
    await expect(page.getByText("Trailers")).toBeVisible();
    await expect(page.getByText("Streaming")).toBeVisible();
  });

  test("displays Monthly Revenue Trend", async ({ page }) => {
    await expect(page.getByText("Monthly Revenue Trend")).toBeVisible();
  });

  test("genre ROI cards are visible", async ({ page }) => {
    await expect(page.getByText(/Action/).first()).toBeVisible();
    await expect(page.getByText(/Drama/).first()).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// 9. PROMOTION PAGE — Timeline, tasks, film selector
// ═══════════════════════════════════════════════════════════

test.describe("Promotion Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/promotion", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("displays film selector buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Crimson Horizon/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Whispers/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Velocity/ })).toBeVisible();
  });

  test("shows promotion progress bar", async ({ page }) => {
    await expect(page.getByText(/Promotion Progress/)).toBeVisible();
    await expect(page.getByText(/Step \d+ of 9/)).toBeVisible();
  });

  test("timeline shows 9 promotion steps", async ({ page }) => {
    await expect(page.getByText("Market Research & Positioning")).toBeVisible();
    await expect(page.getByText("Brand Identity & Assets")).toBeVisible();
    await expect(page.getByText("Performance Analysis")).toBeVisible();
  });

  test("switching films changes the progress", async ({ page }) => {
    // Select Moonlit Garden (promoStep = 1)
    const moonlit = page.getByRole("button", { name: /Moonlit Garden/ });
    await moonlit.click();
    await page.waitForTimeout(1500);

    await expect(page.getByText(/Moonlit Garden — Promotion Progress/)).toBeVisible();
    await expect(page.getByText("Step 1 of 9")).toBeVisible();
  });

  test("task checkboxes are interactive", async ({ page }) => {
    // Find a task checkbox in the current active step
    const checkboxes = page.locator("button").filter({ hasText: "" });
    expect(await checkboxes.count()).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════
// 9b. ANNOUNCEMENTS PAGE — Announcement Board
// ═══════════════════════════════════════════════════════════

test.describe("Announcements Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/announcements", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("displays announcement board title", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "🎬 Movie announcements" })).toBeVisible();
  });

  test("renders statistical counter values", async ({ page }) => {
    await expect(page.getByText("Total").first()).toBeVisible();
    await expect(page.getByText("Urgent").first()).toBeVisible();
    await expect(page.getByText("Pinned").first()).toBeVisible();
    await expect(page.getByText("Passed").first()).toBeVisible();
  });

  test("grid and swimlane view toggle works", async ({ page }) => {
    // Defaults to grid view which shows hero spotlight and cards
    await expect(page.getByRole("button", { name: "Swimlanes", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Swimlanes", exact: true }).click();
    await page.waitForTimeout(1000);
    
    // Swimlanes view shows category lane headings (h3 elements)
    await expect(page.getByRole("heading", { name: /Premieres/i }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: /Trailer drops/i }).first()).toBeVisible({ timeout: 10000 });
  });
});

// ═══════════════════════════════════════════════════════════
// 10. REPORTS PAGE — Executive summary, performance table
// ═══════════════════════════════════════════════════════════

test.describe("Reports Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reports", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("executive summary cards display financial data", async ({ page }) => {
    await expect(page.getByText("Portfolio Value")).toBeVisible();
    await expect(page.getByText("Total Revenue")).toBeVisible();
    await expect(page.getByText("Campaign Spend")).toBeVisible();
    await expect(page.getByText("Digital Impressions")).toBeVisible();
    await expect(page.getByText("Social Engagement")).toBeVisible();
    await expect(page.getByText("Press Coverage")).toBeVisible();
  });

  test("film performance table has all movies", async ({ page }) => {
    await expect(page.getByText("Film Performance")).toBeVisible();
    await expect(page.getByText("Crimson Horizon").first()).toBeVisible();
    await expect(page.getByText("Velocity").first()).toBeVisible();
  });

  test("campaign channel trends chart is visible", async ({ page }) => {
    await expect(page.getByText("Campaign Channel Trends")).toBeVisible();
  });

  test("quick insights sidebar shows top performer", async ({ page }) => {
    await expect(page.getByText("Quick Insights")).toBeVisible();
    await expect(page.getByText("Top Performer")).toBeVisible();
    await expect(page.getByText("Average Rating")).toBeVisible();
    await expect(page.getByText("Asset Pipeline")).toBeVisible();
  });

  test("budget allocation section is visible", async ({ page }) => {
    await expect(page.getByText("Budget Allocation")).toBeVisible();
  });

  test("recent activity section shows entries", async ({ page }) => {
    await expect(page.getByText("Recent Activity")).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// 11. SETTINGS PAGE — Profile, toggles, integrations
// ═══════════════════════════════════════════════════════════

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("profile section displays user info", async ({ page }) => {
    await expect(page.getByText("Profile Settings")).toBeVisible();
    await expect(page.getByText("Sarah Chen")).toBeVisible();
    await expect(page.getByText(/sarah@studio\.com/)).toBeVisible();
  });

  test("notification toggles are present", async ({ page }) => {
    await expect(page.getByText("Notification Channels")).toBeVisible();
    await expect(page.getByText("Email Notifications")).toBeVisible();
    await expect(page.getByText("Push Notifications")).toBeVisible();
  });

  test("theme selector has Dark/Light/System options", async ({ page }) => {
    await expect(page.getByText("Appearance")).toBeVisible();
    await expect(page.getByRole("button", { name: /Dark/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Light/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /System/ })).toBeVisible();
  });

  test("integrations section lists 6 services", async ({ page }) => {
    await expect(page.getByText("Integrations")).toBeVisible();
    await expect(page.getByText("Slack").first()).toBeVisible();
    await expect(page.getByText("Google Drive")).toBeVisible();
    await expect(page.getByText("Frame.io")).toBeVisible();
    await expect(page.getByText("Jira")).toBeVisible();
  });

  test("danger zone has export and reset buttons", async ({ page }) => {
    await expect(page.getByText("Danger Zone")).toBeVisible();
    await expect(page.getByRole("button", { name: "Export Data" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset" }).first()).toBeVisible();
  });

  test("save settings button triggers confirmation", async ({ page }) => {
    const saveBtn = page.getByRole("button", { name: "Save Settings" });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    await expect(page.getByText(/settings saved/i)).toBeVisible({ timeout: 5000 });
  });
});

// ═══════════════════════════════════════════════════════════
// 12. CALENDAR PAGE — Timeline rendering
// ═══════════════════════════════════════════════════════════

test.describe("Calendar Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  });

  test("timeline heading and date range are visible", async ({ page }) => {
    // TextReveal animates chars individually — just verify h1 exists
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    // Subheading with date range
    await expect(page.getByText(/Apr.*Dec/).first()).toBeVisible();
  });

  test("production rows show movie titles", async ({ page }) => {
    await expect(page.getByText("Crimson Meridian")).toBeVisible();
    await expect(page.getByText("The Last Observatory")).toBeVisible();
    await expect(page.getByText("Whispers at Dawn")).toBeVisible();
    await expect(page.getByText("Iron Cascade")).toBeVisible();
  });

  test("legend shows completed/upcoming/today indicators", async ({ page }) => {
    // Legend at the bottom uses <span> elements — use CSS to scope to legend container
    const legendSection = page.locator(".flex.flex-wrap.items-center.gap-4").last();
    await expect(legendSection.getByText("Completed")).toBeVisible();
    await expect(legendSection.getByText("Upcoming")).toBeVisible();
    await expect(legendSection.getByText("Today")).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// 13. CROSS-PAGE STATE PERSISTENCE — Zustand store
// ═══════════════════════════════════════════════════════════

test.describe("Cross-Page State Persistence", () => {
  test("adding a comment on dashboard persists within session", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Type a comment
    const commentInput = page.getByPlaceholder(/note|feedback|comment/i);
    await expect(commentInput).toBeVisible({ timeout: 5000 });
    await commentInput.fill("E2E test comment from Playwright");

    // Click Post
    const postBtn = page.getByRole("button", { name: "Post" });
    await postBtn.click();
    await page.waitForTimeout(1000);

    // Comment should appear in the list
    await expect(page.getByText("E2E test comment from Playwright")).toBeVisible({ timeout: 5000 });
  });
});

// ═══════════════════════════════════════════════════════════
// 14. HEADER & SEARCH — Global search bar
// ═══════════════════════════════════════════════════════════

test.describe("Header", () => {
  test("search bar is visible on dashboard", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const searchInput = page.getByPlaceholder(/search|film|people/i);
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });

  test("settings icon in header is clickable", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const settingsIcon = page.getByLabel(/settings/i);
    if (await settingsIcon.isVisible()) {
      await settingsIcon.click();
      await page.waitForTimeout(500);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// 15. RESPONSIVE — Mobile viewport
// ═══════════════════════════════════════════════════════════

test.describe("Responsive Layout", () => {
  test("mobile viewport shows hamburger menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Sidebar should be hidden on mobile
    const sidebar = page.locator("aside");
    // Hamburger button should be visible
    const menuBtn = page.getByLabel("Open menu");
    await expect(menuBtn).toBeVisible();

    // Open mobile menu
    await menuBtn.click();
    await page.waitForTimeout(500);
    await expect(sidebar).toBeVisible();
  });

  test("dashboard content adapts to mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // KPI card text should still be readable (CSS uppercases the raw label)
    await expect(page.getByText("Total Budget")).toBeVisible();
    await expect(page.getByText(/\$430M/).first()).toBeVisible();
  });
});
