import React from 'react'

function Spinner() {
    return (
        <div className="flex-col gap-2 w-full flex items-center justify-center">
            <div
                className="w-8 h-8 border-2 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
            >
                <div
                    className="w-6 h-6 border-2 border-transparent text-blue-800 text-2xl animate-spin flex items-center justify-center border-t-blue-800 rounded-full"
                ></div>
            </div>
        </div>
    )
}

export default Spinner