// import 'dotenv/config'
import GeminiProDal from '../../dal/GeminiPro'
import _ from 'lodash'
import { Repeater } from 'graphql-yoga'

const typeDefinitions = `
    scalar JSON
    type Chat {
        GeminiPro(params: GeminiProArgs): ChatResult
        GeminiProStream(params: GeminiProArgs): [String]
    }

    input GeminiProArgs {
        messages: Message
        "API_KEY"
        apiKey: String
        "Model Name"
        model: String
        "API Version"
        apiVersion: String
        "Max Tokens"
        maxTokens: Int
    }
`

const resolvers = {
    Chat: {
        GeminiPro: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const chatArgs = parent?.chatArgs || {}
            const baseMessages = chatArgs.messages || []
            const geminiProArgs = args?.params || {}
            const { messages: appendMessages, apiKey, model, apiVersion, maxTokens } = geminiProArgs || {}
            const maxTokensUse = maxTokens || chatArgs?.maxTokens
            const messages = _.concat([], baseMessages || [], appendMessages || []) || []
            const key = messages.at(-1)?.content
            console.log(`key`, key)
            if (!key) {
                return { text: '' }
            }
            const text: any = await (
                await GeminiProDal.loader(
                    context,
                    { messages, apiKey, model, apiVersion, maxOutputTokens: maxTokensUse },
                    key
                )
            ).load(key)
            return { text }
        },
        GeminiProStream: async (parent: TParent, args: Record<string, any>, context: TBaseContext) => {
            const xvalue = new Repeater<String>(async (push, stop) => {
                const chatArgs = parent?.chatArgs || {}
                const baseMessages = chatArgs.messages || []
                const geminiProArgs = args?.params || {}
                const { messages: appendMessages, apiKey, model, apiVersion } = geminiProArgs || {}
                const messages = _.concat([], baseMessages || [], appendMessages || []) || []
                const key = `${messages.at(-1)?.content || ''}_stream`

                await (
                    await GeminiProDal.loader(
                        context,
                        {
                            messages,
                            apiKey,
                            model,
                            apiVersion,
                            isStream: true,
                            completeHandler: ({ content, status }) => {
                                stop()
                            },
                            streamHandler: ({ token, status }) => {
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
