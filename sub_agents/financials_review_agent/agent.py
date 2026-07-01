"""Specialist agent for financials review."""

import os
import pathlib
from google.adk.agents import Agent
from .prompt import FINANCIALS_REVIEW_AGENT_INSTRUCTION

MODEL = "gemini-pro-latest"

financials_review_agent = Agent(
    model=MODEL,
    name="FinancialsReviewAgent",
    instruction=FINANCIALS_REVIEW_AGENT_INSTRUCTION,
    tools=[]
)