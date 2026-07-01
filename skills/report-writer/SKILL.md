---
name: report-writer
description: |
 Writes the final equity analysis report. Use this skill when all 
 analysis components are completed.
version: 1.0.0
license: MIT
metadata:
 author: pictureinthenoise
---
# Report Writer

When asked to write a report:

1. Check that the following analysis components have been completed:
   * Latest quarter performance analysis
   * Bear case analysis
   * Bull case analysis
   * Investment thesis

These sections represent the minimum set of content required to write a report. You may receive additional content which should also be included in the report, as explained in Step 2 below.

2. Write the report with the following sections:
   * Executive Summary - this section should provide a brief overview of the firm and hint at the investment thesis
   * Historical Financial Review
     - This section should be included if the content/data is provided.
     - This section should include a Markdown table for annual financial data sourced from 10-K reports. The table should include the following metrics across all available annual financial periods:
       * Revenue
       * Earnings
       * Earnings-per-share (EPS)
   * Latest Quarter Performance
   * Bear Case
   * Bull Case
   * Investment Thesis - this section should present the evaluation of the bear and bull cases and the final recommendation
   * Sources - this section should list all sources used in writing the report; if a specific URL is available for a given source, list it.

## Style

The report style should be appropriate for institutional-grade research and should be characterized by direct, no-jargon language.

## Output Format

Output the report using Markdown.