import { useEffect } from 'react'

export const useKeyDown = (ref, callback, keyCode, is_mobile) => {
    const handleKeyDown = e => {
        if (ref.current && e.keyCode === keyCode && !e.shiftKey && !is_mobile) {
            e.preventDefault()
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
