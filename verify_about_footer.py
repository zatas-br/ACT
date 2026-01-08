from playwright.sync_api import sync_playwright
import os
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Load local about.html
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/about.html")

        # Wait for JS to run (loadContent)
        page.wait_for_timeout(1000)

        print("Checking footer logo on about.html...")
        logo = page.locator("#footer-logo")

        if logo.count() > 0 and logo.is_visible():
            src = logo.get_attribute("src")
            print(f"SUCCESS: Footer logo found with src: {src}")
            if "git.png" in src:
                print("SUCCESS: Logo src is correct.")
            else:
                print(f"WARNING: Logo src might be incorrect: {src}")
        else:
            print("FAILURE: Footer logo is missing or not visible.")
            exit(1)

        print("Checking global modal overlay...")
        modal = page.locator("#global-modal-overlay")
        if modal.count() > 0:
            print("SUCCESS: Modal overlay structure found.")
        else:
            print("FAILURE: Modal overlay structure missing.")
            exit(1)

        # Take screenshot of footer
        footer = page.locator("footer")
        footer.screenshot(path="about_footer_fixed.png")
        print("Screenshot saved to about_footer_fixed.png")

        browser.close()

if __name__ == "__main__":
    run()
