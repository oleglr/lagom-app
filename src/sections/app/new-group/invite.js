import React from 'react'
import { InviteForm } from './invite-form'
import { Success } from './success'
import { MainSection, FormWrapper } from '../../../components/container'

export const Invite = () => {
    const [invite_status, setInviteStatus] = React.useState('')

    return (
        <MainSection>
            <FormWrapper>
                {invite_status === 'complete' ? (
                    <Success />
                ) : (
                    <InviteForm onSuccess={() => setInviteStatus('complete')} />
                )}
            </FormWrapper>
        </MainSection>
    )
}
