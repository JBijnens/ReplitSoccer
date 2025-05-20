import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceToggleProps {
  currentStatus: string;
  onUpdateStatus: (status: string) => void;
  isPending?: boolean;
  small?: boolean;
}

const AttendanceToggle = ({ 
  currentStatus, 
  onUpdateStatus, 
  isPending = false,
  small = false
}: AttendanceToggleProps) => {
  const isAttending = currentStatus === "attending";
  const isNotAttending = currentStatus === "notAttending";
  
  return (
    <div className={cn(
      "flex rounded-md overflow-hidden border",
      small ? "text-xs" : "text-sm"
    )}>
      <Button
        type="button"
        variant="ghost"
        size={small ? "sm" : "default"}
        className={cn(
          "py-1 px-3 font-medium rounded-none border-0",
          isAttending 
            ? "bg-status-attending text-white hover:bg-status-attending hover:text-white" 
            : "bg-white text-neutral-dark hover:bg-muted"
        )}
        onClick={() => onUpdateStatus("attending")}
        disabled={isPending}
      >
        {isPending && isAttending ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <Check className={cn("mr-1", small ? "h-3 w-3" : "h-4 w-4")} />
        )}
        Yes
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size={small ? "sm" : "default"}
        className={cn(
          "py-1 px-3 font-medium rounded-none border-0",
          isNotAttending 
            ? "bg-status-not-attending text-white hover:bg-status-not-attending hover:text-white" 
            : "bg-white text-neutral-dark hover:bg-muted"
        )}
        onClick={() => onUpdateStatus("notAttending")}
        disabled={isPending}
      >
        {isPending && isNotAttending ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <X className={cn("mr-1", small ? "h-3 w-3" : "h-4 w-4")} />
        )}
        No
      </Button>
    </div>
  );
};

export default AttendanceToggle;
