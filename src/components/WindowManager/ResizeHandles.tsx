/**
 * ResizeHandles Component
 * 
 * 8-directional resize handles for window resizing.
 * Invisible hit areas with cursor feedback.
 */

import React, { memo } from 'react';
import { ResizeDirection } from '../../stores/windowTypes';
import { RESIZE_HANDLES } from '../../hooks/useWindowResize';

interface ResizeHandlesProps {
    /** Handler to start resize for a given direction */
    onResizeStart: (direction: ResizeDirection) => (e: React.MouseEvent) => void;
    /** Whether resizing is disabled (e.g., when maximized) */
    disabled?: boolean;
    /** Whether to show visible indicators (for debugging) */
    showIndicators?: boolean;
}

/**
 * ResizeHandles Component
 * 
 * Renders 8 invisible resize handles around the window edges.
 * Each handle has the appropriate cursor style.
 */
export const ResizeHandles = memo(({
    onResizeStart,
    disabled = false,
    showIndicators = false,
}: ResizeHandlesProps) => {
    if (disabled) return null;

    return (
        <>
            {RESIZE_HANDLES.map((handle) => (
                <div
                    key={handle.direction}
                    className={`absolute z-20 ${showIndicators ? 'bg-blue-500/30' : ''}`}
                    style={{
                        ...handle.style,
                        cursor: handle.cursor,
                    }}
                    onMouseDown={onResizeStart(handle.direction)}
                    aria-label={`Resize ${handle.direction}`}
                    role="separator"
                    aria-orientation={
                        ['n', 's'].includes(handle.direction) ? 'horizontal' : 'vertical'
                    }
                />
            ))}
        </>
    );
});

ResizeHandles.displayName = 'ResizeHandles';

export default ResizeHandles;
