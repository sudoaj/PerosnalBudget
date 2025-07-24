'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { EXAMPLE_TEMPLATE } from '@/lib/template-data';
import { BudgetItem } from '@/types/budget';

interface TemplateUploadProps {
    onTemplateUpload: (items: Array<Omit<BudgetItem, 'id'>>) => void;
}

export function TemplateUpload({ onTemplateUpload }: TemplateUploadProps) {
    const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);

    const loadExampleTemplate = () => {
        const items = EXAMPLE_TEMPLATE.items.map(item => ({
            name: item.name,
            amount: item.amount,
            category: item.category as any,
            notes: item.notes,
            dueDate: item.dueDate,
            frequency: item.frequency,
            expenseFrequency: item.expenseFrequency,
            paid: item.paid || false,
            balance: item.balance,
            paymentAmount: item.paymentAmount,
        }));

        onTemplateUpload(items);
        setUploadResult({
            success: true,
            message: `Example template loaded successfully with ${items.length} items.`,
        });
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Load Example Data
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={loadExampleTemplate}
                    className="w-full"
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Load Example Template
                </Button>

                {/* Upload Result */}
                {uploadResult && (
                    <div className={`p-3 rounded-lg border ${
                        uploadResult.success 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <div className="flex items-center gap-2">
                            {uploadResult.success ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">
                                {uploadResult.success ? 'Success!' : 'Error'}
                            </span>
                        </div>
                        <p className="text-sm mt-1">{uploadResult.message}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
