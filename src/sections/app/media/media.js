import React from 'react'
import { Heading, Stack, Box, List, ListIcon, ListItem } from '@chakra-ui/core'
import { useGlobal } from '../../../context/global-context'
import { CreateGroup } from '../../../components/general/create-group'
import { useFetch } from '../../../components/hooks/fetch-data'
import { MediaList } from './media-list'

function Feature({ title, desc, ...rest }) {
    return (
        <Box p={5} shadow="md" borderWidth="1px" {...rest}>
            <Heading fontSize="lg" marginBottom={3}>
                {title}
            </Heading>
            <List spacing={3}>
                <ListItem>
                    <ListIcon icon="check-circle" color="green.500" />
                    Free storage up to 1gb
                </ListItem>
                <ListItem>
                    <ListIcon icon="check-circle" color="green.500" />
                    All your images and video stored, forever.
                </ListItem>
                <ListItem>
                    <ListIcon icon="check-circle" color="green.500" />
                    Organize your groups images into albums
                </ListItem>
            </List>
        </Box>
    )
}

const MediaListContainer = () => {
    const { active_group } = useGlobal()
    const [data, loading] = useFetch(`http://localhost:3000/media?groupId=${active_group.id}`)

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }

    if (loading) return <div>loading...</div>

    return (
        <div style={{ height: '100%' }}>
            <Heading marginLeft="2rem" marginTop="2rem" size="xl" marginBottom="16px">
                Media:
            </Heading>
            <div style={{ height: '100%' }}>
                {!!data.images.length && <MediaList items={data.images} />}
                {!!!data.images.length && (
                    <Stack marginLeft="2rem" spacing={8} maxW="400px" marginRight="2rem">
                        <Feature title="Don't lose any memories" />
                    </Stack>
                )}
            </div>
        </div>
    )
}

const Media = () => {
    const { active_group } = useGlobal()

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }

    return <MediaListContainer />
}

export default Media
