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
} from '@chakra-ui/core'
import { Formik, Form, Field } from 'formik'
import { useAuth0 } from '../../react-auth0-spa'
import { MainSection, FormWrapper } from '../container'

const Profile = () => {
    const [form_status, setFormStatus] = React.useState('')
    const [files, setFiles] = React.useState([])
    const [preview, setPreview] = React.useState([])

    const { user, getTokenSilently } = useAuth0()

    const input_ref = React.useRef()

    const uploadFileClient = e => {
        const file = e.target.files
        setFiles(Array.from(file))
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
        <MainSection>
            <FormWrapper>
                <Heading size="xl" marginBottom="16px">
                    Edit your profile
                </Heading>
                <Stack spacing={2}>
                    <Heading size="md">Photo</Heading>
                    <Image
                        rounded="full"
                        size="100px"
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
                            const is_no_changes = user.name === values.nickname && !preview
                            if (is_no_changes) {
                                setFormStatus('')
                                return
                            }

                            const token = await getTokenSilently()

                            if (preview) {
                                const formData = new FormData()
                                formData.append('user_id', user.sub)
                                formData.append('nickname', values.nickname)
                                files.forEach(file => {
                                    formData.append('chatfile', file)
                                })
                                fetch(`http://localhost:3000/update-profile-img`, {
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
                                        window.location.refresh()
                                    })
                            } else {
                                fetch(`http://localhost:3000/update-profile`, {
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
                                        console.log('res: ', res)
                                        if (res.error) {
                                            setFormStatus('')
                                            setStatus({ msg: res.error })
                                            return
                                        }
                                        // TODO: find a way to update user without refreshing
                                        window.location.refresh()
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
                                            {status && status.msg && (
                                                <Stack isInline align="center">
                                                    <Icon color="red.500" name="warning" size="18px" />
                                                    <Text>Server error {status.msg}, please try again</Text>
                                                </Stack>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                {status && status.msg && (
                                    <Stack isInline align="center">
                                        <Icon color="red.500" name="warning" size="18px" />
                                        <Text>Server error {status.msg}, please try again</Text>
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
