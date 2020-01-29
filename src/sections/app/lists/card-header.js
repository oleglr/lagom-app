import React from 'react'
import styled from '@emotion/styled'
import { Box, Heading } from '@chakra-ui/core'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { EmojiPicker } from '../chat/emoji-picker'
import { useUI } from '../../../main-content'
import { useGlobal } from '../../../context/global-context'
import { editListIcon } from './list-socket-methods'

const EmojiWrapper = styled.div`
    margin-right: 8px;
    border-radius: 2px;

    &:hover {
        cursor: pointer;
        background-color: var(--grey-3);
    }
`
const PopoverContainer = styled.div`
    height: ${props => (props.is_mobile ? '372px' : '')};
    width: ${props => (props.is_mobile ? '254px' : '')};
`
export const CardHeader = ({ name, icon, todo_list }) => {
    const [show_picker, setShowPicker] = React.useState(false)
    const completed = todo_list.list_items.filter(li => li.status === 'complete').length
    const total = todo_list.list_items.length

    const { is_mobile } = useUI()
    const { active_group } = useGlobal()

    const updateListIcon = ({ native }) => {
        editListIcon({ group_id: active_group.id, list_id: todo_list._id, icon: native })
        setShowPicker(false)
    }

    return (
        <div>
            <Heading size="md" display="flex">
                <Popover
                    isOpen={show_picker}
                    position={['top', 'right', 'left', 'bottom']}
                    padding={10}
                    content={({ position, targetRect, popoverRect }) => (
                        <ArrowContainer
                            position={'bottom'}
                            targetRect={targetRect}
                            popoverRect={popoverRect}
                            arrowColor={'black'}
                            arrowSize={7}
                        >
                            <PopoverContainer is_mobile={is_mobile}>
                                <div>
                                    <EmojiPicker
                                        is_mobile={is_mobile}
                                        showPicker={true}
                                        onSelectEmoji={updateListIcon}
                                        has_custom={false}
                                        closePicker={() => {
                                            setShowPicker(false)
                                        }}
                                    />
                                </div>
                            </PopoverContainer>
                        </ArrowContainer>
                    )}
                >
                    <EmojiWrapper onClick={() => setShowPicker(true)}>
                        <span aria-label="list emoji icon" role="img">
                            {icon}
                        </span>
                    </EmojiWrapper>
                </Popover>
                {name}
            </Heading>
            <Box maxHeight="98px">
                <Box maxWidth="180px" as="div" color="gray.600" fontSize="sm">
                    {`${completed}/${total} completed`}
                </Box>
            </Box>
        </div>
    )
}
