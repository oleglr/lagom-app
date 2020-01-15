import React from 'react'
import {
    Button,
    Heading,
    Image,
    Stack,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Icon,
    Spinner,
    Text,
    Modal,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    ModalOverlay,
    ModalContent,
} from '@chakra-ui/core'
import { Formik, Form, Field } from 'formik'
import { useAuth0 } from '../../react-auth0-spa'
import { MainSection, FormWrapper } from '../container'
import AvatarEditor from 'react-avatar-editor'

const MAX_FILE_SIZE = 3000000

const Profile = () => {
    const [form_status, setFormStatus] = React.useState('')
    const [files, setFiles] = React.useState([])
    const [preview, setPreview] = React.useState([])
    const [show_modal, setShowModal] = React.useState(false)

    const { user, getTokenSilently } = useAuth0()

    const input_ref = React.useRef()
    const avatar_ref = React.useRef()

    const uploadFileClient = e => {
        const file = e.target.files
        setFiles(Array.from(file))
    }

    const onClickSave = async () => {
        if (avatar_ref) {
            const canvasScaled = avatar_ref.current.getImageScaledToCanvas()
            canvasScaled.toBlob(
                blob => {
                    setFiles({ blob, canvasScaled })
                    setShowModal(false)
                },
                'image/jpeg',
                0.95
            )
        }
    }

    const clearFiles = () => {
        setFiles([])
        setShowModal(false)
    }

    React.useEffect(() => {
        if (files && files.blob) {
            setPreview([files.canvasScaled.toDataURL()])
        } else {
            if (!files.length) {
                setPreview(undefined)
                return
            }

            const object_urls = files.map(f => URL.createObjectURL(f))
            setPreview(object_urls)
            setShowModal(true)

            return () => {
                object_urls.forEach(url => {
                    URL.revokeObjectURL(url)
                })
            }
        }
    }, [files])

    return (
        <MainSection pt="0px">
            <FormWrapper>
                <Heading size="xl" marginBottom="16px">
                    Edit your profile
                </Heading>
                <Stack spacing={2}>
                    <Heading size="md">Photo</Heading>
                    <Image
                        borderRadius="20px"
                        size="200px"
                        src={preview && preview.length ? preview[0] : user.picture}
                        alt={user.name}
                    />
                    <input
                        aria-label="hidden file input"
                        name="chatfile"
                        accept="image/*"
                        ref={input_ref}
                        type="file"
                        hidden
                        onChange={uploadFileClient}
                    />
                    <Button width="150px" variant="outline" onClick={() => input_ref.current.click()}>
                        Upload photo
                    </Button>
                    <Modal isOpen={show_modal} onClose={() => clearFiles()} size={'xl'}>
                        <ModalOverlay zIndex="1400" />
                        <ModalContent borderRadius="5px">
                            <ModalCloseButton />
                            <ModalHeader>Crop your image</ModalHeader>
                            <ModalBody>
                                {preview && preview.length && (
                                    <Stack>
                                        <AvatarEditor
                                            ref={avatar_ref}
                                            image={preview[0]}
                                            borderRadius={20}
                                            width={250}
                                            height={250}
                                        />
                                    </Stack>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="ghost" mr={3} onClick={() => clearFiles()}>
                                    Cancel
                                </Button>
                                <Button onClick={onClickSave} className="btn-primary">
                                    Next
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Formik
                        initialValues={{ nickname: user.nickname }}
                        validate={values => {
                            const errors = {}
                            if (!values.nickname) {
                                errors.nickname = 'Required'
                            }
                            return errors
                        }}
                        onSubmit={async (values, { setStatus, setSubmitting }) => {
                            setFormStatus('submitting')
                            const is_no_changes = user.name === values.nickname && !preview.length
                            if (is_no_changes) {
                                setFormStatus('')
                                return
                            }

                            if (files && files.blob && files.blob.size > MAX_FILE_SIZE) {
                                setFormStatus('')
                                setStatus({ msg: `File size cannot exceed 3mb` })
                                return
                            }

                            const token = await getTokenSilently()

                            if (preview && preview.length) {
                                const formData = new FormData()
                                formData.append('user_id', user.sub)
                                formData.append('nickname', values.nickname)
                                formData.append('chatfile', files.blob)
                                fetch(`${process.env.REACT_APP_API}/update-profile-img`, {
                                    method: 'POST',
                                    body: formData,
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                })
                                    .then(res => res.json())
                                    .then(async res => {
                                        if (res.error) {
                                            setFormStatus('')
                                            console.warn(res.error)
                                            setStatus({ msg: res.error })
                                            return
                                        }
                                        window.location.reload()
                                    })
                            } else {
                                fetch(`${process.env.REACT_APP_API}/update-profile`, {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        user_id: user.sub,
                                        nickname: values.nickname,
                                    }),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                })
                                    .then(data => data.json())
                                    .then(async res => {
                                        if (res.error) {
                                            setFormStatus('')
                                            setStatus({ msg: res.error })
                                            return
                                        }
                                        // TODO: find a way to update user without refreshing
                                        window.location.reload()
                                    })
                            }
                        }}
                    >
                        {({ isSubmitting, status }) => (
                            <Form style={{ marginTop: '16px' }}>
                                <Field
                                    name="nickname"
                                    render={({ field, form }) => (
                                        <FormControl isInvalid={form.errors.nickname && form.touched.nickname}>
                                            <FormLabel htmlFor="user-name">Username</FormLabel>
                                            <Input {...field} type="text" id="user-name" data-lpignore="true" />
                                            <FormErrorMessage>{form.errors.nickname}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                />
                                {status && status.msg && (
                                    <Stack isInline align="center">
                                        <Icon color="red.500" name="warning" size="18px" />
                                        <Text>Error {status.msg}</Text>
                                    </Stack>
                                )}
                                <Stack justify="flex-end">
                                    <Button
                                        mt={4}
                                        variantColor="teal"
                                        width="150px"
                                        type="submit"
                                        id="form-submit-btn"
                                        disabled={form_status === 'submitting'}
                                    >
                                        {form_status === 'submitting' ? <Spinner /> : 'Save Changes'}
                                    </Button>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Stack>
            </FormWrapper>
        </MainSection>
    )
}

export default Profile
