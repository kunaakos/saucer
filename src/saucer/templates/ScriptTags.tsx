import React from 'react'

export type HeaderScriptTagProps = React.DetailedHTMLProps<
    React.ScriptHTMLAttributes<HTMLScriptElement>,
    HTMLScriptElement
>

type ScriptTagProps = {
    scriptTags: HeaderScriptTagProps[]
}

export const ScriptTags = ({ scriptTags }: ScriptTagProps) => (
    <>
        {scriptTags.map((scriptTagProps) => (
            <script key={JSON.stringify(scriptTagProps)} {...scriptTagProps} />
        ))}
    </>
)
