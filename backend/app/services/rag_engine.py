from __future__ import annotations

import uuid
from typing import Optional

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

from app.core.config import settings
from app.models.schemas import InterviewQuestion


class QuestionList(BaseModel):
    questions: list[str] = Field(description="List of interview questions")


class RagEngine:
    def __init__(self) -> None:
        self.llm = ChatGroq(
            api_key=settings.groq_api_key,
            model_name=settings.groq_model,
            temperature=0.7,
        )

    async def generate_questions(
        self,
        resume_id: Optional[str],
        job_description: str,
        role: str,
        num_questions: int,
    ) -> list[InterviewQuestion]:
        parser = JsonOutputParser(pydantic_object=QuestionList)
        
        prompt = ChatPromptTemplate.from_template(
            """
            You are an expert technical recruiter. Generate {num_questions} interview questions for a {role} position.
            
            Job Description:
            {job_description}
            
            The questions should be a mix of technical and behavioral.
            
            {format_instructions}
            """
        )
        
        chain = prompt | self.llm | parser
        
        try:
            result = await chain.ainvoke({
                "num_questions": num_questions,
                "role": role,
                "job_description": job_description[:2000], # Truncate if too long
                "format_instructions": parser.get_format_instructions(),
            })
            
            questions_text = result.get("questions", [])
            
            questions: list[InterviewQuestion] = []
            for i, q_text in enumerate(questions_text):
                kind = "technical" if "technical" in q_text.lower() or i < num_questions // 2 else "behavioral"
                # Simple heuristic for kind, can be improved
                
                questions.append(
                    InterviewQuestion(
                        id=str(uuid.uuid4()),
                        kind=kind,
                        prompt=q_text,
                        context=job_description[:200] + "...",
                    )
                )
            return questions
            
        except Exception as e:
            print(f"Error generating questions: {e}")
            # Fallback
            questions: list[InterviewQuestion] = []
            for i in range(num_questions):
                kind = "technical" if i < max(1, num_questions - 1) else "behavioral"
                prompt_text = (
                    f"({role}) Question {i + 1}: Based on the job description, explain a relevant concept and give an example." 
                    if kind == "technical"
                    else "Tell me about a time you faced a difficult deadline. What did you do?"
                )
                context = (job_description[:500] + "...") if job_description else None
                questions.append(
                    InterviewQuestion(
                        id=str(uuid.uuid4()),
                        kind=kind,
                        prompt=prompt_text,
                        context=context,
                    )
                )
            return questions
