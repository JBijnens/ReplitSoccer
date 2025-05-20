import { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format, parseISO } from "date-fns";
import { AuthContext } from "@/App";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import AttendanceToggle from "@/components/AttendanceToggle";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Edit, 
  Trash2, 
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface MatchDetailsProps {
  id: number;
}

const MatchDetails = ({ id }: MatchDetailsProps) => {
  const { user } = useContext(AuthContext);
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch match details
  const { data: match, isLoading, isError } = useQuery({
    queryKey: [`/api/matches/${id}`],
  });
  
  // Fetch match attendances
  const { data: attendances, isLoading: isLoadingAttendances } = useQuery({
    queryKey: [`/api/attendance/match/${id}`],
    enabled: !!match,
  });
  
  // Update attendance mutation
  const updateAttendance = useMutation({
    mutationFn: async (status: string) => {
      return apiRequest("POST", "/api/attendance", {
        matchId: id,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/matches/${id}`] });
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
  
  // Delete match mutation
  const deleteMatch = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/matches/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches/upcoming"] });
      toast({
        title: "Match deleted",
        description: "The match has been deleted successfully.",
      });
      navigate("/matches");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete match. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  if (isError) {
    return (
      <div className="flex-grow container mx-auto px-4 py-6">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">Match not found</h2>
            <p className="text-muted-foreground mb-4">The match you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/matches")}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to matches
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <Card className="max-w-4xl mx-auto mb-6">
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-24 w-full mb-4" />
          </CardContent>
        </Card>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-12 w-12 rounded-full mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Format date and time
  const matchDate = match ? format(parseISO(match.date), "EEEE, MMMM d, yyyy") : "";
  
  // Group attendances by status
  const attending = attendances?.filter(a => a.status === "attending") || [];
  const notAttending = attendances?.filter(a => a.status === "notAttending") || [];
  
  return (
    <div className="flex-grow container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4 sm:mb-0"
          onClick={() => navigate("/matches")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to matches
        </Button>
        
        {user.isAdmin && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/edit-match/${id}`)}
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    match and all associated attendance records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => deleteMatch.mutate()}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      <Card className="max-w-4xl mx-auto mb-6">
        <CardHeader className="bg-primary text-white">
          <CardTitle className="text-2xl mb-2">vs. {match?.opponent}</CardTitle>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{matchDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{match?.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{match?.location}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Your Attendance</h3>
            <AttendanceToggle
              currentStatus={match?.userAttendance?.status || "pending"}
              onUpdateStatus={(status) => updateAttendance.mutate(status)}
              isPending={updateAttendance.isPending}
            />
          </div>
          
          {match?.details && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Match Details</h3>
              <p className="text-muted-foreground">{match.details}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Attendance</CardTitle>
            <div className="text-sm font-medium">
              {attending.length} / {(attending.length + notAttending.length)} players
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAttendances ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-12 w-12 rounded-full mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {attending.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-secondary mb-3">Attending</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {attending.map((attendance) => (
                      <div key={attendance.id} className="flex flex-col items-center">
                        <Avatar className="h-12 w-12 border-2 border-status-attending">
                          {attendance.user?.picture ? (
                            <AvatarImage src={attendance.user.picture} alt={attendance.user.name} />
                          ) : (
                            <AvatarFallback>{attendance.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm mt-1 text-center">{attendance.user?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {notAttending.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-destructive mb-3">Not Attending</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {notAttending.map((attendance) => (
                      <div key={attendance.id} className="flex flex-col items-center">
                        <Avatar className="h-12 w-12 border-2 border-status-not-attending">
                          {attendance.user?.picture ? (
                            <AvatarImage src={attendance.user.picture} alt={attendance.user.name} />
                          ) : (
                            <AvatarFallback>{attendance.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm mt-1 text-center">{attendance.user?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {attending.length === 0 && notAttending.length === 0 && (
                <p className="text-center text-muted-foreground py-6">No attendance records yet.</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchDetails;
