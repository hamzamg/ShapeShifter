import { Layer, LayerUtil, PathLayer } from 'app/model/layers';
import { Path } from 'app/model/paths';
import { PaperService } from 'app/services';
import * as paper from 'paper';

/** Adds a new path to the first level of the vector layer tree. */
export function addPathToStore(ps: PaperService, pathData: string) {
  const vl = ps.getVectorLayer().clone();
  const pl = new PathLayer({
    name: LayerUtil.getUniqueLayerName([vl], 'path'),
    children: [] as Layer[],
    pathData: new Path(pathData),
    fillColor: '#000',
  });
  vl.children = [...vl.children, pl];
  ps.setVectorLayer(vl);
  return pl;
}

/** Returns the path data string for the specified path layer ID. */
export function getPathFromStore(ps: PaperService, layerId: string) {
  const vl = ps.getVectorLayer();
  const pl = vl.findLayerById(layerId).clone() as PathLayer;
  return pl.pathData.getPathString();
}

/** Replaces an existing path in the vector layer tree. */
export function replacePathInStore(ps: PaperService, layerId: string, pathData: string) {
  const vl = ps.getVectorLayer();
  const pl = vl.findLayerById(layerId).clone() as PathLayer;
  pl.pathData = new Path(pathData);
  const newVl = LayerUtil.replaceLayer(vl, layerId, pl);
  ps.setVectorLayer(newVl);
}

/** Selects the curves associated with the given selected segment indices. */
export function selectCurves(
  ps: PaperService,
  path: paper.Path,
  selectedSegments: ReadonlySet<number>,
) {
  const numSegments = path.segments.length;
  const visibleHandleIns = new Set(selectedSegments);
  const visibleHandleOuts = new Set(selectedSegments);
  selectedSegments.forEach(segmentIndex => {
    // Also display the out-handle for the previous segment
    // and the in-handle for the next segment.
    const { previous, next } = path.segments[segmentIndex];
    if (previous) {
      visibleHandleOuts.add(previous.index);
    }
    if (next) {
      visibleHandleIns.add(next.index);
    }
  });
  ps.setFocusedPathInfo({
    layerId: ps.getFocusedPathInfo().layerId,
    selectedSegments,
    visibleHandleIns,
    visibleHandleOuts,
    selectedHandleIns: new Set<number>(),
    selectedHandleOuts: new Set<number>(),
  });
}