import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './TabsPanel.module.scss'
import { memo, ReactNode, useId } from 'react'
import { VStack } from '../../../redesigned/Stack'
import { Box, Tab, Tabs, useMediaQuery } from '@mui/material'
import { Card } from '../../../redesigned/Card'

export interface TabPanelItem {
  label: string
  content: ReactNode
}

interface TabsPanelProps {
  embedded?: boolean
  ariaLabel?: string
  className?: string
  tabItems: TabPanelItem[]
  value: number
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

interface CustomTabPanelProps {
  idPrefix: string
  embedded?: boolean
  children: ReactNode
  value: number
  index: number
}

function CustomTabPanel ({ children, value, index, idPrefix, embedded, ...other }: CustomTabPanelProps) {
  return (
    <div
      role="tabpanel"
      className={cls.panel}
      hidden={value !== index}
      id={`${idPrefix}-panel-${index}`}
      aria-labelledby={`${idPrefix}-tab-${index}`}
      {...other}
    >
      {value === index && (
        embedded ? <VStack gap="16" max className={cls.embeddedContent}>{children}</VStack> : <Box sx={{ p: 3 }}><div>{children}</div></Box>
      )}
    </div>
  )
}

export const TabsPanel = memo((props: TabsPanelProps) => {
  const {
    className,
    tabItems,
    value,
    onChange,
    embedded = false,
    ariaLabel = 'endpoints options'
  } = props

  const isMobile = useMediaQuery('(max-width:800px)')
  const idPrefix = useId()

  const mods: Mods = {
    [cls.TabsMobile]: isMobile
  }

  function a11yProps (index: number) {
    return {
      id: `${idPrefix}-tab-${index}`,
      'aria-controls': `${idPrefix}-panel-${index}`
    }
  }

  const Container = embedded ? VStack : Card
  return (
    <Container
      className={classNames(cls.TabsPanelMain, mods, [className])}
      max
      {...(!embedded ? { border: 'partial' as const } : {})}
    >
      <Tabs
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        variant="scrollable"
        scrollButtons={'auto'}
        allowScrollButtonsMobile={isMobile}
        textColor={'inherit'}
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--text-redesigned)'
          }
        }}
      >
        {tabItems.map((item, index) => (
          <Tab
            key={index}
            label={item.label}
            {...a11yProps(index)}

          />
        ))}
      </Tabs>
      {tabItems.map((item, index) => (
        <CustomTabPanel key={index} value={value} index={index} idPrefix={idPrefix} embedded={embedded}>
          {item.content}
        </CustomTabPanel>
      ))}
    </Container>
  )
})
