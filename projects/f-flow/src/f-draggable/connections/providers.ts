import {
  CREATE_CONNECTION_FINALIZE_PROVIDERS,
  CREATE_CONNECTION_PREPARATION_PROVIDERS,
  GET_CAN_BE_CONNECTED_OUTPUT_BY_OUTLET_PROVIDERS
} from './create-connection';
import {
  GET_INPUT_UNDER_POINTER_PROVIDERS,
} from './get-input-under-pointer';
import {
  REASSIGN_CONNECTION_FINALIZE_PROVIDERS,
  REASSIGN_CONNECTION_PREPARATION_PROVIDERS,
} from './reassign-connection';
import { GetAllCanBeConnectedInputPositionsExecution } from './get-all-can-be-connected-input-positions';
import { FindClosestInputUsingSnapThresholdExecution } from './find-closest-input-using-snap-threshold';

export const CONNECTIONS_PROVIDERS = [

  ...CREATE_CONNECTION_FINALIZE_PROVIDERS,

  ...CREATE_CONNECTION_PREPARATION_PROVIDERS,

  FindClosestInputUsingSnapThresholdExecution,

  GetAllCanBeConnectedInputPositionsExecution,

  ...GET_CAN_BE_CONNECTED_OUTPUT_BY_OUTLET_PROVIDERS,

  ...REASSIGN_CONNECTION_FINALIZE_PROVIDERS,

  ...REASSIGN_CONNECTION_PREPARATION_PROVIDERS,

  ...GET_INPUT_UNDER_POINTER_PROVIDERS,
];
