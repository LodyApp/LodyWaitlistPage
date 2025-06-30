#!/bin/bash

# Supabase mCP Server Setup Script
# This script sets up the mCP server for Cursor to understand your Supabase database structure

echo "Setting up mCP server for Supabase..."

# Your Supabase connection details
SUPABASE_URL="postgresql://postgres.dwzymbjpvnpqhebquhht:CnyE&!JW%4xw@BY@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# Install mCP Supabase server if not already installed
if ! command -v mcp-supabase &> /dev/null; then
    echo "Installing mCP Supabase server..."
    npm install -g @modelcontextprotocol/server-supabase
fi

# Start the mCP server
echo "Starting mCP server with your Supabase connection..."
mcp-supabase --connection-string "$SUPABASE_URL"

echo "mCP server is now running!"
echo "You can now use Cursor with full database awareness."
echo ""
echo "To use this in Cursor:"
echo "1. Go to Cursor settings"
echo "2. Add mCP server: bash /full/path/to/setup-mcp.sh"
echo "3. Cursor will now understand your Supabase database structure"
