export interface ExchangeTokenRequest {
    code: string;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    grantType?: string;
}
