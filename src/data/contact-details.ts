// Addresses and email explicitly confirmed by the client in Prompt 2.
// Do not infer office-specific email, opening hours or an Abuja street address.
export const contactDetails = {
  email: 'inq@grfdalleyandpartners.com',
  telephone: { display: '+234 1 454 9824', href: 'tel:+23414549824', source: 'Updated Firm Profile, page 25', approval: 'Current availability requires reconfirmation.' },
  offices: [
    { id: 'lagos', name: 'Lagos', label: 'Head office', lines: ['Gabsdall House, 2nd–4th Floor', '26 Igbosere Road', 'Lagos State, Nigeria'] },
    { id: 'port-harcourt', name: 'Port Harcourt', label: 'Office', lines: ['13 Finima Street, Old G.R.A', 'Port Harcourt', 'Rivers State, Nigeria'] },
    { id: 'abuja', name: 'Abuja', label: 'Office', lines: [], pending: 'Address pending confirmation.' },
  ],
} as const;
