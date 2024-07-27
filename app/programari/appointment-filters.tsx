// app/programari/appointment-filters.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

type FilterOptions = {
  status: 'ALL' | 'PENDING' | 'CONFIRMED' | 'PAID';
  startDate: Date | null;
  endDate: Date | null;
  clientName: string;
};

type AppointmentFiltersProps = {
  onFilterChange: (filters: FilterOptions) => void;
};

export function AppointmentFilters({ onFilterChange }: AppointmentFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'ALL',
    startDate: null,
    endDate: null,
    clientName: '',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'ALL',
      startDate: null,
      endDate: null,
      clientName: '',
    });
  };

  return (
    <div className="bg-secondary p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtrează programările</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            onValueChange={(value) => handleFilterChange('status', value)}
            value={filters.status}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Selectează status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toate</SelectItem>
              <SelectItem value="PENDING">În așteptare</SelectItem>
              <SelectItem value="CONFIRMED">Confirmate</SelectItem>
              <SelectItem value="PAID">Plătite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">De la data</Label>
          <DatePicker
            date={filters.startDate as Date}
            onSelect={(date) => handleFilterChange('startDate', date)}
          />
        </div>
        <div>
          <Label htmlFor="endDate">Până la data</Label>
          <DatePicker
            date={filters.endDate as Date}
            onSelect={(date) => handleFilterChange('endDate', date)}
          />
        </div>
        <div>
          <Label htmlFor="clientName">Nume client</Label>
          <Input
            id="clientName"
            value={filters.clientName}
            onChange={(e) => handleFilterChange('clientName', e.target.value)}
            placeholder="Caută după nume"
          />
        </div>
      </div>
      <Button 
        className="mt-4"
        onClick={resetFilters}
      >
        Resetează filtrele
      </Button>
    </div>
  );
}