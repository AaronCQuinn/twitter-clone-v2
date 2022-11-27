import React from 'react'
import { useEffect } from 'react'

function Home() {
    useEffect(() => {
        document.title = 'Homepage'
    }, [])

    return (
        <div>
            Home
        </div>
    )
}

export default Home