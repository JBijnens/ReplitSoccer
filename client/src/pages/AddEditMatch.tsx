import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { format, parse } from "date-fns";
import { AuthContext } from "@/App";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Form schema
const matchFormSchema = z.object({
  date: z.string().nonempty("Date is required"),
  time: z.string().nonempty("Time is required"),
  opponent: z.string().nonempty("Opponent name is required"),
  location: z.string().nonempty("Location is required"),
  details: z.string().optional(),
});

type MatchFormValues = z.infer<typeof matchFormSchema>;

interface AddEditMatchProps {
  id?: number;
}

const AddEditMatch = ({ id }: AddEditMatchProps) => {
  const { user } = useContext(AuthContext);
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id;
  
  // Fetch match if editing
  const { data: match, isLoading: isLoadingMatch } = useQuery({
    queryKey: [`/api/matches/${id}`],
    enabled: isEditing,
  });
  
  // Create form
  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      date: "",
      time: "",
      opponent: "",
      location: "",
      details: "",
    },
  });
  
  // Update form when match data is loaded
  useEffect(() => {
    if (match && isEditing) {
      form.reset({
        date: format(new Date(match.date), "yyyy-MM-dd"),
        time: match.time,
        opponent: match.opponent,
        location: match.location,
        details: match.details || "",
      });
    }
  }, [match, form, isEditing]);
  
  // Create mutation
  const createMatch = useMutation({
    mutationFn: async (values: MatchFormValues) => {
      // Convert date and time to ISO format
      const dateObj = parse(values.time, "HH:mm", new Date(values.date));
      const matchData = {
        ...values,
        date: dateObj.toISOString(),
      };
      
      return apiRequest("POST", "/api/matches", matchData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches/upcoming"] });
      toast({
        title: "Match created",
        description: "The match has been created successfully.",
      });
      navigate("/matches");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create match. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateMatch = useMutation({
    mutationFn: async (values: MatchFormValues) => {
      // Convert date and time to ISO format
      const dateObj = parse(values.time, "HH:mm", new Date(values.date));
      const matchData = {
        ...values,
        date: dateObj.toISOString(),
      };
      
      return apiRequest("PUT", `/api/matches/${id}`, matchData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/matches/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches/upcoming"] });
      toast({
        title: "Match updated",
        description: "The match has been updated successfully.",
      });
      navigate(`/matches/${id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update match. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Check if user is admin
  if (!user.isAdmin) {
    navigate("/matches");
    return null;
  }
  
  const onSubmit = (values: MatchFormValues) => {
    if (isEditing) {
      updateMatch.mutate(values);
    } else {
      createMatch.mutate(values);
    }
  };
  
  const isSubmitting = createMatch.isPending || updateMatch.isPending;
  
  return (
    <div className="flex-grow container mx-auto px-4 py-6">
      <div className="flex justify-start mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(isEditing ? `/matches/${id}` : "/matches")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {isEditing ? "Back to match details" : "Back to matches"}
        </Button>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Match" : "Add New Match"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing && isLoadingMatch ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="opponent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opponent</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. FC Thunder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lincoln Park Field" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional details about the match..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? "Update Match" : "Create Match"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditMatch;
