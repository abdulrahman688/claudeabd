-- Syrian Renaissance Platform - Database Initialization
-- Enable required PostgreSQL extensions

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable vector extension for Sham's memory (semantic search)
-- Note: This requires pgvector to be installed
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Note: Prisma will handle table creation via migrations
-- This file is for extension initialization only
