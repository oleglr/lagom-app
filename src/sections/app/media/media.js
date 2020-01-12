import React from 'react'
import styled from '@emotion/styled'
import { CellMeasurerCache } from 'react-virtualized'
import { Heading, Image, Box, Stack } from '@chakra-ui/core'
import moment from 'moment'
import { Flex } from '../../../components/container'
import { useGlobal } from '../../../context/global-context'
import { CreateGroup } from '../../../components/general/create-group'
import { useFetch } from '../../../components/hooks/fetch-data'
import { ImagePreview } from '../../../components/general/image'
import { MediaList } from './media-list'

const getUser = (message, members) => {
    const user = members.find(u => u.user_id === message.user)
    if (user) return { name: user.nickname, img: user.picture }
}

const ImageCard = styled(Box)`
    &:hover {
        cursor: pointer;
        .media-img {
            filter: brightness(0.5);
        }
    }
`

const Media = () => {
    const { group_members, active_group } = useGlobal()
    const [data, loading] = useFetch(`http://localhost:3000/media?groupId=${active_group.id}`)

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }

    if (loading) return <div>loading...</div>

    return (
        <div style={{ margin: '2rem 0 0 2rem', height: '100%' }}>
            <Heading size="xl" marginBottom="16px">
                Media:
            </Heading>
            <div style={{ height: '100%' }}>
                <MediaList items={[...data.images, ...data.images, ...data.images, ...data.images, ...data.images, ...data.images, ...data.images, ...data.images]} />
            </div>
            {/* <Flex wrap="wrap" justify="flex-start">
                {data &&
                    data.images &&
                    data.images.map(message => {
                        const user = getUser(message, group_members)

                        return (
                            <ImageCard
                                key={message._id}
                                maxW="200px"
                                minW="200px"
                                borderWidth="1px"
                                rounded="lg"
                                overflow="hidden"
                                margin="12px"
                                height="fit-content"
                            >
                                <ImagePreview img_source={message.image_url}>
                                    <Image
                                        className="media-img"
                                        size="200px"
                                        bjectFit="cover"
                                        alt={message.action}
                                        src={message.image_url}
                                    />
                                    <Box p="6">
                                        <Stack isInline>
                                            <img
                                                src={user.img}
                                                alt="Profile"
                                                style={{
                                                    borderRadius: '5px',
                                                    maxHeight: '25px',
                                                    maxWidth: '25px',
                                                    marginTop: '4px',
                                                    backgroundColor: 'coral',
                                                }}
                                            />
                                            <Box
                                                mt="1"
                                                marginLeft="5px"
                                                fontWeight="semibold"
                                                as="h4"
                                                lineHeight="tight"
                                                isTruncated
                                            >
                                                {user.name}
                                            </Box>
                                        </Stack>
                                        <Box as="div" color="gray.600" fontSize="sm">
                                            {moment(message.createdAt).format('ll')}
                                        </Box>
                                    </Box>
                                </ImagePreview>
                            </ImageCard>
                        )
                    })}
            </Flex> */}
        </div>
    )
}

export default Media
