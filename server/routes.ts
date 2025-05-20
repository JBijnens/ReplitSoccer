import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMatchSchema, 
  insertAttendanceSchema, 
  insertPlayerSchema 
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-local";
import { Strategy as MicrosoftStrategy } from "passport-local";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(
    session({
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET || "soccer-team-attendance-app-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
    })
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Admin middleware
  const requireAdmin = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    next();
  };

  // Auth routes
  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // User routes
  app.get("/api/users/me", requireAuth, async (req, res) => {
    const user = req.user as any;
    res.json(user);
  });

  app.get("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Match routes
  app.get("/api/matches", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const matches = await storage.getAllMatchesWithAttendance(user.id);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to get matches" });
    }
  });

  app.get("/api/matches/upcoming", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const matches = await storage.getUpcomingMatches(limit);
      
      const matchesWithAttendance = await Promise.all(
        matches.map(match => storage.getMatchWithAttendance(match.id, user.id))
      );
      
      res.json(matchesWithAttendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to get upcoming matches" });
    }
  });

  app.get("/api/matches/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user as any;
      const match = await storage.getMatchWithAttendance(id, user.id);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: "Failed to get match" });
    }
  });

  app.post("/api/matches", requireAdmin, async (req, res) => {
    try {
      const user = req.user as any;
      const matchData = { ...req.body, createdBy: user.id };
      
      const validatedData = insertMatchSchema.parse(matchData);
      const newMatch = await storage.createMatch(validatedData);
      
      res.status(201).json(newMatch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid match data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  app.put("/api/matches/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const matchData = req.body;
      
      const updatedMatch = await storage.updateMatch(id, matchData);
      
      if (!updatedMatch) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json(updatedMatch);
    } catch (error) {
      res.status(500).json({ message: "Failed to update match" });
    }
  });

  app.delete("/api/matches/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMatch(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json({ message: "Match deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete match" });
    }
  });

  // Attendance routes
  app.post("/api/attendance", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const attendanceData = { ...req.body, userId: user.id };
      
      const validatedData = insertAttendanceSchema.parse(attendanceData);
      const updatedAttendance = await storage.updateAttendance(
        validatedData.userId,
        validatedData.matchId,
        validatedData.status
      );
      
      res.json(updatedAttendance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid attendance data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update attendance" });
    }
  });

  app.get("/api/attendance/match/:matchId", requireAuth, async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      const attendances = await storage.getAttendancesByMatch(matchId);
      
      // Get users for each attendance
      const attendanceWithUsers = await Promise.all(
        attendances.map(async attendance => {
          const user = await storage.getUser(attendance.userId);
          return { ...attendance, user };
        })
      );
      
      res.json(attendanceWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get match attendances" });
    }
  });

  // Player routes
  app.get("/api/players", requireAuth, async (req, res) => {
    try {
      const players = await storage.getPlayersWithStats();
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to get players" });
    }
  });

  app.get("/api/players/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      const user = await storage.getUser(player.userId);
      const attendances = await storage.getAttendancesByUser(player.userId);
      const matches = await storage.getAllMatches();
      
      const attendedMatches = attendances.filter(a => a.status === "attending").length;
      const totalMatches = matches.length;
      const attendanceRate = totalMatches > 0 ? (attendedMatches / totalMatches) * 100 : 0;
      
      res.json({
        ...player,
        user,
        attendanceRate,
        attendedMatches,
        totalMatches
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get player" });
    }
  });

  app.put("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playerData = req.body;
      
      const updatedPlayer = await storage.updatePlayer(id, playerData);
      
      if (!updatedPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(updatedPlayer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update player" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
