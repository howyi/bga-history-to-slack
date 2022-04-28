import {Handler} from 'aws-lambda';
import {check as sevenwonders} from './games/sevenwonders';
import {IncomingWebhook} from "@slack/webhook";
import {IncomingWebhookSendArguments} from "@slack/webhook/dist/IncomingWebhook";

const NOTIFY_MINUTES = process.env.NOTIFY_MINUTES
const GAME_NAME = process.env.GAME_NAME
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const TABLE_ID = process.env.TABLE_ID

export const check: Handler = async (event, context, callback) => {

    if (!NOTIFY_MINUTES || !GAME_NAME || !SLACK_WEBHOOK_URL || !TABLE_ID) {
        console.log("SKIP")
        return
    }

    let res: IncomingWebhookSendArguments | undefined
    switch (GAME_NAME) {
        case "7wonders":
            res = await sevenwonders(Number(NOTIFY_MINUTES), Number(TABLE_ID))
            break
        default:
            break
    }
    if (!res) {
        return
    }
    const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);
    await webhook.send({
        username: "parrot",
        icon_emoji: ":parrot:",
        ...res
    });
}