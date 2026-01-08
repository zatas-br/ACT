
import asyncio
from playwright.async_api import async_playwright
import sys
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Assume server is running on port 8000
        try:
            await page.goto("http://localhost:8000", timeout=10000)
        except Exception as e:
            print(f"Error connecting to server: {e}")
            return

        # Wait for content to load
        await page.wait_for_timeout(2000)

        # Scroll to services grid
        services = page.locator('#services-grid')
        await services.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)

        # Screenshot cards
        await page.screenshot(path="verification/verification_cards.png")
        print("Captured verification_cards.png")

        # Click first card
        cards = await page.locator('.card').all()
        if not cards:
            print("No cards found!")
            sys.exit(1)

        await cards[0].click()

        # Wait for modal
        modal = page.locator('#global-modal-overlay')
        await expect_modal_visible(modal)

        await page.wait_for_timeout(500) # Wait for fade in

        # Screenshot modal
        await page.screenshot(path="verification/verification_modal.png")
        print("Captured verification_modal.png")

        await browser.close()

async def expect_modal_visible(locator):
    for i in range(10):
        classes = await locator.get_attribute('class')
        if 'active' in classes:
            return
        await asyncio.sleep(0.2)
    print("FAILED: Modal did not get 'active' class")
    sys.exit(1)

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    asyncio.run(verify())
