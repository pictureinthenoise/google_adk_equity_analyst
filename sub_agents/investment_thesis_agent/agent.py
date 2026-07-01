"""Specialist agent for evaluating bear and bull case analyses and generating an investment thesis."""

import pathlib
from google.adk.agents import Agent
from google.adk.skills import load_skill_from_dir
from google.adk.tools.skill_toolset import SkillToolset
from google.adk.models.lite_llm import LiteLlm
from .prompt import INVESTMENT_THESIS_AGENT_INSTRUCTION

MODEL = "claude-sonnet-4-6"

evaluation_skill = load_skill_from_dir(
    pathlib.Path(__file__).parent / "skills" / "evaluation"
)

investment_thesis_analyst = Agent(
	name="InvestmentThesisAnalyst",
	model=LiteLlm(model=MODEL),
	description="Evaluates a bear case and bull case for a specified public company and forms an investment thesis.",
	instruction=INVESTMENT_THESIS_AGENT_INSTRUCTION,
	tools=[SkillToolset(skills=[evaluation_skill])]
)