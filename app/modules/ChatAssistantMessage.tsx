'use client'
import React, { useEffect, useState } from 'react'
import { IHistory, Roles, IChatMessage, AssistantMessage} from '../shared/interface'
import _ from 'lodash'
import ReactMarkdown from 'react-markdown'
import {Prism as SyntaxHighlighter, PrismLight as SyntaxHighlighterLight} from 'react-syntax-highlighter'
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'


interface IChatAssistantMessageProps{
    chatMessage: AssistantMessage
}

const  ChatAssistantMessage = ({chatMessage}: IChatAssistantMessageProps) =>{

    const {
        content,
        provider,
        role,
    } = chatMessage || {}

    return (
        <div className="w-full">
            <div className='py-2 px-3 text-base m-auto md:px-5 lg:px-1 xl:px-5'>
                <div className='mx-auto flex flex-1 gap-3 md:gap-6 md:max-w-[50rem] w-full justify-start px-4'>
                    <div className='flex relative flex-row gap-3'>
                        <div className='provider-icon flex-shrink-0 flex flex-col relative items-end'>
                            <div  className='rounded-full border border-gray-200 border-solid w-8 h-8 flex justify-center items-center' >
                                <img src={`/images/providers/${provider || 'default'}.svg`} className='w-[1.125rem] h-[1.125rem]'/>
                            </div>
                            
                        </div>
                        <div className='flex w-full flex-col gap-1 juice:empty:hidden juice:first:pt-[3px] text-gray-600'>
                            <div className='markdown prose w-full break-words dark:prose-invert light'>
                                <ReactMarkdown
                                    components={{
                                        code(props) {
                                            const {children, className, node, ...rest} = props
                                            const match = /language-(\w+)/.exec(className || '')
                                            const codeName = match?.[1] || ''
                                            return match ? (
                                            <div  className="text-sm leading-4 my-3 overflow-hidden overflow-x-scroll break-all break-words flex gap-0 flex-col">
                                                <div className="flex items-center relative bg-gray-950 text-gray-300 text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                                    <span>{codeName}</span>
                                                    <div className="flex items-center">
                                                        <span className="" data-state="closed">
                                                            <button className="flex gap-1 items-center">
                                                                <img src="/images/icons/copy-code.svg" alt="copy code" className='w-3 h-3 text-gray-300' />
                                                                Copy code
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* @ts-ignore */}
                                                <SyntaxHighlighter
                                                    {...rest}
                                                    PreTag="pre"
                                                    language={codeName}
                                                    wrapLines={true}
                                                    wrapLongLines={true}
                                                    style={vscDarkPlus}
                                                    className={`rounded-b-md !mt-0`}
                                                >
                                                    {String(children)?.replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                            ) : (
                                                <code {...rest} className={`${className || ''} text-sm leading-5 font-bold text-black`}>
                                                    {`\``}{children}{`\``}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatAssistantMessage