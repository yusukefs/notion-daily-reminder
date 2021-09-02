import { Client as NotionClient } from "@notionhq/client";
import { Block as NotionBlock } from "@notionhq/client/build/src/api-types";
import { WebClient as SlackClient, KnownBlock as SlackBlock } from "@slack/web-api";

// Initialize a client
const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
})

// Post a message to a channel of Slack
async function publishMessageToSlack(blocks: SlackBlock[]) {
  const slackWeb = new SlackClient(process.env.SLACK_TOKEN);
  try {
    await slackWeb.chat.postMessage({
      channel: process.env.SLACK_CHANNEL,
      blocks: blocks,
      text: "Weekly Goals",
    });
    console.log("Message posted!");
  } catch (error) {
    console.log(error);
  }
}

function convertNotionBlockToSlackBlock(block: NotionBlock): SlackBlock {
  switch (block.type) {
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": block[block.type].text[0].plain_text,
          "emoji": true
        },
      };

    case "to_do":
      return block[block.type].checked ? {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `:white_check_mark: ~${block[block.type].text[0].plain_text}~`,
          },
        ],
      } : {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `:white_medium_square: ${block[block.type].text[0].plain_text}`,
          },
        ],
      };

    default:
      return null;
  }
}

;(async () => {
  // Get original blocks in the Notion page
  const blocks = await notion.blocks.children.list({ block_id: process.env.NOTION_PAGE_ID });

  // Construct slack message blocks
  const today = new Date();
  const slackBlocksPrefix: SlackBlock[] = [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": ":muscle: Weekly Goals :muscle:",
        "emoji": true
      },
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": `*${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}*`,
        },
      ],
    },
  ];
  const slackBlocksContents = blocks.results.map((item: NotionBlock, i: number) => convertNotionBlockToSlackBlock(item)).filter(item => item);

  publishMessageToSlack([...slackBlocksPrefix, ...slackBlocksContents]);
})()
