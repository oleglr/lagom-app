import { useState, useEffect } from 'react'
import { useAuth0 } from '../../react-auth0-spa'

function useFetch(url) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const { getTokenSilently } = useAuth0()

    useEffect(() => {
        async function fetchUrl() {
            const token = await getTokenSilently()
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const json = await response.json()
            console.log('json: ', json)
            setData(json)
            setLoading(false)
        }

        fetchUrl()
    }, [url, getTokenSilently])

    return [data, loading]
}

export { useFetch }
