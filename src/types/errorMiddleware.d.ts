export interface BoomifyOptions {
  decorate: {
    isDeveloperError: any;
    originalUrl?: string;
    method?: string;
    ip?: string;
  };
  data: { stack: any | 'n/a' };
}
