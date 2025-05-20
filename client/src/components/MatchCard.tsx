import { format, parseISO } from "date-fns";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AttendanceToggle from "./AttendanceToggle";
import { ChevronRight, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchCardProps {
  match: any;
  currentUserId: number;
  isPast?: boolean;
}

const MatchCard = ({ match, currentUserId, isPast = false }: MatchCardProps) => {
  const { toast } = useToast();
  
  // Parse and format date
  const matchDate = format(parseISO(match.date), "EEE, MMM d, yyyy");
  
  // Update attendance mutation
  const updateAttendance = useMutation({
    mutationFn: async (status: string) => {
      return apiRequest("POST", "/api/attendance", {
        matchId: match.id,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/matches/${match.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches/upcoming"] });
      toast({
        title: "Attendance updated",
        description: "Your attendance status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Get current attendance status
  const currentStatus = match.userAttendance?.status || "pending";
  
  // Calculate additional attendees
  const maxVisibleAttendees = 5;
  const additionalAttendees = match.attendees.length > maxVisibleAttendees
    ? match.attendees.length - maxVisibleAttendees
    : 0;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4 border-b border-neutral-light bg-primary text-white">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">{matchDate}</p>
          <p className="text-sm font-medium">{match.time}</p>
        </div>
        <h3 className="text-lg font-bold mt-2">vs. {match.opponent}</h3>
        <p className="text-sm flex items-center mt-1">
          <MapPin className="mr-1 h-4 w-4" />
          {match.location}
        </p>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-neutral-dark">Your Attendance</h4>
          
          {isPast ? (
            <div className="text-sm text-muted-foreground">
              {currentStatus === "attending" ? "Attended" : "Did not attend"}
            </div>
          ) : (
            <AttendanceToggle
              currentStatus={currentStatus}
              onUpdateStatus={(status) => updateAttendance.mutate(status)}
              isPending={updateAttendance.isPending}
              small
            />
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm text-neutral-dark mb-2">
            <span>Team Attendance</span>
            <span className="font-medium">
              {match.attendanceCount.attending} / {match.attendanceCount.total} players
            </span>
          </div>
          
          <div className="flex flex-wrap">
            {match.attendees.slice(0, maxVisibleAttendees).map((player: any, index: number) => (
              <div key={index} className="inline-block relative mr-1 mb-1">
                <Avatar className="h-8 w-8 border-2 border-status-attending">
                  {player.picture ? (
                    <AvatarImage src={player.picture} alt={player.name} />
                  ) : (
                    <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
              </div>
            ))}
            
            {additionalAttendees > 0 && (
              <div className="inline-block relative mr-1 mb-1 bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center text-xs">
                +{additionalAttendees}
              </div>
            )}
            
            {match.attendees.length === 0 && (
              <span className="text-sm text-muted-foreground">No players attending yet</span>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-right">
          <Link href={`/matches/${match.id}`} className="text-primary hover:text-primary-light text-sm font-medium inline-flex items-center">
            View details <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
