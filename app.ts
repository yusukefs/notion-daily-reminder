import { Client as NotionClient } from "@notionhq/client";
import { WebClient as SlackClient } from "@slack/web-api";

// Initialize a client
const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
})

// Post a message to a channel of Slack
async function publishMessageToSlack(text: string) {
  const slackWeb = new SlackClient(process.env.SLACK_TOKEN);
  try {
    await slackWeb.chat.postMessage({
      channel: process.env.SLACK_CHANNEL,
      text: text,
    });
    console.log("Message posted!");
  } catch (error) {
    console.log(error);
  }
}

;(async () => {
  const blocks = await notion.blocks.children.list({ block_id: process.env.NOTION_PAGE_ID });
  for (const block of blocks.results) {
    console.log(block[block.type])
  }

  // publishMessageToSlack("Test Message");
})()
