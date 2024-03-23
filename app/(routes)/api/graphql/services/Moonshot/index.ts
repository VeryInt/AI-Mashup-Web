import 'dotenv/config'
import MoonshotDal from '../../dal/Moonshot'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'

const typeDefinitions = `
    scalar JSON
    type Chat {
        Moonshot(params: MoonshotArgs): ChatResult
        MoonshotStream(params: MoonshotArgs): [String]
    }

    input MoonshotArgs {
        messages: Message
        "API_KEY"
        apiKey: String
    }
`

const resolvers = {
    Chat: {
        Moonshot: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const chatArgs = parent?.chatArgs || {}
            const baseMessages = chatArgs.messages || []
            const moonshotArgs = args?.params || {}
            const { messages: appendMessages, apiKey } = moonshotArgs || {}
            const messages = _.concat([], baseMessages || [], appendMessages || []) || []
            const key = messages.at(-1)?.content
            console.log(`key`, key)
            if (!key) {
                return { text: '' }
            }
            const text: any = await (await MoonshotDal.loader(context, { messages, apiKey }, key)).load(key)
            return { text }
        },
        MoonshotStream: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const xvalue = new Repeater<String>(async (push, stop) => {
                const chatArgs = parent?.chatArgs || {}
                const baseMessages = chatArgs.messages || []
                const moonshotArgs = args?.params || {}
                const { messages: appendMessages, apiKey } = moonshotArgs || {}
                const messages = _.concat([], baseMessages || [], appendMessages || []) || []
                const key = `${messages.at(-1)?.content || ''}_stream`

                await (
                    await MoonshotDal.loader(
                        context,
                        {
                            messages,
                            apiKey,
                            isStream: true,
                            completeHandler: ({ content, status }) => {
                                stop()
                            },
                            streamHanler: ({ token, status }) => {
                                if (token && status) {
                                    push(token)
                                }
                            },
                        },
                        key
                    )
                ).load(key)
            })
            return xvalue
        },
    },
}

export default {
    typeDefinitions,
    resolvers,
}