import { 
  users, type User, type InsertUser,
  matches, type Match, type InsertMatch,
  attendances, type Attendance, type InsertAttendance,
  players, type Player, type InsertPlayer,
  type MatchWithAttendance, type PlayerWithStats
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByProviderId(providerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Match operations
  getMatch(id: number): Promise<Match | undefined>;
  getAllMatches(): Promise<Match[]>;
  getUpcomingMatches(limit?: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<Match>): Promise<Match | undefined>;
  deleteMatch(id: number): Promise<boolean>;
  
  // Attendance operations
  getAttendance(userId: number, matchId: number): Promise<Attendance | undefined>;
  getAttendancesByMatch(matchId: number): Promise<Attendance[]>;
  getAttendancesByUser(userId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(userId: number, matchId: number, status: string): Promise<Attendance | undefined>;
  
  // Player operations
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayerByUserId(userId: number): Promise<Player | undefined>;
  getAllPlayers(): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<Player>): Promise<Player | undefined>;
  
  // Combined operations
  getMatchWithAttendance(matchId: number, userId?: number): Promise<MatchWithAttendance | undefined>;
  getAllMatchesWithAttendance(userId?: number): Promise<MatchWithAttendance[]>;
  getPlayersWithStats(): Promise<PlayerWithStats[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private matches: Map<number, Match>;
  private attendances: Map<string, Attendance>;
  private players: Map<number, Player>;
  private currentUserId: number;
  private currentMatchId: number;
  private currentAttendanceId: number;
  private currentPlayerId: number;

  constructor() {
    this.users = new Map();
    this.matches = new Map();
    this.attendances = new Map();
    this.players = new Map();
    this.currentUserId = 1;
    this.currentMatchId = 1;
    this.currentAttendanceId = 1;
    this.currentPlayerId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByProviderId(providerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.providerId === providerId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      picture: insertUser.picture || null,
      isAdmin: insertUser.isAdmin || false 
    };
    this.users.set(id, user);
    return user;
  }

  // Match operations
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getAllMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }

  async getUpcomingMatches(limit?: number): Promise<Match[]> {
    const now = new Date();
    
    const upcomingMatches = Array.from(this.matches.values())
      .filter(match => new Date(match.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return limit ? upcomingMatches.slice(0, limit) : upcomingMatches;
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const match: Match = { 
      ...insertMatch, 
      id,
      details: insertMatch.details || null
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: number, matchUpdate: Partial<Match>): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, ...matchUpdate };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  async deleteMatch(id: number): Promise<boolean> {
    return this.matches.delete(id);
  }

  // Attendance operations
  async getAttendance(userId: number, matchId: number): Promise<Attendance | undefined> {
    const key = `${userId}-${matchId}`;
    return this.attendances.get(key);
  }

  async getAttendancesByMatch(matchId: number): Promise<Attendance[]> {
    return Array.from(this.attendances.values()).filter(
      attendance => attendance.matchId === matchId
    );
  }

  async getAttendancesByUser(userId: number): Promise<Attendance[]> {
    return Array.from(this.attendances.values()).filter(
      attendance => attendance.userId === userId
    );
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.currentAttendanceId++;
    const attendance: Attendance = { ...insertAttendance, id };
    const key = `${attendance.userId}-${attendance.matchId}`;
    this.attendances.set(key, attendance);
    return attendance;
  }

  async updateAttendance(userId: number, matchId: number, status: string): Promise<Attendance | undefined> {
    const key = `${userId}-${matchId}`;
    const attendance = this.attendances.get(key);
    
    if (attendance) {
      const updatedAttendance = { ...attendance, status };
      this.attendances.set(key, updatedAttendance);
      return updatedAttendance;
    }
    
    // If attendance record doesn't exist, create a new one
    return this.createAttendance({ userId, matchId, status });
  }

  // Player operations
  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayerByUserId(userId: number): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(player => player.userId === userId);
  }

  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    const player: Player = { 
      ...insertPlayer, 
      id,
      position: insertPlayer.position || null,
      status: insertPlayer.status || "Active"
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: number, playerUpdate: Partial<Player>): Promise<Player | undefined> {
    const player = this.players.get(id);
    if (!player) return undefined;
    
    const updatedPlayer = { ...player, ...playerUpdate };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  // Combined operations
  async getMatchWithAttendance(matchId: number, userId?: number): Promise<MatchWithAttendance | undefined> {
    const match = await this.getMatch(matchId);
    if (!match) return undefined;
    
    const matchAttendances = await this.getAttendancesByMatch(matchId);
    const attendingUsers = await Promise.all(
      matchAttendances
        .filter(a => a.status === "attending")
        .map(async a => {
          const user = await this.getUser(a.userId);
          return user;
        })
    );
    
    // Filter out undefined users
    const attendees = attendingUsers.filter(user => user !== undefined) as User[];
    
    let userAttendance = undefined;
    if (userId) {
      userAttendance = await this.getAttendance(userId, matchId);
    }
    
    return {
      ...match,
      userAttendance,
      attendees,
      attendanceCount: {
        attending: attendees.length,
        total: this.users.size
      }
    };
  }

  async getAllMatchesWithAttendance(userId?: number): Promise<MatchWithAttendance[]> {
    const matches = await this.getAllMatches();
    const matchesWithAttendance = await Promise.all(
      matches.map(match => this.getMatchWithAttendance(match.id, userId))
    );
    
    // Filter out undefined matches and sort by date
    return (matchesWithAttendance
      .filter(match => match !== undefined) as MatchWithAttendance[])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getPlayersWithStats(): Promise<PlayerWithStats[]> {
    const players = await this.getAllPlayers();
    const matches = await this.getAllMatches();
    const totalMatches = matches.length;
    
    return await Promise.all(
      players.map(async player => {
        const user = await this.getUser(player.userId);
        const attendances = await this.getAttendancesByUser(player.userId);
        const attendedMatches = attendances.filter(a => a.status === "attending").length;
        const attendanceRate = totalMatches > 0 ? (attendedMatches / totalMatches) * 100 : 0;
        
        return {
          ...player,
          user: user!,
          attendanceRate,
          attendedMatches,
          totalMatches
        };
      })
    );
  }
}

export const storage = new MemStorage();
