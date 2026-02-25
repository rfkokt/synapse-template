/**
 * Icon Map — resolves string icon names (from BE) to Lucide React components.
 *
 * When the backend sends `icon: "Package"`, we look it up here.
 * Add new icons as the menu grows.
 */
import {
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
  type LucideIcon,
} from 'lucide-react';

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
