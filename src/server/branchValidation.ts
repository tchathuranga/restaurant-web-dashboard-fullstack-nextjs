const HTTP_URL = /^https?:\/\/\S+$/i;

export interface BranchInput {
  name: string;
  address: string;
  hours: string;
  phone: string;
  uberUrl: string;
  pickmeUrl: string;
}

// Trims and checks the fields an admin can edit. Delivery links are optional but must be http(s) URLs.
export function validateBranchBody(body: unknown): { value: BranchInput } | { error: string } {
  const fields = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const value: BranchInput = {
    name: text(fields.name),
    address: text(fields.address),
    hours: text(fields.hours),
    phone: text(fields.phone),
    uberUrl: text(fields.uberUrl),
    pickmeUrl: text(fields.pickmeUrl),
  };

  if (!value.name || !value.address || !value.hours || !value.phone) {
    return { error: 'Name, address, opening hours and phone are required' };
  }
  if (value.uberUrl && !HTTP_URL.test(value.uberUrl)) {
    return { error: 'Uber Eats link must start with http:// or https://' };
  }
  if (value.pickmeUrl && !HTTP_URL.test(value.pickmeUrl)) {
    return { error: 'PickMe link must start with http:// or https://' };
  }
  return { value };
}
