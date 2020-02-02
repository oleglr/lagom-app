import React from 'react'
import styled from '@emotion/styled'
import {
    Alert,
    AlertIcon,
    Button,
    FormLabel,
    Icon,
    Input,
    Text,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Stack,
} from '@chakra-ui/core'
import Div100vh from 'react-div-100vh'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import { Flex } from '../../../components/container'
import { useAuth0 } from '../../../react-auth0-spa'
import { useGlobal } from '../../../context/global-context'
import { useUI } from '../../../main-content'
import Compress from 'compress.js'
import imageCompression from 'browser-image-compression'

const IconWrapper = styled.span`
    position: absolute;
    left: 8px;
    top: ${props => (props.is_mobile ? '4px' : '3px')};
    height: 40px;
    width: 32px;
    z-index: 1;
    border-radius: 5px;
    transition: 0.2s;
    display: flex;
    justify-content: center;

    &:hover {
        background-color: #aa1945;
        cursor: pointer;

        svg {
            color: #fff;
        }
    }
`

const StyledImage = styled.img`
    image-orientation: from-image;
    max-height: ${props => (props.is_mobile ? '65vh' : '50vh')};
    border-radius: 5px;
`

const SmallImage = styled.img`
    image-orientation: from-image;
    max-height: 100px;
    max-width: 100px;
    border-radius: 5px;
    border: 1px solid var(--grey-2);
`

const ImageWrapper = styled.div`
    position: relative;
    margin: 10px;
`

const CloseModalWrapper = styled.div`
    padding-right: 24px;

    &:hover {
        cursor: pointer;
    }
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
        cursor: pointer;
    }
`
const StyledInput = styled.input`
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    font-size: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 2.5rem;
    line-height: 2.5rem;
    background-color: rgb(255, 255, 255);
    transition: all 0.2s ease 0s;
    outline: none;
    border-radius: 0.25rem;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-color: inherit;

    &:focus {
        border-color: #3182ce;
        box-shadow: 0 0 0 1px #3182ce;
    }
`

const MAX_FILE_SIZE = 5000000

const mobileFooterStyle = {
    padding: '10px',
}

const mobileModalStyle = {
    marginBottom: 0,
    marginTop: 0,
    height: '100%',
}

const mobileButtonStyle = {
    marginTop: '28px',
}

var compress_options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
}

export const Upload = ({ is_thread, thread_message_id, paste_file }) => {
    const [modal_status, setModalStatus] = React.useState('')
    const [files, setFiles] = React.useState([])
    const [preview, setPreview] = React.useState([])
    const [status, setStatus] = React.useState('')
    const [message, setMessage] = React.useState('')
    const [error_msg, setErrorMsg] = React.useState('')

    const { is_mobile } = useUI()
    const { getTokenSilently, user } = useAuth0()
    const { active_group } = useGlobal()

    const input_ref = React.useRef()
    const initial_focus_ref = React.useRef()

    const onWriteMessage = e => {
        e.preventDefault()
        setMessage(e.target.value)
    }

    const addSetFile = file => {
        setErrorMsg('')
        setStatus('')
        setMessage('')
        setFiles(Array.from(file))
    }

    const uploadFileClient = async e => {
        setModalStatus('loading')

        const file = e.target.files
        const compressed_files = []
        for (let i = 0; i < file.length; i++) {
            if (file[i].size > 20000) {
                const compressed_and_resized_file = await imageCompression(file[i], compress_options)
                compressed_files.push(compressed_and_resized_file)
            } else {
                compressed_files.push(file[i])
            }
        }

        setModalStatus('ready')

        addSetFile(compressed_files)
    }

    React.useEffect(() => {
        if (!paste_file) return
        addSetFile(paste_file)
    }, [paste_file])

    const sendFiles = async e => {
        if (!files.length) return
        if (error_msg) return

        setStatus('loading')

        const compress = new Compress()
        const compressed_files = await compress.compress(files, {
            size: 2,
            quality: 0.75,
            maxWidth: 1920,
            maxHeight: 1920,
            resize: true,
        })

        const compressed_blobs = compressed_files.map(f => {
            const base64str = f.data
            const imgExt = f.ext
            const base_64 = Compress.convertBase64ToFile(base64str, imgExt)
            return base_64
        })

        const formData = new FormData()
        formData.append('group_id', active_group.id)
        formData.append('user_id', user.sub)

        if (message) {
            formData.append('message', message)
        }
        if (is_thread) {
            formData.append('message_id', thread_message_id)
        }

        compressed_blobs.forEach(file => {
            formData.append('chatfile', file)
        })

        const token = await getTokenSilently()
        const type = files.length > 1 ? 'upload-multiple' : 'upload'
        const endpoint = is_thread ? type + '-thread' : type

        fetch(`${process.env.REACT_APP_API}/${endpoint}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (res.status === 500) {
                    return { error: 'Server error' }
                }
                return res.json()
            })
            .then(res => {
                if (res.error) {
                    setStatus('error')
                    setErrorMsg(res.error)
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
        files.forEach(f => {
            if (f.size > MAX_FILE_SIZE) {
                setStatus('error')
                setErrorMsg(`File size cannot exceed 5mb`)
            }
        })
        setPreview(object_urls)

        // free memory when ever this component is unmounted
        return () => {
            object_urls.forEach(url => {
                URL.revokeObjectURL(url)
            })
        }
    }, [files])

    React.useEffect(() => {
        const send_btn = document.getElementById('input-btn')
        if (preview && send_btn && is_mobile) {
            send_btn.focus()
        }
    }, [preview, is_mobile])

    const cleanUpAndClose = () => {
        if (modal_status === 'loading') return
        setModalStatus('')
        setFiles([])
    }

    return (
        <>
            <form encType="multipart/form-data">
                <input
                    aria-label="hidden file input"
                    name="chatfile"
                    accept="image/*"
                    ref={input_ref}
                    type="file"
                    onClick={event => {
                        event.target.value = null
                    }}
                    hidden
                    multiple={is_thread ? false : true}
                    onChange={uploadFileClient}
                />
                <IconWrapper onClick={() => input_ref.current.click()} is_mobile={is_mobile}>
                    <PopoverBubble text={<Text>Upload file</Text>}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Icon name="attachment" size="14px" />
                        </div>
                    </PopoverBubble>
                </IconWrapper>
                <Modal
                    isOpen={!!modal_status}
                    onClose={cleanUpAndClose}
                    size={is_mobile ? 'full' : 'xl'}
                    blockScrollOnMount={true}
                >
                    <ModalOverlay zIndex="1400" />
                    <ModalContent borderRadius="5px" style={is_mobile ? mobileModalStyle : {}}>
                        <Div100vh>
                            <Stack isInline align="center" borderBottom="1px solid var(--grey-2)">
                                <ModalHeader style={{ marginRight: 'auto' }}>Upload a file</ModalHeader>
                                <CloseModalWrapper onClick={cleanUpAndClose}>
                                    <Icon name="close" />
                                </CloseModalWrapper>
                            </Stack>
                            <ModalBody>
                                {modal_status === 'loading' && <Spinner />}
                                {modal_status === 'ready' && (
                                    <>
                                        {preview && preview.length === 1 && (
                                            <Flex height="unset">
                                                <StyledImage
                                                    is_mobile={is_mobile}
                                                    alt="upload preview"
                                                    src={preview[0]}
                                                />
                                            </Flex>
                                        )}
                                        <Flex justify="unset" wrap="wrap" height="unset">
                                            {preview &&
                                                preview.length > 1 &&
                                                preview.map((url, idx) => (
                                                    <ImageWrapper key={idx}>
                                                        <IconCloseWrapper onClick={() => removeFile(idx)}>
                                                            <Icon name="close" size="10px" />
                                                        </IconCloseWrapper>
                                                        <SmallImage alt="Upload preview" src={url} />
                                                    </ImageWrapper>
                                                ))}
                                        </Flex>
                                        {!is_mobile && (
                                            <div style={{ marginTop: '1rem' }}>
                                                <FormLabel htmlFor="image_message">Add a comment (optional)</FormLabel>
                                                <StyledInput
                                                    className="input"
                                                    id="image_message"
                                                    type="text"
                                                    value={message}
                                                    onChange={onWriteMessage}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter style={is_mobile ? mobileFooterStyle : {}}>
                                <Stack isInline width={is_mobile ? '100%' : 'unset'}>
                                    {status === 'error' && (
                                        <Alert status="error">
                                            <AlertIcon />
                                            {error_msg}
                                        </Alert>
                                    )}
                                    {is_mobile && (
                                        <div style={{ width: '100%', marginRight: '10px' }}>
                                            <FormLabel htmlFor="image_message">Add a comment (optional)</FormLabel>
                                            <Input
                                                width="100%"
                                                id="image_message"
                                                type="text"
                                                value={message}
                                                onChange={onWriteMessage}
                                            />
                                        </div>
                                    )}
                                    {!is_mobile && (
                                        <Button variant="ghost" mr={3} onClick={cleanUpAndClose}>
                                            Close
                                        </Button>
                                    )}
                                    <Button
                                        id="input-btn"
                                        style={is_mobile ? mobileButtonStyle : {}}
                                        onClick={sendFiles}
                                        className="btn-primary"
                                        ref={initial_focus_ref}
                                    >
                                        {status === 'loading' ? <Spinner /> : 'Send'}
                                    </Button>
                                </Stack>
                            </ModalFooter>
                        </Div100vh>
                        )}
                    </ModalContent>
                </Modal>
            </form>
        </>
    )
}
