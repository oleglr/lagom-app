import React from 'react'
import ReactLottie from 'react-lottie'

export const Lottie = ({
  animationData,
  autoplay = true,
  loop = true,
  onAnimationComplete,
  ...props
}) => {
  const default_options = {
    loop,
    autoplay,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const eventListeners = []
  if (onAnimationComplete) {
    eventListeners.push({
      eventName: 'complete',
      callback: onAnimationComplete,
    })
  }

  return (
    <ReactLottie
      options={default_options}
      eventListeners={eventListeners}
      isClickToPauseDisabled
      {...props}
    />
  )
}
