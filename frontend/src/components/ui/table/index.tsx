import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

type BaseCellProps = {
  children: ReactNode;
  className?: string;
};

type TdProps = BaseCellProps & TdHTMLAttributes<HTMLTableCellElement> & { isHeader?: false };
type ThProps = BaseCellProps & ThHTMLAttributes<HTMLTableCellElement> & { isHeader: true };

// Gộp lại: union type
type TableCellProps = TdProps | ThProps;

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({ children, isHeader, className, ...rest }) => {
  if (isHeader) {
    return (
      <th className={className} {...rest}>
        {children}
      </th>
    );
  } else {
    return (
      <td className={className} {...rest}>
        {children}
      </td>
    );
  }
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
