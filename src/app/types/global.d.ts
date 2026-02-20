declare module 'lucide-react' {
  import { type FC, type SVGProps } from 'react'

  export type LucideIcon = FC<SVGProps<SVGSVGElement> & {
    size?: number | string
    color?: string
    strokeWidth?: number | string
    absoluteStrokeWidth?: boolean
  }>

  // Individual icon exports used in the project
  export const Mail: LucideIcon
  export const Calendar: LucideIcon
  export const Send: LucideIcon
  export const MessageCircle: LucideIcon
  export const Hash: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronRight: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const AlertTriangle: LucideIcon
  export const RefreshCw: LucideIcon
  export const Menu: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const X: LucideIcon
  export const Check: LucideIcon
  export const Search: LucideIcon
  export const User: LucideIcon
  export const Lock: LucideIcon
  export const Plus: LucideIcon
  export const Trash2: LucideIcon
  export const Info: LucideIcon
  export const Play: LucideIcon
  export const Square: LucideIcon
  export const Star: LucideIcon
  export const Braces: LucideIcon
  export const Type: LucideIcon
  export const ToggleLeft: LucideIcon
  export const List: LucideIcon
  export const FileCode: LucideIcon
  export const Phone: LucideIcon
  export const Palette: LucideIcon
  export const ShieldCheck: LucideIcon
  export const Shield: LucideIcon
  export const CreditCard: LucideIcon
  export const UserCheck: LucideIcon
  export const Save: LucideIcon
  export const Settings2: LucideIcon
  export const MessageSquareText: LucideIcon
  export const Boxes: LucideIcon
  export const CheckCircle: LucideIcon
  export const AlertCircle: LucideIcon
  export const Loader2: LucideIcon
  export const Building2: LucideIcon
  export const Wallet: LucideIcon
  export const KeyRound: LucideIcon
  export const Users: LucideIcon
  export const Server: LucideIcon
  export const Network: LucideIcon
  export const Clock: LucideIcon
  export const Settings: LucideIcon
  export const MessageSquare: LucideIcon
  export const ChevronUp: LucideIcon
  export const Globe: LucideIcon
  export const Monitor: LucideIcon
  export const DollarSign: LucideIcon
  export const Download: LucideIcon
  export const ArrowUp: LucideIcon
  export const ArrowDown: LucideIcon
  export const Brain: LucideIcon
  export const Wrench: LucideIcon
  export const UserX: LucideIcon
  export const MessageSquareOff: LucideIcon
  export const Headphones: LucideIcon
  export const LineChart: LucideIcon
  export const GitBranch: LucideIcon
  export const Smile: LucideIcon
  export const Target: LucideIcon
  export const TrendingUp: LucideIcon
  export const Receipt: LucideIcon
  export const BarChart3: LucideIcon
  export const Sparkles: LucideIcon
  export const Bot: LucideIcon
  export const Mic: LucideIcon
  export const Cpu: LucideIcon
  export const Edit: LucideIcon
  export const Activity: LucideIcon
  export const Zap: LucideIcon
  export const Wifi: LucideIcon
  export const Key: LucideIcon
  export const PenLine: LucideIcon
  export const LayoutGrid: LucideIcon
  export const CheckCircle2: LucideIcon
  export const ExternalLink: LucideIcon
  export const PhoneCall: LucideIcon
  export const Briefcase: LucideIcon
  export const PartyPopper: LucideIcon
  export const UtensilsCrossed: LucideIcon
  export const Stethoscope: LucideIcon
  export const Home: LucideIcon
  export const Car: LucideIcon
  export const Dumbbell: LucideIcon
  export const Scissors: LucideIcon
  export const SkipForward: LucideIcon
  export const LayoutDashboard: LucideIcon
  export const BookOpen: LucideIcon

  // Catch-all for any other icons not explicitly listed
  const _default: LucideIcon
  export default _default
}

declare module '*.scss' {
  type IClassNames = Record<string, string>
  const classNames: IClassNames
  export = classNames
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg' {
  import type React from 'react'
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>
  export default SVG
}

declare const __IS_DEV__: boolean
declare const __API__: string
declare const __WS__: string
declare const __PROJECT__: 'storybook' | 'frontend' | 'jest'
declare const __STATIC__: string
declare const __GOOGLE_CLIENT_ID__: string
declare const __TG_BOT_ID__: string
declare const __STRIPE_PUBLISHABLE_KEY__: string

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T
}
