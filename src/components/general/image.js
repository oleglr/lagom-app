import React from 'react'
import styled from '@emotion/styled'
import { Flex } from '../container'
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/core'

const StyledImage = styled.img`
    max-height: 100vh;
`

export const ImagePreview = ({ children, img_source }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Modal onClose={onClose} size="full" isOpen={isOpen} isCentered>
                <ModalOverlay backgroundColor="rgba(0,0,0,0.9)" />
                <ModalContent width="fit-content">
                    <ModalCloseButton />
                    <ModalBody
                        paddingRight="0"
                        paddingLeft="0"
                        paddingTop="0"
                        paddingBottom="0"
                    >
                        <Flex>
                            <StyledImage src={img_source} alt="modal preview" />
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <div onClick={onOpen}>{children}</div>
        </>
    )
}
