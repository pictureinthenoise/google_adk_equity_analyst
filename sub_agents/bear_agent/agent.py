"""Specialist agent for generating bear-case analyses of public companies."""

import pathlib
from google.adk.agents import Agent
from google.adk.skills import load_skill_from_dir
from google.adk.tools.skill_toolset import SkillToolset
from .prompt import BEAR_AGENT_INSTRUCTION

MODEL = "gemini-pro-latest"

bear_analysis_skill = load_skill_from_dir(
    pathlib.Path(__file__).parent / "skills" / "bear-analysis"
)

bear_analyst = Agent(
	name="BearAnalyst",
	model=MODEL,
	description="Creates a bear case for a specified public company.",
	instruction=BEAR_AGENT_INSTRUCTION,
	tools=[SkillToolset(skills=[bear_analysis_skill])]
)