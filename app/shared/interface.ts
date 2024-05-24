// type chatItem
interface SystemMessage {
    role: Roles.system,
    content: string,
    name?: string
}

interface UserMessage {
    role: Roles.user,
    content: string | { type: 'text'; text: string }[] | { type: 'image_url'; image_url: { url: string, detail?: string } }[],
    name?: string
}

interface AssistantMessage {
    role: Roles.assistant,
    content?: string | null,
    name?: string
    tool_calls?: {
        id: string,
        name: string,
        function: {
            name: string,
            arguments: string,
        }
    }[]
}

export type IChatItem = SystemMessage | UserMessage | AssistantMessage

// type Roles
export enum Roles {
    user = 'user',
    assistant = 'assistant',
    system = 'system',
}

// type history
export type IHistory = IChatItem[]