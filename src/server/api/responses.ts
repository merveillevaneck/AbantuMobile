import z, { ZodTypeAny } from 'zod';
import { api } from './generated-client';


/**
 * Build an alias -> responseSchema map, while preserving the exact key/value types.
 */
function buildResponseSchemas<
  const Es extends readonly { alias: PropertyKey; response: ZodTypeAny }[],
>(es: Es) {
  type Map = { [E in Es[number] as E["alias"]]: E["response"] };

  const out = {} as Map;
  for (const e of es) {
    // runtime assignment needs a cast, but the returned type stays precise
    (out as any)[e.alias] = e.response;
  }
  return out;
}

export const responseSchemas = buildResponseSchemas(api.api);

/**
 * Helper to get the inferred response type for a given alias.
 */
export type ResponseOf<Alias extends keyof typeof responseSchemas> = z.infer<
  (typeof responseSchemas)[Alias]
>;
