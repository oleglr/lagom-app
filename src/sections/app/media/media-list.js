import React from 'react'
import moment from 'moment'
import styled from '@emotion/styled'
import { Image, Box, Stack } from '@chakra-ui/core'
import { List, AutoSizer } from 'react-virtualized'
import { ImagePreview } from '../../../components/general/image'
import { useGlobal } from '../../../context/global-context'

const ImageCard = styled(Box)`
    &:hover {
        cursor: pointer;
        .media-img {
            filter: brightness(0.5);
        }
    }
`

const MediaCard = ({ message, measure }) => {
    const { getUser } = useGlobal()
    const user = getUser(message.user)

    return (
        <ImageCard
            key={message._id}
            width="200px"
            borderWidth="1px"
            rounded="lg"
            overflow="hidden"
            margin="5px"
            height="fit-content"
        >
            <ImagePreview img_source={message.image_url}>
                <Image
                    className="media-img"
                    height="130px"
                    width="200px"
                    objectFit="cover"
                    alt={message.action}
                    src={message.image_url}
                />
                <Box p="5px" maxHeight="98px">
                    <Stack isInline align="center" maxWidth="180px">
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
                            onLoad={measure}
                        />
                        <Box mt="1" marginLeft="5px" fontSize="12px" fontWeight="semibold" as="h4" isTruncated>
                            {user.name}
                        </Box>
                    </Stack>
                    <Box maxWidth="180px" as="div" color="gray.600" fontSize="sm">
                        {moment(message.createdAt).format('ll')}
                    </Box>
                </Box>
            </ImagePreview>
        </ImageCard>
    )
}
class MediaList extends React.Component {
    render() {
        return (
            <AutoSizer>
                {({ height, width }) => {
                    const item_size = 200
                    const row_height = 200

                    const itemsPerRow = Math.floor(width / item_size)

                    const rowCount = Math.ceil(this.props.items.length / itemsPerRow)

                    return (
                        <List
                            rowCount={rowCount}
                            rowHeight={row_height}
                            height={height}
                            width={width}
                            rowRenderer={({ index, key, style }) => {
                                const items = []
                                const fromIndex = index * itemsPerRow
                                const toIndex = Math.min(fromIndex + itemsPerRow, this.props.items.length)

                                for (let i = fromIndex; i < toIndex; i++) {
                                    items.push(<MediaCard key={i} message={this.props.items[i]} />)
                                }

                                return (
                                    <div key={key} style={{ ...style, display: 'flex' }}>
                                        {items}
                                    </div>
                                )
                            }}
                        />
                    )
                }}
            </AutoSizer>
        )
    }
}

export { MediaList }
