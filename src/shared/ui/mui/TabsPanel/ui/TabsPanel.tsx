import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TabsPanel.module.scss'
import { memo, ReactNode } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { VStack } from '../../../redesigned/Stack'
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

  function a11yProps (index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  return (
        <Card
            className={classNames(cls.TabsPanel, {}, [className])}
            max
            border={'round'}
        >
            <VStack max gap={'16'}>
                <Tabs
                    value={value}
                    onChange={onChange}
                    aria-label="endpoints options"
                    selectionFollowsFocus
                    variant={'scrollable'}
                    scrollButtons={'auto'}
                    textColor={'inherit'}
                >
                    {tabItems.map((item, index) => (
                        <Tab className={cls.tab} key={index} label={item.label} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </VStack>
            {tabItems.map((item, index) => (
                <CustomTabPanel key={index} value={value} index={index}>
                    {item.content}
                </CustomTabPanel>
            ))}
        </Card>
  )
})
