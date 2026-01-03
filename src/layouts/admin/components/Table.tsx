import type { ReactNode } from 'react';

interface Column<T> {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
    align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyField: string;
    className?: string;
}

const Table = <T extends Record<string, any>>({
    data,
    columns,
    keyField,
    className = ''
}: TableProps<T>) => {
    return (
        <div className={`table-wrapper ${className}`}>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className={col.align ? `text-${col.align}` : ''}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item[keyField]}>
                            {columns.map((col) => (
                                <td key={`${item[keyField]}-${col.key}`} className={col.align ? `text-${col.align}` : ''}>
                                    {col.render(item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
