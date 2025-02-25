import React, { InputHTMLAttributes } from 'react'

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input
            {...props  }
            required
            className="border-2 border-gray-300 px-3 py-2 rounded-md text-sm min-w-[20rem] focus:outline-none"
        />
    )
}
