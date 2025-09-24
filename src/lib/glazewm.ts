import type { GlazeWmOutput, NetworkOutput, NetworkTraffic } from "zebar";

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

export const getTraffic = (output: NetworkOutput): { value: number, unit: string } => {
    const traffic = output.traffic as NetworkTraffic
    return { value: traffic.received.siValue, unit: traffic.received.siUnit }
}

export const format_time = (now: number): string => {
    const unix = new Date(now);
    return `${unix.getHours().toString().padStart(2, "0")}:${unix.getMinutes().toString().padStart(2, "0")}`
}
