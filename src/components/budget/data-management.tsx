'use client';

import { useBudgetStore } from '@/store/budget';
import { exportToOrganizedCSV, exportToMarkdown } from '@/lib/export-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileText, Save, FileType, Trash2, AlertTriangle } from 'lucide-react';
import { useRef, useState } from 'react';

export function DataManagement() {
  const {
    template,
    periods,
    clearAll,
    importData,
  } = useBudgetStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleExportMarkdown = () => {
    const data = { template, periods };
    exportToMarkdown(data);
  };

  const handleExportCSV = () => {
    const data = { template, periods };
    exportToOrganizedCSV(data);
  };

  const handleExportJSON = () => {
    const data = {
      template,
      periods,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      importData(data);
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download your budget data in different formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button onClick={handleExportMarkdown} className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Markdown</div>
                <div className="text-xs text-muted-foreground">Organized & readable</div>
              </div>
            </Button>
            
            <Button onClick={handleExportCSV} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileType className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">CSV</div>
                <div className="text-xs text-muted-foreground">Categorized data</div>
              </div>
            </Button>
            
            <Button onClick={handleExportJSON} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Save className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">JSON</div>
                <div className="text-xs text-muted-foreground">Complete backup</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Upload and restore your budget data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="import-file" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Import Budget Data (JSON)</label>
            <Input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              ref={fileInputRef}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions - use with caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={clearAll}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
