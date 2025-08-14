import * as React from "react";
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  MoreHorizontal, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface EnhancedTableProps {
  className?: string;
  children: React.ReactNode;
}

function EnhancedTable({ className, ...props }: EnhancedTableProps) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function EnhancedTableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "border-b border-border/50 bg-muted/30",
        className
      )}
      {...props}
    />
  );
}

function EnhancedTableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function EnhancedTableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

interface EnhancedTableRowProps extends React.ComponentProps<"tr"> {
  interactive?: boolean;
  onClick?: () => void;
}

function EnhancedTableRow({ className, interactive = false, onClick, children, ...props }: EnhancedTableRowProps) {
  return (
    <motion.tr
      className={cn(
        "border-b border-border/50 transition-colors",
        interactive && "hover:bg-muted/50 cursor-pointer",
        className
      )}
      onClick={onClick}
      whileHover={interactive ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.tr>
  );
}

interface SortableHeaderProps extends React.ComponentProps<"th"> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

function EnhancedTableHead({ 
  className, 
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  ...props 
}: SortableHeaderProps) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-muted-foreground",
        "[&:has([role=checkbox])]:pr-0",
        sortable && "cursor-pointer hover:text-foreground transition-colors",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <div className="flex flex-col">
            <ArrowUp 
              className={cn(
                "h-3 w-3 transition-colors",
                sortDirection === 'asc' ? "text-primary" : "text-muted-foreground/50"
              )} 
            />
            <ArrowDown 
              className={cn(
                "h-3 w-3 -mt-1 transition-colors",
                sortDirection === 'desc' ? "text-primary" : "text-muted-foreground/50"
              )} 
            />
          </div>
        )}
      </div>
    </th>
  );
}

function EnhancedTableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function EnhancedTableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

// Status Badge Component
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'draft';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    active: { 
      icon: CheckCircle, 
      color: 'text-green-500 bg-green-500/10 border-green-500/20',
      label: 'Active'
    },
    inactive: { 
      icon: XCircle, 
      color: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
      label: 'Inactive'
    },
    pending: { 
      icon: Clock, 
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
      label: 'Pending'
    },
    completed: { 
      icon: CheckCircle, 
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      label: 'Completed'
    },
    failed: { 
      icon: XCircle, 
      color: 'text-red-500 bg-red-500/10 border-red-500/20',
      label: 'Failed'
    },
    draft: { 
      icon: AlertCircle, 
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      label: 'Draft'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1 border", config.color)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// Action Buttons Component
interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onExternal?: () => void;
}

function ActionButtons({ onView, onEdit, onDelete, onDownload, onExternal }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      {onView && (
        <Button variant="ghost" size="sm" onClick={onView}>
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {onDownload && (
        <Button variant="ghost" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
      )}
      {onExternal && (
        <Button variant="ghost" size="sm" onClick={onExternal}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Enhanced Project Table Example
interface Project {
  id: string;
  name: string;
  description: string;
  framework: string;
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'draft';
  updated: string;
  collaborators: number;
}

interface ProjectsTableProps {
  projects: Project[];
  onProjectAction?: (project: Project, action: string) => void;
}

function ProjectsTable({ projects, onProjectAction }: ProjectsTableProps) {
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <EnhancedTable>
        <EnhancedTableHeader>
          <EnhancedTableRow>
            <EnhancedTableHead 
              sortable 
              sortDirection={sortField === 'name' ? sortDirection : null}
              onSort={() => handleSort('name')}
            >
              Project
            </EnhancedTableHead>
            <EnhancedTableHead>Framework</EnhancedTableHead>
            <EnhancedTableHead 
              sortable
              sortDirection={sortField === 'status' ? sortDirection : null}
              onSort={() => handleSort('status')}
            >
              Status
            </EnhancedTableHead>
            <EnhancedTableHead>Collaborators</EnhancedTableHead>
            <EnhancedTableHead 
              sortable
              sortDirection={sortField === 'updated' ? sortDirection : null}
              onSort={() => handleSort('updated')}
            >
              Last Updated
            </EnhancedTableHead>
            <EnhancedTableHead className="w-[100px]">Actions</EnhancedTableHead>
          </EnhancedTableRow>
        </EnhancedTableHeader>
        <EnhancedTableBody>
          {projects.map((project, index) => (
            <EnhancedTableRow 
              key={project.id} 
              interactive 
              onClick={() => onProjectAction?.(project, 'view')}
            >
              <EnhancedTableCell>
                <div className="space-y-1">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </div>
                </div>
              </EnhancedTableCell>
              <EnhancedTableCell>
                <Badge variant="secondary">{project.framework}</Badge>
              </EnhancedTableCell>
              <EnhancedTableCell>
                <StatusBadge status={project.status} />
              </EnhancedTableCell>
              <EnhancedTableCell>
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(project.collaborators, 3) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 border-2 border-background flex items-center justify-center text-xs font-medium text-white"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {project.collaborators > 3 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                      +{project.collaborators - 3}
                    </div>
                  )}
                </div>
              </EnhancedTableCell>
              <EnhancedTableCell className="text-muted-foreground">
                {project.updated}
              </EnhancedTableCell>
              <EnhancedTableCell>
                <ActionButtons
                  onView={() => onProjectAction?.(project, 'view')}
                  onEdit={() => onProjectAction?.(project, 'edit')}
                  onDownload={() => onProjectAction?.(project, 'download')}
                  onDelete={() => onProjectAction?.(project, 'delete')}
                />
              </EnhancedTableCell>
            </EnhancedTableRow>
          ))}
        </EnhancedTableBody>
      </EnhancedTable>
    </div>
  );
}

export {
  EnhancedTable,
  EnhancedTableHeader,
  EnhancedTableBody,
  EnhancedTableFooter,
  EnhancedTableHead,
  EnhancedTableRow,
  EnhancedTableCell,
  EnhancedTableCaption,
  StatusBadge,
  ActionButtons,
  ProjectsTable
};