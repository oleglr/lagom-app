import React from 'react'
import { useHistory } from 'react-router-dom'
import { Heading, Image, Box, Badge, Button } from '@chakra-ui/core'
import moment from 'moment'
import { Flex } from '../../../components/container'
import { useGlobal } from '../../../context/global-context'
import { CreateGroup } from '../../../components/general/create-group'
import { useUI } from '../../../main-content'

const Profile = () => {
    const { group_members, active_group } = useGlobal()
    const { is_mobile } = useUI()
    const history = useHistory()

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }

    return (
        <div style={{ margin: '2rem' }}>
            <Heading size="xl" marginBottom="16px">
                Members:
            </Heading>
            <Flex wrap="wrap" justify={is_mobile ? 'center' : 'flex-start'}>
                {!!group_members &&
                    !!group_members.length &&
                    group_members.map(member => (
                        <Box
                            key={member.user_id}
                            maxW="200px"
                            minW="200px"
                            borderWidth="1px"
                            rounded="lg"
                            overflow="hidden"
                            margin="12px"
                            height="fit-content"
                            style={{
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <Image size="200px" objectFit="cover" src={member.picture} alt={member.nickname} />

                            <Box p="6">
                                <Box d="flex" alignItems="baseline">
                                    {member.user_id === active_group.admin ? (
                                        <Badge rounded="full" px="2" variantColor="purple">
                                            Admin
                                        </Badge>
                                    ) : (
                                        <Badge rounded="full" px="2" variantColor="teal">
                                            Member
                                        </Badge>
                                    )}
                                </Box>

                                <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                    {member.nickname}
                                </Box>
                                <Box as="div" color="gray.600" fontSize="sm">
                                    Member since:
                                </Box>
                                <Box as="div" color="gray.600" fontSize="sm">
                                    {moment(member.created_at).format('ll')}
                                </Box>
                            </Box>
                        </Box>
                    ))}
            </Flex>
            <Button onClick={() => history.push('/invite')} className="btn-primary" marginLeft="12px" marginTop="16px">
                Add members
            </Button>
        </div>
    )
}

export default Profile
