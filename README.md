# Google ADK Equity Analyst 📈

*Good* equity analysis is a complex orchestration of skills. Analysts must demonstrate financial and technical expertise, research and analytical rigor, and excellent communication and judgment. 

This project implements the **Google Agent Development Kit (ADK)** to create an autonomous **Equity Analyst** AI team that delivers comprehensive equity research reports with institutional rigor. Enter a ticker (e.g. `IBM`) or a company name (e.g. `Apple`), and the tool handles the rest — acting as a professional research team at your fingertips.

## 🌟 Features

* **Automated Data Gathering:** Searches and collects SEC filings, investor documents, news, and historical financial data.
* **Intelligent Synthesis:** Reads, interprets, and summarizes complex financial sources.
* **Competing Analyses:** Formulates distinct bear and bull arguments based on raw and interpreted information.
* **Objective Thesis Generation:** Develops a final investment thesis against competing arguments using specialized evaluation rubrics.
* **Conversational Interface:** An intuitive web client allows you to ask follow-up questions *after* the report is generated, clarifying key points or requesting deeper exploration in natural language.

## 🚀 Quick Start

### Web Prototype

You can try the live **Equity Analyst** here: [https://equityanalyst.pictureinthenoise.com](https://equityanalyst.pictureinthenoise.com)

##### Figure 1 - Google ADK Equity Analyst agent running on the web

![Google ADK Equity Analyst agent running on the web](https://storage.googleapis.com/adk-equity-analyst/google_adk_equity_analyst_web_screenshot_1.png)

1. **Tip:** The system produces higher-quality, tailored reports when you tell the agents exactly what to focus on. 
* ❌ *Instead of:* `I want you to generate a report for IBM Corporation (IBM)`
* ✅ *Try:* `I want you to generate a report for IBM Corporation (IBM). I want you to pay particular attention to (1) the company's growth-by-acquisition strategy, (2) declining relevance of the IBM Consulting segment with increasing AI adoption, and (3) management's claim of delivery of a large-scale, fault-tolerant quantum computer by 2029.`
2. **Tip:** The **Equity Analyst** uses the AlphaVantage MCP server to retrieve historical financial information. The AlphaVantage server will sometimes return limited or no data due to rate limits. If this happens, please try your request again after a few minutes.

### Local Deployment

1. Create a directory for your ADK projects, e.g. `mkdir ~/adk_projects`, and `cd` into the new folder.
2. *Recommended:* Create a Python virtual environment in the ADK projects directory, e.g. `python3 -m venv env`, and activate it, `source env/bin/activate`.
3. Clone the project repository: `git clone https://github.com/pictureinthenoise/google_adk_equity_analyst.git`.
   * *You can ignore the `web_client` directory.*
4. Install dependencies: `pip install google-adk[extensions] mcp` or `pip install -r google_adk_equity_analyst/requirements.txt`.
5. Create a `.env` file in the *cloned repo directory* with your API keys:

```bash
nano google_adk_equity_analyst/.env
```

Add the following variables:

```env
GEMINI_API_KEY=[YOUR_GEMINI_API_KEY]
ANTHROPIC_API_KEY=[YOUR_ANTHROPIC_API_KEY]
ALPHAVANTAGE_API_KEY=[YOUR_ALPHAVANTAGE_API_KEY]
```

6. Run the agent from the **ADK projects directory** created in **Step 1**, e.g. `~/adk_projects/adk run google_adk_equity_analyst`.

##### Figure 2 - Google ADK Equity Analyst agent running in the terminal

![Equity Analyst agent running in the terminal](https://storage.googleapis.com/adk-equity-analyst/google_adk_equity_analyst_terminal_screenshot_1.png)

**Tip**: The project is configured to use Google Gemini Pro and Anthropic Claude Sonnet. These models require billing setup with Google and Anthropic respectively. If you don't have billing accounts with Google and/or Anthropic, you can modify the root agent and **each** sub-agent `agent.py` file to use a free model, e.g. `gemini-flash-latest`. If changing the `investment_thesis_agent` sub-agent to a Gemini-family model, remember to **remove** the `LiteLlm` wrapper.

### Web Deployment

The web prototype mentioned above is deployed as follows:

* The [Google ADK API Server](https://adk.dev/runtime/api-server/) is used as a REST-based inferface to the agent system.
* Nginx is configured on the server to reverse proxy client requests to the API Server.
* The web client is configured to send requests to the Nginx `server_name`. The web client is standard HTML, CSS, and JavaScript and located in the `web_client` folder of the repo. When deploying the web client, remember to modify `app.js` with your server URL and agent name (i.e. if you change the agent folder name to something else).

```javascript
const API_BASE_URL = '[YOUR_SERVER_URL]';
const APP_NAME = '[YOUR_APP_NAME]';
```

> **NOTE:** *Patience is virtue!* The agent can take 5 or more minutes to generate a report.

## 🧠 Architecture & Business Workflow

The system models a research team using multiple specialized ADK agents. 

1. **Research Agent:** Validates the company and retrieves SEC filings, investor documents, news, and historical financial data.
2. **Financials Review Agent:** Performs a preliminary review of all collected data, creating a baseline sub-report of past and current financial performance.
3. **Bear & Bull Case Analysts:** Accept the baseline report and raw data. Each analyst applies sector-specific knowledge (via ADK skills) to construct the strongest possible bear and bull cases.
4. **Investment Thesis Analyst:** Evaluates the bear and bull cases using a defined rubric to determine the strongest arguments and formulate a final thesis.
5. **Lead Analyst:** Reviews all generated analyses, synthesizes the findings, and writes the final comprehensive report.

```text
                                        +-----------------+
                                        |    USER QUERY   |<-----
                                        +-----------------+     |
                                                 |              |
                                                 v              |
                                        +-----------------+     |
                                        |  RESEARCH AGENT |-----|
                                        +-----------------+
                                                 |
                                                 v
                                        +-----------------+
                                        |   REVIEW AGENT  |
                                        +-----------------+
                                                 |
                                                 v                                               
                ---------------------------------------------------------------------
                |                                                                   |
        +-----------------+                                                 +-----------------+
        |    BEAR CASE    |                                                 |    BULL CASE    |
        |     ANALYST     |                                                 |     ANALYST     |
        +-----------------+                                                 +-----------------+
                |                                                                   |
                ---------------------------------------------------------------------
                                                 |
                                                 v
                                        +-----------------+
                                        |    INVESTMENT   |
                                        |  THESIS ANALYST |
                                        +-----------------+
                                                 |
                                                 v
                                        +-----------------+
                                        |   LEAD ANALYST  |
                                        |    REVIEW AND   |<----|
                                        |  REPORT WRITING |     |
                                        +-----------------+     |
                                                 |              |
                                                 v              |
                                        +-----------------+     |
                                        |  USER RESPONSE/ |-----|
                                        |    FOLLOW-UP    |
                                        +-----------------+
```

## 🛠️ Technical Implementation

The implementation uses the following strategies to "codify" the rigor required for comprehensive financial analysis:

1. **Multi-Agent Modularity:** The root agent communicates with sub-agents stored in their own directories. Skills and tools are stored locally with each agent, facilitating easy maintenance and targeted prompt engineering.
2. **MCP Server Integration:** The [AlphaVantage MCP Server](https://mcp.alphavantage.co/) is used to retrieve historical financial data. It is wrapped as an `Agent` and exposed as an `AgentTool` to the **Research Agent**.
3. **Domain Knowledge via Skills:** Skills are used to provide crucial domain knowledge to agents.
4. **Multi-LLM Strategy to Reduce Bias:** To mitigate LLM bias, the **Investment Thesis Analyst** uses **Anthropic Claude Sonnet**, while all other agents use **Google Gemini Pro**. Separating the generation of arguments (Gemini) from the final evaluation (Claude) helps ensure objective decision-making.

## 🔮 Future Work

This prototype serves as a foundation that can easily be extended:

* **Workflow Customization:** The business workflow can be modified to map exactly to the proprietary workflows of specific hedge funds or investment firms.
* **Deeper Domain Skills:** Skills can be expanded to codify deeper domain knowledge, e.g. industry-specific or sub-industry-specific knowledge.
* **Additional MCP Integrations:** Additional data provider integrations will provide the system with a richer data set for analysis.