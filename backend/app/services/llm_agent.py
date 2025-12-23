from __future__ import annotations

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from app.core.config import settings
from app.models.schemas import InterviewQuestion


class LlmAgent:
    def __init__(self) -> None:
        self.llm = ChatGroq(
            api_key=settings.groq_api_key,
            model_name=settings.groq_model,
            temperature=0.3,
        )

    async def evaluate_answer(self, question: InterviewQuestion, answer: str) -> dict:
        parser = JsonOutputParser()
        prompt = ChatPromptTemplate.from_template(
            """
            You are an expert technical interviewer. Evaluate the candidate's answer to the following question.
            
            Question ({kind}): {question_text}
            Context: {context}
            
            Candidate Answer: {answer}
            
            Provide a JSON response with the following keys:
            - technical_accuracy: float (0.0 to 1.0)
            - clarity: float (0.0 to 1.0)
            - notes: list[str] (constructive feedback)
            
            {format_instructions}
            """
        )
        
        chain = prompt | self.llm | parser
        
        try:
            result = await chain.ainvoke({
                "kind": question.kind,
                "question_text": question.prompt,
                "context": question.context or "N/A",
                "answer": answer,
                "format_instructions": parser.get_format_instructions(),
            })
            return result
        except Exception as e:
            print(f"Error evaluating answer: {e}")
            # Fallback to stub
            score = 0.5
            if len(answer.strip()) >= 40:
                score = 0.65
            return {
                "technical_accuracy": score if question.kind == "technical" else 0.6,
                "clarity": min(1.0, max(0.0, 0.4 + 0.01 * len(answer.split()))),
                "notes": ["Error calling LLM, using fallback scoring."],
            }

    async def generate_final_report(self, history: list[dict]) -> dict:
        parser = JsonOutputParser()
        prompt = ChatPromptTemplate.from_template(
            """
            You are an expert interview coach. Review the following interview session history and generate a comprehensive performance report.
            
            Session History:
            {history}
            
            Provide a JSON response with the following keys:
            - areas_of_improvement: list[str] (3-5 key areas to work on)
            - mistakes: list[str] (Specific verbal or non-verbal mistakes noticed, e.g. "Used filler words", "Missed edge cases")
            - tips: list[str] (Actionable advice for next time)
            - attitude_score: float (0.0 to 1.0, based on tone and professionalism)
            
            {format_instructions}
            """
        )
        
        chain = prompt | self.llm | parser
        
        try:
            result = await chain.ainvoke({
                "history": str(history),
                "format_instructions": parser.get_format_instructions(),
            })
            return result
        except Exception as e:
            print(f"Error generating report: {e}")
            return {
                "areas_of_improvement": ["Practice more"],
                "mistakes": ["Could not analyze"],
                "tips": ["Keep trying"],
                "attitude_score": 0.8
            }

    async def analyze_company_intel(self, company: str, context: dict) -> dict:
        parser = JsonOutputParser()
        prompt = ChatPromptTemplate.from_template(
            """
            You are a corporate intelligence analyst. Analyze the provided search results for {company} and extract key information for a job candidate.
            
            Search Context:
            Tech Stack Info: {tech_stack}
            Values Info: {values}
            Interview Info: {interview}
            News Info: {news}
            Sentiment Info: {sentiment}
            
            Provide a JSON response with the following keys:
            - techStack: list[str] (Extract at least 5 key technologies, languages, or frameworks mentioned. e.g. ["React", "Python", "AWS", "Go", "Kubernetes"])
            - values: list[str] (Core values or leadership principles)
            - topics: list[dict] (Common interview topics with probability, e.g. {{"topic": "Graphs", "probability": 80}})
            - tips: list[str] (Specific interview tips for this company)
            - news: list[str] (Recent relevant news headlines)
            - sentiment: dict (Market sentiment analysis)
                - aggregateScore: float (0-5)
                - totalReviews: str (e.g. "12k")
                - sentiment: str (e.g. "Mostly Positive")
                - sources: list[dict] (e.g. [{{"name": "Glassdoor", "rating": 4.2, "icon": "G", "color": "text-green-500"}}])
                - themes: list[dict] (e.g. [{{"topic": "WLB", "score": "High", "trend": "up"}}])
                - aiSummary: dict ({{ "pros": [], "cons": [] }})
            
            {format_instructions}
            """
        )
        
        chain = prompt | self.llm | parser
        
        try:
            result = await chain.ainvoke({
                "company": company,
                "tech_stack": context.get("tech_stack", ""),
                "values": context.get("values", ""),
                "interview": context.get("interview", ""),
                "news": context.get("news", ""),
                "sentiment": context.get("sentiment", ""),
                "format_instructions": parser.get_format_instructions(),
            })
            return result
        except Exception as e:
            print(f"Error analyzing company intel: {e}")
            return {
                "techStack": ["Unknown"],
                "values": ["Unknown"],
                "topics": [],
                "tips": ["Research the company website."],
                "news": []
            }
