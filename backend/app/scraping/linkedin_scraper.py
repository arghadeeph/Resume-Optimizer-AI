from __future__ import annotations

from playwright.async_api import async_playwright
from typing import List

from app.schemas.analysis import ProfileData


async def scrape_linkedin_profile(profile_url: str) -> ProfileData:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto(profile_url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(1500)

            headline = await _extract_text(
                page,
                [
                    "h1.text-heading-xlarge",
                    ".top-card-layout__headline",
                    "h2.top-card-layout__headline",
                ],
            )
            about = await _extract_text(
                page,
                [
                    "section.about-section",
                    "section.pv-about-section",
                    "#about",
                ],
            )
            experience = await _extract_list_text(
                page,
                [
                    "section.experience-section li",
                    "#experience ~ * li",
                    "section[id*='experience'] li",
                ],
            )
            skills = await _extract_list_text(
                page,
                [
                    "section.skills-section li",
                    "#skills ~ * li",
                    "section[id*='skills'] li",
                ],
            )

            return ProfileData(
                headline=headline,
                about=about,
                experience=experience,
                skills=skills,
            )
        finally:
            await browser.close()


async def _extract_text(page, selectors: List[str]) -> str:
    for selector in selectors:
        locator = page.locator(selector).first
        if await locator.count() > 0:
            content = (await locator.inner_text()).strip()
            if content:
                return content
    return ""


async def _extract_list_text(page, selectors: List[str]) -> str:
    for selector in selectors:
        locator = page.locator(selector)
        count = await locator.count()
        if count > 0:
            items = []
            for idx in range(min(count, 20)):
                text = (await locator.nth(idx).inner_text()).strip()
                if text:
                    items.append(text)
            if items:
                return "\n".join(items)
    return ""
