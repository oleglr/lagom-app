import React from 'react'
import styled from '@emotion/styled'
import { Picker } from 'emoji-mart'
import { useOutsideClick } from '../../../components/hooks/outside-click'
import { useKeyDown } from '../../../components/hooks/keydown'
import { customEmojis } from '../../../utils/emoji'
import 'emoji-mart/css/emoji-mart.css'

const PickerWrapper = styled.div`
    display: ${props => (props.is_mobile ? 'flex' : '')};
    justify-content: ${props => (props.is_mobile ? 'center' : '')};
    background-color: ${props => (props.is_mobile ? 'transparent' : '')};
`

export const EmojiPicker = ({ closePicker, onSelectEmoji, showPicker, is_mobile, has_custom = true }) => {
    const ref = React.useRef()

    useOutsideClick(ref, closePicker)
    useKeyDown(ref, closePicker, 27)

    return (
        <PickerWrapper ref={ref} is_mobile={is_mobile}>
            {showPicker && (
                <Picker
                    emojiSize={is_mobile ? 30 : 24}
                    perLine={is_mobile ? 7 : 9}
                    native
                    onSelect={onSelectEmoji}
                    darkMode={true}
                    autoFocus={!is_mobile}
                    title="Pick your emoji…"
                    emoji="point_up"
                    custom={has_custom ? customEmojis : []}
                    exclude={['foods', 'objects']}
                    include={['recent', 'custom', 'people', 'food', 'nature', 'activity', 'places', 'symbols', 'flags']}
                />
            )}
        </PickerWrapper>
    )
}
