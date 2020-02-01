import React from 'react'
import styled from '@emotion/styled'
import { Heading, Stack, Text, Box, Button, Select } from '@chakra-ui/core'
import { useHistory } from 'react-router-dom'
import { useAuth0 } from '../../../react-auth0-spa'
import { useGlobal } from '../../../context/global-context'
import { getSocket as socket } from '../../../api/socket'

const PageLayout = styled(Box)`
    height: 100%;
    margin-top: ${props => (props.is_mobile ? '' : '100px')};
    margin-right: ${props => (props.is_mobile ? '' : '100px')};
    margin-left: ${props => (props.is_mobile ? '' : '100px')};
    margin: ${props => (props.is_mobile ? '20px' : '')};
`

const Groups = () => {
    const [all_groups, setAllGroups] = React.useState([])

    const { active_group } = useGlobal()
    const history = useHistory()
    const { user } = useAuth0()

    React.useEffect(() => {
        const addGroups = groups => {
            setAllGroups(groups.all_groups)
        }
        socket().on('get_all_groups', addGroups)
        socket().emit(
            'get_all_groups',
            {
                user_id: user.sub,
            },
            e => {
                console.log(e)
            }
        )
        return () => {
            socket().off('get_all_groups', addGroups)
        }
    }, [user.sub])

    // get all groups display in dropdowns
    const changeGroup = e => {
        localStorage.setItem('active_group', e.target.value)
        localStorage.setItem('user_id', user.sub)
        window.location.reload()
    }

    return (
        <PageLayout is_mobile={false}>
            <Stack isInline>
                <Heading marginLeft="0" marginBottom="8px" size="xl" style={{ marginRight: 'auto' }}>
                    <span role="img" aria-label="balloon" style={{ paddingRight: '15px' }}>
                        🎈
                    </span>
                    Groups:
                </Heading>
            </Stack>
            <Button m={4} onClick={() => history.push('/new-group')}>
                Create a new group:
            </Button>
            <Text>Change group:</Text>
            {!!all_groups.length && (
                <Select placeholder="Select option" onChange={changeGroup} defaultValue={active_group.id}>
                    {all_groups.map(group => {
                        return (
                            <option key={group._id} value={group._id}>
                                {group.name}
                            </option>
                        )
                    })}
                </Select>
            )}
        </PageLayout>
    )
}

export default Groups
