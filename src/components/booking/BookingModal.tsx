"use client";

import { useState, useEffect } from "react";
import { Car } from "@/services/carService";
import SidebarBookingForm from "./SidebarBookingForm";
import { CalendarCheck } from "lucide-react";
import Button from "@/components/ui/Button";

interface BookingModalProps {
  car: Car;
}

export default function BookingModal({ car }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Empêcher le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Bouton de réservation principal */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="primary"
        size="lg"
        fullWidth
        icon={<CalendarCheck size={24} />}
        iconPosition="left"
      >
        Réserver maintenant
      </Button>

      {/* Overlay & Popup - Centered on screen */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            className="bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              margin: 'auto',
            }}
          >
            <SidebarBookingForm 
              car={car} 
              onClose={() => setIsOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
}
