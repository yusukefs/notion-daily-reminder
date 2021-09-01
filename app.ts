import { Client } from "@notionhq/client";

// Initialize a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

;(async () => {
  const listUsersResponse = await notion.users.list()
  console.log(listUsersResponse)
})()
