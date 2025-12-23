from __future__ import annotations

from app.services.orchestrator import InterviewOrchestrator
from app.services.tracker import TrackerService
from app.services.code_executor import CodeExecutor
from app.services.recon_service import ReconService
from app.services.roadmap_service import RoadmapService
from app.services.llm_agent import LlmAgent

# Initialize shared services
llm_agent = LlmAgent() # Shared LLM instance if needed, or orchestrator has its own

orchestrator = InterviewOrchestrator() # Orchestrator creates its own LLM agent internally currently
tracker = TrackerService()
executor = CodeExecutor()
recon = ReconService(llm_agent=orchestrator._llm) # Reuse the LLM agent from orchestrator
roadmap = RoadmapService(llm_agent=orchestrator._llm)
