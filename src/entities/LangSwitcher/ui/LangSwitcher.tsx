import { useTranslation } from 'react-i18next'
import { memo, useCallback, useMemo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Icon } from '@/shared/ui/redesigned/Icon'
import RuIcon from '@/shared/assets/icons/RU.svg'
import USIcon from '@/shared/assets/icons/US.svg'
import DEIcon from '@/shared/assets/icons/DE.svg'
import CNIcon from '@/shared/assets/icons/CN.svg'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { TextField } from '@mui/material'

interface LangSwitcherProps {
  className?: string
  short?: boolean
}

interface LanguageOption {
  value: string
  label: string
  Icon: React.VFC<React.SVGProps<SVGSVGElement>>
}

export const LangSwitcher = memo(({ className, short }: LangSwitcherProps) => {
  const { t, i18n } = useTranslation()

  const options = useMemo<LanguageOption[]>(() => [
    { value: 'ru', label: 'Русский', Icon: RuIcon },
    { value: 'en', label: 'English', Icon: USIcon },
    { value: 'de', label: 'Deutsch', Icon: DEIcon },
    { value: 'zh', label: '中文', Icon: CNIcon },
  ], [])

  const currentLanguage = i18n.language?.split('-')[0] || 'en'
  const selectedOption = options.find(opt => opt.value === currentLanguage) || options[1]

  const onChange = useCallback((event: any, newValue: LanguageOption | null) => {
    if (newValue) {
      i18n.changeLanguage(newValue.value)
    }
  }, [i18n])

  return (
    <div className={classNames('', {}, [className])}>
      <Combobox
        value={selectedOption}
        onChange={onChange}
        options={options}
        getOptionLabel={(option: LanguageOption) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        disableClearable
        componentsProps={{
          paper: {
            sx: {
              minWidth: '150px',
              width: 'auto !important',
            }
          }
        }}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            <HStack gap="8">
              <Icon Svg={option.Icon} width={20} height={20} />
              <span>{option.label}</span>
            </HStack>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              readOnly: true,
              style: {
                width: 0,
                minWidth: 0,
                padding: 0,
                opacity: 0,
                color: 'transparent'
              }
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon Svg={selectedOption.Icon} width={24} height={24} />
                </div>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                paddingLeft: '8px !important',
                paddingRight: '23px !important',
                minWidth: '60px',
              },
              '& .MuiInputBase-input': {
                width: 0,
                minWidth: 0,
                padding: 0,
                opacity: 0,
              },
              '& .MuiAutocomplete-endAdornment': {
                right: '4px !important',
              },
            }}
          />
        )}
      />
    </div>
  )
})
