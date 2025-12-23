from __future__ import annotations

import os
import uuid
import json
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import settings
from app.core.state import orchestrator, tracker, executor, recon, roadmap
from app.models.schemas import (
    DashboardStats,
    InterviewStartRequest,
    InterviewStartResponse,
    RoundInfo,
    SubmitAnswerResult,
    InterviewHistoryItem,
    SkillMatrixItem,
    CriticalAlert,
    InterviewReport,
    TrackerData,
    JobApplication,
    CodeExecutionRequest,
    CodeExecutionResponse,
    ReconRequest,
    ReconResponse,
    ResumeItem,
)
from pydantic import BaseModel

class AnswerRequest(BaseModel):
    answer_text: str

router = APIRouter()


@router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf"}:
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported")

    upload_dir = Path(settings.data_dir) / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_id = str(uuid.uuid4())
    dest = upload_dir / f"{file_id}.pdf"

    content = await file.read()
    dest.write_bytes(content)

    # Update metadata
    resumes_file = Path(settings.data_dir) / "resumes.json"
    resumes = []
    if resumes_file.exists():
        try:
            resumes = json.loads(resumes_file.read_text())
        except:
            pass
    
    new_resume = {
        "id": file_id,
        "name": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "is_default": len(resumes) == 0
    }
    resumes.append(new_resume)
    resumes_file.write_text(json.dumps(resumes, indent=2))

    return {"resume_id": file_id, "path": str(dest)}


@router.get("/resume/list", response_model=list[ResumeItem])
async def list_resumes():
    resumes_file = Path(settings.data_dir) / "resumes.json"
    if not resumes_file.exists():
        return []
    try:
        data = json.loads(resumes_file.read_text())
        return [ResumeItem(**item) for item in data]
    except:
        return []


@router.post("/interview/start", response_model=InterviewStartResponse)
async def start_interview(payload: InterviewStartRequest):
    session = await orchestrator.create_session(
        resume_id=payload.resume_id,
        job_description=payload.job_description,
        role=payload.role,
        num_questions=payload.num_questions,
    )

    return InterviewStartResponse(
        session_id=session.session_id,
        current_question=session.current_question,
    )


@router.get("/interview/history", response_model=list[InterviewHistoryItem])
async def get_interview_history():
    return [
        InterviewHistoryItem(
            id="1",
            role="Senior Frontend Engineer",
            date="2023-10-24",
            duration="45m",
            score=85,
            status="Completed"
        ),
        InterviewHistoryItem(
            id="2",
            role="Backend Developer",
            date="2023-10-20",
            duration="30m",
            score=72,
            status="Completed"
        ),
        InterviewHistoryItem(
            id="3",
            role="Product Manager",
            date="2023-10-15",
            duration="15m",
            score=0,
            status="Incomplete"
        ),
    ]


@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    # In a real app, this would fetch from a database
    return DashboardStats(
        rounds=[
            RoundInfo(
                id="1",
                name="Screening",
                round_label="1 Round",
                applicants_desc="17 Applicants Completed",
                questions_desc="17 Questions",
                status="Completed",
                status_color="text-green-500"
            ),
            RoundInfo(
                id="2",
                name="Coding",
                round_label="2 Round",
                applicants_desc="12 Applicants Completed",
                questions_desc="27 Questions",
                status="Cancelled",
                status_color="text-red-500"
            ),
        ],
        skill_matrix=[
            SkillMatrixItem(subject="Technical", A=120),
            SkillMatrixItem(subject="Communication", A=98),
            SkillMatrixItem(subject="Confidence", A=86),
            SkillMatrixItem(subject="Subject Depth", A=99),
            SkillMatrixItem(subject="Problem Solving", A=85),
            SkillMatrixItem(subject="Culture Fit", A=65),
        ],
        critical_alerts=[
            CriticalAlert(
                id="1",
                title="System Design Depth",
                description="You failed to discuss Scalability in 3/5 sessions.",
                type="critical",
                action_label="Practice Module"
            ),
            CriticalAlert(
                id="2",
                title="Body Language",
                description="Eye contact drops below 40% when thinking.",
                type="warning",
                action_label="Practice Module"
            ),
        ],
        recent_missions=[
            InterviewHistoryItem(
                id="1",
                role="DevOps Intern",
                date="2h ago",
                duration="45m",
                score=82,
                status="Passed"
            ),
            InterviewHistoryItem(
                id="2",
                role="Senior Backend",
                date="1d ago",
                duration="60m",
                score=65,
                status="Failed"
            ),
            InterviewHistoryItem(
                id="3",
                role="Full Stack",
                date="3d ago",
                duration="30m",
                score=78,
                status="Passed"
            ),
        ]
    )


@router.post("/interview/{session_id}/answer", response_model=SubmitAnswerResult)
async def submit_answer(session_id: str, payload: AnswerRequest):
    result = await orchestrator.submit_answer(session_id, payload.answer_text)
    return result


@router.post("/interview/{session_id}/end", response_model=InterviewReport)
async def end_interview_session(session_id: str):
    report = await orchestrator.end_session(session_id)
    return report


@router.get("/tracker", response_model=TrackerData)
async def get_tracker_data():
    return tracker.get_data()


@router.post("/tracker/sync", response_model=TrackerData)
async def sync_tracker_data(data: TrackerData):
    return tracker.update_data(data)


@router.post("/tracker/job", response_model=TrackerData)
async def add_tracker_job(job: JobApplication):
    return tracker.add_job(job)


@router.post("/dojo/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    return executor.execute(request.code, request.language, request.problem_id)


@router.post("/recon/search", response_model=ReconResponse)
async def search_company_intel(request: ReconRequest):
    return await recon.gather_intel(request.company)


@router.get("/roadmap/generate")
async def generate_roadmap(role: str):
    return await roadmap.generate_career_path(role)
