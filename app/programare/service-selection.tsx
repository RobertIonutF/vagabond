/* /app/programare/service-selection.tsx */
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type ServiceSelectionProps = {
  services: Service[];
  onSelectionChange: (selectedServices: string[]) => void;
};

export default function ServiceSelection({ services, onSelectionChange }: ServiceSelectionProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices(prev => {
      const newSelection = prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      onSelectionChange(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Selectează serviciile</h3>
      {services.map(service => (
        <div key={service.id} className="flex items-center space-x-2">
          <Checkbox
            id={service.id}
            checked={selectedServices.includes(service.id)}
            onCheckedChange={() => handleServiceChange(service.id)}
          />
          <Label htmlFor={service.id} className="flex-grow">{service.name}</Label>
          <Badge variant="outline">{service.price} RON</Badge>
          <Badge variant="secondary">{service.duration} min</Badge>
        </div>
      ))}
    </div>
  );
}