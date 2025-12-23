from duckduckgo_search import DDGS
from app.services.llm_agent import LlmAgent

class ReconService:
    def __init__(self, llm_agent: LlmAgent):
        self.ddgs = DDGS()
        self.llm = llm_agent

    async def gather_intel(self, company: str) -> dict:
        try:
            # 1. Search for Tech Stack (Broader query)
            tech_results = self.ddgs.text(f"{company} engineering tech stack languages frameworks tools", max_results=4)
            
            # 2. Search for Values
            values_results = self.ddgs.text(f"{company} core values leadership principles", max_results=3)
            
            # 3. Search for Interview Questions/Topics
            interview_results = self.ddgs.text(f"{company} software engineer interview questions leetcode", max_results=3)
            
            # 4. Search for News
            news_results = self.ddgs.text(f"{company} engineering technology news recent", max_results=3)

            # 5. Search for Sentiment (Glassdoor/Blind)
            sentiment_results = self.ddgs.text(f"{company} reviews site:glassdoor.com OR site:teamblind.com", max_results=5)

            # Combine context
            context = {
                "tech_stack": str(tech_results),
                "values": str(values_results),
                "interview": str(interview_results),
                "news": str(news_results),
                "sentiment": str(sentiment_results)
            }

            # Analyze with LLM
            analysis = await self.llm.analyze_company_intel(company, context)
            
            # Add logo
            analysis["name"] = company
            analysis["logo"] = f"https://logo.clearbit.com/{company.lower().replace(' ', '')}.com"
            
            return analysis
        except Exception as e:
            print(f"Recon Error: {e}")
            return {
                "name": company,
                "logo": f"https://logo.clearbit.com/{company.lower().replace(' ', '')}.com",
                "techStack": ["Error fetching data"],
                "values": ["Error fetching data"],
                "topics": [],
                "tips": ["Could not retrieve live data."],
                "news": []
            }
