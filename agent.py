import pathlib
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.skills import load_skill_from_dir
from google.adk.tools.skill_toolset import SkillToolset

import warnings
warnings.filterwarnings("ignore")

import logging
logging.basicConfig(level=logging.ERROR)

from . import prompt

from .sub_agents.research_agent.agent import research_agent
from .sub_agents.financials_review_agent.agent import financials_review_agent
from .sub_agents.bear_agent.agent import bear_analyst
from .sub_agents.bull_agent.agent import bull_analyst
from .sub_agents.investment_thesis_agent.agent import investment_thesis_analyst

MODEL = "gemini-pro-latest"

report_writer = load_skill_from_dir(
    pathlib.Path(__file__).parent / "skills" / "report-writer"
)

root_agent = Agent(
	name="EquityAnalyst",
	model=MODEL,
	description="Runs a team that creates institutional-grade, deep-dive analyses of public companies.",
	instruction=prompt.equity_analyst,
	tools=[
        AgentTool(agent=research_agent),
        AgentTool(agent=financials_review_agent),
        AgentTool(agent=bear_analyst),
        AgentTool(agent=bull_analyst),
        AgentTool(agent=investment_thesis_analyst),
        SkillToolset(skills=[report_writer])
    ]
)

print(f"'{root_agent.name}' created using model '{MODEL}' and is ready to go!")