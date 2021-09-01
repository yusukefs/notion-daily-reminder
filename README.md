# notion-slack-reminder

Sends a reminder of contents in Notion.so to Slack.

## Setup

```sh
yarn install
```

```sh
cp .env.sample .env
```

Add the following environmental variables to `.env` file.

- `NOTION_TOKEN`: A token for the Notion API.
- `NOTION_PAGE_ID`: ID of the page to process (uuid).
- `SLACK_TOKEN`: A token for the Slack API.
- `SLACK_CHANNEL`: Channel name or ID to send the message.

## Run!

```sh
yarn start
```
