"""Specialist agent for research."""

import os
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams
from google.adk.tools import google_search
from .prompt import RESEARCH_AGENT_INSTRUCTION, SEARCH_AGENT_INSTRUCTION, ALPHAVANTAGE_AGENT_INSTRUCTION

MODEL = "gemini-pro-latest"
ALPHAVANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY")

alphavantage_data_agent = Agent(
    model=MODEL,
    name="AlphaVantageDataAgent",
    instruction=ALPHAVANTAGE_AGENT_INSTRUCTION,
    tools=[
        MCPToolset(
            connection_params=StreamableHTTPConnectionParams(
                url="https://mcp.alphavantage.co/mcp?apikey=" + ALPHAVANTAGE_API_KEY,
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
        )
    ] 
)

google_search_agent = Agent(
    model=MODEL,
    name="SearchAgent",
    instruction=SEARCH_AGENT_INSTRUCTION,
    tools=[google_search]
)

research_agent = Agent(
    model=MODEL,
    name="ResearchAgent",
    instruction=RESEARCH_AGENT_INSTRUCTION,
    tools=[
        AgentTool(agent=google_search_agent),
        AgentTool(agent=alphavantage_data_agent)
    ]
)