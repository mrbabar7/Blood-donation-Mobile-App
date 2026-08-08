import React from "react";
import { Building2 } from "lucide-react-native";
import ConstantCard from "./ConstantCard";

export default function NgoCard({ ngo, onOpenMap, onSelect, onCall }) {
  return (
    <ConstantCard
      item={ngo}
      openMap={(addr, name) =>
        onOpenMap(name, addr, ngo.phone || ngo.whatsapp, ngo.formType)
      }
      handleCall={onCall}
      onSelectSpecs={onSelect}
      icon={Building2}
      themeColor="#DC2626"
      specsLabel="Available Services"
    />
  );
}
