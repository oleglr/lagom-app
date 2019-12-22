import React from 'react'
import { UserContext } from '../../context/user-context'
import styled from '@emotion/styled'

const MainSection = styled.section`
  text-align: center;
`

export const AppContent = () => {
  const { name } = React.useContext(UserContext)

  return <MainSection>Hello {name} welcome to lagom</MainSection>
}
