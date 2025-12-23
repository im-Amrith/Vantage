from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class InterviewQuestion(BaseModel):
    id: str
    kind: Literal["technical", "behavioral"] = "technical"
    prompt: str
    context: str | None = None


class InterviewStartRequest(BaseModel):
    resume_id: str | None = None
    role: str = "Software Engineer"
    job_description: str
    num_questions: int = Field(default=5, ge=1, le=20)


class InterviewStartResponse(BaseModel):
    session_id: str
    current_question: InterviewQuestion


class InterviewFeedback(BaseModel):
    technical_accuracy: float = Field(ge=0, le=1)
    clarity: float = Field(ge=0, le=1)
    confidence: float = Field(ge=0, le=1)
    notes: list[str] = Field(default_factory=list)


class InterviewReport(BaseModel):
    session_id: str
    num_questions: int
    hiring_probability: float = Field(ge=0, le=1)
    averages: dict[str, float]
    events: list[dict[str, Any]] = Field(default_factory=list)
    areas_of_improvement: list[str] = Field(default_factory=list)
    mistakes: list[str] = Field(default_factory=list)
    tips: list[str] = Field(default_factory=list)
    areas_of_improvement: list[str] = Field(default_factory=list)
    mistakes: list[str] = Field(default_factory=list)
    tips: list[str] = Field(default_factory=list)


class SubmitAnswerResult(BaseModel):
    feedback: InterviewFeedback
    next_question: InterviewQuestion | None
    report: InterviewReport | None


class RoundInfo(BaseModel):
    id: str
    name: str
    round_label: str
    applicants_desc: str
    questions_desc: str
    status: Literal["Completed", "Cancelled", "In progress"]
    status_color: str


class InterviewHistoryItem(BaseModel):
    id: str
    role: str
    date: str
    duration: str
    score: int
    status: str


class SkillMatrixItem(BaseModel):
    subject: str
    A: int
    fullMark: int = 150


class CriticalAlert(BaseModel):
    id: str
    title: str
    description: str
    type: Literal["critical", "warning", "info"]
    action_label: str | None = None


class JobApplication(BaseModel):
    id: str
    company: str
    role: str
    logo: str | None = None
    days_ago: int = 0
    status: Literal["active", "stagnant", "closed"] = "active"


class TrackerColumn(BaseModel):
    id: str
    title: str
    color: str
    items: list[JobApplication]


class ResumeItem(BaseModel):
    id: str
    name: str
    date: str
    is_default: bool = False


class TrackerData(BaseModel):
    columns: dict[str, TrackerColumn]
    column_order: list[str]


class ReconRequest(BaseModel):
    company: str


class ReconResponse(BaseModel):
    name: str
    logo: str
    techStack: list[str]
    values: list[str]
    topics: list[dict]
    tips: list[str]
    news: list[str]
    sentiment: dict | None = None


class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    problem_id: str | None = None


class TestCaseResult(BaseModel):
    id: int
    input: str
    expected: str
    actual: str
    passed: bool
    error: str | None = None


class CodeExecutionResponse(BaseModel):
    results: list[TestCaseResult]
    output: str | None = None
    error: str | None = None
    complexity: dict[str, str] | None = None


class DashboardStats(BaseModel):
    rounds: list[RoundInfo]
    skill_matrix: list[SkillMatrixItem]
    critical_alerts: list[CriticalAlert]
    recent_missions: list[InterviewHistoryItem]

