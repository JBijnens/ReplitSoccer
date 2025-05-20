import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamTableProps {
  players: any[];
  limit?: number;
}

const TeamTable = ({ players, limit }: TeamTableProps) => {
  // Sort by attendance rate descending
  const sortedPlayers = [...players].sort((a, b) => b.attendanceRate - a.attendanceRate);
  
  // Apply limit if specified
  const displayPlayers = limit ? sortedPlayers.slice(0, limit) : sortedPlayers;
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Injured":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };
  
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-light">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Player
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Attendance Rate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-neutral-light">
            {displayPlayers.map((player) => (
              <tr key={player.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Avatar className="h-10 w-10">
                        {player.user?.picture ? (
                          <AvatarImage src={player.user.picture} alt={player.user.name} />
                        ) : (
                          <AvatarFallback>{player.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-dark">{player.user?.name}</div>
                      <div className="text-sm text-muted-foreground">{player.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-dark">{player.position || "Unassigned"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-secondary h-2.5 rounded-full" 
                      style={{ width: `${player.attendanceRate}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-neutral-dark mt-1">
                    {Math.round(player.attendanceRate)}% ({player.attendedMatches}/{player.totalMatches} matches)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(player.status)}
                  >
                    {player.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TeamTable;
