import { useContext } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/App";
import MatchCard from "@/components/MatchCard";
import TeamTable from "@/components/TeamTable";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Fetch upcoming matches
  const { data: upcomingMatches, isLoading: isLoadingMatches } = useQuery({
    queryKey: ["/api/matches/upcoming?limit=3"],
  });
  
  // Fetch team members
  const { data: players, isLoading: isLoadingPlayers } = useQuery({
    queryKey: ["/api/players"],
  });
  
  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      {/* Upcoming Matches Section */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-dark">Upcoming Matches</h2>
          <div className="mt-2 sm:mt-0">
            <Link href="/matches" className="text-primary hover:text-primary-light font-medium flex items-center">
              View all matches <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {isLoadingMatches ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
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
        ) : upcomingMatches?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} currentUserId={user.id} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No upcoming matches found.</p>
              {user.isAdmin && (
                <Link href="/add-match" className="text-primary hover:text-primary-light font-medium flex items-center justify-center">
                  Add a new match <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </section>
      
      {/* Team Members Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-dark">Team Members</h2>
          <div className="mt-2 sm:mt-0">
            <Link href="/team" className="text-primary hover:text-primary-light font-medium flex items-center">
              View all team members <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {isLoadingPlayers ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-light">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Attendance Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-neutral-light">
                    {[...Array(4)].map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="ml-4">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-4 w-24 mt-1" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-20" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-2.5 w-full rounded-full" />
                          <Skeleton className="h-4 w-24 mt-1" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <TeamTable players={players || []} limit={4} />
        )}
      </section>
    </main>
  );
};

export default Dashboard;
