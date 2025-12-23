from __future__ import annotations

import uuid
from datetime import datetime
from dataclasses import dataclass, field

from app.models.schemas import (
    InterviewFeedback,
    InterviewQuestion,
    InterviewReport,
    SubmitAnswerResult,
)
from app.services.audio_engine import AudioEngine
from app.services.llm_agent import LlmAgent
from app.services.rag_engine import RagEngine
from app.services.vision_engine import VisionEngine


@dataclass
class InterviewSession:
    session_id: str
    questions: list[InterviewQuestion]
    idx: int = 0
    events: list[dict] = field(default_factory=list)

    @property
    def current_question(self) -> InterviewQuestion:
        return self.questions[self.idx]


class InterviewOrchestrator:
    def __init__(self) -> None:
        self._sessions: dict[str, InterviewSession] = {}
        self._rag = RagEngine()
        self._vision = VisionEngine()
        self._audio = AudioEngine()
        self._llm = LlmAgent()

    async def create_session(self, resume_id: str | None, job_description: str, role: str, num_questions: int) -> InterviewSession:
        session_id = str(uuid.uuid4())

        questions = await self._rag.generate_questions(
            resume_id=resume_id,
            job_description=job_description,
            role=role,
            num_questions=num_questions,
        )

        session = InterviewSession(session_id=session_id, questions=questions)
        self._sessions[session_id] = session
        session.events.append({"type": "session_created", "role": role})
        return session

    def get_session(self, session_id: str) -> InterviewSession:
        if session_id not in self._sessions:
            raise KeyError("Unknown session")
        return self._sessions[session_id]

    async def submit_answer(self, session_id: str, answer_text: str) -> SubmitAnswerResult:
        session = self.get_session(session_id)
        question = session.current_question

        audio_stats = self._audio.analyze_transcript(answer_text)
        llm_eval = await self._llm.evaluate_answer(question=question, answer=answer_text)

        feedback = InterviewFeedback(
            technical_accuracy=llm_eval.get("technical_accuracy", 0.5),
            clarity=llm_eval.get("clarity", 0.5),
            confidence=min(1.0, max(0.0, 0.5 + 0.5 * (audio_stats.get("fluency", 0.0)))),
            notes=[
                *(llm_eval.get("notes") or []),
                *audio_stats.get("notes", []),
            ],
        )

        session.events.append(
            {
                "type": "answer_submitted",
                "timestamp": datetime.now().isoformat(),
                "question_id": question.id,
                "question": question.model_dump(),
                "answer": answer_text,
                "feedback": feedback.model_dump(),
            }
        )

        session.idx += 1
        if session.idx >= len(session.questions):
            report = await self._build_report(session)
            return SubmitAnswerResult(feedback=feedback, next_question=None, report=report)

        return SubmitAnswerResult(feedback=feedback, next_question=session.current_question, report=None)

    async def submit_telemetry(self, session_id: str, telemetry: dict) -> None:
        session = self.get_session(session_id)
        vision_stats = self._vision.analyze_telemetry(telemetry)
        session.events.append({"type": "telemetry", "telemetry": telemetry, "vision": vision_stats})

    async def end_session(self, session_id: str) -> InterviewReport:
        session = self.get_session(session_id)
        return await self._build_report(session)

    async def _build_report(self, session: InterviewSession) -> InterviewReport:
        feedbacks = [e.get("feedback") for e in session.events if e.get("type") == "answer_submitted"]
        feedbacks = [f for f in feedbacks if isinstance(f, dict)]

        def avg(key: str) -> float:
            vals = [float(f.get(key, 0.0)) for f in feedbacks]
            return sum(vals) / len(vals) if vals else 0.0

        # Generate comprehensive report using LLM
        llm_report = await self._llm.generate_final_report(session.events)

        averages = {
            "technical_accuracy": avg("technical_accuracy"),
            "clarity": avg("clarity"),
            "confidence": avg("confidence"),
            "attitude": llm_report.get("attitude_score", 0.85),
        }
        hiring_probability = 0.5 * averages["technical_accuracy"] + 0.2 * averages["clarity"] + 0.3 * averages["confidence"]

        return InterviewReport(
            session_id=session.session_id,
            num_questions=len(session.questions),
            hiring_probability=hiring_probability,
            averages=averages,
            events=session.events,
            areas_of_improvement=llm_report.get("areas_of_improvement", []),
            mistakes=llm_report.get("mistakes", []),
            tips=llm_report.get("tips", []),
        )
