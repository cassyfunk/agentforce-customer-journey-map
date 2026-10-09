# Starting Prompt for Claude

Use this prompt when starting a new Claude session on this project:

---

I'm building an interactive customer journey map for the Agentforce product. 
The project lives at `~/projects/customer-journey-map` and uses React + Vite + Tailwind CSS + D3.

The journey has four stages:
1. **SKU Provisioned / Purchase** — customer has bought the product
2. **Agent Created** — customer has set up their first agent  
3. **Agent Being Used** — active deployment and conversations
4. **Scaled Agent Usage Achieved** — expanded to more use cases/teams

The map uses swim lanes: Customer Actions, Thoughts, Feelings, Touchpoints, Pain Points, Opportunities.
Each card is clickable and shows a detail panel. A D3 emotion curve runs across the top showing 
sentiment at each stage.

All content data lives in `src/data/journeyData.js` — that's the main file to edit when adding 
customer insights. The `knowledge/` directory contains synthesized notes, best practices, and 
design decisions.

My next task is: [DESCRIBE WHAT YOU WANT TO DO]

---

## Good follow-up prompts

**To add your customer data:**
> I have [CSV / pain point list / interview notes] to add to the journey map. Here is the data: [paste]. 
> Please add it to the correct stages and lanes in journeyData.js. For pain points, assess severity 
> (high/medium/low) based on frequency and impact.

**To add filtering / personas:**
> Add a persona filter to the journey map. I have three customer segments: [list them]. 
> Update the data model so touchpoints can be tagged to one or more personas, and add 
> a filter bar that shows/hides rows by persona.

**To add an export:**
> Add a "Export as PNG" button that captures the full journey map grid using html2canvas.

**To update the emotion curve:**
> Review the pain points in the data and suggest updated sentiment scores for each stage. 
> The current scores are: SKU Provisioned: 0.5, Agent Created: 0.0, Being Used: 1.0, Scaled: 1.8.
