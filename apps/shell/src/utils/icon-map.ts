/**
 * Icon Map — resolves string icon names (from BE) to Lucide React components.
 *
 * When the backend sends `icon: "Package"`, we look it up here.
 * Add new icons as the menu grows.
 */
import { type IconType as LucideIcon } from 'react-icons';
import {
  LuLayoutDashboard as LayoutDashboard,
  LuPackage as Package,
  LuBook as Book,
  LuUsers as Users,
  LuSettings as Settings,
  LuCircleHelp as HelpCircle,
  LuClipboardList as ClipboardList,
  LuShoppingCart as ShoppingCart,
  LuChartColumn as BarChart3,
  LuFileText as FileText,
  LuTruck as Truck,
  LuMapPin as MapPin,
  LuCalendar as Calendar,
  LuCreditCard as CreditCard,
  LuBell as Bell,
  LuShield as Shield,
  LuGlobe as Globe,
  LuMousePointer as MousePointer,
  LuTextCursorInput as TextCursorInput,
  LuTag as Tag,
  LuLoader as Loader,
  LuMaximize2 as Maximize2,
  LuShieldAlert as ShieldAlert,
  LuGraduationCap as GraduationCap,
  LuFolderTree as FolderTree,
  LuTerminal as Terminal,
  LuSquarePlus as PlusSquare,
  LuKey as Key,
  LuLink as Link,
  LuComponent as Component,
  LuPalette as Palette,
  LuRadio as Radio,
  LuSettings2 as Settings2,
  LuGitBranch as GitBranch,
  LuShieldCheck as ShieldCheck,
} from 'react-icons/lu';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  Book,
  Users,
  Settings,
  HelpCircle,
  ClipboardList,
  ShoppingCart,
  BarChart3,
  FileText,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  Bell,
  Shield,
  Globe,
  MousePointer,
  TextCursorInput,
  Tag,
  Loader,
  Maximize2,
  ShieldAlert,
  GraduationCap,
  FolderTree,
  Terminal,
  PlusSquare,
  Key,
  Link,
  Component,
  Palette,
  Radio,
  Settings2,
  GitBranch,
  ShieldCheck,
};

/**
 * Get a Lucide icon component by name string.
 * Falls back to `Package` if the name is not found.
 */
export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Package;
}
