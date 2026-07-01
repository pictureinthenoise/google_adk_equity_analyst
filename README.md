# Google ADK Equity Analyst 📈

*Good* equity analysis is a complex orchestration of skills. Analysts must demonstrate financial and technical expertise, research and analytical rigor, and excellent communication and judgment. 

This project implements the **Google Agent Development Kit (ADK)** to create an autonomous **Equity Analyst** AI team that delivers comprehensive equity research reports with institutional rigor. Enter a ticker (e.g., `IBM`) or a company name (e.g., `Apple`), and the tool handles the rest — acting as a professional research team at your fingertips.

## 🚀 Quick Start

### Web Prototype

You can try the live **Equity Analyst** here: [https://equityanalyst.pictureinthenoise.com](https://equityanalyst.pictureinthenoise.com)

1. **Pro-Tip:** The system produces higher-quality, tailored reports when you tell the agents exactly what to focus on. 
* ❌ *Instead of:* `I want you to generate a report for IBM Corporation (IBM)`
* ✅ *Try:* `I want you to generate a report for IBM Corporation (IBM). I want you to pay particular attention to (1) the company's growth-by-acquisition strategy, (2) declining relevance of the IBM Consulting segment with increasing AI adoption, and (3) management's claim of delivery of a large-scale, fault-tolerant quantum computer by 2029.`

2. **Pro-Tip** **Be patient!** The agent can take 5 or more minutes to generate the requested report.

### Simple Local Deployment

1. Create a directory for your **ADK projects**, e.g. `mkdir ~/adk_projects`, and `cd` into the new folder.
2. Recommended: Create a Python virtual environment in the ADK projects directory, e.g. `python -m venv env`, and activate it, `source env/bin/activate`.
3. Clone the project repository: `git clone https://github.com/pictureinthenoise/google-adk-equity-analyst.git`.
4. Install dependencies: `pip install google-adk[extensions] mcp`.
5. Create a `.env` file in the **project directory** with your API keys.

```bash
nano google-adk-equity-analyst/.env
```

Add the following variables:

```env
GEMINI_API_KEY=[YOUR_GEMINI_API_KEY]
ANTHROPIC_API_KEY=[YOUR_ANTHROPIC_API_KEY]
ALPHAVANTAGE_API_KEY=[YOUR_ALPHAVANTAGE_API_KEY]
```

6. Run the agent from the **ADK projects** directory created in **Step 1**: `adk run google-adk-equity-analyst`.