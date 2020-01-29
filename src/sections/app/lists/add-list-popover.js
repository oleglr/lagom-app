import React from 'react'
import {
    Button,
    FormControl,
    Input,
    FormLabel,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/core'
import { Error } from '../../../components/elements'

const MAX_NAME_LENGTH = 200
// eslint-disable-next-line no-unused-vars
const MAX_LIST_COUNT = 3

export const PopoverForm = ({ addNewListName, new_list_loading, list_count }) => {
    let default_error
    // TODO enable for max check
    // if (list_count >= MAX_LIST_COUNT) {
    //     default_error = `Max ${MAX_LIST_COUNT} lists allowed, for more lists please upgrade your account to premium`
    // } else {
    //     default_error = ''
    // }

    const [new_list_name, setNewListName] = React.useState('')
    const [form_error, setFormError] = React.useState(default_error)
    const [isOpen, setIsOpen] = React.useState(false)
    const [status, setStatus] = React.useState('')

    const input_ref = React.useRef()

    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    const onUpdateName = e => {
        setNewListName(e.target.value)
    }

    const newListName = e => {
        e.preventDefault()
        if (form_error) return
        setStatus('submitting')
        addNewListName(new_list_name)
    }

    React.useEffect(() => {
        if (!new_list_loading && status === 'submitting') {
            setStatus('')
            setNewListName('')
            close()
        }
    }, [new_list_loading, status])

    React.useEffect(() => {
        if (new_list_name.length >= MAX_NAME_LENGTH) {
            // TODO display error
            setFormError(`Name should be shorter than ${MAX_NAME_LENGTH} characters`)
            return
        } else {
            setFormError('')
        }
    }, [new_list_name])

    return (
        <div style={{ maxHeight: '40px', marginBottom: '20px' }}>
            <Popover placement="right" initialFocusRef={input_ref} isOpen={isOpen} onClose={close}>
                <PopoverTrigger>
                    <Button className="btn-primary" onClick={open}>
                        Add list
                    </Button>
                </PopoverTrigger>
                <PopoverContent zIndex={4}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight="bold">Add new list</PopoverHeader>
                    <PopoverBody>
                        {default_error && <Error error={default_error} />}
                        {!default_error && (
                            <form onSubmit={newListName}>
                                <FormControl>
                                    <FormLabel fontWeight="normal" htmlFor="list-name">
                                        Name
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        id="list-name"
                                        placeholder="E.g. Malaysia trip"
                                        data-lpignore="true"
                                        value={new_list_name}
                                        onChange={e => {
                                            onUpdateName(e)
                                        }}
                                        ref={input_ref}
                                        marginBottom="16px"
                                    />
                                    {/* TODO: sharable error component */}
                                    {form_error && <Error error={form_error} />}
                                </FormControl>
                                <Button
                                    isDisabled={status === 'submitting'}
                                    isLoading={status === 'submitting'}
                                    variantColor="teal"
                                    type="submit"
                                >
                                    Add list
                                </Button>
                            </form>
                        )}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </div>
    )
}
