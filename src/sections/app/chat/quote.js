import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@chakra-ui/core'

const QuoteStyle = styled.div`
  text-align: left;
  font-size: 14px;
  background: #f3f3f3;
  border-left: 5px solid var(--carafe);
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  width: ${props => (props.w ? props.w : '')};
`

export const Quote = ({ user, text, time, w }) => {
  return (
    <QuoteStyle w={w}>
      <Text fontWeight="bold">{user}</Text>
      <Text>{text}</Text>
      {time && (
        <Text style={{ paddingTop: '5px', fontSize: '12px', opacity: '0.8' }}>
          {time}
        </Text>
      )}
    </QuoteStyle>
  )
}
