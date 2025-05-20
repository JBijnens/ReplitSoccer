import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/App";
import TeamTable from "@/components/TeamTable";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Team = () => {
  const { user } = useContext(AuthContext);
  
  // Mock player data for the team
  const players = [
    {
      id: 1,
      userId: 1,
      user: {
        id: 1,
        name: "Alex Johnson",
        email: "alex@example.com",
        picture: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128"
      },
      position: "Forward",
      status: "Active",
      attendanceRate: 75,
      attendedMatches: 15,
      totalMatches: 20
    },
    {
      id: 2,
      userId: 2,
      user: {
        id: 2,
        name: "Emma Wilson",
        email: "emma@example.com",
        picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128"
      },
      position: "Midfielder",
      status: "Active",
      attendanceRate: 90,
      attendedMatches: 18,
      totalMatches: 20
    },
    {
      id: 3,
      userId: 3,
      user: {
        id: 3,
        name: "Michael Brown",
        email: "michael@example.com",
        picture: null
      },
      position: "Defender",
      status: "Injured",
      attendanceRate: 60,
      attendedMatches: 12,
      totalMatches: 20
    },
    {
      id: 4,
      userId: 4,
      user: {
        id: 4,
        name: "Sophia Garcia",
        email: "sophia@example.com",
        picture: null
      },
      position: "Goalkeeper",
      status: "Active",
      attendanceRate: 85,
      attendedMatches: 17,
      totalMatches: 20
    }
  ];
  
  const isLoading = false;
  
  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-dark">Team Members</h1>
      </div>
      
      {isLoading ? (
        <Card>
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
                {[...Array(8)].map((_, index) => (
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
        </Card>
      ) : (
        <TeamTable players={players || []} />
      )}
    </main>
  );
};

export default Team;
