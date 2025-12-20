/**
 * Optimized Icon Exports
 *
 * This file provides tree-shakeable icon imports from lucide-react.
 * Instead of importing the entire 43MB library, we only bundle the icons we actually use.
 *
 * Usage:
 * ```typescript
 * import { User, Settings, Home } from "@/icons";
 * ```
 *
 * Benefits:
 * - Reduces bundle size by ~10-20MB
 * - Faster compilation
 * - Better tree-shaking
 */

// Navigation & UI
export {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Menu,
  X,
  Plus,
  PlusCircle,
  Minus,
  Check,
  CheckCircle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  MoreHorizontal,
} from "lucide-react";

// Content & Editing
export {
  Edit,
  Edit2,
  Edit3,
  Pencil,
  Trash,
  Trash2,
  Copy,
  Save,
  Download,
  Upload,
  FileText,
  File,
  FileImage,
  FilePlus,
  FileCode,
  FileArchive,
  FileJson,
  Folder,
  FolderOpen,
  FolderGit2,
  Search,
  Filter,
  Archive,
  MoreVertical,
  Book,
  BookOpen,
  ClipboardList,
} from "lucide-react";

// User & Account
export {
  User,
  UserPlus,
  Users,
  UserCircle,
  UserCheck,
  LogIn,
  LogOut,
  Settings,
  Settings2,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
} from "lucide-react";

// Status & Feedback
export {
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Loader,
  Loader2,
  RefreshCw,
  RefreshCcw,
  RotateCcw,
  CheckSquare,
  Square,
  Circle,
  Disc,
  XCircle,
} from "lucide-react";

// Social & Communication
export {
  Mail,
  MessageCircle,
  MessageSquare,
  Send,
  Bell,
  BellOff,
  Share,
  Share2,
  ExternalLink,
  Link,
  Link2,
  Heart,
  Star,
  ThumbsUp,
  AtSign,
  Linkedin,
  Megaphone,
} from "lucide-react";

// Business & Productivity
export {
  Calendar,
  Clock,
  History,
  TrendingUp,
  TrendingDown,
  BarChart,
  BarChart2,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Target,
  Award,
  Briefcase,
  Trophy,
} from "lucide-react";

// Media & Content
export {
  Image,
  Video,
  Music,
  Film,
  Camera,
  Mic,
  MicOff,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";

// Location & Navigation
export {
  Home,
  MapPin,
  Map,
  MapIcon,
  Navigation,
  Compass,
  Globe,
  Globe2,
  Building,
  Building2,
} from "lucide-react";

// Code & Development
export {
  Code,
  Code2,
  Terminal,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitFork,
  Github,
  Package,
  Database,
  Server,
  Cpu,
  HardDrive,
} from "lucide-react";

// Layout & Structure
export {
  Layout,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  Grid3x3,
  List,
  Columns,
  Rows,
  Sidebar,
  PanelLeft,
  PanelRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Layers,
  Layers3,
  StickyNote,
} from "lucide-react";

// Workspace & Tools
export {
  Palette,
  Pen,
  PenTool,
  Paintbrush,
  Pipette,
  Scissors,
  Hammer,
  Wrench,
  Sliders,
  SlidersHorizontal,
} from "lucide-react";

// E-commerce & Financial
export {
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Wallet,
  Receipt,
  Tag,
  Tags,
} from "lucide-react";

// Miscellaneous
export {
  Bookmark,
  BookmarkCheck,
  Flag,
  Sparkles,
  Flame,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Umbrella,
  Coffee,
  Lightbulb,
  Rocket,
  Puzzle,
} from "lucide-react";

// Image & Cropping
export { Crop, ZoomIn, ZoomOut, HandHelping, Gift } from "lucide-react";

// Type export for icon props
export type { LucideProps, LucideIcon } from "lucide-react";
