import { getType } from "typesafe-actions";
import * as actions from "./actions";

const initialState: any = {
  region: []
};

export const regionReducer = (
  state = initialState,
  action: any
): any => {
  switch (action.type) {
    case getType(actions.UpdateRegionAction): {
      let optionIndex = state.region.findIndex((region) => {
        return region.chatId === action.payload.chatId;
      });
      let newRegion;
      if (optionIndex != -1) {
        state.region[optionIndex] = action.payload;
        newRegion = state.region;
      } else {
        const option = action.payload;
        newRegion = state.region.concat([option]);
      }
      return Object.assign({}, state, {
        region: newRegion
      });
    }

    default: {
      return state;
    }
  }
};
