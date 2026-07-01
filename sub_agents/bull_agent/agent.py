"""Specialist agent for generating bull-case analyses of public companies."""

import pathlib
from google.adk.agents import Agent
from google.adk.skills import load_skill_from_dir
from google.adk.tools.skill_toolset import SkillToolset
from .prompt import BULL_AGENT_INSTRUCTION

MODEL = "gemini-pro-latest"

bull_analysis_skill = load_skill_from_dir(
    pathlib.Path(__file__).parent / "skills" / "bull-analysis"
)

bull_analyst = Agent(
	name="BullAnalyst",
	model=MODEL,
	description="Creates a bull case for a specified public company.",
	instruction=BULL_AGENT_INSTRUCTION,
	tools=[SkillToolset(skills=[bull_analysis_skill])]
)