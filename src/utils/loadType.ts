import { BeamConcentratedLoad, BeamElementUniformEdgeLoad, BeamTemperatureLoad, Load } from "ts-fem";

export const loadType = (el: Load) => {
  if (el instanceof BeamElementUniformEdgeLoad) {
    return "udl";
  } else if (el instanceof BeamConcentratedLoad) {
    return "concentrated";
  } else if (el instanceof BeamTemperatureLoad) {
    return "temperature";
  } else {
    return "unknown";
  }
};
