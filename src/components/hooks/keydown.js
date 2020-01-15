import { useEffect } from 'react'

export const useKeyDown = (ref, callback, keyCode) => {
    const handleKeyDown = e => {
        if (ref.current && e.keyCode === keyCode) {
            callback()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    })
}
