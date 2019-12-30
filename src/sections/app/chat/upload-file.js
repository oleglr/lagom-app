import React from 'react'
import styled from '@emotion/styled'
import {
    Alert,
    AlertIcon,
    Button,
    Icon,
    Text,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/core'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import { Flex } from '../../../components/container'
import { useAuth0 } from '../../../react-auth0-spa'

const IconWrapper = styled.span`
    position: absolute;
    left: 7px;
    top: 5px;
    height: 80%;
    width: 30px;
    z-index: 1;
    padding-top: 5px;
    border-radius: 5px;
    transition: 0.2s;

    &:hover {
        background-color: #aa1945;
        cursor: pointer;

        svg {
            color: #fff;
        }
    }
`

const StyledImage = styled.img`
    max-height: 40vh;
    border-radius: 5px;
`

const SmallImage = styled.img`
    max-height: 100px;
    max-width: 100px;
    border-radius: 5px;
    border: 1px solid var(--grey-2);
`

const ImageWrapper = styled.div`
    position: relative;
    margin: 10px;
`

const IconCloseWrapper = styled.div`
    position: absolute;
    z-index: 5;
    right: 0;
    top: 0;
    padding: 0px 5px 2px 6px;
    border-radius: 5px;
    transition: background 0.2s;

    &:hover {
        background: black;
        color: white;
        cursor: pointer;
    }
`

export const Upload = () => {
    const [files, setFiles] = React.useState([])
    const [preview, setPreview] = React.useState([])
    const [status, setStatus] = React.useState('')

    const { getTokenSilently, user } = useAuth0()
    const input_ref = React.useRef()

    const uploadFileClient = e => {
        const file = e.target.files
        setFiles(Array.from(file))
    }

    const sendFiles = async e => {
        if (!files.length) return

        setStatus('loading')

        const formData = new FormData()
        formData.append('group_id', '5df5c5b8aec1710635f037c4')
        formData.append('user_id', user.name)

        files.forEach(file => {
            formData.append('chatfile', file)
        })

        const token = await getTokenSilently()
        const endpoint = files.length > 1 ? 'upload-multiple' : 'upload'

        fetch(`http://localhost:3000/${endpoint}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.errors || res.error) {
                    console.warn(res.error, res.errors)
                    setStatus('error')
                    return
                }
                setStatus('')
                setFiles([])
            })
    }

    const removeFile = idx => {
        const new_files = files.filter((_, i) => i !== idx)
        setFiles(new_files)
    }

    // create a preview as a side effect, whenever selected file is changed
    React.useEffect(() => {
        if (!files.length) {
            setPreview(undefined)
            return
        }

        const object_urls = files.map(f => URL.createObjectURL(f))
        setPreview(object_urls)

        // free memory when ever this component is unmounted
        return () => {
            object_urls.forEach(url => {
                URL.revokeObjectURL(url)
            })
        }
    }, [files])

    return (
        <>
            <form encType="multipart/form-data">
                <input
                    name="chatfile"
                    accept="image/*"
                    ref={input_ref}
                    type="file"
                    hidden
                    multiple
                    onChange={uploadFileClient}
                />
                <IconWrapper onClick={() => input_ref.current.click()}>
                    <PopoverBubble text={<Text>Upload file</Text>}>
                        <Icon name="attachment" size="14px" />
                    </PopoverBubble>
                </IconWrapper>
                <Modal
                    isOpen={!!files.length}
                    onClose={() => setFiles('')}
                    size={'xl'}
                >
                    <ModalOverlay />
                    <ModalContent borderRadius="5px">
                        <ModalHeader>Upload a file</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {preview && preview.length === 1 && (
                                <Flex>
                                    <StyledImage
                                        alt="upload preview"
                                        src={preview[0]}
                                    />
                                </Flex>
                            )}
                            <Flex justify="unset" wrap="wrap">
                                {preview &&
                                    preview.length > 1 &&
                                    preview.map((url, idx) => (
                                        <ImageWrapper key={idx}>
                                            <IconCloseWrapper
                                                onClick={() => removeFile(idx)}
                                            >
                                                <Icon
                                                    name="close"
                                                    size="10px"
                                                />
                                            </IconCloseWrapper>
                                            <SmallImage
                                                alt="Upload preview"
                                                src={url}
                                            />
                                        </ImageWrapper>
                                    ))}
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            {status === 'error' && (
                                <Alert status="error">
                                    <AlertIcon />
                                    Please try again, there was a connection
                                    issue.
                                </Alert>
                            )}
                            <Button
                                variant="ghost"
                                mr={3}
                                onClick={() => setFiles('')}
                            >
                                Close
                            </Button>
                            <Button onClick={sendFiles} className="btn-primary">
                                {status === 'loading' ? <Spinner /> : 'Send'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </form>
        </>
    )
}
