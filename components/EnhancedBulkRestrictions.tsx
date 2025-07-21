/**
 * Enhanced Bulk Restrictions Component
 * Provides comprehensive save and publish functionality for bulk restrictions
 */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, X, Plus, Save, Upload, Calendar, Building, Settings, Eye, 
  Trash2, Clock, MapPin, Target, ChevronDown, ChevronUp 
} from 'lucide-react';

// Types
interface RestrictionType {
  id: string;
  name: string;
  code: string;
  color: 'red' | 'orange' | 'blue' | 'purple';
  description: string;
  needsValue: boolean;
}

interface BulkRestriction {
  id: string;
  restrictionType: RestrictionType;
  value?: string;
  dateRange: { start: string; end: string };
  targets: {
    roomTypes: string[];
    ratePlans: string[];
    channels: string[];
  };
  status: 'active' | 'draft' | 'published';
  createdBy: string;
  createdAt: Date;
  notes?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
  onPublishConfirmation: () => void;
  logEvent: (event: any) => void;
}

const restrictionTypes: RestrictionType[] = [
  { id: 'stop_sell', name: 'Stop Sell', code: 'SS', color: 'red', description: 'Completely stop all sales', needsValue: false },
  { id: 'closed_to_arrival', name: 'Closed to Arrival', code: 'CTA', color: 'orange', description: 'Block new arrivals on selected dates', needsValue: false },
  { id: 'closed_to_departure', name: 'Closed to Departure', code: 'CTD', color: 'orange', description: 'Block departures on selected dates', needsValue: false },
  { id: 'minlos', name: 'Minimum Length of Stay', code: 'MLOS', color: 'blue', description: 'Set minimum nights required', needsValue: true },
  { id: 'maxlos', name: 'Maximum Length of Stay', code: 'MAXLOS', color: 'blue', description: 'Set maximum nights allowed', needsValue: true },
  { id: 'booking_window', name: 'Advance Booking Window', code: 'ABW', color: 'purple', description: 'Set advance booking requirements', needsValue: true }
];

export default function EnhancedBulkRestrictions({ 
  isOpen, 
  onClose, 
  isDark = false, 
  onPublishConfirmation,
  logEvent 
}: Props) {
  const [selectedRestrictionType, setSelectedRestrictionType] = useState<RestrictionType | null>(null);
  const [restrictionForm, setRestrictionForm] = useState({
    value: '',
    dateRange: { start: '', end: '' },
    roomTypes: [] as string[],
    ratePlans: [] as string[],
    channels: [] as string[],
    notes: ''
  });
  const [bulkRestrictions, setBulkRestrictions] = useState<BulkRestriction[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  const handleCreateRestriction = () => {
    console.log('Creating restriction with form data:', restrictionForm);
    console.log('Selected restriction type:', selectedRestrictionType);
    
    // Enhanced validation with specific error messages
    const errors: string[] = [];
    
    if (!selectedRestrictionType) {
      errors.push('Please select a restriction type');
    }
    
    if (!restrictionForm.dateRange.start || !restrictionForm.dateRange.end) {
      errors.push('Please select both start and end dates');
    }
    
    if (restrictionForm.dateRange.start && restrictionForm.dateRange.end) {
      const startDate = new Date(restrictionForm.dateRange.start);
      const endDate = new Date(restrictionForm.dateRange.end);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        errors.push('Start date cannot be in the past');
      }
      
      if (endDate < startDate) {
        errors.push('End date must be after start date');
      }
      
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 365) {
        errors.push('Date range cannot exceed 365 days');
      }
    }
    
    // Check if restriction needs a value
    if (selectedRestrictionType && selectedRestrictionType.needsValue) {
      if (!restrictionForm.value || parseInt(restrictionForm.value) <= 0) {
        errors.push(`Please enter a valid ${selectedRestrictionType.name.toLowerCase()} value`);
      }
      
      const maxValue = selectedRestrictionType.id === 'booking_window' ? 365 : 30;
      if (parseInt(restrictionForm.value) > maxValue) {
        errors.push(`${selectedRestrictionType.name} cannot exceed ${maxValue} ${selectedRestrictionType.id === 'booking_window' ? 'days' : 'nights'}`);
      }
    }
    
    if (restrictionForm.roomTypes.length === 0 && restrictionForm.ratePlans.length === 0 && restrictionForm.channels.length === 0) {
      errors.push('Please select at least one room type, rate plan, or channel');
    }
    
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    // Create the restriction
    const newRestriction: BulkRestriction = {
      id: `restriction-${Date.now()}`,
      restrictionType: selectedRestrictionType!,
      value: restrictionForm.value || undefined,
      dateRange: restrictionForm.dateRange,
      targets: {
        roomTypes: restrictionForm.roomTypes,
        ratePlans: restrictionForm.ratePlans,
        channels: restrictionForm.channels
      },
      status: 'draft',
      createdBy: 'Current User',
      createdAt: new Date(),
      notes: restrictionForm.notes
    };

    setBulkRestrictions(prev => [...prev, newRestriction]);

    // Log the event
    logEvent({
      eventType: 'bulk_restriction_added',
      roomType: restrictionForm.roomTypes.join(', '),
      ratePlan: restrictionForm.ratePlans.join(', '),
      channel: restrictionForm.channels.join(', '),
      dateAffected: `${restrictionForm.dateRange.start} to ${restrictionForm.dateRange.end}`,
      newValue: restrictionForm.value || selectedRestrictionType!.name,
      source: 'bulk_operation',
      metadata: {
        restrictionType: selectedRestrictionType!.id,
        affectedCells: (restrictionForm.roomTypes.length + restrictionForm.ratePlans.length + restrictionForm.channels.length) * 
                       Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))
      },
      severity: 'medium',
      category: 'restrictions',
      description: `Added ${selectedRestrictionType!.name} restriction to ${restrictionForm.roomTypes.length + restrictionForm.ratePlans.length + restrictionForm.channels.length} targets for ${Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days`
    });

    // Reset form
    setSelectedRestrictionType(null);
    setRestrictionForm({
      value: '',
      dateRange: { start: '', end: '' },
      roomTypes: [],
      ratePlans: [],
      channels: [],
      notes: ''
    });
    
    alert(`✅ Restriction "${selectedRestrictionType!.name}" added successfully!`);
  };

  const handleSaveDraft = () => {
    console.log('Saving restrictions as draft:', bulkRestrictions);
    
    // Update all restrictions to draft status
    setBulkRestrictions(prev => prev.map(r => ({ ...r, status: 'draft' as const })));
    
    // Log the save draft event
    logEvent({
      eventType: 'bulk_restrictions_saved_draft',
      roomType: 'Multiple',
      ratePlan: 'Multiple', 
      channel: 'Multiple',
      dateAffected: 'Multiple Dates',
      newValue: `${bulkRestrictions.length} restrictions (draft)`,
      source: 'bulk_operation',
      metadata: {
        restrictionsCount: bulkRestrictions.length,
        restrictionTypes: bulkRestrictions.map(r => r.restrictionType.id),
        totalTargets: bulkRestrictions.reduce((acc, r) => acc + Object.values(r.targets).flat().length, 0),
        status: 'draft'
      },
      severity: 'low',
      category: 'restrictions',
      description: `Saved ${bulkRestrictions.length} bulk restrictions as draft`
    });

    alert(`✅ ${bulkRestrictions.length} restriction(s) saved as draft!\n\nYou can continue editing or publish them later.`);
  };

  const handleSaveAndPublish = () => {
    if (bulkRestrictions.length === 0) {
      alert('Please add at least one restriction before publishing.');
      return;
    }
    
    console.log('Publishing restrictions:', bulkRestrictions);
    
    // Update all restrictions to published status
    setBulkRestrictions(prev => prev.map(r => ({ ...r, status: 'published' as const })));
    
    // Log the publish event
    logEvent({
      eventType: 'bulk_restrictions_published',
      roomType: 'Multiple',
      ratePlan: 'Multiple',
      channel: 'Multiple',
      dateAffected: 'Multiple Dates',
      newValue: `${bulkRestrictions.length} restrictions`,
      source: 'bulk_operation',
      metadata: {
        restrictionsCount: bulkRestrictions.length,
        restrictionTypes: bulkRestrictions.map(r => r.restrictionType.id),
        totalTargets: bulkRestrictions.reduce((acc, r) => acc + Object.values(r.targets).flat().length, 0),
        publishedAt: new Date().toISOString()
      },
      severity: 'high',
      category: 'restrictions',
      description: `Published ${bulkRestrictions.length} bulk restrictions affecting multiple targets`
    });

    // Show success message
    alert(`🚀 Successfully published ${bulkRestrictions.length} restriction(s)!\n\nRestrictions are now active and will be applied to your property management system.`);
    
    // Trigger publish confirmation
    onPublishConfirmation();
    
    // Clear restrictions and close modal
    setBulkRestrictions([]);
    setSelectedRestrictionType(null);
    setRestrictionForm({
      value: '',
      dateRange: { start: '', end: '' },
      roomTypes: [],
      ratePlans: [],
      channels: [],
      notes: ''
    });
    onClose();
  };

  const handleDeleteRestriction = (restrictionId: string) => {
    setBulkRestrictions(prev => prev.filter(r => r.id !== restrictionId));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Enhanced Bulk Restrictions</h2>
                <p className="text-orange-100 mt-1">Apply, save, and publish restrictions to multiple targets</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - simplified for example */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="text-center py-8">
            <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Enhanced Bulk Restrictions Component
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This is the enhanced version with proper save and publish functionality.
              <br />
              You can integrate this component into your main page to replace the existing one.
            </p>
            
            {bulkRestrictions.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  {bulkRestrictions.length} restriction(s) ready to save/publish
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Footer with Save & Publish */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          {/* Main Action Buttons Row */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            
            <div className="flex items-center gap-3">
              {/* Add More Restrictions Button */}
              <button
                onClick={() => {
                  // Simulate adding a restriction
                  const newRestriction: BulkRestriction = {
                    id: `restriction-${Date.now()}`,
                    restrictionType: restrictionTypes[0],
                    dateRange: { start: '2024-02-01', end: '2024-02-05' },
                    targets: { roomTypes: ['Deluxe Room'], ratePlans: ['BAR'], channels: ['Direct'] },
                    status: 'draft',
                    createdBy: 'Current User',
                    createdAt: new Date(),
                  };
                  setBulkRestrictions(prev => [...prev, newRestriction]);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Restriction
              </button>

              {/* Save Draft Button */}
              <button
                onClick={handleSaveDraft}
                disabled={bulkRestrictions.length === 0}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>

              {/* Save & Publish Button */}
              <button
                onClick={handleSaveAndPublish}
                disabled={bulkRestrictions.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Upload className="w-4 h-4" />
                Save & Publish
              </button>
            </div>
          </div>

          {/* Status Information Row */}
          <div className="flex justify-between items-center text-xs">
            <div className="text-gray-500 dark:text-gray-400">
              💡 Enhanced: Add multiple restrictions, save as draft, or publish to activate
            </div>
            
            {bulkRestrictions.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {bulkRestrictions.length} restriction(s) ready
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  Draft status
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 