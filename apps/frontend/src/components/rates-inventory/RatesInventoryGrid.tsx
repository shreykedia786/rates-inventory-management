import React, { useState, useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridApi,
  ColumnApi as GridColumnApi,
  GridReadyEvent,
  CellValueChangedEvent,
  SelectionChangedEvent,
  ValueGetterParams,
  ValueSetterParams,
  CellClassParams,
} from 'ag-grid-community';
import { format, parseISO, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { 
  Calendar,
  Download,
  Upload,
  Copy,
  Trash2,
  RefreshCw,
  Filter,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Package,
  Clock,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useRatesInventory } from '@/hooks/useRatesInventory';
import { useAuth } from '@/hooks/useAuth';
import { RateInventoryData, BulkUpdateOperation } from '@/types/rates-inventory';

// AG Grid theme and styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';

/**
 * Rates & Inventory Grid Component for Phase 1
 * 
 * Implements:
 * - Spreadsheet-like interface with AG Grid
 * - Inline editing for rates, inventory, and restrictions
 * - Real-time validation and error handling
 * - Bulk operations and selection
 * - Channel sync status monitoring
 * - AI suggestions integration
 * - Keyboard navigation and shortcuts
 * 
 * @author UNO Team
 * @version 1.0.0
 */

interface RatesInventoryGridProps {
  propertyId: string;
  dateRange: { start: Date; end: Date };
  onDataChange?: (changes: any[]) => void;
  onBulkOperation?: (operation: string, data: any) => void;
}

export const RatesInventoryGrid: React.FC<RatesInventoryGridProps> = ({
  propertyId,
  dateRange,
  onDataChange,
  onBulkOperation,
}) => {
  const { user } = useAuth();
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<GridColumnApi | null>(null);
  
  // State management
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(propertyId);
  const [dateRangeState, setDateRangeState] = useState({
    startDate: dateRange.start,
    endDate: dateRange.end,
  });
  const [selectedRows, setSelectedRows] = useState<RateInventoryData[]>([]);
  const [bulkOperation, setBulkOperation] = useState<BulkUpdateOperation | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Data fetching
  const {
    data: ratesInventoryData,
    isLoading,
    error,
    refetch,
    updateRateInventory,
    bulkUpdateRatesInventory,
    isUpdating,
  } = useRatesInventory(selectedPropertyId, {
    startDate: dateRangeState.startDate,
    endDate: dateRangeState.endDate,
  });

  // Custom cell renderers
  const SyncStatusRenderer = (params: any) => {
    const status = params.value;
    const getStatusConfig = (status: string) => {
      switch (status) {
        case 'SUCCESS':
          return { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Synced' };
        case 'PENDING':
          return { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
        case 'FAILED':
          return { icon: AlertTriangle, color: 'bg-red-100 text-red-800', text: 'Failed' };
        default:
          return { icon: Clock, color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
      }
    };

    if (!status) return null;

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const AiSuggestionRenderer = (params: any) => {
    const suggestion = params.value;
    const currentRate = params.data.rate;
    
    if (!suggestion) return null;

    const difference = suggestion - currentRate;
    const percentChange = ((difference / currentRate) * 100).toFixed(1);
    const isIncrease = difference > 0;

    return (
      <div className="flex items-center gap-2">
        <span className="font-medium">${suggestion.toFixed(2)}</span>
        <Badge 
          className={`text-xs ${
            isIncrease 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isIncrease ? '+' : ''}{percentChange}%
        </Badge>
      </div>
    );
  };

  const BooleanRenderer = (params: any) => {
    return (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={params.value}
          onChange={(e) => {
            params.setValue(e.target.checked);
          }}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </div>
    );
  };

  // Column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Date',
      field: 'date',
      width: 120,
      pinned: 'left',
      cellClass: 'font-medium',
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      headerName: 'Room Type',
      field: 'roomType.name',
      width: 150,
      pinned: 'left',
      cellRenderer: (params: any) => (
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="font-medium">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Rate Plan',
      field: 'ratePlan.name',
      width: 150,
      pinned: 'left',
    },
    {
      headerName: 'Rate ($)',
      field: 'rate',
      width: 100,
      editable: true,
      type: 'numericColumn',
      cellClass: 'text-right font-medium',
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '';
      },
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 10000,
        precision: 2,
      },
    },
    {
      headerName: 'Inventory',
      field: 'inventory',
      width: 100,
      editable: true,
      type: 'numericColumn',
      cellClass: 'text-right',
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 1000,
      },
    },
    {
      headerName: 'Min LOS',
      field: 'minStay',
      width: 90,
      editable: true,
      type: 'numericColumn',
      cellClass: 'text-center',
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 1,
        max: 30,
      },
    },
    {
      headerName: 'Max LOS',
      field: 'maxStay',
      width: 90,
      editable: true,
      type: 'numericColumn',
      cellClass: 'text-center',
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 1,
        max: 365,
      },
    },
    {
      headerName: 'CTA',
      field: 'closedToArrival',
      width: 80,
      editable: true,
      cellRenderer: BooleanRenderer,
      cellClass: 'text-center',
    },
    {
      headerName: 'CTD',
      field: 'closedToDeparture',
      width: 80,
      editable: true,
      cellRenderer: BooleanRenderer,
      cellClass: 'text-center',
    },
    {
      headerName: 'Stop Sell',
      field: 'stopSell',
      width: 90,
      editable: true,
      cellRenderer: BooleanRenderer,
      cellClass: 'text-center',
    },
    {
      headerName: 'Competitor Rate',
      field: 'competitorRate',
      width: 130,
      cellClass: 'text-right text-gray-600',
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : 'N/A';
      },
    },
    {
      headerName: 'AI Suggestion',
      field: 'aiSuggestion',
      width: 140,
      cellRenderer: AiSuggestionRenderer,
    },
    {
      headerName: 'Sync Status',
      field: 'syncStatus',
      width: 120,
      cellRenderer: SyncStatusRenderer,
    },
  ], []);

  // Grid event handlers
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    
    // Auto-size columns
    params.api.sizeColumnsToFit();
  }, []);

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    const { data, colDef, newValue, oldValue } = event;
    
    // Validate the change
    const validationError = validateCellValue(colDef.field!, newValue, data);
    if (validationError) {
      setValidationErrors(prev => ({
        ...prev,
        [`${data.id}_${colDef.field}`]: validationError,
      }));
      // Revert the change
      event.node.setDataValue(colDef.field!, oldValue);
      return;
    }

    // Clear any existing validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${data.id}_${colDef.field}`];
      return newErrors;
    });

    // Trigger data change callback
    onDataChange?.([{
      id: data.id,
      field: colDef.field,
      oldValue,
      newValue,
    }]);

    // Update sync status to pending
    event.node.setDataValue('syncStatus', 'PENDING');
  }, [onDataChange]);

  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  }, []);

  // Validation function
  const validateCellValue = (field: string, value: any, rowData: RateInventoryData): string | null => {
    switch (field) {
      case 'rate':
        if (value < 0) return 'Rate cannot be negative';
        if (value > 10000) return 'Rate cannot exceed $10,000';
        break;
      case 'inventory':
        if (value < 0) return 'Inventory cannot be negative';
        if (value > 1000) return 'Inventory cannot exceed 1,000';
        break;
      case 'minStay':
        if (value && rowData.maxStay && value > rowData.maxStay) {
          return 'Min LOS cannot be greater than Max LOS';
        }
        break;
      case 'maxStay':
        if (value && rowData.minStay && value < rowData.minStay) {
          return 'Max LOS cannot be less than Min LOS';
        }
        break;
    }
    return null;
  };

  // Bulk operations
  const handleBulkRateAdjustment = () => {
    if (selectedRows.length === 0) return;
    
    const adjustment = prompt('Enter rate adjustment (e.g., +10, -5, 10%)');
    if (!adjustment) return;

    onBulkOperation?.('rate_adjustment', {
      rows: selectedRows,
      adjustment,
    });
  };

  const handleBulkInventoryUpdate = () => {
    if (selectedRows.length === 0) return;
    
    const inventory = prompt('Enter new inventory value');
    if (!inventory) return;

    onBulkOperation?.('inventory_update', {
      rows: selectedRows,
      inventory: parseInt(inventory),
    });
  };

  const handleApplyAiSuggestions = () => {
    if (selectedRows.length === 0) return;

    const rowsWithSuggestions = selectedRows.filter(row => row.aiSuggestion);
    if (rowsWithSuggestions.length === 0) {
      alert('No AI suggestions available for selected rows');
      return;
    }

    onBulkOperation?.('apply_ai_suggestions', {
      rows: rowsWithSuggestions,
    });
  };

  const handleSyncToChannels = () => {
    if (selectedRows.length === 0) return;

    onBulkOperation?.('sync_to_channels', {
      rows: selectedRows,
    });
  };

  const handleCopyRates = useCallback(() => {
    if (!selectedRows.length) return;
    
    // Copy selected data to clipboard
    const csvData = selectedRows.map(row => 
      `${row.date},${row.roomType.name},${row.ratePlan.name},${row.rate},${row.inventory}`
    ).join('\n');
    
    navigator.clipboard.writeText(csvData);
  }, [selectedRows]);

  const handleExport = useCallback(() => {
    if (!gridApi) return;
    
    gridApi.exportDataAsCsv({
      fileName: `rates-inventory-${format(new Date(), 'yyyy-MM-dd')}.csv`,
      columnSeparator: ',',
    });
  }, [gridApi]);

  // Default column properties
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    cellClass: 'cell-wrap-text',
    autoHeight: true,
  }), []);

  // Grid options
  const gridOptions = useMemo(() => ({
    enableRangeSelection: true,
    enableFillHandle: true,
    enableRangeHandle: true,
    suppressMultiRangeSelection: false,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    animateRows: true,
    rowHeight: 50,
    headerHeight: 60,
  }), []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load rates and inventory data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Rates & Inventory Management
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={!ratesInventoryData?.data.length}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Bulk Operations Toolbar */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-900">
                  {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyRates}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkRateAdjustment}
                  disabled={selectedRows.length === 0}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Bulk Rate Adjustment
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkInventoryUpdate}
                  disabled={selectedRows.length === 0}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Update Inventory
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyAiSuggestions}
                  disabled={selectedRows.length === 0}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Apply AI Suggestions
                </Button>
              </div>
            </div>
          )}
          
          {/* Grid Container */}
          <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={ratesInventoryData?.data || []}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              gridOptions={gridOptions}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              onSelectionChanged={onSelectionChanged}
              loading={isLoading}
              suppressLoadingOverlay={!isLoading}
              loadingOverlayComponent="agLoadingOverlay"
              noRowsOverlayComponent="agNoRowsOverlay"
            />
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div>
              Total: {ratesInventoryData?.data.length || 0} records
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                Synced
              </div>
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 text-yellow-500 mr-1" />
                Pending
              </div>
              <div className="flex items-center">
                <XCircle className="w-4 h-4 text-red-500 mr-1" />
                Failed
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 