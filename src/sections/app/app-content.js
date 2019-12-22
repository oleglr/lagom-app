import React from 'react'
import { UserContext } from '../../context/user-context'

export const AppContent = () => {
  const { name } = React.useContext(UserContext)

  return <div>Hello {name} welcome to lagom</div>
}
