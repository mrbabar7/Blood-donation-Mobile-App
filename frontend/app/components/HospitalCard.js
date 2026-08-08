import React from "react";
import { Building2 } from "lucide-react-native";
import ConstantCard from "./ConstantCard";

export default function HospitalCard({ hosp, onOpenMap, onSelect, onCall }) {
  return (
    <ConstantCard
      item={hosp}
      openMap={(addr, name) =>
        onOpenMap(name, addr, hosp.phone || hosp.whatsapp, hosp.formType)
      }
      handleCall={onCall}
      onSelectSpecs={onSelect}
      icon={Building2}
      themeColor="#DC2626"
      specsLabel="Available Services"
    />
  );
}
