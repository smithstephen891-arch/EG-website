"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DonationState {
  amount: number;
  type: "one-time" | "monthly";
  paymentMethod: string;
  donorName: string;
  donorEmail: string;
}

interface DonationContextType {
  donation: DonationState;
  setDonation: (donation: Partial<DonationState>) => void;
  resetDonation: () => void;
}

const defaultDonation: DonationState = {
  amount: 0,
  type: "one-time",
  paymentMethod: "",
  donorName: "",
  donorEmail: "",
};

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [donation, setDonationState] = useState<DonationState>(defaultDonation);

  const setDonation = (updates: Partial<DonationState>) => {
    setDonationState((prev) => ({ ...prev, ...updates }));
  };

  const resetDonation = () => {
    setDonationState(defaultDonation);
  };

  return (
    <DonationContext.Provider value={{ donation, setDonation, resetDonation }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
}
