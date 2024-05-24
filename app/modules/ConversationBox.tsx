'use client'
import React, { useEffect, useState } from 'react'
import { IHistory, Roles } from '../shared/interface'
import _ from 'lodash'

const historyMock = [
    {
        role: Roles.user,
        content: `Hello, how can I help you today?`
    },
    {
        role: Roles.assistant,
        content: `Hi there! I'm here to help. How can I assist you today?`
    }
]
const ConversationBox = ()=>{
    const [history, setHistory] = useState<IHistory>([])
    useEffect(() => {
        helperGetHistory().then(historyFromServer => {
            setHistory(historyFromServer)
        })
    }, [])

    return (
        <div>
            {_.map(history, (item, index) => {
                return <div key={index}>{item.role}: {item.content as string}</div>
            })}
        </div>
    )
}

export default ConversationBox

const helperGetHistory = async (): Promise<IHistory> => {
    // mock fetch history

    return historyMock

}