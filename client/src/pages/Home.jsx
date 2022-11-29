import React from 'react'
import { useEffect } from 'react'

function Home() {
    useEffect(() => {
        document.title = 'Home ● Twitter'
    }, [])

    return (
        <div>
            Home
        </div>
    )
}

export default Home