import { test, expect } from '../afterEachSetup'

  test('Test A1: Navigate and verify title', async ({ page }) => {
    await page.goto('https://example.com');
    await test.step("Verify page title", async () => {
      expect(await page.title()).toBe('Example Domain');
    });
  });

  // Tests A2 to A10
  for (let i = 2; i <= 10; i++) {
    test(`Test A${i}: Check content visibility and interaction`, async ({ page }) => {
      await test.step(`Navigate to example page for Test A${i}`, async () => {
        await page.goto('https://example.com');
      });
      await test.step("Check for visible header", async () => {
        const header = page.locator('h1');
        expect(await header.isVisible()).toBe(true);
      });
      await test.step("Verify header text", async () => {
        const header = page.locator('h1');
        // Intentionally failing some tests to simulate the issue
        if (i % 2 === 0) {
          expect(await header.textContent()).toBe(`Incorrect Header A${i}`); // This will fail for even tests
        } else {
          expect(await header.textContent()).not.toBe(''); // This should pass for odd tests
        }
      });
      await test.step("Click on 'More information' link (if applicable)", async () => {
        const link = page.locator('a');
        if (await link.isVisible()) {
          await link.click();
          // Verify navigation for odd tests only
          if (i % 2 !== 0) {
            expect(await page.url()).not.toBe('https://example.com');
          }
        }
      });
    });
  }
