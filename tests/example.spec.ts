import { test, expect } from '../afterEachSetup'

  test('Test B1: Fill and submit form', async ({ page }) => {
    await page.goto('https://example.com/forms');
    await test.step("Fill the form", async () => {
      await page.fill('input[name="firstName"]', 'John', { timeout: 1000 });
      await page.fill('input[name="lastName"]', 'Doe');
      await page.click('input[type="submit"]');
    });
    await test.step("Verify submission", async () => {
      expect(await page.locator('p.status').textContent()).toBe('Form submitted!');
    });
  });

  // Tests B2 to B10
  for (let i = 2; i <= 10; i++) {
    test(`Test B${i}: Form validation and error messages`, async ({ page }) => {
      await test.step(`Navigate to form page for Test B${i}`, async () => {
        await page.goto('https://example.com/forms');
      });
      await test.step("Submit empty form", async () => {
        await page.click('input[type="submit"]', { timeout: 1000 });
      });
      await test.step("Verify error messages", async () => {
        const errorLocator = page.locator('.error');
        // Intentionally failing some tests to simulate the issue
        if (i % 2 === 0) {
          expect(await errorLocator.count()).toBe(0); // This will fail for even tests
        } else {
          expect(await errorLocator.count()).toBeGreaterThan(0); // This should pass for odd tests
        }
      });
      await test.step("Fill form with invalid data", async () => {
        await page.fill('input[name="email"]', `invalid-email-for-test-B${i}`);
        await page.click('input[type="submit"]');
      });
      await test.step("Check for specific error message", async () => {
        // Failing specific tests to simulate different conditions
        if (i % 3 === 0) {
          expect(await page.textContent('.error')).toContain(`Invalid email address`); // This will fail for every third test
        } else {
          expect(await page.textContent('.error')).not.toContain(`Form submitted successfully`);
        }
      });
    });
  }
