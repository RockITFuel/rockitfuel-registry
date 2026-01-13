import { expect, test } from "@playwright/test";

test.describe("Sidebar default collapsed state", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test("all sections are collapsed by default on initial page load", async ({
    page,
  }) => {
    // Navigate to the sidebar fixture page
    await page.goto("/__test__/sidebar-fixture");

    // Wait for the sidebar to be visible
    await page.waitForSelector("nav");

    // Verify all chevrons point right (collapsed state)
    // When collapsed, ChevronRight is shown; when expanded, ChevronDown is shown
    const chevronRightIcons = page.locator("nav button svg");
    const chevronCount = await chevronRightIcons.count();

    // We have 3 sections, each should have a chevron
    expect(chevronCount).toBe(3);

    // Check that all chevrons are ChevronRight (collapsed)
    // lucide-solid uses path elements with d attribute and class names
    for (let i = 0; i < chevronCount; i++) {
      const chevron = chevronRightIcons.nth(i);
      // lucide-solid icons have class "lucide-chevron-right" or "lucide-chevron-down"
      const hasRightClass = await chevron.evaluate((el) =>
        el.classList.contains("lucide-chevron-right")
      );
      expect(hasRightClass).toBe(true);
    }

    // Verify all section items are hidden (not in the DOM when using SolidJS Show)
    // The section items are inside divs with class "space-y-1 px-2"
    const sectionItems = page.locator("nav .space-y-1.px-2");
    const sectionItemsCount = await sectionItems.count();

    // All sections should be collapsed, so no item containers should be visible
    expect(sectionItemsCount).toBe(0);

    // Double-check: the actual navigation links inside sections should not exist
    // Links like "Dashboard", "Settings", "Profile" etc. should not be in the DOM
    const dashboardLink = page.getByRole("link", { name: "Dashboard" });
    await expect(dashboardLink).not.toBeVisible();

    const settingsLink = page.getByRole("link", { name: "Settings" });
    await expect(settingsLink).not.toBeVisible();

    const usersLink = page.getByRole("link", { name: "Users" });
    await expect(usersLink).not.toBeVisible();

    const reportsLink = page.getByRole("link", { name: "Reports" });
    await expect(reportsLink).not.toBeVisible();
  });

  test("localStorage is empty for sidebar-collapsed-sections on fresh load", async ({
    page,
  }) => {
    // Navigate to the sidebar fixture page
    await page.goto("/__test__/sidebar-fixture");

    // Check that localStorage doesn't have any expanded sections stored
    // or if it does, they should all be false/collapsed
    const storedState = await page.evaluate(() => {
      const stored = window.localStorage.getItem("sidebar-collapsed-sections");
      return stored ? JSON.parse(stored) : null;
    });

    // Either null (not set) or empty object, or all values are false
    if (storedState !== null) {
      const values = Object.values(storedState);
      const allCollapsed = values.every((v) => v === false);
      expect(allCollapsed).toBe(true);
    }
  });
});
