import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { PortalPlacement, OverlayHorizontalPositions, OverlayVerticalPositions } from '../enums';

const INDENTATION: number = 12;

export const VERTICAL_BOTTOM_CENTER_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Center, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.Center, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Center, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.Center, overlayY: OverlayVerticalPositions.Bottom },
    0,
    -INDENTATION,
  ),
];

export const VERTICAL_TOP_CENTER_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Center, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.Center, overlayY: OverlayVerticalPositions.Bottom },
    0,
    -INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Center, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.Center, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
];

export const HORIZONTAL_RIGHT_CENTER_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Center },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Center },
    INDENTATION,
    0,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Center },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Center },
    -INDENTATION,
    0,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Center, originY: OverlayVerticalPositions.Center },
    { overlayX: OverlayHorizontalPositions.Center, overlayY: OverlayVerticalPositions.Center },
  ),
];

export const HORIZONTAL_RIGHT_TOP_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Top },
    INDENTATION,
    0,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Top },
    -INDENTATION,
    0,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Bottom },
    0,
    -INDENTATION,
  ),
];

export const HORIZONTAL_LEFT_CENTER_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Center },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Center },
    -INDENTATION,
    0,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Center },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Center },
    INDENTATION,
    0,
  ),
];

export const VERTICAL_BOTTOM_START_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
];

export const VERTICAL_BOTTOM_START_PRIORITY_HORIZONTAL: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Bottom },
    0,
    -INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Center, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.Center, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Center, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.Center, overlayY: OverlayVerticalPositions.Bottom },
    0,
    -INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Center },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Center },
    -INDENTATION,
    0,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Center },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Center },
    INDENTATION,
    0,
  ),
];

export const VERTICAL_BOTTOM_END_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
];

export const START_CENTER_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Center },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Center },
    0,
    INDENTATION,
  ),
];

export const START_END_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Top },
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Top },
  ),
];

export const VERTICAL_TOP_START_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.Start, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Bottom },
    0,
    -INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.Start, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
];

export const VERTICAL_TOP_END_PRIORITY: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Top },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Bottom },
    0,
    -INDENTATION,
  ),
  new ConnectionPositionPair(
    { originX: OverlayHorizontalPositions.End, originY: OverlayVerticalPositions.Bottom },
    { overlayX: OverlayHorizontalPositions.End, overlayY: OverlayVerticalPositions.Top },
    0,
    INDENTATION,
  ),
];

export const PORTAL_POSITIONS_MAP: Map<PortalPlacement, ConnectionPositionPair[]> = new Map([
  [PortalPlacement.TopCenter, VERTICAL_TOP_CENTER_PRIORITY],
  [PortalPlacement.BottomCenter, VERTICAL_BOTTOM_CENTER_PRIORITY],
  [PortalPlacement.LeftCenter, HORIZONTAL_LEFT_CENTER_PRIORITY],
  [PortalPlacement.RightCenter, HORIZONTAL_RIGHT_CENTER_PRIORITY],
  [PortalPlacement.RightTop, HORIZONTAL_RIGHT_TOP_PRIORITY],
  [PortalPlacement.BottomStart, VERTICAL_BOTTOM_START_PRIORITY],
  [PortalPlacement.BottomEnd, VERTICAL_BOTTOM_END_PRIORITY],
  [PortalPlacement.StartCenter, START_CENTER_PRIORITY],
  [PortalPlacement.StartEnd, START_END_PRIORITY],
  [PortalPlacement.TopStart, VERTICAL_TOP_START_PRIORITY],
  [PortalPlacement.TopEnd, VERTICAL_TOP_END_PRIORITY],
  [PortalPlacement.BottomStartHorizontal, VERTICAL_BOTTOM_START_PRIORITY_HORIZONTAL],
]);
