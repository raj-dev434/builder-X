import React from 'react';
import { InvoiceBlock as InvoiceBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';

interface InvoiceBlockProps {
    block: InvoiceBlockType;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<InvoiceBlockType>) => void;
    onDelete: () => void;
}

export const InvoiceBlock: React.FC<InvoiceBlockProps> = ({
    block,
    isSelected,
    onSelect,
    onUpdate,
    onDelete
}) => {
    const {
        invoiceNumber, invoiceDate, dueDate, status,
        companyName, companyAddress,
        clientName, clientAddress,
        items = [],
        currency = '$', taxRate = 0, discount = 0, notes,
        backgroundColor, padding, borderRadius, borderWidth, borderColor, boxShadow
    } = block.props;

    // Calculations
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = discount;
    const total = subtotal + taxAmount - discountAmount;

    return (
        <BaseBlock
            block={block}
            isSelected={isSelected}
            onSelect={onSelect}
            onUpdate={(updates) => onUpdate(updates as Partial<InvoiceBlockType>)}
            onDelete={onDelete}
            className="w-full"
        >
            <div
                className="invoice-container flex flex-col gap-6"
                style={{
                    backgroundColor: backgroundColor || '#fff',
                    padding: padding || '2rem',
                    borderRadius,
                    borderWidth,
                    borderColor,
                    borderStyle: 'solid',
                    boxShadow,
                    fontFamily: block.props.fontFamily
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
                        <p className="text-gray-500 text-sm">#{invoiceNumber}</p>
                        {status && (
                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded uppercase font-semibold
                        ${status === 'paid' ? 'bg-green-100 text-green-700' :
                                    status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                    `}>
                                {status}
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <h3 className="font-bold text-gray-800">{companyName}</h3>
                        <p className="text-gray-500 text-sm whitespace-pre-line">{companyAddress}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Bill To</h4>
                        <p className="font-semibold text-gray-800">{clientName}</p>
                        <p className="text-gray-500 text-sm whitespace-pre-line">{clientAddress}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Date</h4>
                            <p className="text-gray-700 font-medium">{invoiceDate}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Due Date</h4>
                            <p className="text-gray-700 font-medium">{dueDate}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-xs font-bold text-gray-400 uppercase">
                                <th className="py-2">Description</th>
                                <th className="py-2 text-center">Qty</th>
                                <th className="py-2 text-right">Price</th>
                                <th className="py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y">
                            {items.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    <td className="py-3 pr-4">{item.description}</td>
                                    <td className="py-3 text-center">{item.quantity}</td>
                                    <td className="py-3 text-right">{currency}{item.price.toFixed(2)}</td>
                                    <td className="py-3 text-right font-medium">{currency}{(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="border-t pt-4 flex justify-end">
                    <div className="w-48 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{currency}{subtotal.toFixed(2)}</span>
                        </div>
                        {taxRate > 0 && (
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax ({taxRate}%)</span>
                                <span>{currency}{taxAmount.toFixed(2)}</span>
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Discount</span>
                                <span>-{currency}{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>{currency}{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {notes && (
                    <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                        <p>{notes}</p>
                    </div>
                )}
            </div>
        </BaseBlock>
    );
};
