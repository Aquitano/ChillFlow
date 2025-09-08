# Audio Engine Debug Features

This document describes the comprehensive debugging features added to the ChillFlow audio engine for development mode.

## Features

### 1. Debug Logger (`debug.ts`)

A comprehensive logging system that only operates in development mode:

- **Log Levels**: `debug`, `info`, `warn`, `error`
- **Categorized Logging**: Events are grouped by category (e.g., 'AudioContext', 'TrackLoader', 'Playback')
- **Performance Timing**: Built-in performance measurement utilities
- **Data Logging**: Structured data logging with JSON serialization
- **Stack Traces**: Automatic stack trace capture for errors

### 2. Enhanced Audio Engine (`engine.ts`)

The audio engine now includes extensive debugging throughout all operations:

- **Initialization Tracking**: Logs audio context creation and configuration
- **Track Loading**: Detailed logging of codec selection, loading progress, and errors
- **Playback Control**: Logs play/pause/stop operations with state information
- **Volume Control**: Tracks volume changes and gain ramping
- **Buffer Health Monitoring**: Continuous monitoring of audio buffer status
- **Error Context**: Enhanced error messages with detailed context

### 3. React Hook Debugging (`useAudioEngine.ts`)

The React hooks now include debugging for:

- **Hook Lifecycle**: Initialization and state changes
- **Event Handling**: Audio engine event processing
- **Error Propagation**: Error handling within React components

### 4. Debug Panel UI (`components/dev/AudioDebugPanel.tsx`)

A comprehensive debug panel that provides:

- **Real-time Engine State**: Live view of audio engine internal state
- **Event Log Viewer**: Filterable log of all debug events
- **Performance Metrics**: Timing information for operations
- **Interactive Controls**: Clear logs, filter by level/category

## Usage

### Browser Console Access

In development mode, the following are available in the browser console:

```javascript
// Access the audio engine directly
window.__audioEngine

// Access the debug logger
window.__audioDebugLogger

// Helper functions
window.__audioDebugHelpers.getEngineState()
window.__audioDebugHelpers.logAudioContext()
window.__audioDebugHelpers.logMediaElement()
window.__audioDebugHelpers.clearDebugLog()
window.__audioDebugHelpers.getDebugEvents()
```

### Debug Panel

Add the debug panel to your app by importing and using the trigger component:

```tsx
import { AudioDebugTrigger } from '@/components/dev/AudioDebugPanel';

export function MyApp() {
  return (
    <div>
      {/* Your app content */}
      <AudioDebugTrigger />
    </div>
  );
}
```

This will add a floating button in the bottom-right corner (development only) that opens the debug panel.

### Programmatic Debugging

```typescript
import { getAudioDebugLogger } from '@/lib/audio/debug';

const logger = getAudioDebugLogger();

// Log at different levels
logger.debug('MyComponent', 'Debug message', { data: 'value' });
logger.info('MyComponent', 'Info message');
logger.warn('MyComponent', 'Warning message');
logger.error('MyComponent', 'Error message', error);

// Performance timing
const endTimer = logger.time('MyComponent', 'Operation name');
// ... do work ...
endTimer(); // Logs the duration

// Get events
const events = logger.getEvents();
const errorEvents = logger.getEventsByLevel('error');
const audioEvents = logger.getEventsByCategory('AudioContext');
```

## Debug Categories

The system uses the following debug categories:

- **Engine**: Audio engine lifecycle (init, destroy)
- **AudioContext**: Web Audio API context operations
- **AudioGraph**: Audio node connections and routing
- **TrackLoader**: Audio track loading and preparation
- **TrackSelection**: Codec selection and variant picking
- **MediaElement**: HTMLAudioElement operations and events
- **Playback**: Play, pause, stop, seek operations
- **Volume**: Volume and mute operations
- **GainRamp**: Audio gain ramping and smoothing
- **BufferHealth**: Audio buffer monitoring and health checks
- **Events**: Audio engine event dispatching
- **Hook**: React hook operations

## Performance Monitoring

The debug system includes automatic performance monitoring:

- **Track Loading Times**: Measures time from load start to ready
- **Audio Context Initialization**: Times context setup
- **Buffer Health**: Monitors buffered audio ahead of playhead
- **Stall Detection**: Detects when playback appears to stall

## Production Behavior

All debugging features are automatically disabled in production builds:

- Debug logger becomes a no-op
- Performance monitoring is disabled
- Debug panel is not rendered
- Console helpers are not exposed
- No performance impact on production builds

## Troubleshooting Common Issues

### Audio Not Playing
1. Check browser console for debug messages
2. Look for 'NotAllowedError' - requires user interaction
3. Check audio context state in debug panel
4. Verify track loading completed successfully

### Poor Audio Quality
1. Check selected codec in track selection logs
2. Verify buffer health in debug panel
3. Look for network-related warnings

### Performance Issues
1. Review performance timing logs
2. Check buffer health monitoring
3. Look for frequent gain ramping operations

### Browser Compatibility
1. Check audio context creation logs
2. Review codec support detection
3. Look for Web Audio API warnings
