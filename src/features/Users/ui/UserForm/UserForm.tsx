import { memo, ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import {
    getUserAuthData,
    isUserAdmin,
    isOwnerUser,
    isSubUser,
    useGetUser,
    User,
    UserCurrencyValues,
    UserRolesValues,
    UserAddAvatar,
    RoleSelect,
    currencySymbols,
    usersApi,
} from '@/entities/User'
import { OurOrganizationSelect } from '@/entities/OurOrganization'
import { getTenantCurrencyCode, isPaymentOrganizationsTabVisible } from '@/shared/lib/domain'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import cls from './UserForm.module.scss'

interface UserFormProps {
    className?: string
    userId?: string
    isEdit?: boolean
    formFields: User
    setFormFields: (fields: User) => void
}

export const UserForm = memo((props: UserFormProps) => {
    const {
        className,
        userId,
        isEdit,
        formFields,
        setFormFields
    } = props

    const { t } = useTranslation('users')
    const isAdmin = useSelector(isUserAdmin)
    const isOwner = useSelector(isOwnerUser)
    const clientData = useSelector(getUserAuthData)

    const isSub = useSelector(isSubUser)

    const { data: userData, isLoading, isError } = useGetUser(userId!, {
        skip: !isEdit || !userId
    })

    const selectUsersList = useMemo(() => usersApi.endpoints.getUsers.select({}), [])
    const selectSubUsersList = useMemo(() => usersApi.endpoints.getSubUsers.select(), [])
    const usersListCache = useSelector(selectUsersList)
    const subUsersCache = useSelector(selectSubUsersList)

    const cachedUser = useMemo(() => {
        if (!userId) return undefined

        const fromAdminList = usersListCache?.data?.rows?.find(
            (user) => String(user.id) === String(userId)
        )
        if (fromAdminList) return fromAdminList

        return subUsersCache?.data?.find(
            (user) => String(user.id) === String(userId)
        )
    }, [userId, usersListCache, subUsersCache])

    const effectiveUserData = userData ?? cachedUser
    const showLoadError = isError && !cachedUser

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

    useEffect(() => {
        if (isEdit && effectiveUserData) {
            if (isAdmin) {
                setFormFields({
                    ...effectiveUserData,
                    balance:
                        effectiveUserData.balance != null && !Number.isNaN(Number(effectiveUserData.balance))
                            ? Number(effectiveUserData.balance)
                            : 0,
                })
            } else {
                setFormFields(effectiveUserData)
            }
        }
    }, [isEdit, effectiveUserData, setFormFields, isAdmin])

    useEffect(() => {
        if (!isEdit && !isAdmin && clientData) {
            setFormFields({
                ...formFields,
                vpbx_user_id: clientData.id,
                vpbxUser: {
                    id: clientData.id,
                    name: clientData.name || ''
                },
                roles: [{ value: UserRolesValues.USER, description: '' }]
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, isAdmin, clientData?.id])

    const onChangeText = useCallback((field: keyof User) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormFields({
                ...formFields,
                [field]: event.target.value
            })
        }, [formFields, setFormFields])

    const onChangeRole = useCallback((_event: any, value: UserRolesValues) => {
        setFormFields({
            ...formFields,
            roles: [{ value, description: '' }]
        })
    }, [formFields, setFormFields])

    const tenantCurrency = getTenantCurrencyCode()
    const showPersonalAccount = isPaymentOrganizationsTabVisible()
    const personalAccountNumber = (formFields.personalAccountNumber || '').trim()

    useEffect(() => {
        if (!isEdit && formFields.currency !== tenantCurrency) {
            setFormFields({
                ...formFields,
                currency: tenantCurrency as UserCurrencyValues,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, tenantCurrency])

    if (isLoading && !cachedUser) {
        return (
            <VStack max align="center" justify="center" className={cls.loader}>
                <Loader />
            </VStack>
        )
    }

    if (showLoadError) {
        return <ErrorGetData />
    }

    const avatarSrc = formFields.avatar
        ? (formFields.avatar.startsWith('http') ? formFields.avatar : `${__STATIC__}/${formFields.avatar}`)
        : ''

    // Owner creating a sub-user: simplified form
    const isOwnerCreating = isOwner && !isAdmin && !isEdit

    return (
        <div className={classNames(cls.UserForm, {}, [className])}>
            <Card
                max
                padding="24"
                border="partial"
                className={cls.formCard}
            >
                <VStack gap="24" max align="start">
                    <HStack gap="8" align="center">
                        <AccountCircleIcon fontSize="small" className={cls.sectionIcon} />
                        <Text text={t('Основная информация')} size="m" bold />
                    </HStack>

                    {isEdit && (
                        <HStack justify="center" max>
                            <div
                                onClick={() => { setIsAvatarModalOpen(true) }}
                                className={cls.avatarWrap}
                            >
                                <Avatar size={100} src={avatarSrc} />
                            </div>
                        </HStack>
                    )}

                    <VStack gap="8" max>
                        <Text text={t('Имя') || ''} size="s" bold className={cls.label} />
                        <Textarea
                            placeholder={t('Введите имя') ?? ''}
                            onChange={onChangeText('name')}
                            data-testid="UserCard.name"
                            value={formFields.name || ''}
                            className={cls.fullWidth}
                            minRows={1}
                        />
                    </VStack>

                    <VStack gap="8" max>
                        <Text text={t('Email') || ''} size="s" bold className={cls.label} />
                        <Textarea
                            placeholder={t('Введите email') ?? ''}
                            onChange={onChangeText('email')}
                            data-testid="UserCard.email"
                            value={formFields.email || ''}
                            className={cls.fullWidth}
                            minRows={1}
                        />
                    </VStack>

                    {isEdit && showPersonalAccount && personalAccountNumber && (
                        <VStack gap="8" max>
                            <Text text={t('personalAccount.label')} size="s" bold className={cls.label} />
                            <Text
                                text={personalAccountNumber}
                                size="m"
                                bold
                                className={cls.personalAccountNumber}
                            />
                        </VStack>
                    )}

                    {!isOwnerCreating && !isSub && (
                        <VStack gap="8" max>
                            <Text text={t('Валюта') || ''} size="s" bold className={cls.label} />
                            <Text
                                text={`${tenantCurrency} (${currencySymbols[tenantCurrency] || tenantCurrency})`}
                                size="m"
                                bold
                            />
                        </VStack>
                    )}

                    {isAdmin && isEdit && (
                        <VStack gap="8" max>
                            <Text text={t('Баланс') || ''} size="s" bold className={cls.label} />
                            <Text
                                text={t('Баланс подсказка админ')}
                                size="xs"
                                variant="accent"
                            />
                            <Textarea
                                placeholder="0.00"
                                onChange={(e) => {
                                    const v = e.target.value.replace(',', '.').trim()
                                    if (v === '') {
                                        setFormFields({ ...formFields, balance: undefined })
                                        return
                                    }
                                    const n = Number(v)
                                    if (!Number.isFinite(n)) return
                                    setFormFields({ ...formFields, balance: n })
                                }}
                                data-testid="UserCard.balance"
                                value={formFields.balance === undefined || formFields.balance === null ? '' : String(formFields.balance)}
                                className={cls.fullWidth}
                                minRows={1}
                                type="number"
                            />
                        </VStack>
                    )}

                    {isAdmin && (
                        <VStack gap="8" max>
                            <Text text={t('Уровень доступа') || ''} size="s" bold className={cls.label} />
                            <RoleSelect
                                value={formFields.roles?.[0]?.value}
                                onChange={onChangeRole}
                                label=""
                                data-testid="UserCard.RoleSelect"
                            />
                        </VStack>
                    )}

                    {isAdmin && (
                        <VStack gap="8" max>
                            <Text text={t('ourOrg.fieldLabel')} size="s" bold className={cls.label} />
                            <Text text={t('ourOrg.fieldHint')} size="xs" variant="accent" />
                            <OurOrganizationSelect
                                label=""
                                organizationId={
                                    formFields.ourOrganizationId != null
                                        ? String(formFields.ourOrganizationId)
                                        : formFields.our_organization_id
                                }
                                onChangeOrganization={(id) => {
                                    setFormFields({
                                        ...formFields,
                                        ourOrganizationId: id ? Number(id) : null,
                                        our_organization_id: id || undefined,
                                    })
                                }}
                            />
                        </VStack>
                    )}
                </VStack>
            </Card>

            {isEdit && (
                <UserAddAvatar
                    show={isAvatarModalOpen}
                    onClose={() => { setIsAvatarModalOpen(false) }}
                    user={formFields}
                />
            )}
        </div>
    )
})
