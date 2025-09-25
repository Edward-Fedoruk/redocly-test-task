# MD Preview Generator

A Markdoc-powered documentation site generator with live editing capabilities.

## Installation

```bash
npm install
npm run build
```

## Usage

### Preview Command

View markdown files in a directory with live reload:

```bash
npm run start preview <directory> [options]
```

#### Options

- `-p, --port <port>` - Port to run server on (default: 3000)

#### Example

```bash
# Preview markdown files in ./docs directory
npm run dev preview ./docs

# Use custom port
npm run dev preview ./docs --port 8080
```

## How it Works

1. The tool scans the specified directory for markdown files
2. Processes each file using Markdoc to generate HTML
3. Starts a local web server with live reload capabilities
4. Watches for file changes and updates the browser automatically

## Project Structure

- `src/cli.ts` - Command line interface
- `src/express.ts` - Web server setup
- `src/file-processor.ts` - Markdown file processing logic
- `src/session.ts` - Session management and caching
- `src/utils.ts` - Utility functions
- `src/views/` - Handlebars templates for the web interface

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start after building
npm start
```

## Key Decisions

## Priorities
1. **Simplicity** - Minimal dependencies and straightforward implementation
2. **Working prototype** - Focus on core functionality
3. **CLI tool** - Command-line first approach

### Server-Sent Events (SSE)
**Decision**: Use SSE for live reload functionality instead of WebSockets or polling.

**Rationale**:
- SSE provides a simple communication channel from server to client
- Lower overhead than WebSockets for one-way data flow

**Implementation**: `/events` endpoint streams change notifications to trigger page reloads.

### Express.js with Handlebars Templating
**Decision**: Use Express.js as the web framework with Handlebars for templating.

**Rationale**:
- Very Simple setup for serving static content and API endpoints
- Handlebars offers quick template engine setup

**Implementation**: Three main routes: home (`/`), SSE endpoint (`/events`), and dynamic pages (`/:page`).

**Considerations**: Something more robust could be used for handling more complex UI.

### TypeScript with CommonJS Modules
**Decision**: Use TypeScript compiled to CommonJS instead of ES modules.

**Rationale**:
- Type safety during development

### File System Watching for Change Detection
**Decision**: Use Node.js native `fs.watch()` for monitoring file changes.

**Rationale**:
- Built-in Node.js functionality, no external dependencies
- Real-time change detection
- Lightweight implementation

**Considerations**: investigate limits of watch and behavior on different OS.

## Future Considerations

### Tech Debt
1. **New files processing**: Pick up new added files to the folder
2. **Async File Operations**: Move to async file reading for better performance
3. **Markdown Service Abstraction**: Create separate service to reduce Markdoc dependency
4. **File Watching Limits**: Investigate limits with large numbers of files
5. **Error Handling**: Better error handling
6. **Logging**: Better logging and UX for developer when using CLI

### Potential Improvements
- Add support for nested directories
- Better UI with advanced file processing capabilities like search, live edit (WSYWIG)
- Add markdown file validation
