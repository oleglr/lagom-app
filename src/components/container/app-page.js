import styled from '@emotion/styled'

export const MainSection = styled.section`
    height: 100%;
    width: 100%;
    padding-top: ${props => (props.pt ? props.pt : '4rem')};
`

export const FormWrapper = styled.div`
    margin: 0 auto;
    max-width: 600px;
    background-color: var(--white);
    padding: 4rem 16px;
    border-radius: 0.25rem;

    @media (max-width: 600px) {
        #form-submit-btn {
            width: 100%;
        }
    }
`
