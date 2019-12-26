import React from 'react'
import { Picker } from 'emoji-mart'
import { useOutsideClick } from '../../../components/hooks/outside-click'

import 'emoji-mart/css/emoji-mart.css'

export const EmojiPicker = ({ closePicker }) => {
  const ref = React.useRef()

  useOutsideClick(ref, () => {
    closePicker()
  })

  return (
    <div ref={ref}>
      <Picker
        darkMode={false}
        title="Pick your emoji…"
        emoji="point_up"
        exclude={['foods', 'objects']}
      />
    </div>
  )
}
