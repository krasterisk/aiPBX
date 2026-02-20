import { memo, useState, useCallback } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Input } from '@/shared/ui/redesign-v3/Input'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Search, Mail, User, Lock } from 'lucide-react'
import cls from './Redesignv3Demo.module.scss'

interface DemoOption {
    id: string
    name: string
}

const demoOptions: DemoOption[] = [
    { id: '1', name: 'React' },
    { id: '2', name: 'TypeScript' },
    { id: '3', name: 'JavaScript' },
    { id: '4', name: 'Node.js' },
    { id: '5', name: 'Python' },
    { id: '6', name: 'Java' },
    { id: '7', name: 'C++' },
    { id: '8', name: 'Go' },
    { id: '9', name: 'Rust' },
    { id: '10', name: 'PHP' }
]

export const Redesignv3Demo = memo(() => {
    // Input states
    const [search, setSearch] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')

    // Combobox states
    const [singleValue, setSingleValue] = useState<DemoOption | null>(null)
    const [multiValue, setMultiValue] = useState<DemoOption[] | null>(null)
    const [searchableValue, setSearchableValue] = useState<DemoOption | null>(null)

    const handleEmailChange = useCallback((value: string) => {
        setEmail(value)
        if (value && !value.includes('@')) {
            setEmailError('Email должен содержать @')
        } else {
            setEmailError('')
        }
    }, [])

    return (
        <VStack gap="32" max className={cls.Redesignv3Demo}>
            <VStack gap="16" max>
                <Text title="Redesign v3 Components Demo" size="l" bold />
                <Text text="Демонстрация новых компонентов Input и Combobox (MUI version)" variant="accent" />
            </VStack>

            {/* Input Examples */}
            <VStack gap="24" max className={cls.section}>
                <Text title="Input Component" size="l" />

                <VStack gap="16" max>
                    <Text text="Базовые примеры" bold />

                    <HStack gap="16" max wrap="wrap">
                        <Input
                            placeholder="Простой input"
                            value={username}
                            onChange={setUsername}
                        />

                        <Input
                            placeholder="С иконкой поиска"
                            value={search}
                            onChange={setSearch}
                            addonLeft={<Search size={18} />}
                        />
                    </HStack>

                    <HStack gap="16" max wrap="wrap">
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            addonLeft={<Mail size={18} />}
                            error={emailError}
                            fullWidth
                        />
                    </HStack>

                    <VStack gap="8" max>
                        <Text text="Размеры" bold />
                        <Input size="s" placeholder="Маленький (s)" addonLeft={<User size={16} />} />
                        <Input size="m" placeholder="Средний (m) - по умолчанию" addonLeft={<User size={18} />} />
                        <Input size="l" placeholder="Большой (l)" addonLeft={<User size={20} />} />
                    </VStack>

                    <HStack gap="16" max wrap="wrap">
                        <Input
                            placeholder="Только для чтения"
                            value="Readonly value"
                            readonly
                        />

                        <Input
                            placeholder="Отключен"
                            disabled
                        />
                    </HStack>
                </VStack>
            </VStack>

            {/* Combobox Examples */}
            <VStack gap="24" max className={cls.section}>
                <Text title="Combobox Component (MUI)" size="l" />

                <VStack gap="16" max>
                    <VStack gap="8" max>
                        <Text text="Одиночный выбор" bold />
                        <Combobox
                            label="Выберите технологию"
                            options={demoOptions}
                            value={singleValue}
                            onChange={(e, value) => { setSingleValue(value as DemoOption | null) }}
                            getOptionLabel={(option: any) => option.name}
                            fullWidth
                        />
                        {singleValue && (
                            <Text text={`Выбрано: ${singleValue.name}`} variant="accent" />
                        )}
                    </VStack>

                    <VStack gap="8" max>
                        <Text text="Множественный выбор" bold />
                        <Combobox
                            label="Выберите технологии"
                            options={demoOptions}
                            value={multiValue || []}
                            onChange={(e, value) => { setMultiValue(value as DemoOption[] | null) }}
                            getOptionLabel={(option: any) => option.name}
                            multiple
                            fullWidth
                        />
                        {multiValue && multiValue.length > 0 && (
                            <Text
                                text={`Выбрано ${multiValue.length}: ${multiValue.map(v => v.name).join(', ')}`}
                                variant="accent"
                            />
                        )}
                    </VStack>

                    <VStack gap="8" max>
                        <Text text="С поиском (MUI Autocomplete)" bold />
                        <Combobox
                            label="Поиск технологии"
                            options={demoOptions}
                            value={searchableValue}
                            getOptionLabel={(option: any) => option.name}
                            onChange={(e, value) => { setSearchableValue(value as DemoOption | null) }}
                            fullWidth
                            noOptionsText="Технология не найдена"
                        />
                    </VStack>

                    <HStack gap="16" max wrap="wrap">
                        <Combobox
                            placeholder="Стандартный"
                            options={demoOptions.slice(0, 5)}
                            value={null}
                            getOptionLabel={(option: any) => option.name}
                            onChange={() => { }}
                        />

                        <Combobox
                            placeholder="Средний"
                            options={demoOptions.slice(0, 5)}
                            value={null}
                            getOptionLabel={(option: any) => option.name}
                            onChange={() => { }}
                        />

                        <Combobox
                            placeholder="С иконкой (заглушка)"
                            options={demoOptions.slice(0, 5)}
                            value={null}
                            getOptionLabel={(option: any) => option.name}
                            onChange={() => { }}
                        />
                    </HStack>
                </VStack>
            </VStack>

            {/* Combined Example */}
            <VStack gap="24" max className={cls.section}>
                <Text title="Комплексный пример: Форма регистрации" size="l" />

                <VStack gap="16" max className={cls.form}>
                    <Input
                        label="Имя пользователя"
                        placeholder="Введите имя"
                        value={username}
                        onChange={setUsername}
                        addonLeft={<User size={18} />}
                        fullWidth
                    />

                    <Input
                        label="Email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={handleEmailChange}
                        addonLeft={<Mail size={18} />}
                        error={emailError}
                        fullWidth
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={setPassword}
                        addonLeft={<Lock size={18} />}
                        fullWidth
                    />

                    <Combobox
                        label="Основная технология"
                        options={demoOptions}
                        value={singleValue}
                        getOptionLabel={(option: any) => option.name}
                        onChange={(e, value) => { setSingleValue(value as DemoOption | null) }}
                        fullWidth
                    />

                    <Combobox
                        label="Дополнительные навыки"
                        options={demoOptions}
                        value={multiValue || []}
                        getOptionLabel={(option: any) => option.name}
                        onChange={(e, value) => { setMultiValue(value as DemoOption[] | null) }}
                        multiple
                        fullWidth
                    />
                </VStack>
            </VStack>
        </VStack>
    )
})
