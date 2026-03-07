from __future__ import annotations

from collections import defaultdict, deque
from time import time
from typing import DefaultDict, Deque

from fastapi import HTTPException, Request

from app.core.config import settings


class InMemoryRateLimiter:
    def __init__(self, limit_per_minute: int):
        self.limit = limit_per_minute
        self.requests: DefaultDict[str, Deque[float]] = defaultdict(deque)

    def check(self, client_key: str) -> None:
        now = time()
        window_start = now - 60
        bucket = self.requests[client_key]
        while bucket and bucket[0] < window_start:
            bucket.popleft()
        if len(bucket) >= self.limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        bucket.append(now)


rate_limiter = InMemoryRateLimiter(settings.rate_limit_per_minute)


def apply_rate_limit(request: Request) -> None:
    client = request.client.host if request.client else "anonymous"
    rate_limiter.check(client)
