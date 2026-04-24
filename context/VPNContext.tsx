import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { api } from '../lib/api';
import { Server, ConnectionState, ConnectionData } from '../types';

interface VPNContextType {
  servers: Server[];
  connectionState: ConnectionState;
  connectionData: ConnectionData | null;
  selectedServer: Server | null;
  setSelectedServer: (server: Server) => void;
  toggleConnection: () => Promise<void>;
  sessionStats: { duration: number; up: number; down: number };
  error: string | null;
  loadServers: () => Promise<void>;
}

const VPNContext = createContext<VPNContextType | undefined>(undefined);

export const VPNProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [sessionStats, setSessionStats] = useState({ duration: 0, up: 0, down: 0 });
  const [error, setError] = useState<string | null>(null);
  
  const timerRef = useRef<number | null>(null);

  const loadServers = async () => {
    try {
      const res = await api.vpn.servers();
      setServers(res.data.servers);
      if (res.data.servers.length > 0 && !selectedServer) {
        setSelectedServer(res.data.servers[0]);
      }
    } catch (e) {
      console.error("Failed to load servers", e);
    }
  };

  const checkStatus = async () => {
    try {
      const res = await api.vpn.status();
      const isConnected = res.data.isConnected;
      
      if (isConnected && res.data.connection) {
        setConnectionState(ConnectionState.CONNECTED);
        setConnectionData(res.data.connection);
        
        // Calculate duration based on connectionTime
        const startTime = new Date(res.data.connection.connectionTime).getTime();
        const now = Date.now();
        const seconds = Math.floor((now - startTime) / 1000);
        setSessionStats(prev => ({ ...prev, duration: seconds }));
      } else {
        setConnectionState(ConnectionState.DISCONNECTED);
        setConnectionData(null);
      }
    } catch (e) {
      console.error("Failed to check status", e);
    }
  };

  useEffect(() => {
    loadServers();
    checkStatus();
  }, []);

  // Timer effect
  useEffect(() => {
    if (connectionState === ConnectionState.CONNECTED) {
      timerRef.current = window.setInterval(() => {
        setSessionStats(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [connectionState]);

  const toggleConnection = async () => {
    setError(null);
    if (connectionState === ConnectionState.CONNECTED) {
      // Disconnect
      setConnectionState(ConnectionState.DISCONNECTING);
      try {
        const res = await api.vpn.disconnect();
        setConnectionState(ConnectionState.DISCONNECTED);
        setConnectionData(null);
        // We could show stats from res.data here (durationMinutes, dataDownloadedMB, etc)
      } catch (e) {
        console.error("Disconnect failed", e);
        setConnectionState(ConnectionState.CONNECTED); // Revert
        setError("Failed to disconnect.");
      }
    } else {
      // Connect
      if (!selectedServer) {
        setError("Please select a server first.");
        return;
      }
      setConnectionState(ConnectionState.CONNECTING);
      try {
        const res = await api.vpn.connect(selectedServer.location);
        // Simulate a slight delay for effect if the API is too fast
        setTimeout(async () => {
           await checkStatus();
           if (res.status !== 'success') {
             setConnectionState(ConnectionState.DISCONNECTED);
             setError("Connection failed.");
           }
        }, 1000);
      } catch (e) {
        console.error("Connect failed", e);
        setConnectionState(ConnectionState.DISCONNECTED);
        setError("Failed to connect. Is the backend running?");
      }
    }
  };

  return (
    <VPNContext.Provider value={{ 
      servers, 
      connectionState, 
      connectionData, 
      selectedServer, 
      setSelectedServer, 
      toggleConnection, 
      sessionStats,
      error,
      loadServers
    }}>
      {children}
    </VPNContext.Provider>
  );
};

export const useVPN = () => {
  const context = useContext(VPNContext);
  if (!context) throw new Error('useVPN must be used within a VPNProvider');
  return context;
};
