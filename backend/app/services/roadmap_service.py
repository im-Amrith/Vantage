import os
import json
from googleapiclient.discovery import build
from app.services.llm_agent import LlmAgent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

class RoadmapService:
    def __init__(self, llm_agent: LlmAgent):
        self.llm = llm_agent
        self.youtube_api_key = os.getenv("YOUTUBE_API_KEY")
        self.youtube = None
        if self.youtube_api_key:
            try:
                self.youtube = build('youtube', 'v3', developerKey=self.youtube_api_key)
            except Exception as e:
                print(f"Failed to initialize YouTube API: {e}")

    async def get_videos(self, query: str):
        """Searches YouTube for top tutorials on the topic"""
        videos = []
        if not self.youtube:
            # Fallback
            return [{
                "video_title": f"{query} Tutorial",
                "video_url": f"https://www.youtube.com/results?search_query={query}",
                "thumbnail": "https://img.youtube.com/vi/placeholder/mqdefault.jpg"
            }]
            
        try:
            request = self.youtube.search().list(
                part="snippet",
                maxResults=2,
                q=f"{query} tutorial",
                type="video",
                relevanceLanguage="en"
            )
            response = request.execute()
            for item in response.get('items', []):
                videos.append({
                    "video_title": item['snippet']['title'],
                    "video_url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "thumbnail": item['snippet']['thumbnails']['medium']['url']
                })
        except Exception as e:
            print(f"YouTube Error: {e}")
            # Fallback on error
            if not videos:
                videos.append({
                    "video_title": f"{query} Tutorial",
                    "video_url": f"https://www.youtube.com/results?search_query={query}",
                    "thumbnail": "https://img.youtube.com/vi/placeholder/mqdefault.jpg"
                })
        return videos

    async def get_articles(self, query: str):
        """Uses a custom search or simple scraping to find articles"""
        # Simulation as per requirements
        slug = query.lower().replace(" ", "-")
        return [
            {
                "article_title": f"Complete Guide to {query} - GeeksforGeeks",
                "article_url": f"https://www.geeksforgeeks.org/{slug}/"
            },
            {
                "article_title": f"Learn {query} in 2024 - FreeCodeCamp",
                "article_url": f"https://www.freecodecamp.org/news/tag/{slug}/"
            }
        ]

    async def generate_career_path(self, role: str):
        # 1. ASK GROQ FOR THE STRUCTURE
        parser = JsonOutputParser()
        prompt = ChatPromptTemplate.from_template(
            """
            You are a Career Architect. Generate a comprehensive step-by-step learning roadmap for the given role: {role}.
            Cover Beginner, Intermediate, and Advanced levels.
            
            Return ONLY JSON format with the following structure:
            {{
              "steps": [
                {{"id": "1", "topic": "Topic Name", "description": "Detailed explanation of this concept, why it is crucial for the role, and key sub-topics to master.", "search_query": "Topic Name keywords"}}
              ]
            }}
            Limit to 10-12 major milestones.
            
            {format_instructions}
            """
        )
        
        chain = prompt | self.llm.llm | parser
        
        try:
            roadmap_data = await chain.ainvoke({
                "role": role,
                "format_instructions": parser.get_format_instructions()
            })
            
            # 2. ENRICH WITH CONTENT
            for step in roadmap_data.get('steps', []):
                step['resources'] = {}
                
                # Fetch Videos
                step['resources']['videos'] = await self.get_videos(step['search_query'])
                    
                # Fetch Articles
                step['resources']['articles'] = await self.get_articles(step['search_query'])

            return roadmap_data
            
        except Exception as e:
            print(f"Error generating roadmap: {e}")
            return {"steps": []}
