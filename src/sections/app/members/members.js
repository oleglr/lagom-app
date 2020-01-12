import React from 'react'
import { Heading, Image, Box, Badge, Text, Button, Stack } from '@chakra-ui/core'
import moment from 'moment'
import { Flex } from '../../../components/container'
import { useGlobal } from '../../../context/global-context'
import { CreateGroup } from '../../../components/general/create-group'

const Profile = () => {
    const { group_members, active_group } = useGlobal()

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }

    return (
        <div style={{ margin: '2rem' }}>
            <Heading size="xl" marginBottom="16px">
                Members:
            </Heading>
            <Flex wrap="wrap" justify="flex-start">
                {group_members &&
                    group_members.length &&
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
        </div>
    )
}

export default Profile
