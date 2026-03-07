import pytest

from app.scraping.linkedin_scraper import _extract_list_text, _extract_text


class FakeNth:
    def __init__(self, value):
        self.value = value

    async def inner_text(self):
        return self.value


class FakeLocator:
    def __init__(self, values):
        self.values = values
        self.first = self

    async def count(self):
        return len(self.values)

    async def inner_text(self):
        return self.values[0]

    def nth(self, idx):
        return FakeNth(self.values[idx])


class FakePage:
    def __init__(self, mapping):
        self.mapping = mapping

    def locator(self, selector):
        return FakeLocator(self.mapping.get(selector, []))


@pytest.mark.asyncio
async def test_extract_text_returns_first_non_empty_selector():
    page = FakePage({"a": [], "b": ["Headline here"]})
    value = await _extract_text(page, ["a", "b"])
    assert value == "Headline here"


@pytest.mark.asyncio
async def test_extract_list_text_joins_items():
    page = FakePage({"x": ["Python", "FastAPI", "Docker"]})
    value = await _extract_list_text(page, ["x"])
    assert value == "Python\nFastAPI\nDocker"
