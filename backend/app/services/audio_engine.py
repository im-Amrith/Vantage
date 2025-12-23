from __future__ import annotations

import re


class AudioEngine:
    def __init__(self) -> None:
        pass

    def analyze_transcript(self, text: str) -> dict:
        tokens = [t for t in re.split(r"\s+", text.strip()) if t]
        filler = sum(1 for t in tokens if t.lower() in {"um", "uh", "like", "you", "know"})

        fluency = 1.0
        if tokens:
            fluency = max(0.0, 1.0 - (filler / max(1, len(tokens))))

        notes = []
        if filler >= 3:
            notes.append("High filler-word usage")

        return {"fluency": fluency, "filler_count": filler, "notes": notes}
