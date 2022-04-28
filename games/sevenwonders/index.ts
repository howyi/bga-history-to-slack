import {LANG_MAP} from './lang';
import axios from "axios";
import {MessageAttachment} from "@slack/types";
import {IncomingWebhookSendArguments} from "@slack/webhook/dist/IncomingWebhook";

const HISTORY_URL = "https://ja.boardgamearena.com/9/sevenwonders/sevenwonders/notificationHistory.html"

type LogResponse = {
    packet_id: string
    packet_type: string
    time: string
    data: RootLog[]
}

type RootLog = {
    uid: string
    type: string
} & Log

type Log = {
    log: string
    args: {
        [key in string]: string | Log
    } & {
        "i18n": string[]
    }
}

type HistoryResponse = {
    status: number;
    data: {
        valid: number;
        data: LogResponse[]
    }
}

export const check = async (notifyMinutes: number, tableId: number): Promise<IncomingWebhookSendArguments | undefined> => {
    const NotifyLogs: LogResponse[] = []
    let from = 0
    while (true) {
        console.log("from", from)
        const res = await axios.get<HistoryResponse>(
            HISTORY_URL,
            {
                params: {
                    table: tableId,
                    from,
                    privateinc: 1,
                    history: 1
                }
            }
        )
        const data = res?.data?.data?.data
        if (!data) {
            console.error(res.data)
            break
        }
        const date = new Date();
        const now = Math.floor( date.getTime()/ 1000)
        const checkAfterTime = now - (notifyMinutes * 60)
        let lastPacketId = from
        for (const resKey in data) {
            const d = data[resKey]
            if (!d) {
                continue
            }
            lastPacketId = Math.max(lastPacketId, Number(d.packet_id))
            if (d.packet_type != 'history') {
                continue
            }
            if (checkAfterTime >= Number(d.time)) {
                continue
            }
            NotifyLogs.push(d)
        }

        if (lastPacketId === from) {
            break
        }
        console.log("lastPacketId", lastPacketId)
        from = lastPacketId + 1
    }

    const attachments: MessageAttachment[] = []

    NotifyLogs.forEach((logResponse) => {
        logResponse.data.forEach((log) => {
            const text = buildText(log)
            attachments.push({
                color: getColor(log.type),
                text,
            })
        })
    })

    if (attachments.length == 0) {
        return
    }

    const link = "https://boardgamearena.com/9/sevenwonders?table=" + tableId
    attachments.unshift({
        author_name: `7wonders (Table: ${tableId})`,
        author_link: link,
    })

    attachments.push({
        text: link,
    })

    return {
        attachments: attachments,
    }
}

const getColor = (type: string): string => {
    switch (type) {
        case "coinDelta":
            return "#ffdf57"
        case "warVictory":
            return "#ff1b1b"
        case "newAge":
            return "#d3abff"
        default:
            return '#d7d7d7'
    }
}

const buildText = (log: Log): string => {
    if (log.log == "") {
        return ""
    }
    let rawText = log.log
    if (LANG_MAP[rawText]) {
        rawText = LANG_MAP[rawText]
    }
    if (!log.args) {
        return rawText
    }
    Object.keys(log.args).forEach((before) => {
        let after = log.args[before]
        if (typeof after == "object") {
            after = buildText(after)
        }
        if (log.args.i18n && log.args.i18n.includes(before)) {
            if (LANG_MAP[after]) {
                after = LANG_MAP[after]
            }
        }
        const search = "\\\$\{"+before+"\}"
        rawText = rawText.replace(new RegExp(search,'g'), after)
    })
    return rawText
}