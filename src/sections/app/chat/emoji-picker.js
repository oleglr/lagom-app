import React from 'react'
import { Picker } from 'emoji-mart'
import { useOutsideClick } from '../../../components/hooks/outside-click'
import { useKeyDown } from '../../../components/hooks/keydown'

import 'emoji-mart/css/emoji-mart.css'

export const EmojiPicker = ({ closePicker, onSelectEmoji, showPicker }) => {
    const ref = React.useRef()

    useOutsideClick(ref, closePicker)
    useKeyDown(ref, closePicker, 27)

    return (
        <div ref={ref}>
            {showPicker && (
                <Picker
                    native
                    onSelect={onSelectEmoji}
                    darkMode={true}
                    autoFocus
                    title="Pick your emoji…"
                    emoji="point_up"
                    exclude={['foods', 'objects']}
                    include={['recent', 'custom', 'people', 'food', 'nature', 'activity', 'places', 'symbols', 'flags']}
                />
            )}
        </div>
    )
}
