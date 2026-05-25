import React, { useState } from 'react'

const CustomDropDown = ({ value, options, onChange }) => {
    const [showOptions, setShowOptions] = useState(false)
    return (
        <div className='relative ' >
            <button className='focus:border-2  focus:border-indigo-100 hover:border-2 md:min-w-36 lg:min-w-48 min:w-24 text-sm whitespace-nowrap px-4 py-1 bg-white hover:border-indigo-100 rounded-xl'
                onClick={() => setShowOptions(!showOptions)}>
                {value || "select"}
            </button>
            {showOptions && (
                <div className='absolute md:min-w-36  lg:min-w-36 min:w-24 z-50 hover:border-2 hover:border-indigo-100 shadow-sm bg-white lg:p-4 whitespace-nowrap lg:ml-4 mt-2 rounded-2xl '>
                    {options.map((item, i) => {
                        return <div className='lg:mt-1 lg:px-4  shadow-sm shadow-indigo-200 px-2 text-sm  py-1 hover:bg-indigo-50 rounded hover:border-2 hover:border-indigo-100' key={i} onClick={() => {
                            setShowOptions(false)
                            onChange(item)
                            console.log(item)
                        }}>
                            {item}
                        </div>
                    })}
                </div>
            )}
        </div>
    )
}

export default CustomDropDown;