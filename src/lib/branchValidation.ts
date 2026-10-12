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
export function validateBranchBody(body: any): { value: BranchInput } | { error: string } {
  const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const value: BranchInput = {
    name: text(body?.name),
    address: text(body?.address),
    hours: text(body?.hours),
    phone: text(body?.phone),
    uberUrl: text(body?.uberUrl),
    pickmeUrl: text(body?.pickmeUrl),
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
