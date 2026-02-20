import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './TabsPanel.module.scss'
import { memo, ReactNode } from 'react'
import { Box, Tab, Tabs, useMediaQuery } from '@mui/material'
import { Card } from '../../../redesigned/Card'

export interface TabPanelItem {
  label: string
  content: ReactNode
}

interface TabsPanelProps {
  className?: string
  tabItems: TabPanelItem[]
  value: number
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

interface CustomTabPanelProps {
  children: ReactNode
  value: number
  index: number
}

function CustomTabPanel ({ children, value, index, ...other }: CustomTabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  )
}

export const TabsPanel = memo((props: TabsPanelProps) => {
  const {
    className,
    tabItems,
    value,
    onChange
  } = props

  const isMobile = useMediaQuery('(max-width:800px)')

  const mods: Mods = {
    [cls.TabsMobile]: isMobile
  }

  function a11yProps (index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  return (
    <Card
      className={classNames(cls.TabsPanelMain, mods, [className])}
      max
      border={'partial'}
    >
      <Tabs
        value={value}
        onChange={onChange}
        aria-label="endpoints options"
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
        <CustomTabPanel key={index} value={value} index={index}>
          {item.content}
        </CustomTabPanel>
      ))}
    </Card>
  )
})
