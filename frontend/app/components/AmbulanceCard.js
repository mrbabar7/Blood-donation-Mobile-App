import React from "react";
import { Truck } from "lucide-react-native";
import ConstantCard from "./ConstantCard";

export default function AmbulanceCard({
  ambulance,
  onOpenMap,
  onSelect,
  onCall,
}) {
  return (
    <ConstantCard
      item={ambulance}
      openMap={(addr, name) =>
        onOpenMap(
          name,
          addr,
          ambulance.phone || ambulance.whatsapp,
          ambulance.formType,
        )
      }
      handleCall={onCall}
      onSelectSpecs={onSelect}
      icon={Truck}
      themeColor="#DC2626"
      specsLabel="Available Services"
    />
  );
}
