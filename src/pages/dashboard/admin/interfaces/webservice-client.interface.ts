export interface WebserviceClientCreator {
  id: number;
  username: string | null;
}

export default interface WebserviceClient {
  id: number;
  name: string;
  token_prefix: string;
  is_active: boolean;
  is_usable: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  created_by: WebserviceClientCreator | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface WebserviceClientListData {
  current_page: number;
  data: WebserviceClient[];
  per_page: number;
  total: number;
}

export interface WebserviceClientListResponse {
  success: boolean;
  message: string;
  data: WebserviceClientListData;
}

export interface WebserviceClientResponse {
  success: boolean;
  message: string;
  data: WebserviceClient;
}

export interface WebserviceClientTokenResponse {
  success: boolean;
  message: string;
  data: {
    client: WebserviceClient;
    token: string;
  };
}

export interface WebserviceClientDeleteResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface CreateWebserviceClientRequest {
  name: string;
  expires_at?: string;
}

export interface UpdateWebserviceClientRequest {
  id: number;
  name?: string;
  is_active?: boolean;
  expires_at?: string | null;
}
