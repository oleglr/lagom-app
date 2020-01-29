import React from 'react'
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/core'

export const DeleteListPopover = ({ name, list_id, deleteList }) => {
    return (
        <Popover>
            <PopoverTrigger>
                <Button size="sm" marginTop="auto" variant="outline">
                    Delete
                </Button>
            </PopoverTrigger>
            <PopoverContent zIndex={4}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold">Delete {name}?</PopoverHeader>
                <PopoverBody>Deleting a list is permanent and there is no way to get it back.</PopoverBody>
                <Button
                    marginRight="0.75rem"
                    marginLeft="0.75rem"
                    marginBottom="0.75rem"
                    variantColor="red"
                    onClick={() => deleteList(list_id, name)}
                >
                    Delete list
                </Button>
            </PopoverContent>
        </Popover>
    )
}
