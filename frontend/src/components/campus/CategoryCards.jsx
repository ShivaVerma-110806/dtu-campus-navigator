import React from "react";
import * as Icons from "lucide-react";
import { CATEGORIES } from "./data";
import { cn } from "../../lib/utils";

export default function CategoryCards({ activeId, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CATEGORIES.map((cat) => {
        const IconComponent = Icons[cat.iconName] || Icons.HelpCircle;
        const isActive = cat.id === activeId;

        return (
          <button
            key={cat.id}
            onClick={() => onToggle(isActive ? null : cat.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer select-none w-full",
              "border-border bg-white hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50",
              isActive && "border-primary bg-[rgba(66,133,244,0.05)] hover:bg-[rgba(66,133,244,0.08)]"
            )}
          >
            {/* 32px circular icon chip */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150",
                isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}
            >
              <IconComponent size={16} />
            </div>
            
            <span className="text-[14px] font-medium text-foreground">
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
