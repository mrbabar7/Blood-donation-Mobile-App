import React from "react";
import { Building2 } from "lucide-react-native";
import ConstantCard from "./ConstantCard";

export default function BankCard({ bank, onOpenMap, onSelect, onCall }) {
  return (
    <ConstantCard
      item={bank}
      openMap={(addr, name) =>
        onOpenMap(name, addr, bank.phone || bank.whatsapp, bank.formType)
      }
      handleCall={onCall}
      onSelectSpecs={onSelect}
      icon={Building2}
      themeColor="#DC2626"
      specsLabel="Available Services"
    />
  );
}
