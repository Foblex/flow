import {
  GET_CAN_BE_CONNECTED_OUTPUT_BY_OUTLET_PROVIDERS
} from './create-connection';
import { CREATE_CONNECTION_FINALIZE_PROVIDERS } from './create-connection';
import { CREATE_CONNECTION_PREPARATION_PROVIDERS } from './create-connection';
import {
  REASSIGN_CONNECTION_FINALIZE_PROVIDERS,
  REASSIGN_CONNECTION_PREPARATION_PROVIDERS,
} from './reassign-connection';
import { CONNECTION_DRAG_COMMON_PROVIDERS } from './common';

export const CONNECTIONS_PROVIDERS = [

  ...CONNECTION_DRAG_COMMON_PROVIDERS,

  ...CREATE_CONNECTION_FINALIZE_PROVIDERS,

  ...CREATE_CONNECTION_PREPARATION_PROVIDERS,

  ...GET_CAN_BE_CONNECTED_OUTPUT_BY_OUTLET_PROVIDERS,

  ...REASSIGN_CONNECTION_FINALIZE_PROVIDERS,

  ...REASSIGN_CONNECTION_PREPARATION_PROVIDERS,
];
