import { useContext } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/App";
import MatchCard from "@/components/MatchCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

const Matches = () => {
  const { user } = useContext(AuthContext);
  
  // Mock data for demonstration
  const matches = [
    {
      id: 1,
      date: new Date("2025-06-10T18:00:00"),
      time: "6:00 PM",
      opponent: "FC Thunder",
      location: "Main Stadium",
      details: "Important match against our rivals",
      createdBy: 1,
      attendees: [
        {
          id: 1,
          name: "Alex Johnson",
          email: "alex@example.com",
          picture: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
        }
      ],
      userAttendance: { status: "attending" },
      attendanceCount: { attending: 1, total: 2 }
    },
    {
      id: 2,
      date: new Date("2025-06-18T19:30:00"),
      time: "7:30 PM",
      opponent: "United FC",
      location: "Lincoln Park Field",
      details: "Away game - carpool available",
      createdBy: 1,
      attendees: [],
      userAttendance: { status: "pending" },
      attendanceCount: { attending: 0, total: 2 }
    },
    {
      id: 3,
      date: new Date("2025-06-25T17:00:00"),
      time: "5:00 PM",
      opponent: "City Warriors",
      location: "Community Field",
      details: "Season finale match",
      createdBy: 1,
      attendees: [],
      userAttendance: { status: "pending" },
      attendanceCount: { attending: 0, total: 2 }
    },
    {
      id: 4,
      date: new Date("2025-05-15T18:30:00"),
      time: "6:30 PM",
      opponent: "Eagles FC",
      location: "Home Stadium",
      details: "Past match",
      createdBy: 1,
      attendees: [
        {
          id: 1,
          name: "Alex Johnson",
          email: "alex@example.com",
          picture: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
        },
        {
          id: 2,
          name: "Emma Wilson", 
          email: "emma@example.com",
          picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128"
        }
      ],
      userAttendance: { status: "attending" },
      attendanceCount: { attending: 2, total: 2 }
    }
  ];
  
  const isLoading = false;
  
  // Split matches into upcoming and past
  const now = new Date();
  const upcomingMatches = matches?.filter(
    (match) => new Date(match.date) >= now
  ) || [];
  const pastMatches = matches?.filter(
    (match) => new Date(match.date) < now
  ) || [];
  
  // Sort matches by date
  upcomingMatches.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  pastMatches.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-dark">All Matches</h1>
        {user.isAdmin && (
          <div className="mt-2 sm:mt-0">
            <Link href="/add-match">
              <Button size="sm" className="flex items-center">
                <PlusCircle className="mr-1 h-4 w-4" />
                Add new match
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-0">
                <div className="p-4 border-b border-neutral-light bg-primary text-white">
                  <Skeleton className="h-5 w-32 bg-primary-light" />
                  <Skeleton className="h-6 w-40 mt-2 bg-primary-light" />
                  <Skeleton className="h-5 w-36 mt-1 bg-primary-light" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <div className="flex flex-wrap mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-8 rounded-full mr-1 mb-1" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Upcoming Matches */}
          {upcomingMatches.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} currentUserId={user.id} />
                ))}
              </div>
            </section>
          )}
          
          {/* Past Matches */}
          {pastMatches.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Past Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastMatches.map((match) => (
                  <MatchCard key={match.id} match={match} currentUserId={user.id} isPast={true} />
                ))}
              </div>
            </section>
          )}
          
          {/* No matches */}
          {upcomingMatches.length === 0 && pastMatches.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No matches found.</p>
                {user.isAdmin && (
                  <Link href="/add-match">
                    <Button className="flex items-center">
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Add new match
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </main>
  );
};

export default Matches;
