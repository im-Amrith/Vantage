from __future__ import annotations


class VisionEngine:
    def __init__(self) -> None:
        pass

    def analyze_telemetry(self, telemetry: dict) -> dict:
        gaze_score = telemetry.get("gaze_score")
        posture_score = telemetry.get("posture_score")
        emotion = telemetry.get("emotion")

        return {
            "gaze_score": gaze_score,
            "posture_score": posture_score,
            "emotion": emotion,
        }
