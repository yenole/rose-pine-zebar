import type { GlazeWmOutput } from "zebar";

export const getWindowTitle = (glazewm: GlazeWmOutput): string | null => {
    const focusedWorkspace = glazewm.focusedWorkspace;
    const focusedContainer = glazewm.focusedContainer;

    if (focusedContainer.type === "window") {
        return focusedContainer.title || focusedContainer.processName
    }

    // If the focused container is not a window, return workspace displayName. If displayName is not available, fallback to workspace name.
    const focusedWorkspaceDisplayName = focusedWorkspace.displayName
        ? focusedWorkspace.displayName
        : `Workspace ${focusedWorkspace.name}`;
    return focusedWorkspaceDisplayName;
};
