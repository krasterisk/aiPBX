import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TabsPanel.module.scss'
import { memo, ReactNode, useState } from 'react'
import { Box, Typography, Tabs, Tab } from '@mui/material'

interface TabsPanelProps {
  className?: string
  children?: ReactNode
  index: number
  value: number
}

export const TabsPanel = memo((props: TabsPanelProps) => {
  const {
    className,
    children,
    value,
    index,
    ...other
  } = props

  function CustomTabPanel (props: TabsPanelProps) {
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
                <Typography>{children}</Typography>
              </Box>
          )}
        </div>
    )
  }

  const [val, setVal] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setVal(newValue)
  }

  function a11yProps (index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  return (
          <Box className={classNames(cls.TabsPanel, {}, [className])}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Item Two" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              123
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              456
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              789
            </CustomTabPanel>
          </Box>
  )
})
