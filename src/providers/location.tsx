import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type Locations =
  | "home"
  | "events"
  | "gallery"
  | "executives"
  | "resources";

export type LocationState = [Locations, Dispatch<SetStateAction<Locations>>];

const LocationContext = createContext<LocationState>(
  [] as unknown as LocationState
);

export const LocationProvider = LocationContext.Provider;
export const useLocation = () => {
  return useContext(LocationContext);
};
